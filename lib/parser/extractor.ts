import { ExtractedQuestion } from '@/types';

/**
 * Normalizes answer keys (A, B, C, D or 1, 2, 3, 4) to 0-based indices (0 = A, 1 = B, 2 = C, 3 = D)
 */
export function normalizeAnswerIndex(ansStr: string, optionsCount: number = 4): number | null {
  if (!ansStr) return null;
  const clean = ansStr.trim().toUpperCase().replace(/[().:[\]]/g, '');
  
  // Check A, B, C, D, E
  if (/^[A-E]$/.test(clean)) {
    const code = clean.charCodeAt(0) - 65; // A -> 0, B -> 1, C -> 2, D -> 3
    if (code >= 0 && code < optionsCount) return code;
  }
  
  // Check 1, 2, 3, 4, 5
  if (/^[1-5]$/.test(clean)) {
    const num = parseInt(clean, 10) - 1;
    if (num >= 0 && num < optionsCount) return num;
  }

  // Check words like "FIRST", "SECOND", "THIRD", "FOURTH"
  const wordMap: Record<string, number> = {
    'OPTION A': 0, 'OPTION B': 1, 'OPTION C': 2, 'OPTION D': 3,
    'OPTION 1': 0, 'OPTION 2': 1, 'OPTION 3': 2, 'OPTION 4': 3,
  };
  for (const [key, val] of Object.entries(wordMap)) {
    if (clean.includes(key)) return val;
  }

  return null;
}

/**
 * Parses end-of-document Answer Key tables or lists like:
 * "1. A  2. B  3. C" or "1-A, 2-D, 3-C" or "ANSWER KEY\n1 (b)\n2 (c)"
 */
function extractSeparateAnswerKey(text: string): Map<number, number> {
  const answerKeyMap = new Map<number, number>();
  
  // Look for section headers like ANSWER KEY, ANSWERS, KEY, SOLUTIONS
  const keySectionRegex = /(?:ANSWER\s*KEY|ANSWERS|KEY|SOLUTIONS\s*KEY|CORRECT\s*ANSWERS)[\s\S]*$/i;
  const match = text.match(keySectionRegex);
  if (!match) return answerKeyMap;

  const keyText = match[0];
  
  // Pattern 1: 1. A or 1-A or 1: A or 1 (A) or Q1. A
  const itemRegex = /(?:Q\.?\s*)?(\d{1,3})\s*[-.:\s]+\s*\(?([A-Ea-e1-4])\)?/g;
  let itemMatch: RegExpExecArray | null;
  while ((itemMatch = itemRegex.exec(keyText)) !== null) {
    const qNum = parseInt(itemMatch[1], 10);
    const ans = normalizeAnswerIndex(itemMatch[2]);
    if (ans !== null && !answerKeyMap.has(qNum)) {
      answerKeyMap.set(qNum, ans);
    }
  }

  return answerKeyMap;
}

/**
 * Core robust MCQ parser algorithm
 */
