'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Target,
  RotateCcw,
  History,
  FileUp,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Bookmark,
  Check,
  Share2,
} from 'lucide-react';
import { getResultById } from '@/lib/storage/localStore';
import { ExamResult } from '@/types';
import { useToast } from '@/components/Toast';

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const attemptId = params.attemptId as string;

  const [result, setResult] = useState<ExamResult | null>(null);
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect' | 'unanswered' | 'marked'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadedResult = getResultById(attemptId);
    if (!loadedResult) {
      toast.error('Result not found.');
      router.push('/history');
      return;
    }
    setResult(loadedResult);
  }, [attemptId, router, toast]);

  if (!mounted || !result) {
    return <div className="p-12 text-center text-slate-500">Loading exam result & analytics...</div>;
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const filteredReviews = result.questionReviews.filter((q) => {
    if (filter === 'correct') return q.status === 'correct';
    if (filter === 'incorrect') return q.status === 'incorrect';
    if (filter === 'unanswered') return q.status === 'unanswered';
    if (filter === 'marked') return q.isMarkedForReview;
    return true;
  });

  const getGradeColor = (grade: ExamResult['performanceGrade']) => {
    switch (grade) {
      case 'Excellent':
        return 'from-emerald-600 to-teal-600 text-emerald-100';
      case 'Very Good':
        return 'from-blue-600 to-indigo-600 text-blue-100';
      case 'Good':
        return 'from-indigo-600 to-purple-600 text-indigo-100';
      case 'Needs Improvement':
        return 'from-amber-600 to-orange-600 text-amber-100';
      default:
        return 'from-slate-700 to-slate-900 text-slate-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Hero Scorecard */}
      <div
        className={`p-6 sm:p-10 rounded-3xl bg-gradient-to-r ${getGradeColor(
          result.performanceGrade
        )} text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8`}
      >
        <div className="space-y-3 text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{result.performanceGrade} Performance</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {result.examTitle}
          </h1>
          <p className="text-sm max-w-xl text-white/90 leading-relaxed">
            {result.feedbackText}
          </p>
          <div className="text-xs text-white/70 pt-2">
            Submitted on{' '}
            {new Date(result.submittedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>

        {/* Big Score Badge */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 text-center min-w-[200px] shadow-xl relative z-10 shrink-0">
          <span className="text-xs uppercase font-bold tracking-wider text-white/80 block mb-1">
            Total Score
          </span>
          <div className="text-4xl sm:text-5xl font-black tracking-tight mb-1">
            {result.score} <span className="text-xl sm:text-2xl font-normal opacity-80">/ {result.maxScore}</span>
          </div>
          <div className="inline-block text-sm font-bold px-3 py-1 rounded-full bg-white text-slate-900 shadow-sm mt-2">
            {result.percentage}% Score
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Score</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {result.score}
          </div>
          <span className="text-[11px] text-slate-400">Max {result.maxScore}</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 mb-1">
            <span>Correct</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {result.correct}
          </div>
          <span className="text-[11px] text-slate-400">+{result.correct * (result.settings?.marksPerQuestion || 1)} marks</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-600 mb-1">
            <span>Incorrect</span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-rose-600">
            {result.incorrect}
          </div>
          <span className="text-[11px] text-rose-500">
            {result.settings?.negativeMarkingEnabled ? `-${result.incorrect * (result.settings?.negativeMarks || 0.25)} penalty` : 'No penalty'}
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Unanswered</span>
            <HelpCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
            {result.unanswered}
          </div>
          <span className="text-[11px] text-slate-400">Skipped questions</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-600 mb-1">
            <span>Accuracy</span>
            <Target className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {result.accuracy}%
          </div>
          <span className="text-[11px] text-slate-400">Of attempted</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-600 mb-1">
            <span>Time Used</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {formatTime(result.timeTakenSeconds)}
          </div>
          <span className="text-[11px] text-slate-400">Avg {result.averageTimePerQuestionSeconds}s / Q</span>
        </div>
      </div>

      {/* 3. Visual Performance Chart / Breakdown */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Question Response Distribution
        </h3>

        {/* Custom Responsive Progress Bar */}
        <div className="h-6 rounded-xl bg-slate-100 dark:bg-slate-800 flex overflow-hidden p-1 gap-1">
          {result.correct > 0 && (
            <div
              className="bg-emerald-500 rounded-lg transition-all"
              style={{ width: `${(result.correct / result.totalQuestions) * 100}%` }}
              title={`Correct: ${result.correct}`}
            />
          )}
          {result.incorrect > 0 && (
            <div
              className="bg-rose-500 rounded-lg transition-all"
              style={{ width: `${(result.incorrect / result.totalQuestions) * 100}%` }}
              title={`Incorrect: ${result.incorrect}`}
            />
          )}
          {result.unanswered > 0 && (
            <div
              className="bg-slate-300 dark:bg-slate-600 rounded-lg transition-all"
              style={{ width: `${(result.unanswered / result.totalQuestions) * 100}%` }}
              title={`Unanswered: ${result.unanswered}`}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
            <span>Correct ({result.correct})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
            <span>Incorrect ({result.incorrect})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-slate-400 inline-block" />
            <span>Unanswered ({result.unanswered})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-purple-500 inline-block" />
            <span>Marked for Review ({result.markedForReviewCount})</span>
          </div>
        </div>
      </div>

      {/* 4. Filterable Question-by-Question Detailed Analysis */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Question-Wise Detailed Review
            </h2>
            <p className="text-xs text-slate-500">
              Review your answers, correct options, and step-by-step solutions.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({result.questionReviews.length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filter === 'correct'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              Correct ({result.correct})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filter === 'incorrect'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400'
              }`}
            >
              Incorrect ({result.incorrect})
            </button>
            <button
              onClick={() => setFilter('unanswered')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filter === 'unanswered'
                  ? 'bg-slate-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Unanswered ({result.unanswered})
            </button>
            <button
              onClick={() => setFilter('marked')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filter === 'marked'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400'
              }`}
            >
              Review ({result.markedForReviewCount})
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredReviews.map((q) => {
            const isCorrect = q.status === 'correct';
            const isIncorrect = q.status === 'incorrect';
            const isUnanswered = q.status === 'unanswered';

            return (
              <div
                key={q.questionId}
                className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                  isCorrect
                    ? 'border-emerald-200 dark:border-emerald-900/60'
                    : isIncorrect
                    ? 'border-rose-200 dark:border-rose-900/60'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Question {q.questionNumber}
                    </span>
                    {q.isMarkedForReview && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                        <Bookmark className="w-2.5 h-2.5 fill-current" />
                        Marked
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-bold">
                    {isCorrect && (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Correct (+{q.marksAwarded})
                      </span>
                    )}
                    {isIncorrect && (
                      <span className="text-rose-600 flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Incorrect ({q.marksAwarded})
                      </span>
                    )}
                    {isUnanswered && (
                      <span className="text-slate-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Unanswered (0)
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  {q.questionText}
                </p>

                {/* Options Review Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {q.options.map((optText, optIdx) => {
                    const isCandidateChoice = q.userAnswer === optIdx;
                    const isRightAnswer = q.correctAnswer === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border flex items-center gap-3 text-xs font-medium ${
                          isRightAnswer
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                            : isCandidateChoice && !isRightAnswer
                            ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isRightAnswer
                              ? 'bg-emerald-600 text-white'
                              : isCandidateChoice && !isRightAnswer
                              ? 'bg-rose-600 text-white'
                              : 'border border-slate-300 dark:border-slate-600 text-slate-500'
                          }`}
                        >
                          {letter}
                        </div>
                        <span className="flex-1">{optText}</span>
                        {isRightAnswer && (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                            Correct Answer
                          </span>
                        )}
                        {isCandidateChoice && !isRightAnswer && (
                          <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-1.5 py-0.5 rounded">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs space-y-1">
                    <span className="font-bold text-indigo-900 dark:text-indigo-300 block">
                      Solution & Explanation:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Bottom Navigation Actions */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <Link
          href={`/exam/${result.examId}/instructions`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake This Mock Test</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/history"
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <History className="w-4 h-4" />
            <span>All History</span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            <span>Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
