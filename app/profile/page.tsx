'use client';

import React, { useEffect, useState } from 'react';
import {
  User,
  Award,
  BookOpen,
  Target,
  Clock,
  Settings,
  Save,
  ShieldCheck,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { getUserProfile, saveUserProfile, getUserStats, getStoredExams } from '@/lib/storage/localStore';
import { UserProfile, UserStats } from '@/types';
import { useToast } from '@/components/Toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { INITIAL_SAMPLE_EXAMS } from '@/lib/storage/mockData';

export default function ProfilePage() {
  const toast = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Aspirant',
    email: 'aspirant@examportal.dev',
    targetExam: 'Staff Selection Commission (SSC CGL)',
    theme: 'light',
  });
  const [stats, setStats] = useState<UserStats>({
    totalExamsTaken: 0,
    examsCompleted: 0,
    averageScorePercentage: 0,
    bestScorePercentage: 0,
    totalQuestionsAttempted: 0,
    overallAccuracy: 0,
    totalTimeSpentSeconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfile(getUserProfile());
    setStats(getUserStats());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserProfile(profile);
    toast.success('Profile preferences updated successfully!');
  };

  const handleResetDemoData = () => {
    if (confirm('This will reset mock tests and history to default sample state. Proceed?')) {
      localStorage.clear();
      toast.success('Local data reset to default demo data.');
      window.location.reload();
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const hours = Math.floor(mins / 60);
    if (hours > 0) return `${hours} hrs ${mins % 60} mins`;
    return `${mins} mins`;
  };

  if (!mounted) {
    return <div className="p-12 text-center text-slate-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-700/50 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shrink-0">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-semibold">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Target: {profile.targetExam}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
          <p className="text-xs text-indigo-200">{profile.email}</p>
        </div>
      </div>

      {/* Aggregate Performance Snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
          <span className="text-xs font-semibold text-slate-500">Total Exams</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {stats.totalExamsTaken}
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
          <span className="text-xs font-semibold text-slate-500">Average Score</span>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {stats.averageScorePercentage}%
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
          <span className="text-xs font-semibold text-slate-500">Overall Accuracy</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.overallAccuracy}%
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
          <span className="text-xs font-semibold text-slate-500">Total CBT Time</span>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">
            {formatSeconds(stats.totalTimeSpentSeconds)}
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form
        onSubmit={handleSave}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
      >
        <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-600" />
          <span>Candidate Preferences</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Candidate Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Primary Target Examination
          </label>
          <select
            value={profile.targetExam}
            onChange={(e) => setProfile({ ...profile, targetExam: e.target.value })}
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Staff Selection Commission (SSC CGL)">Staff Selection Commission (SSC CGL / CHSL / MTS)</option>
            <option value="Banking & Insurance (IBPS / SBI / RBI)">Banking & Insurance (IBPS / SBI / RBI)</option>
            <option value="Railway Recruitment (RRB NTPC / Group D)">Railway Recruitment (RRB NTPC / Group D)</option>
            <option value="UPSC & State Public Service Commissions">UPSC & State Public Service Commissions</option>
            <option value="Engineering / Medical Entrance (JEE / NEET)">Engineering / Medical Entrance (JEE / NEET)</option>
            <option value="Teaching & Eligibility Exams (CTET / TET)">Teaching & Eligibility Exams (CTET / TET)</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleResetDemoData}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
