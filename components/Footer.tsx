'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpenCheck, ShieldCheck, Zap, Laptop } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  // Hide footer on CBT active exam screen
  if (pathname.startsWith('/exam/') && !pathname.endsWith('/instructions')) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <BookOpenCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-base">Exam Portal</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
            Practice any MCQ question paper as an interactive Computer Based Test (CBT) mock exam with instant analysis.
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Local & Private Parsing</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
            Exam Categories
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">SSC CGL / CHSL / MTS</Link></li>
            <li><Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">IBPS & SBI Bank PO</Link></li>
            <li><Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">RRB NTPC & Group D</Link></li>
            <li><Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">UPSC & State PSCs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
            Platform Features
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/create" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">PDF & DOCX MCQ Extraction</Link></li>
            <li><Link href="/exams" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Live CBT Test Engine</Link></li>
            <li><Link href="/history" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Instant Accuracy & Scoring</Link></li>
            <li><Link href="/history" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Detailed Question Review</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
            CBT Standards
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
            Modeled according to modern Indian competitive examination CBT interfaces with real question palettes and negative marking support.
          </p>
          <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            <Zap className="w-3.5 h-3.5" />
            <span>Zero latency offline-resilient engine</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          © {new Date().getFullYear()} Exam Portal. All rights reserved. Practice Smarter. Perform Better.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/create" className="hover:underline">Create Mock</Link>
          <Link href="/history" className="hover:underline">History</Link>
        </div>
      </div>
    </footer>
  );
}
