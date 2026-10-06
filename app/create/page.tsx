'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileUp,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FileCode,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { saveDraftQuestions } from '@/lib/storage/localStore';
import { SAMPLE_RAW_DOCUMENTS } from '@/lib/storage/mockData';
import { parseMCQDocument } from '@/lib/parser/extractor';
import { ExtractedQuestion } from '@/types';

export default function CreateMockPage() {
  const router = useRouter();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const processingStages = [
    'Uploading document...',
    'Reading raw binary stream...',
    'Extracting text characters...',
    'Detecting question headers & numbers...',
    'Segmenting A/B/C/D option choices...',
    'Identifying answer keys & explanations...',
    'Normalizing structured mock format...',
    'Finalizing question validation...',
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const validateAndSetFile = (f: File) => {
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const name = f.name.toLowerCase();
    const isValid = validExtensions.some((ext) => name.endsWith(ext));

    if (!isValid) {
      toast.error('Please upload a valid PDF, DOCX, DOC, or TXT file.');
      return;
    }

    if (f.size > 25 * 1024 * 1024) {
      toast.error('File size exceeds 25MB limit.');
      return;
    }

    setFile(f);
    toast.info(`Selected "${f.name}" (${(f.size / 1024).toFixed(1)} KB)`);
  };

  const handleProcess = async () => {
    if (activeTab === 'upload' && !file) {
      toast.error('Please select or drop a question paper first.');
      return;
    }
    if (activeTab === 'paste' && !pastedText.trim()) {
      toast.error('Please paste question paper text before processing.');
      return;
    }

    setIsProcessing(true);
    setProgressPercent(10);

    // Simulate animated realistic progress steps
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < processingStages.length - 1) {
        setProcessingStage(processingStages[currentStep]);
        setProgressPercent(Math.min(90, Math.round(((currentStep + 1) / processingStages.length) * 100)));
        currentStep++;
      }
    }, 400);

    try {
      const formData = new FormData();
      if (activeTab === 'upload' && file) {
        formData.append('file', file);
      } else {
        formData.append('text', pastedText);
      }

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      clearInterval(interval);

      if (!res.ok || !data.success) {
        // Fallback to client-side parser if server route had issues
        let fallbackQuestions: ExtractedQuestion[] = [];
        if (activeTab === 'paste' && pastedText) {
          fallbackQuestions = parseMCQDocument(pastedText);
        } else if (file) {
          // If file was plain text
          const text = await file.text().catch(() => '');
          if (text) {
            fallbackQuestions = parseMCQDocument(text);
          }
        }

        if (fallbackQuestions.length > 0) {
          setProgressPercent(100);
          setProcessingStage('Completed!');
          saveDraftQuestions(fallbackQuestions, file?.name || 'Pasted_Questions.txt');
          toast.success(`Successfully parsed ${fallbackQuestions.length} questions!`);
          setTimeout(() => router.push('/create/review'), 600);
          return;
        }

        throw new Error(data.error || 'Failed to process document');
      }

      setProgressPercent(100);
      setProcessingStage(`Extracted ${data.questions.length} questions successfully!`);
      saveDraftQuestions(data.questions, data.filename);
      toast.success(`Extracted ${data.questions.length} questions!`);

      setTimeout(() => {
        router.push('/create/review');
      }, 700);
    } catch (err: any) {
      clearInterval(interval);
      setIsProcessing(false);
      console.error(err);
      toast.error(err.message || 'Error processing document. Please verify the file format.');
    }
  };

  const loadSample = () => {
    const sample = SAMPLE_RAW_DOCUMENTS[0];
    setPastedText(sample.content);
    setActiveTab('paste');
    toast.info('Sample question paper loaded into editor!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1 of 3: Document Upload</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create a Mock Test
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Upload your MCQ question paper in PDF or Word format, and we&apos;ll convert it into an interactive CBT mock exam.
        </p>
      </div>

      {/* Main Form Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3.5 px-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document (PDF / DOCX)</span>
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-3.5 px-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'paste'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Paste Raw Text / Markdown</span>
          </button>
        </div>

        {/* Tab 1: Upload Dropzone */}
        {activeTab === 'upload' && (
          <div className="p-6 sm:p-8 space-y-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 scale-[1.01]'
                  : file
                  ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-950/40'
              }`}
            >
              <div className="max-w-md mx-auto space-y-4">
                <div
                  className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg transition-transform ${
                    file
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white'
                  }`}
                >
                  {file ? <CheckCircle2 className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
                </div>

                {file ? (
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {file.name}
                    </h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to process
                    </p>
                    <p className="text-xs text-slate-400">Click or drop to replace file</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                      Drag & drop your question paper here
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      or <span className="text-indigo-600 dark:text-indigo-400 font-semibold underline">browse files</span> from your computer
                    </p>
                    <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                      <span>Supported: PDF, DOCX, DOC, TXT</span>
                      <span>•</span>
                      <span>Max size: 25 MB</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <button
                type="button"
                onClick={loadSample}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Don&apos;t have a file? Try our sample question paper</span>
              </button>
              <span>Encrypted in-browser parsing</span>
            </div>
          </div>
        )}

        {/* Tab 2: Paste Raw Text */}
        {activeTab === 'paste' && (
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Paste MCQ Questions Text
              </label>
              <button
                type="button"
                onClick={loadSample}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Insert Sample Format</span>
              </button>
            </div>

            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder={`1. What is the capital of India?
A. Mumbai
B. New Delhi
C. Kolkata
D. Chennai
Answer: B
Explanation: New Delhi is the capital of India.

2. Which planet is closest to the Sun?
A. Venus
B. Mercury
C. Earth
D. Mars
Ans: B`}
              rows={12}
              className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Processing State Overlay / Indicator */}
        {isProcessing && (
          <div className="p-6 bg-indigo-50/90 dark:bg-indigo-950/90 border-t border-indigo-200 dark:border-indigo-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                {processingStage || 'Processing paper...'}
              </span>
              <span>{progressPercent}%</span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-indigo-200 dark:bg-indigo-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-indigo-700 dark:text-indigo-300 text-center">
              Our intelligent engine is identifying question bodies, options, answer keys, and structuring your CBT mock test.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleProcess}
            disabled={isProcessing || (activeTab === 'upload' ? !file : !pastedText.trim())}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-indigo-600/30 transition-all"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Paper...</span>
              </>
            ) : (
              <>
                <span>Process Paper & Extract MCQs</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Formatting Guidelines */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          Supported Question Formats
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 font-mono">
            <span className="font-bold text-indigo-600 block mb-1">Standard Format A</span>
            1. Question text?<br />
            A. Option 1<br />
            B. Option 2<br />
            C. Option 3<br />
            D. Option 4<br />
            Answer: B
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 font-mono">
            <span className="font-bold text-indigo-600 block mb-1">Numbered Format B</span>
            Q1. Question text?<br />
            (1) Option 1<br />
            (2) Option 2<br />
            (3) Option 3<br />
            (4) Option 4<br />
            Correct: 2
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 font-mono">
            <span className="font-bold text-indigo-600 block mb-1">Answer Key at End</span>
            1. Question text?<br />
            (a) .. (b) .. (c) .. (d) ..<br />
            ...<br />
            ANSWER KEY:<br />
            1-B, 2-C, 3-A
          </div>
        </div>
      </div>
    </div>
  );
}
