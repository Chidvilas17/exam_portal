'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Send,
  HelpCircle,
  Menu,
  X,
  User,
  ShieldAlert,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { getExamById, getActiveAttempt, saveActiveAttempt, removeActiveAttempt, saveExamResult, getUserProfile } from '@/lib/storage/localStore';
import { calculateExamResult } from '@/lib/scoring/engine';
import { Exam, ExamAttemptState, PaletteQuestionStatus, UserProfile } from '@/types';
import { SubmitModal } from '@/components/exam/SubmitModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/components/Toast';

export default function CBTExamPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const examId = params.examId as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [attempt, setAttempt] = useState<ExamAttemptState | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaletteOpenMobile, setIsPaletteOpenMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Ref for timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const attemptRef = useRef<ExamAttemptState | null>(null);

  // Keep attemptRef in sync
  useEffect(() => {
    attemptRef.current = attempt;
  }, [attempt]);

  // Initial load or restore from active attempt
  useEffect(() => {
    const foundExam = getExamById(examId);
    if (!foundExam) {
      toast.error('Exam not found.');
      router.push('/dashboard');
      return;
    }

    setExam(foundExam);
    setProfile(getUserProfile());

    const attemptId = `attempt-${examId}`;
    const restored = getActiveAttempt(attemptId);

    if (restored && !restored.isSubmitted) {
      setAttempt(restored);
      setCurrentIdx(restored.currentQuestionIndex || 0);
      setRemainingSeconds(restored.remainingSeconds);
      toast.info('Restored your in-progress exam session.');
    } else {
      // Create new initial attempt
      const durationSecs = (foundExam.settings?.durationMinutes || 15) * 60;
      const initialAttempt: ExamAttemptState = {
        attemptId: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        examId: foundExam.id,
        examTitle: foundExam.title,
        questions: foundExam.questions,
        settings: foundExam.settings,
        startedAt: Date.now(),
        remainingSeconds: durationSecs,
        currentQuestionIndex: 0,
        answers: {},
        visitedQuestions: { [foundExam.questions[0].id]: true },
        markedForReview: {},
        isSubmitted: false,
        lastSavedAt: Date.now(),
      };
      setAttempt(initialAttempt);
      setCurrentIdx(0);
      setRemainingSeconds(durationSecs);
      saveActiveAttempt(initialAttempt);
    }
  }, [examId, router, toast]);

  // Final submission handler
  const handleFinalSubmit = useCallback(() => {
    if (!attemptRef.current || isSubmitting) return;
    setIsSubmitting(true);

    if (timerRef.current) clearInterval(timerRef.current);

    const currentAttempt = {
      ...attemptRef.current,
      remainingSeconds,
      isSubmitted: true,
    };

    // Calculate score & evaluation
    const finalResult = calculateExamResult(currentAttempt);

    // Save result to history
    saveExamResult(finalResult);

    // Clear active attempt cache
    removeActiveAttempt(currentAttempt.attemptId);
    removeActiveAttempt(`attempt-${examId}`);

    toast.success('Exam submitted successfully!');
    router.push(`/result/${finalResult.attemptId}`);
  }, [examId, remainingSeconds, isSubmitting, router, toast]);

  // Real countdown timer effect
  useEffect(() => {
    if (!attempt) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          toast.warning('Time is up! Your exam is being submitted automatically.');
          handleFinalSubmit();
          return 0;
        }

        const next = prev - 1;

        // Warnings at specific thresholds
        if (next === 600) toast.info('10 minutes remaining in exam.');
        if (next === 300) toast.warning('5 minutes remaining! Please review your answers.');
        if (next === 60) toast.error('1 minute remaining! Exam will auto-submit shortly.');

        // Persist periodically
        if (next % 5 === 0 && attemptRef.current) {
          saveActiveAttempt({
            ...attemptRef.current,
            remainingSeconds: next,
          });
        }

        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [attempt, handleFinalSubmit, toast]);

  // Save current question index & answers to state + storage
  const updateAttemptState = (
    newAnswers?: Record<string, number>,
    newMarked?: Record<string, boolean>,
    nextIndex?: number
  ) => {
    if (!attempt) return;
    setSaveStatus('saving');

    const updatedAnswers = newAnswers !== undefined ? newAnswers : attempt.answers;
    const updatedMarked = newMarked !== undefined ? newMarked : attempt.markedForReview;
    const nextIdx = nextIndex !== undefined ? nextIndex : currentIdx;

    const nextQId = attempt.questions[nextIdx]?.id;
    const updatedVisited = {
      ...attempt.visitedQuestions,
      ...(nextQId ? { [nextQId]: true } : {}),
    };

    const updated: ExamAttemptState = {
      ...attempt,
      currentQuestionIndex: nextIdx,
      answers: updatedAnswers,
      markedForReview: updatedMarked,
      visitedQuestions: updatedVisited,
      remainingSeconds,
      lastSavedAt: Date.now(),
    };

    setAttempt(updated);
    saveActiveAttempt(updated);

    setTimeout(() => setSaveStatus('saved'), 250);
  };

  const handleSelectOption = (optionIdx: number) => {
    if (!attempt) return;
    const currentQ = attempt.questions[currentIdx];
    const newAnswers = { ...attempt.answers, [currentQ.id]: optionIdx };
    updateAttemptState(newAnswers);
  };

  const handleClearResponse = () => {
    if (!attempt) return;
    const currentQ = attempt.questions[currentIdx];
    const newAnswers = { ...attempt.answers };
    delete newAnswers[currentQ.id];
    updateAttemptState(newAnswers);
    toast.info('Response cleared for this question.');
  };

  const handleMarkForReviewAndNext = () => {
    if (!attempt) return;
    const currentQ = attempt.questions[currentIdx];
    const isCurrentlyMarked = !!attempt.markedForReview[currentQ.id];
    const newMarked = { ...attempt.markedForReview, [currentQ.id]: !isCurrentlyMarked };

    const nextIndex = Math.min(attempt.questions.length - 1, currentIdx + 1);
    setCurrentIdx(nextIndex);
    updateAttemptState(undefined, newMarked, nextIndex);
  };

  const handleSaveAndNext = () => {
    if (!attempt) return;
    const nextIndex = Math.min(attempt.questions.length - 1, currentIdx + 1);
    setCurrentIdx(nextIndex);
    updateAttemptState(undefined, undefined, nextIndex);
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      const prevIndex = currentIdx - 1;
      setCurrentIdx(prevIndex);
      updateAttemptState(undefined, undefined, prevIndex);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    if (!attempt || index < 0 || index >= attempt.questions.length) return;
    setCurrentIdx(index);
    updateAttemptState(undefined, undefined, index);
    setIsPaletteOpenMobile(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Helper: Format seconds to HH:MM:SS
  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  // Helper: Determine status for palette button
  const getQuestionPaletteStatus = (qId: string): PaletteQuestionStatus => {
    if (!attempt) return 'not-visited';
    const isVisited = !!attempt.visitedQuestions[qId];
    const isAnswered = attempt.answers[qId] !== undefined;
    const isMarked = !!attempt.markedForReview[qId];

    if (isAnswered && isMarked) return 'answered-and-marked-for-review';
    if (isMarked) return 'marked-for-review';
    if (isAnswered) return 'answered';
    if (isVisited) return 'not-answered';
    return 'not-visited';
  };

  if (!exam || !attempt) {
    return <div className="p-12 text-center text-slate-500">Initializing CBT Mock Environment...</div>;
  }

  const currentQ = attempt.questions[currentIdx];
  const selectedOption = attempt.answers[currentQ.id];
  const isMarkedReview = !!attempt.markedForReview[currentQ.id];

  // Palette counts
  let answeredCount = 0;
  let notAnsweredCount = 0;
  let markedCount = 0;
  let answeredMarkedCount = 0;
  let notVisitedCount = 0;

  attempt.questions.forEach((q) => {
    const st = getQuestionPaletteStatus(q.id);
    if (st === 'answered') answeredCount++;
    else if (st === 'not-answered') notAnsweredCount++;
    else if (st === 'marked-for-review') markedCount++;
    else if (st === 'answered-and-marked-for-review') {
      answeredCount++;
      answeredMarkedCount++;
    } else notVisitedCount++;
  });

  const totalUnanswered = attempt.questions.length - answeredCount;
  const isTimeCritical = remainingSeconds <= 300; // 5 mins
  const isTimeEmergency = remainingSeconds <= 60; // 1 min

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100 dark:bg-slate-950 select-none">
      {/* 1. CBT Top Header */}
      <header className="h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 z-30 shadow-sm">
        {/* Left: Exam title & section */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-sm">
            CBT
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[200px] sm:max-w-md">
              {exam.title}
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>Section: {currentQ.section || 'General'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    saveStatus === 'saved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                  }`}
                />
                {saveStatus === 'saved' ? 'Saved' : 'Saving...'}
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right: Candidate & Countdown Timer */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Candidate badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {profile?.name || 'Candidate'}
            </span>
          </div>

          {/* Countdown Timer */}
          <div
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border font-mono font-bold text-sm sm:text-base transition-all ${
              isTimeEmergency
                ? 'bg-rose-600 text-white border-rose-700 animate-pulse shadow-lg shadow-rose-600/30'
                : isTimeCritical
                ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-400 dark:border-amber-700'
                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
            }`}
          >
            <Clock className={`w-4 h-4 ${isTimeCritical ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span className="tracking-wider">{formatTimer(remainingSeconds)}</span>
          </div>

          {/* Mobile drawer toggle */}
          <button
            onClick={() => setIsPaletteOpenMobile(!isPaletteOpenMobile)}
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Theme & Fullscreen */}
          <div className="hidden sm:flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Question Area (Left / Center) */}
        <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-900/60">
          <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col justify-between space-y-6">
            {/* Question Card Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Question Number & Marks Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-base sm:text-lg">
                    Question {currentIdx + 1}
                  </span>
                  <span className="text-xs text-slate-400">of {attempt.questions.length}</span>
                  {isMarkedReview && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      <Bookmark className="w-3 h-3 fill-current" />
                      Marked for Review
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    +{exam.settings?.marksPerQuestion || 1}.0
                  </span>
                  {exam.settings?.negativeMarkingEnabled && (
                    <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                      -{exam.settings?.negativeMarks || 0.25}
                    </span>
                  )}
                </div>
              </div>

              {/* Question Body */}
              <div className="text-base sm:text-xl font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                {currentQ.questionText}
              </div>

              {/* 4 Interactive Option Cards */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((optionText, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const letter = String.fromCharCode(65 + optIdx);

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/90 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-100 shadow-md ring-2 ring-indigo-500/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {letter}
                      </div>
                      <span className="text-sm sm:text-base font-medium flex-1 leading-snug">
                        {optionText}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom CBT Navigation & Action Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentIdx === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearResponse}
                  disabled={selectedOption === undefined}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Clear Response
                </button>

                <button
                  type="button"
                  onClick={handleMarkForReviewAndNext}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isMarkedReview ? 'Unmark Review' : 'Mark for Review & Next'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleSaveAndNext}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 transition-all"
                >
                  <span>{currentIdx === attempt.questions.length - 1 ? 'Save & Review' : 'Save & Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Exam</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* 3. Question Palette Sidebar (Right) */}
        <aside
          className={`fixed inset-y-0 right-0 z-40 w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col md:static transition-transform duration-300 shadow-xl md:shadow-none ${
            isPaletteOpenMobile ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
          }`}
        >
          {/* Palette Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Question Palette
              </h3>
              <p className="text-[11px] text-slate-400">Click any number to jump</p>
            </div>
            <button
              onClick={() => setIsPaletteOpenMobile(false)}
              className="md:hidden p-1 text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Question Status Counters */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-medium">
              <span className="w-5 h-5 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                {answeredCount}
              </span>
              <span>Answered</span>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-medium">
              <span className="w-5 h-5 rounded bg-rose-600 text-white font-bold flex items-center justify-center text-[10px]">
                {notAnsweredCount}
              </span>
              <span>Not Answered</span>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 font-medium">
              <span className="w-5 h-5 rounded bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
                {markedCount}
              </span>
              <span>Marked Review</span>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              <span className="w-5 h-5 rounded bg-slate-400 text-white font-bold flex items-center justify-center text-[10px]">
                {notVisitedCount}
              </span>
              <span>Not Visited</span>
            </div>
          </div>

          {/* Palette Grid (1..N) */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-5 gap-2">
              {attempt.questions.map((q, idx) => {
                const status = getQuestionPaletteStatus(q.id);
                const isCurrent = currentIdx === idx;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`h-9 rounded-lg font-bold text-xs transition-all flex items-center justify-center relative ${
                      isCurrent ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 scale-105' : ''
                    } ${
                      status === 'answered'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : status === 'not-answered'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : status === 'marked-for-review'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : status === 'answered-and-marked-for-review'
                        ? 'bg-indigo-600 text-white ring-2 ring-purple-400'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                    }`}
                  >
                    {idx + 1}
                    {status === 'answered-and-marked-for-review' && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Palette Submit CTA */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Test</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Confirmation Modal */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleFinalSubmit}
        totalQuestions={attempt.questions.length}
        answeredCount={answeredCount}
        unansweredCount={totalUnanswered}
        markedForReviewCount={markedCount + answeredMarkedCount}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
