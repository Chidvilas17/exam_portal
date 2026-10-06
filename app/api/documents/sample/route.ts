import { NextResponse } from 'next/server';
import { SAMPLE_RAW_DOCUMENTS, SAMPLE_SSC_QUESTIONS, SAMPLE_BANKING_QUESTIONS } from '@/lib/storage/mockData';
import { parseMCQDocument } from '@/lib/parser/extractor';

export async function GET() {
  const samplePaper = SAMPLE_RAW_DOCUMENTS[0];
  const parsed = parseMCQDocument(samplePaper.content);

  return NextResponse.json({
    samplePaper,
    parsedQuestions: parsed,
    sampleSSC: SAMPLE_SSC_QUESTIONS,
    sampleBanking: SAMPLE_BANKING_QUESTIONS,
  });
}
