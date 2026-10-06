'use client';

import { Exam, ExtractedQuestion, ExamAttemptState, ExamResult, UserStats, ExamSettings, UserProfile } from '@/types';
import { INITIAL_SAMPLE_EXAMS } from './mockData';

const STORAGE_KEYS = {
  EXAMS: 'exam_portal_exams_v1',
  RESULTS: 'exam_portal_results_v1',
  ACTIVE_ATTEMPT_PREFIX: 'exam_portal_attempt_',
  DRAFT_QUESTIONS: 'exam_portal_draft_questions_v1',
  DRAFT_SETTINGS: 'exam_portal_draft_settings_v1',
  USER_PROFILE: 'exam_portal_user_profile_v1',
  THEME: 'exam_portal_theme_v1',
};

// Safe LocalStorage helpers
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing localStorage key "${key}":`, err);
  }
}

// ---------------- EXAMS ----------------
export function getStoredExams(): Exam[] {
  const exams = getItem<Exam[]>(STORAGE_KEYS.EXAMS, []);
  if (!exams || exams.length === 0) {
    // Seed initial sample exams
    setItem(STORAGE_KEYS.EXAMS, INITIAL_SAMPLE_EXAMS);
    return INITIAL_SAMPLE_EXAMS;
  }
  return exams;
}

export function getExamById(id: string): Exam | null {
  const exams = getStoredExams();
  return exams.find((e) => e.id === id) || null;
}

export function saveExam(exam: Exam): void {
  const exams = getStoredExams();
  const existingIdx = exams.findIndex((e) => e.id === exam.id);
  if (existingIdx >= 0) {
    exams[existingIdx] = exam;
  } else {
    exams.unshift(exam);
  }
  setItem(STORAGE_KEYS.EXAMS, exams);
}

export function deleteExam(id: string): void {
  const exams = getStoredExams();
  const filtered = exams.filter((e) => e.id !== id);
  setItem(STORAGE_KEYS.EXAMS, filtered);
}

export function duplicateExam(id: string): Exam | null {
  const original = getExamById(id);
  if (!original) return null;
  const copy: Exam = {
    ...original,
    id: `exam-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: `${original.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attemptsCount: 0,
    bestScore: undefined,
  };
  saveExam(copy);
  return copy;
}

// ---------------- DRAFT QUESTION EXTRACTION FLOW ----------------
export function saveDraftQuestions(questions: ExtractedQuestion[], docName?: string): void {
  setItem(STORAGE_KEYS.DRAFT_QUESTIONS, {
    questions,
    docName: docName || 'Uploaded_Document.pdf',
    savedAt: Date.now(),
  });
}

export function getDraftQuestions(): { questions: ExtractedQuestion[]; docName: string } | null {
  return getItem<{ questions: ExtractedQuestion[]; docName: string } | null>(STORAGE_KEYS.DRAFT_QUESTIONS, null);
}

export function clearDraftQuestions(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.DRAFT_QUESTIONS);
  }
}

// ---------------- ACTIVE CBT ATTEMPT & AUTOSAVE ----------------
export function getActiveAttempt(attemptId: string): ExamAttemptState | null {
  return getItem<ExamAttemptState | null>(`${STORAGE_KEYS.ACTIVE_ATTEMPT_PREFIX}${attemptId}`, null);
}

export function saveActiveAttempt(attempt: ExamAttemptState): void {
  setItem(`${STORAGE_KEYS.ACTIVE_ATTEMPT_PREFIX}${attempt.attemptId}`, {
    ...attempt,
    lastSavedAt: Date.now(),
  });
}

export function removeActiveAttempt(attemptId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`${STORAGE_KEYS.ACTIVE_ATTEMPT_PREFIX}${attemptId}`);
  }
}

// ---------------- RESULTS HISTORY ----------------
export function getStoredResults(): ExamResult[] {
  return getItem<ExamResult[]>(STORAGE_KEYS.RESULTS, []);
}

export function getResultById(attemptId: string): ExamResult | null {
  const results = getStoredResults();
  return results.find((r) => r.attemptId === attemptId) || null;
}

export function saveExamResult(result: ExamResult): void {
  const results = getStoredResults();
  const filtered = results.filter((r) => r.attemptId !== result.attemptId);
  filtered.unshift(result);
  setItem(STORAGE_KEYS.RESULTS, filtered);

  // Update exam stats
  const exams = getStoredExams();
  const targetExam = exams.find((e) => e.id === result.examId);
  if (targetExam) {
    targetExam.attemptsCount = (targetExam.attemptsCount || 0) + 1;
    targetExam.bestScore = Math.max(targetExam.bestScore || 0, result.score);
    saveExam(targetExam);
  }
}

export function deleteResult(attemptId: string): void {
  const results = getStoredResults();
  const filtered = results.filter((r) => r.attemptId !== attemptId);
  setItem(STORAGE_KEYS.RESULTS, filtered);
}

// ---------------- USER STATS ----------------
export function getUserStats(): UserStats {
  const results = getStoredResults();
  if (results.length === 0) {
    return {
      totalExamsTaken: 0,
      examsCompleted: 0,
      averageScorePercentage: 0,
      bestScorePercentage: 0,
      totalQuestionsAttempted: 0,
      overallAccuracy: 0,
      totalTimeSpentSeconds: 0,
    };
  }

  let totalPercentage = 0;
  let bestPercentage = 0;
  let totalAttemptedQuestions = 0;
  let totalCorrectQuestions = 0;
  let totalTime = 0;

  for (const r of results) {
    totalPercentage += r.percentage;
    if (r.percentage > bestPercentage) bestPercentage = r.percentage;
    totalAttemptedQuestions += r.attempted;
    totalCorrectQuestions += r.correct;
    totalTime += r.timeTakenSeconds;
  }

  return {
    totalExamsTaken: results.length,
    examsCompleted: results.length,
    averageScorePercentage: Math.round((totalPercentage / results.length) * 10) / 10,
    bestScorePercentage: Math.round(bestPercentage * 10) / 10,
    totalQuestionsAttempted: totalAttemptedQuestions,
    overallAccuracy:
      totalAttemptedQuestions > 0
        ? Math.round((totalCorrectQuestions / totalAttemptedQuestions) * 1000) / 10
        : 0,
    totalTimeSpentSeconds: totalTime,
  };
}

// ---------------- USER PROFILE ----------------
export function getUserProfile(): UserProfile {
  return getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE, {
    name: 'Aspirant',
    email: 'aspirant@examportal.dev',
    targetExam: 'SSC CGL / Banking / State PSC',
    theme: 'light',
  });
}

export function saveUserProfile(profile: Partial<UserProfile>): UserProfile {
  const current = getUserProfile();
  const updated = { ...current, ...profile };
  setItem(STORAGE_KEYS.USER_PROFILE, updated);
  return updated;
}
