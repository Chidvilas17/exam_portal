'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  History,
  Award,
  Clock,
  Target,
  Search,
  RotateCcw,
  Trash2,
  ArrowRight,
  Sparkles,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { getStoredResults, deleteResult } from '@/lib/storage/localStore';
import { ExamResult } from '@/types';
import { useToast } from '@/components/Toast';

export default function HistoryPage() {
  const toast = useToast();
  const [results, setResults] = useState<ExamResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setResults(getStoredResults());
  }, []);

  const handleDelete = (attemptId: string) => {
    if (confirm('Are you sure you want to delete this test result?')) {
      deleteResult(attemptId);
      setResults((prev) => prev.filter((r) => r.attemptId !== attemptId));
      toast.info('Result record deleted.');
    }
  };

  const filteredResults = results.filter((r) =>
    r.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    return `${mins} mins`;
  };

  if (!mounted) {
    return <div className="p-12 text-center text-slate-500">Loading history...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <History className="w-7 h-7 text-indigo-600" />
            <span>Exam Attempt History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track your test scores, progress, and performance trends over time.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by exam name..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Results List */}
      {filteredResults.length === 0 ? (
        <div className="p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto">
            <History className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No mock test attempts found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your exam history will appear here once you take your first CBT mock test.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
          >
            <span>Take a Mock Test</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResults.map((r) => (
            <div
              key={r.attemptId}
              className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              {/* Left Info */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {r.category || 'Competitive Exam'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(r.submittedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {r.examTitle}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span>
                    Questions: <strong className="text-slate-800 dark:text-slate-200">{r.totalQuestions}</strong>
                  </span>
                  <span>
                    Correct: <strong className="text-emerald-600">{r.correct}</strong>
                  </span>
                  <span>
                    Incorrect: <strong className="text-rose-600">{r.incorrect}</strong>
                  </span>
                  <span>
                    Time: <strong className="text-slate-800 dark:text-slate-200">{formatTime(r.timeTakenSeconds)}</strong>
                  </span>
                </div>
              </div>

              {/* Center Score & Accuracy */}
              <div className="flex items-center gap-6 border-y md:border-y-0 md:border-x border-slate-100 dark:border-slate-800 py-3 md:py-0 px-0 md:px-6 shrink-0 w-full md:w-auto justify-around md:justify-start">
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    {r.score} <span className="text-xs font-normal text-slate-400">/ {r.maxScore}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                      r.percentage >= 75
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : r.percentage >= 50
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                    }`}
                  >
                    {r.percentage}%
                  </span>
                </div>

                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
                  <div className="text-xl font-black text-blue-600 dark:text-blue-400">
                    {r.accuracy}%
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {r.attempted} attempted
                  </span>
                </div>
              </div>

              {/* Right Action buttons */}
              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                <Link
                  href={`/result/${r.attemptId}`}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  View Result
                </Link>

                <Link
                  href={`/exam/${r.examId}/instructions`}
                  className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Retake Exam"
                >
                  <RotateCcw className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDelete(r.attemptId)}
                  className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete Result"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
