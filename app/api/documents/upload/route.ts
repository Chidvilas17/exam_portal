import { NextRequest, NextResponse } from 'next/server';
import { parseMCQDocument } from '@/lib/parser/extractor';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const directText = formData.get('text') as string | null;

    let extractedText = '';
    let filename = 'document.txt';
    let fileType = 'text/plain';

    if (directText && directText.trim().length > 0) {
      extractedText = directText;
      filename = 'Pasted_Text_Paper.txt';
    } else if (file) {
      filename = file.name;
      fileType = file.type;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const lowerName = filename.toLowerCase();

      if (lowerName.endsWith('.pdf')) {
        try {
          // Dynamic import of pdf-parse for Next.js node environment
          const pdfParse = (await import('pdf-parse')).default;
          const pdfData = await pdfParse(buffer);
          extractedText = pdfData.text;
        } catch (pdfErr: any) {
          console.error('PDF parsing error:', pdfErr);
          return NextResponse.json(
            { error: 'Failed to extract text from PDF. The document might be password-protected or image-scanned.' },
            { status: 422 }
          );
        }
      } else if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
        try {
          const mammoth = await import('mammoth');
          const docxResult = await mammoth.extractRawText({ buffer });
          extractedText = docxResult.value;
        } catch (docErr: any) {
          console.error('DOCX parsing error:', docErr);
          return NextResponse.json(
            { error: 'Failed to parse Word document.' },
            { status: 422 }
          );
        }
      } else {
        // Plain text / Markdown
        extractedText = buffer.toString('utf-8');
      }
    } else {
      return NextResponse.json({ error: 'No file or text provided' }, { status: 400 });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'The uploaded document appears to be empty or contains no readable text.' },
        { status: 400 }
      );
    }

    const questions = parseMCQDocument(extractedText);

    return NextResponse.json({
      success: true,
      filename,
      questionsCount: questions.length,
      questions,
      rawTextPreview: extractedText.substring(0, 500),
    });
  } catch (error: any) {
    console.error('Document upload API error:', error);
    return NextResponse.json(
      { error: error?.message || 'An internal error occurred while processing the document' },
      { status: 500 }
    );
  }
}
