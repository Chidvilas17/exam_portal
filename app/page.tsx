'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileUp,
  BrainCircuit,
  Laptop,
  Timer,
  Award,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Play,
  FileText,
  Clock,
  Layers,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: FileUp,
      title: 'Upload Question Paper',
      desc: 'Drag and drop your PDF, DOC, DOCX or text question papers directly. Fast, client-safe, and private.',
      badge: 'PDF / DOCX',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: BrainCircuit,
      title: 'Automatic Question Extraction',
      desc: 'Intelligent parser identifies questions, 4-option sets, answer keys, and explanations automatically.',
      badge: 'Smart Parser',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Laptop,
      title: 'Real CBT Experience',
      desc: 'Authentic Indian competitive examination interface with question palette, legend, and mark-for-review.',
      badge: 'SSC & Banking UI',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Timer,
      title: 'Countdown Timer & Autosave',
      desc: 'Live test timer with 10m, 5m & 1m warnings. Auto-submits on timeout and persists answers on reload.',
      badge: 'Zero Data Loss',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Award,
      title: 'Instant Scoring & Negative Marking',
      desc: 'Strict competitive scoring engine supporting configurable marks and negative penalties (e.g. -0.25, -0.5).',
      badge: 'Auto Evaluation',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: BarChart3,
      title: 'In-Depth Performance Analytics',
      desc: 'Detailed scorecard, accuracy percentages, speed analysis, and question-by-question review with explanations.',
      badge: 'Comprehensive',
      color: 'from-rose-500 to-red-500',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Upload',
      desc: 'Upload your PDF or document containing MCQs from any source or past paper.',
    },
    {
      step: '02',
      title: 'Review & Validate',
      desc: 'Verify extracted questions and options on the interactive validation screen.',
    },
    {
      step: '03',
      title: 'Configure',
      desc: 'Set duration, number of questions, marks per question, and negative marking penalty.',
    },
    {
      step: '04',
      title: 'Attempt in CBT Mode',
      desc: 'Experience real computer-based examination pressure with countdown timer and palette.',
    },
    {
      step: '05',
      title: 'Analyze & Improve',
      desc: 'Get instant score, accuracy metrics, and step-by-step review to eliminate recurring mistakes.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Practice Smarter. Perform Better.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6">
              Practice Any MCQ Paper as a{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Real CBT Mock Test
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              Upload your PDF or document, convert it into an interactive mock exam, and practice with a real CBT-style experience designed for competitive exams.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/create"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all"
              >
                <FileUp className="w-5 h-5" />
                <span>Create Mock Test</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-base transition-all"
              >
                <Play className="w-4 h-4 text-indigo-600 dark:text-indigo-400 fill-current" />
                <span>Try Demo Exam</span>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>PDF & DOCX parsing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Real CBT question palette</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Negative marking support</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Instant answer key review</span>
              </div>
            </div>
          </div>

          {/* Interactive CBT Preview Mockup */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
            {/* Window titlebar */}
            <div className="bg-slate-100 dark:bg-slate-800/90 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  SSC CGL Tier-1 CBT Mock Examination — Live Practice
                </span>
              </div>
              <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-md text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Time Left: 00:44:28</span>
              </div>
            </div>

            {/* CBT UI Mock */}
            <div className="grid grid-cols-1 md:grid-cols-4 p-4 md:p-6 gap-6 bg-slate-50/50 dark:bg-slate-900/50">
              {/* Question area */}
              <div className="md:col-span-3 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                    Question No. 7 of 25
                  </span>
                  <div className="text-xs text-slate-500">Marks: +2.0 | Negative: -0.50</div>
                </div>

                <p className="text-slate-900 dark:text-slate-100 font-medium text-base sm:text-lg leading-snug">
                  Which Article of the Constitution of India provides for the &quot;Right to Constitutional Remedies&quot;?
                </p>

                <div className="space-y-2.5 pt-2">
                  {[
                    { key: 'A', text: 'Article 19 — Protection of certain rights regarding freedom of speech' },
                    { key: 'B', text: 'Article 21 — Protection of life and personal liberty' },
                    { key: 'C', text: 'Article 32 — Remedies for enforcement of rights conferred by this Part', selected: true },
                    { key: 'D', text: 'Article 44 — Uniform civil code for the citizens' },
                  ].map((opt) => (
                    <div
                      key={opt.key}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                        opt.selected
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 shadow-sm ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          opt.selected
                            ? 'bg-indigo-600 text-white'
                            : 'border border-slate-400 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {opt.key}
                      </div>
                      <span className="text-sm font-medium">{opt.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 gap-2">
                  <div className="flex gap-2">
                    <span className="px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 text-xs font-semibold">
                      Mark for Review
                    </span>
                    <span className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                      Clear Response
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-sm">
                      Save & Next →
                    </span>
                  </div>
                </div>
              </div>

              {/* Sidebar Palette preview */}
              <div className="md:col-span-1 border-l border-slate-200 dark:border-slate-800 pl-0 md:pl-4 space-y-4">
                <div className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Question Palette
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { num: 1, s: 'answered' },
                    { num: 2, s: 'answered' },
                    { num: 3, s: 'not-answered' },
                    { num: 4, s: 'answered' },
                    { num: 5, s: 'review' },
                    { num: 6, s: 'answered' },
                    { num: 7, s: 'current' },
                    { num: 8, s: 'not-visited' },
                    { num: 9, s: 'not-visited' },
                    { num: 10, s: 'not-visited' },
                  ].map((p) => (
                    <div
                      key={p.num}
                      className={`h-7 rounded flex items-center justify-center text-xs font-bold ${
                        p.s === 'answered'
                          ? 'bg-emerald-600 text-white'
                          : p.s === 'not-answered'
                          ? 'bg-rose-600 text-white'
                          : p.s === 'review'
                          ? 'bg-purple-600 text-white'
                          : p.s === 'current'
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-1'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {p.num}
                    </div>
                  ))}
                </div>

                <div className="text-[11px] space-y-1.5 text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                    <span>Answered (4)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
                    <span>Not Answered (1)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
                    <span>Marked Review (1)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 inline-block" />
                    <span>Not Visited (19)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Engineered for Competitive Exams
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Everything you need for serious exam preparation
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      {f.badge}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {f.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/70 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Simple 5-Step Process
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              From Question Paper to Live CBT Test in Seconds
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-indigo-600/40 dark:text-indigo-400/40 font-mono mb-2 block">
                    {s.step}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-indigo-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Exams Banner */}
      <section className="py-16 bg-indigo-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Designed for Major Competitive Examinations
          </h3>
          <p className="text-indigo-200 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Whether you are preparing for SSC CGL, IBPS Bank PO, Railway RRB NTPC, State PSCs, or Medical & Engineering entrance papers, convert your study material into real exam practice.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              'SSC CGL / CHSL',
              'IBPS & SBI PO / Clerk',
              'RRB NTPC & Group D',
              'UPSC & State PSCs',
              'Defence (CDS / AFCAT / NDA)',
              'Teaching (CTET / State TET)',
              'CUET & University Entrances',
              'Campus Placement Aptitude',
            ].map((exam, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium transition-colors"
              >
                {exam}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-white dark:bg-slate-900 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white shadow-2xl relative overflow-hidden">
            <h3 className="text-2xl sm:text-4xl font-extrabold mb-4">
              Turn Your MCQ Paper into a CBT Mock Now
            </h3>
            <p className="text-indigo-100 text-base sm:text-lg max-w-xl mx-auto mb-8">
              No complex setup required. Simply upload your PDF or Word document, review questions, and start practicing in real examination conditions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/create"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-base shadow-lg shadow-black/20 hover:-translate-y-0.5 transition-all"
              >
                Upload Question Paper
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-700 border border-white/30 text-white font-bold text-base transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
