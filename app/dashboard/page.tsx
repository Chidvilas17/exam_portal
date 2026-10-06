'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileUp,
  Award,
  BarChart3,
  Target,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Play,
  RotateCcw,
  TrendingUp,
  History,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { getStoredExams, getStoredResults, getUserStats, getUserProfile } from '@/lib/storage/localStore';
import { Exam, ExamResult, UserStats, UserProfile } from '@/types';

export default function DashboardPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalExamsTaken: 0,
    examsCompleted: 0,
    averageScorePercentage: 0,
    bestScorePercentage: 0,
    totalQuestionsAttempted: 0,
    overallAccuracy: 0,
    totalTimeSpentSeconds: 0,
  });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadedExams = getStoredExams();
    const loadedResults = getStoredResults();
    const userStats = getUserStats();
    const userProfile = getUserProfile();

    setExams(loadedExams);
    setResults(loadedResults);
    setStats(userStats);
    setProfile(userProfile);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const hours = Math.floor(mins / 60);
    if (hours > 0) return `${hours}h ${mins % 60}m`;
    return `${mins} mins`;
  };

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-700/40 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-sm border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Target: {profile?.targetExam || 'SSC / Banking / PSC'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, {profile?.name || 'Aspirant'}!
          </h1>
          <p className="text-indigo-200 text-sm max-w-xl">
            Ready for your next mock test? Practice under real exam conditions to build speed and accuracy.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-md hover:bg-indigo-50 hover:-translate-y-0.5 transition-all"
          >
            <FileUp className="w-4 h-4" />
            <span>+ Create Mock Test</span>
          </Link>
          <Link
            href="/history"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-semibold text-sm border border-white/20 transition-colors"
          >
            <History className="w-4 h-4" />
            <span>View History</span>
          </Link>
        </div>
      </div>

      {/* 6 Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Exams</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.totalExamsTaken}
          </div>
          <span className="text-[11px] text-slate-500">Attempted tests</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.examsCompleted}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">100% submitted</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg. Score</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.averageScorePercentage}%
          </div>
          <span className="text-[11px] text-slate-500">Across all tests</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Best Score</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.bestScorePercentage}%
          </div>
          <span className="text-[11px] text-amber-600 font-medium">Personal best</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Questions</span>
            <BarChart3 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.totalQuestionsAttempted}
          </div>
          <span className="text-[11px] text-slate-500">Solved in CBT</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Accuracy</span>
            <Target className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.overallAccuracy}%
          </div>
          <span className="text-[11px] text-slate-500">Precision rate</span>
        </div>
      </div>

      {/* Main Section: Available Mock Tests & Quick Practice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Mock Test Library */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Available Mock Tests
              </h2>
              <p className="text-xs text-slate-500">Choose a test to practice in CBT mode</p>
            </div>
            <Link
              href="/exams"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      {exam.category || 'Competitive Exam'}
                    </span>
                    {exam.bestScore !== undefined && (
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        Best: {exam.bestScore}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 line-clamp-2">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                    {exam.description || `${exam.questions.length} questions interactive test.`}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      {exam.questions.length} Qs
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {exam.settings?.durationMinutes || 15} mins
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {exam.attemptsCount || 0} attempts
                    </span>
                  </div>

                  <Link
                    href={`/exam/${exam.id}/instructions`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start CBT Exam</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Upload CTA Card */}
          <div className="p-6 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <FileUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  Have a question paper in PDF or Word?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Upload your document to convert it into a mock test in seconds.
                </p>
              </div>
            </div>
            <Link
              href="/create"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              Upload Document
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Recent Attempts & Performance */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Recent Attempts
            </h2>
            <Link
              href="/history"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All
            </Link>
          </div>

          {results.length === 0 ? (
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <History className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                No mock test attempts yet
              </h4>
              <p className="text-xs text-slate-500">
                Start one of the sample mock exams above to see your scores and accuracy reports.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.slice(0, 4).map((r) => (
                <div
                  key={r.attemptId}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {r.examTitle}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {new Date(r.submittedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        r.percentage >= 75
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : r.percentage >= 50
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {r.percentage}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      Score:{' '}
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {r.score} / {r.maxScore}
                      </span>
                    </div>
                    <div>
                      Accuracy:{' '}
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {r.accuracy}%
                      </span>
                    </div>
                    <Link
                      href={`/result/${r.attemptId}`}
                      className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Review →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tips Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 text-white space-y-2 border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Pro Tip for CBT Exams</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Use the <strong>Mark for Review</strong> button on questions you are 50% sure about. Return to them in the last 5 minutes without losing your selected option.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
