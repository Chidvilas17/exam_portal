'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, X } from 'lucide-react';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  markedForReviewCount: number;
  isSubmitting?: boolean;
}

export function SubmitModal({
  isOpen,
  onClose,
  onConfirmSubmit,
  totalQuestions,
  answeredCount,
  unansweredCount,
  markedForReviewCount,
  isSubmitting = false,
}: SubmitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Submit Mock Test?
              </h3>
              <p className="text-xs text-slate-500">
                Please review your exam summary before final submission.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Table */}
        <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800 text-xs sm:text-sm">
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500 font-medium">Total Questions:</span>
            <span className="font-bold text-slate-900 dark:text-white">{totalQuestions}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-emerald-600 font-medium flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              Answered:
            </span>
            <span className="font-bold text-emerald-600">{answeredCount}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-rose-600 font-medium flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              Unanswered / Not Visited:
            </span>
            <span className="font-bold text-rose-600">{unansweredCount}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-purple-600 font-medium flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              Marked for Review:
            </span>
            <span className="font-bold text-purple-600">{markedForReviewCount}</span>
          </div>
        </div>

        {/* Warning if unanswered */}
        {unansweredCount > 0 && (
          <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900">
            <strong>Warning:</strong> You have <strong>{unansweredCount}</strong> unanswered question(s). Are you sure you want to conclude the test now?
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Continue Exam
          </button>
          <button
            type="button"
            onClick={onConfirmSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
          >
            {isSubmitting ? 'Evaluating...' : 'Yes, Submit Test'}
          </button>
        </div>
      </div>
    </div>
  );
}
