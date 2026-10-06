'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FileText,
  Clock,
  Award,
  ShieldAlert,
  CheckSquare,
  ArrowRight,
  Info,
  Laptop,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User,
} from 'lucide-react';
import { getExamById, getUserProfile } from '@/lib/storage/localStore';
import { Exam, UserProfile } from '@/types';
import { useToast } from '@/components/Toast';

export default function ExamInstructionsPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const examId = params.examId as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const foundExam = getExamById(examId);
    if (!foundExam) {
      toast.error('Exam not found.');
      router.push('/dashboard');
      return;
    }
    setExam(foundExam);
    setProfile(getUserProfile());
  }, [examId, router, toast]);

  const handleStartExam = () => {
    if (!hasAgreed) {
      toast.warning('Please agree to the instructions declaration to proceed.');
      return;
    }
    router.push(`/exam/${examId}`);
  };

  if (!mounted || !exam) {
    return <div className="p-12 text-center text-slate-500">Loading instructions...</div>;
  }

  const marksPerQ = exam.settings?.marksPerQuestion || 1;
  const totalQuestions = exam.questions.length;
  const totalMarks = totalQuestions * marksPerQ;
  const durationMins = exam.settings?.durationMinutes || 15;
  const isNegative = exam.settings?.negativeMarkingEnabled;
  const negMarks = exam.settings?.negativeMarks || 0.25;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-700/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-300">
            Official Computer Based Test (CBT) Instructions
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {exam.title}
          </h1>
          <p className="text-xs text-slate-300">
            Category: {exam.category || 'Standard Mock Examination'}
          </p>
        </div>

        {/* Candidate Info Badge */}
        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-base">
            <User className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-white">{profile?.name || 'Candidate'}</div>
            <div className="text-indigo-200 text-[11px]">Roll: EXP-{examId.slice(-6).toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Test Parameters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
          <span className="text-xs font-semibold text-slate-500">Total Questions</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {totalQuestions}
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
          <span className="text-xs font-semibold text-slate-500">Duration</span>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {durationMins} mins
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
          <span className="text-xs font-semibold text-slate-500">Maximum Marks</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {totalMarks}
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
          <span className="text-xs font-semibold text-slate-500">Negative Marking</span>
          <div className={`text-2xl font-bold mt-1 ${isNegative ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {isNegative ? `-${negMarks}` : 'None'}
          </div>
        </div>
      </div>

      {/* CBT Palette Legend Guideline */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Laptop className="w-5 h-5 text-indigo-600" />
          <span>Question Palette Navigation & Status Indicators</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The Question Palette displayed on the right side of screen will show the status of each question using the following colors:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="w-7 h-7 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              <strong>Not Visited:</strong> You have not visited the question yet.
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="w-7 h-7 rounded-md bg-rose-600 text-white font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              <strong>Not Answered:</strong> You have visited the question but not answered it.
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="w-7 h-7 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              <strong>Answered:</strong> You have answered the question.
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="w-7 h-7 rounded-md bg-purple-600 text-white font-bold flex items-center justify-center shrink-0">
              4
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              <strong>Marked for Review:</strong> Marked for review without answering.
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 sm:col-span-2">
            <span className="w-7 h-7 rounded-md bg-indigo-600 border-2 border-purple-400 text-white font-bold flex items-center justify-center shrink-0">
              5
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              <strong>Answered & Marked for Review:</strong> The question has been answered AND marked for review (will be evaluated).
            </span>
          </div>
        </div>
      </div>

      {/* General Rules */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-indigo-600" />
          <span>General Examination Instructions</span>
        </h3>
        <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
          <li>The countdown timer at the top right corner will display the remaining time available for you to complete the examination.</li>
          <li>When the timer reaches zero (00:00:00), the examination will automatically end and submit your responses.</li>
          <li>Clicking on <strong>Save & Next</strong> saves your answer for the current question and moves to the next question.</li>
          <li>Clicking on <strong>Clear Response</strong> deselects your chosen option.</li>
          <li>Your responses are <strong>continuously saved</strong> in your local browser storage. If your page accidentally refreshes, your progress will be fully restored.</li>
        </ul>
      </div>

      {/* Declaration & Start Button */}
      <div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-5">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={hasAgreed}
            onChange={(e) => setHasAgreed(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 shrink-0"
          />
          <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
            I have read and understood all the instructions given above. I undertake to abide by the rules of this Computer Based Test mock examination.
          </span>
        </label>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            ← Return to Dashboard
          </button>

          <button
            type="button"
            onClick={handleStartExam}
            disabled={!hasAgreed}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <span>I am ready to begin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
