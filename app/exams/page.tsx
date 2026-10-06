'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Plus,
  Play,
  Copy,
  Trash2,
  Clock,
  Layers,
  Award,
  FileUp,
  Search,
} from 'lucide-react';
import { getStoredExams, deleteExam, duplicateExam } from '@/lib/storage/localStore';
import { Exam } from '@/types';
import { useToast } from '@/components/Toast';

export default function MyExamsPage() {
  const toast = useToast();
  const [exams, setExams] = useState<Exam[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setExams(getStoredExams());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this mock exam?')) {
      deleteExam(id);
      setExams((prev) => prev.filter((e) => e.id !== id));
      toast.info('Mock exam deleted.');
    }
  };

  const handleDuplicate = (id: string) => {
    const copied = duplicateExam(id);
    if (copied) {
      setExams(getStoredExams());
      toast.success(`Created duplicate: "${copied.title}"`);
    }
  };

  const filteredExams = exams.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) {
    return <div className="p-12 text-center text-slate-500">Loading mock tests...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <FolderKanban className="w-7 h-7 text-indigo-600" />
            <span>My Mock Tests</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your created CBT practice sets and question banks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shrink-0 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Mock</span>
          </Link>
        </div>
      </div>

      {/* Grid of Exams */}
      {filteredExams.length === 0 ? (
        <div className="p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto">
            <FolderKanban className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No mock tests found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload your first question paper to generate a CBT test.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
          >
            <FileUp className="w-4 h-4" />
            <span>Upload Question Paper</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 line-clamp-1">
                    {exam.category || 'General Practice'}
                  </span>
                  {exam.bestScore !== undefined && (
                    <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 shrink-0">
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
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 mb-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    {exam.questions.length} Questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {exam.settings?.durationMinutes || 15} mins
                  </span>
                  <span>{exam.attemptsCount || 0} attempts</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/exam/${exam.id}/instructions`}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start CBT Exam</span>
                  </Link>

                  <button
                    onClick={() => handleDuplicate(exam.id)}
                    className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Duplicate Mock Test"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Exam"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
