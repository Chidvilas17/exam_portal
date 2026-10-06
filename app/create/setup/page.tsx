'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Settings,
  Clock,
  Award,
  Layers,
  Shuffle,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { getDraftQuestions, saveExam } from '@/lib/storage/localStore';
import { ExtractedQuestion, Exam, ExamSettings } from '@/types';
import { useToast } from '@/components/Toast';

export default function ExamSetupPage() {
  const router = useRouter();
  const toast = useToast();

  const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);
  const [docName, setDocName] = useState('');

  // Form settings state
  const [examName, setExamName] = useState('');
  const [category, setCategory] = useState('Staff Selection Commission (SSC)');
  const [questionCountType, setQuestionCountType] = useState<'all' | 'custom'>('all');
  const [customQuestionCount, setCustomQuestionCount] = useState(25);
  const [durationPreset, setDurationPreset] = useState<number>(15); // in minutes
  const [customDuration, setCustomDuration] = useState<number>(15);
  const [marksPerQuestion, setMarksPerQuestion] = useState<number>(1);
  const [negativeMarkingEnabled, setNegativeMarkingEnabled] = useState<boolean>(true);
  const [negativeMarks, setNegativeMarks] = useState<number>(0.25);
  const [questionOrder, setQuestionOrder] = useState<'sequential' | 'random'>('sequential');
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const draft = getDraftQuestions();
    if (!draft || !draft.questions || draft.questions.length === 0) {
      toast.error('No draft questions found. Please upload a document first.');
      router.push('/create');
      return;
    }
    setQuestions(draft.questions);
    setDocName(draft.docName);
    
    // Auto-fill exam name based on document name
    const cleanDocName = draft.docName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    setExamName(`${cleanDocName} CBT Mock`);
    setCustomQuestionCount(draft.questions.length);
  }, [router, toast]);

  const handleCreateAndStart = () => {
    if (!examName.trim()) {
      toast.error('Please enter an exam title.');
      return;
    }

    const totalQCount =
      questionCountType === 'all'
        ? questions.length
        : Math.min(questions.length, Math.max(1, customQuestionCount));

    const finalDuration = durationPreset === -1 ? customDuration : durationPreset;

    // Pick question subset according to order
    let selectedQuestions = [...questions];
    if (questionOrder === 'random') {
      selectedQuestions.sort(() => Math.random() - 0.5);
    }
    selectedQuestions = selectedQuestions.slice(0, totalQCount);

    const settings: ExamSettings = {
      examName: examName.trim(),
      category,
      totalQuestions: totalQCount,
      durationMinutes: finalDuration,
      marksPerQuestion: Number(marksPerQuestion) || 1,
      negativeMarkingEnabled,
      negativeMarks: negativeMarkingEnabled ? Number(negativeMarks) || 0.25 : 0,
      questionOrder,
      shuffleOptions,
    };

    const newExamId = `exam-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newExam: Exam = {
      id: newExamId,
      title: examName.trim(),
      category,
      description: `${totalQCount} questions • ${finalDuration} mins • ${
        negativeMarkingEnabled ? `-${negativeMarks} negative marking` : 'No negative marking'
      }`,
      questions: selectedQuestions,
      settings,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attemptsCount: 0,
      sourceDocumentName: docName,
    };

    saveExam(newExam);
    toast.success('Mock test created successfully!');
    router.push(`/exam/${newExamId}/instructions`);
  };

  if (!mounted) {
    return <div className="p-10 text-center text-slate-500">Loading exam configuration...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 3 of 3: Mock Test Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Exam Setup & Parameters
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Configure duration, scoring criteria, negative marking, and question settings for your mock test.
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        {/* Exam Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Exam Title / Name
          </label>
          <input
            type="text"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            placeholder="e.g. SSC CGL Tier-1 Practice Mock 01"
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Exam Category / Pattern
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Staff Selection Commission (SSC)">Staff Selection Commission (SSC CGL / CHSL / MTS)</option>
            <option value="Banking & Insurance (IBPS / SBI / RBI)">Banking & Insurance (IBPS / SBI / RBI)</option>
            <option value="Railway Recruitment (RRB NTPC / Group D)">Railway Recruitment (RRB NTPC / Group D)</option>
            <option value="UPSC & State Public Service Commissions">UPSC & State Public Service Commissions</option>
            <option value="Engineering / Medical Entrance (JEE / NEET)">Engineering / Medical Entrance (JEE / NEET)</option>
            <option value="Teaching & Eligibility Exams (CTET / TET)">Teaching & Eligibility Exams (CTET / TET)</option>
            <option value="General Aptitude & Placement Test">General Aptitude & Placement Test</option>
          </select>
        </div>

        {/* Number of Questions */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Number of Questions
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setQuestionCountType('all')}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                questionCountType === 'all'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <span>All Available</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                ({questions.length} Qs)
              </span>
            </button>

            {[10, 25, 50].map((count) => (
              <button
                key={count}
                type="button"
                disabled={questions.length < count}
                onClick={() => {
                  setQuestionCountType('custom');
                  setCustomQuestionCount(count);
                }}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  questionCountType === 'custom' && customQuestionCount === count
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                    : questions.length < count
                    ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <span>{count} Questions</span>
                <span className="text-slate-400 text-[10px]">subset</span>
              </button>
            ))}
          </div>
        </div>

        {/* Duration Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Exam Duration (Countdown Timer)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[10, 15, 30, 45, 60, 90].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDurationPreset(mins)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  durationPreset === mins
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                {mins} mins
              </button>
            ))}
          </div>
        </div>

        {/* Scoring & Marks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Marks Per Question */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <span>Marks per Correct Answer</span>
            </label>
            <select
              value={marksPerQuestion}
              onChange={(e) => setMarksPerQuestion(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium text-xs sm:text-sm"
            >
              <option value={1}>+1.0 Mark (Standard)</option>
              <option value={2}>+2.0 Marks (SSC CGL / Banking)</option>
              <option value={3}>+3.0 Marks</option>
              <option value={4}>+4.0 Marks (JEE / NEET)</option>
            </select>
          </div>

          {/* Negative Marking */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span>Negative Marking</span>
              </label>
              <input
                type="checkbox"
                checked={negativeMarkingEnabled}
                onChange={(e) => setNegativeMarkingEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <select
              disabled={!negativeMarkingEnabled}
              value={negativeMarks}
              onChange={(e) => setNegativeMarks(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium text-xs sm:text-sm disabled:opacity-40"
            >
              <option value={0.25}>-0.25 (1/4th penalty)</option>
              <option value={0.33}>-0.33 (1/3rd penalty)</option>
              <option value={0.5}>-0.50 (1/2 penalty / SSC standard)</option>
              <option value={1.0}>-1.00 (Full penalty / NEET style)</option>
            </select>
          </div>
        </div>

        {/* Question Ordering & Shuffling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Question Order
              </span>
              <span className="text-[11px] text-slate-500">Sequential or randomized</span>
            </div>
            <div className="flex rounded-lg bg-slate-200 dark:bg-slate-800 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setQuestionOrder('sequential')}
                className={`px-2.5 py-1 rounded-md font-bold ${
                  questionOrder === 'sequential' ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-600' : 'text-slate-500'
                }`}
              >
                1..N
              </button>
              <button
                type="button"
                onClick={() => setQuestionOrder('random')}
                className={`px-2.5 py-1 rounded-md font-bold ${
                  questionOrder === 'random' ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-600' : 'text-slate-500'
                }`}
              >
                Random
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Shuffle Options
              </span>
              <span className="text-[11px] text-slate-500">Scramble A, B, C, D choices</span>
            </div>
            <input
              type="checkbox"
              checked={shuffleOptions}
              onChange={(e) => setShuffleOptions(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push('/create/review')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            ← Back to Questions
          </button>

          <button
            type="button"
            onClick={handleCreateAndStart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/30 transition-all"
          >
            <span>Proceed to Test Instructions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