export function parseMCQDocument(rawText: string): ExtractedQuestion[] {
  if (!rawText || typeof rawText !== 'string') return [];

  // Normalize line endings and remove weird zero-width spaces
  const text = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\u200B-\u200D\uFEFF]/g, '');

  const separateAnswerKey = extractSeparateAnswerKey(text);

  // Split document into potential question blocks
  // Regex to match question starts:
  // e.g., "1. ", "Q1. ", "Q.1 ", "Question 1:", "[1]", "(1)" at start of line
  const lines = text.split('\n');
  const questionBlocks: { header: string; qNum: number; bodyLines: string[] }[] = [];

  const questionStartRegex = /^\s*(?:Q(?:uestion|\.)?\s*(\d{1,4})[:.-]?|\[(\d{1,4})\]|\((\d{1,4})\)|(\d{1,4})[.)])\s+(.+)$/i;

  let currentBlock: { header: string; qNum: number; bodyLines: string[] } | null = null;
  let autoQNum = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if line looks like an answer key section divider; if so, stop accumulating questions
    if (/^\s*(?:ANSWER\s*KEY|SOLUTIONS\s*KEY|FINAL\s*KEY|EXPLANATIONS\s*AND\s*SOLUTIONS)\s*$/i.test(trimmed)) {
      if (currentBlock) {
        questionBlocks.push(currentBlock);
        currentBlock = null;
      }
      break;
    }

    const match = trimmed.match(questionStartRegex);

    if (match) {
      // Determine question number
      const detectedNum = parseInt(match[1] || match[2] || match[3] || match[4], 10) || autoQNum;
      
      // If we already had a question block, push it
      if (currentBlock) {
        questionBlocks.push(currentBlock);
      }

      currentBlock = {
        header: match[5] ? match[5].trim() : '',
        qNum: detectedNum,
        bodyLines: [],
      };
      autoQNum = detectedNum + 1;
    } else if (currentBlock) {
      currentBlock.bodyLines.push(line);
    }
  }

  if (currentBlock) {
    questionBlocks.push(currentBlock);
  }

  // If no structured questions found by question-start regex, fallback to paragraph chunking
  if (questionBlocks.length === 0) {
    const paragraphs = text.split(/\n\s*\n+/);
    let pNum = 1;
    for (const p of paragraphs) {
      const pTrim = p.trim();
      if (pTrim.length > 20 && (/[A-D]\.\s+|\([A-D]\)/i.test(pTrim) || /Option\s+[A-D]/i.test(pTrim))) {
        const pLines = pTrim.split('\n');
        questionBlocks.push({
          header: pLines[0],
          qNum: pNum++,
          bodyLines: pLines.slice(1),
        });
      }
    }
  }

  const results: ExtractedQuestion[] = [];

  questionBlocks.forEach((block, index) => {
    const fullText = [block.header, ...block.bodyLines].join('\n');
    const qNum = block.qNum || (index + 1);

    // Extract options
    // Common option patterns:
    // A. ..., B. ..., C. ..., D. ...
    // (A) ..., (B) ..., (C) ..., (D) ...
    // (1) ..., (2) ..., (3) ..., (4) ...
    // 1. ..., 2. ..., 3. ..., 4. ...
    // [A] ..., [B] ..., [C] ..., [D] ...
    
    let questionText = block.header;
    const options: string[] = [];
    let detectedAnswer: number | null = null;
    let explanation = '';

    // Check for inline or block answers
    const ansMatch = fullText.match(/(?:Ans(?:wer)?|Correct\s*Option|Correct\s*Ans(?:wer)?|Correct)\s*[:=-]?\s*\(?([A-Ea-e1-5])\)?/i);
    if (ansMatch) {
      detectedAnswer = normalizeAnswerIndex(ansMatch[1]);
    }

    // Check separate answer key if not found inline
    if (detectedAnswer === null && separateAnswerKey.has(qNum)) {
      detectedAnswer = separateAnswerKey.get(qNum) ?? null;
    }

    // Check for explanation
    const expMatch = fullText.match(/(?:Explanation|Solution|Exp|Rationale)\s*[:=-]?\s*([\s\S]+?)(?=$|\n\s*(?:Q|\d+\.))/i);
    if (expMatch) {
      explanation = expMatch[1].trim();
    }

    // Extract options from the block lines
    // We try to parse option markers
    const optionRegex = /^\s*(?:\(?([A-Ea-e1-5])\)|\(?([A-Ea-e])\.|\[([A-Ea-e1-5])\]|Option\s*([A-Ea-e1-5])[:.]?)\s+(.+)$/i;

    const collectedOptions: { key: string; text: string }[] = [];
    const questionLines: string[] = [];
    let parsingOptions = false;

    const blockLines = [block.header, ...block.bodyLines];

    for (const rawLine of blockLines) {
      const line = rawLine.trim();
      if (!line) continue;

      // Skip answer / explanation lines from question or option text
      if (/^(?:Ans(?:wer)?|Correct\s*Option|Correct|Explanation|Solution|Exp)\s*[:=-]/i.test(line)) {
        continue;
      }

      // Check for inline options on a single line e.g., "(A) Apple (B) Banana (C) Cherry (D) Date"
      const inlineOptionMatches = Array.from(line.matchAll(/(?:\(?([A-Da-d1-4])\)[.:]?|\b([A-Da-d])\.)\s+([^(]+?)(?=(?:\([A-Da-d1-4]\)|\b[A-Da-d]\.|$))/g));
      if (inlineOptionMatches.length >= 2) {
        parsingOptions = true;
        for (const m of inlineOptionMatches) {
          collectedOptions.push({
            key: m[1] || m[2],
            text: m[3].trim(),
          });
        }
        continue;
      }

      const optMatch = line.match(optionRegex);
      if (optMatch) {
        parsingOptions = true;
        const key = optMatch[1] || optMatch[2] || optMatch[3] || optMatch[4];
        const optContent = optMatch[5].trim();
        collectedOptions.push({
          key,
          text: optContent,
        });
      } else if (!parsingOptions) {
        questionLines.push(line);
      } else {
        // Appending multi-line option text to last option
        if (collectedOptions.length > 0) {
          collectedOptions[collectedOptions.length - 1].text += ' ' + line;
        }
      }
    }

    if (questionLines.length > 0) {
      questionText = questionLines.join(' ').replace(/^\d+[\s.:)]+/, '').trim();
    }

    // Map collected options to standard [A, B, C, D]
    if (collectedOptions.length >= 2) {
      for (let k = 0; k < Math.min(5, collectedOptions.length); k++) {
        options.push(collectedOptions[k].text);
      }
    }

    // Default 4 fallback placeholders if none detected but question text was valid
    if (options.length === 0) {
      options.push('Option A', 'Option B', 'Option C', 'Option D');
    }

    // Determine confidence
    let confidence: 'high' | 'medium' | 'needs_review' = 'high';
    if (options.length >= 4 && detectedAnswer !== null && questionText.length > 8) {
      confidence = 'high';
    } else if (options.length >= 2 && detectedAnswer !== null) {
      confidence = 'medium';
    } else if (detectedAnswer === null) {
      confidence = 'needs_review';
    } else {
      confidence = 'needs_review';
    }

    results.push({
      id: `q-${Date.now()}-${index + 1}-${Math.random().toString(36).substring(2, 6)}`,
      questionNumber: qNum,
      questionText: questionText || `Question ${qNum}`,
      options,
      correctAnswer: detectedAnswer,
      explanation: explanation || undefined,
      confidence,
    });
  });

  return results;
}
