'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Edit3,
  HelpCircle,
  Layers,
  Save,
  Check,
} from 'lucide-react';
import { getDraftQuestions, saveDraftQuestions } from '@/lib/storage/localStore';
import { ExtractedQuestion } from '@/types';
import { useToast } from '@/components/Toast';

export default function ReviewQuestionsPage() {
  const router = useRouter();
  const toast = useToast();

  const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);
  const [docName, setDocName] = useState('Uploaded_Document.pdf');
  const [filterConfidence, setFilterConfidence] = useState<'all' | 'needs_review' | 'high'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const draft = getDraftQuestions();
    if (!draft || !draft.questions || draft.questions.length === 0) {
      toast.error('No extracted questions found. Please upload a document first.');
      router.push('/create');
      return;
    }
    setQuestions(draft.questions);
    if (draft.docName) setDocName(draft.docName);
  }, [router, toast]);

  const handleUpdateQuestion = (id: string, updates: Partial<ExtractedQuestion>) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const updated = { ...q, ...updates };
          // If user set a correct answer and has 4 options, mark confidence high
          if (updated.correctAnswer !== null && updated.options.length >= 2) {
            updated.confidence = 'high';
          }
          return updated;
        }
        return q;
      })
    );
  };

  const handleOptionChange = (qId: string, optIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          const newOpts = [...q.options];
          newOpts[optIndex] = text;
          return { ...q, options: newOpts };
        }
        return q;
      })
    );
  };

  const handleCorrectAnswerSelect = (qId: string, optIndex: number) => {
    handleUpdateQuestion(qId, { correctAnswer: optIndex, confidence: 'high' });
    toast.success('Correct answer updated');
  };

  const handleDeleteQuestion = (id: string) => {
    const filtered = questions.filter((q) => q.id !== id);
    const renumbered = filtered.map((q, idx) => ({ ...q, questionNumber: idx + 1 }));
    setQuestions(renumbered);
    toast.info('Question removed');
  };

  const handleAddQuestion = () => {
    const newQ: ExtractedQuestion = {
      id: `q-manual-${Date.now()}`,
      questionNumber: questions.length + 1,
      questionText: 'Enter question text here...',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      confidence: 'high',
    };
    setQuestions([...questions, newQ]);
    setEditingId(newQ.id);
    toast.success('New question added to test');
  };

  const handleProceed = () => {
    if (questions.length === 0) {
      toast.error('You must have at least 1 question to create a mock test.');
      return;
    }

    const missingAnswers = questions.filter((q) => q.correctAnswer === null);
    if (missingAnswers.length > 0) {
      toast.warning(`${missingAnswers.length} question(s) don't have a correct answer selected. Please choose correct answers or they will default to Option A.`);
    }

    // Default any remaining nulls to 0
    const cleaned = questions.map((q, idx) => ({
      ...q,
      questionNumber: idx + 1,
      correctAnswer: q.correctAnswer !== null ? q.correctAnswer : 0,
    }));

    saveDraftQuestions(cleaned, docName);
    toast.success('Questions validated! Proceeding to exam configuration.');
    router.push('/create/setup');
  };

  const filteredQuestions = questions.filter((q) => {
    if (filterConfidence === 'needs_review') return q.confidence === 'needs_review';
    if (filterConfidence === 'high') return q.confidence === 'high';
    return true;
  });

  const needsReviewCount = questions.filter((q) => q.confidence === 'needs_review' || q.correctAnswer === null).length;

  if (!mounted) {
    return <div className="p-10 text-center text-slate-500">Loading extracted questions...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 2 of 3: Question Validation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Review Extracted Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Source: <span className="font-semibold text-slate-700 dark:text-slate-300">{docName}</span> • Total {questions.length} questions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/create')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Upload</span>
          </button>
          <button
            onClick={handleProceed}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 transition-all"
          >
            <span>Continue to Setup</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Review Alert if items need attention */}
      {needsReviewCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">{needsReviewCount} question(s) need your review.</span>
            <p className="text-amber-700 dark:text-amber-300 mt-0.5 text-xs">
              Some questions did not have an explicit answer key in the document. Click the radio button next to the correct option to confirm it.
            </p>
          </div>
        </div>
      )}

      {/* Filter and Add Question Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Filter:</span>
          <button
            onClick={() => setFilterConfidence('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterConfidence === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All ({questions.length})
          </button>
          <button
            onClick={() => setFilterConfidence('needs_review')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterConfidence === 'needs_review'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Needs Review ({needsReviewCount})
          </button>
          <button
            onClick={() => setFilterConfidence('high')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterConfidence === 'high'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            High Confidence ({questions.length - needsReviewCount})
          </button>
        </div>

        <button
          onClick={handleAddQuestion}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
        >
          <Plus className="w-4 h-4 text-indigo-600" />
          <span>+ Add Question</span>
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isEditing = editingId === q.id;
          const hasAnswer = q.correctAnswer !== null;

          return (
            <div
              key={q.id}
              className={`p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                !hasAnswer
                  ? 'border-amber-300 dark:border-amber-700/80 ring-1 ring-amber-400'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Question #{q.questionNumber}
                  </span>
                  {q.confidence === 'high' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      High Confidence
                    </span>
                  )}
                  {q.confidence === 'needs_review' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      <AlertTriangle className="w-3 h-3" />
                      Needs Review
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingId(isEditing ? null : q.id)}
                    className="p-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg font-medium flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Done Editing' : 'Edit Text'}</span>
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                    title="Delete question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              {isEditing ? (
                <div className="mb-4">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Question Text
                  </label>
                  <textarea
                    value={q.questionText}
                    onChange={(e) => handleUpdateQuestion(q.id, { questionText: e.target.value })}
                    rows={2}
                    className="w-full p-3 text-sm rounded-xl border border-indigo-300 dark:border-indigo-700 bg-slate-50 dark:bg-slate-950 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ) : (
                <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 mb-4 leading-relaxed">
                  {q.questionText}
                </p>
              )}

              {/* Options */}
              <div className="space-y-2 mb-4">
                <div className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center justify-between">
                  <span>Options (Click the radio to set as correct answer):</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    Correct: Option {q.correctAnswer !== null ? String.fromCharCode(65 + q.correctAnswer) : 'None'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((optText, optIdx) => {
                    const isCorrect = q.correctAnswer === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleCorrectAnswerSelect(q.id, optIdx)}
                        className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                          isCorrect
                            ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'border border-slate-300 dark:border-slate-700 text-slate-500'
                          }`}
                        >
                          {letter}
                        </div>

                        {isEditing ? (
                          <input
                            type="text"
                            value={optText}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleOptionChange(q.id, optIdx, e.target.value)}
                            className="w-full text-xs p-1 bg-white dark:bg-slate-900 border rounded font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        ) : (
                          <span className="text-xs font-medium flex-1 line-clamp-2">{optText}</span>
                        )}

                        {isCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanation Field */}
              {isEditing ? (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Explanation / Solution Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={q.explanation || ''}
                    onChange={(e) => handleUpdateQuestion(q.id, { explanation: e.target.value })}
                    placeholder="Enter answer explanation or concept explanation..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              ) : q.explanation ? (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Explanation: </span>
                  {q.explanation}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          <span className="font-bold text-slate-900 dark:text-white">{questions.length} questions ready</span>
          {needsReviewCount > 0 && (
            <span className="text-amber-600 ml-2">({needsReviewCount} need review)</span>
          )}
        </div>

        <button
          onClick={handleProceed}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/30 transition-all"
        >
          <span>Continue to Exam Setup</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
