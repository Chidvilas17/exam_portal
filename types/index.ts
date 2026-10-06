export interface ExtractedOption {
  id: string;
  text: string;
}

export interface ExtractedQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  options: string[]; // [Option A, Option B, Option C, Option D, ...]
  correctAnswer: number | null; // 0 for A, 1 for B, 2 for C, 3 for D, or null if uncertain
  explanation?: string;
  confidence: 'high' | 'medium' | 'needs_review';
  section?: string;
}

export interface ExamSettings {
  examName: string;
  category?: string;
  totalQuestions: number;
  durationMinutes: number; // in minutes
  marksPerQuestion: number;
  negativeMarkingEnabled: boolean;
  negativeMarks: number; // e.g., 0.25, 0.33, 0.5
  questionOrder: 'sequential' | 'random';
  shuffleOptions: boolean;
}

export interface Exam {
  id: string;
  title: string;
  category: string;
  description?: string;
  questions: ExtractedQuestion[];
  settings: ExamSettings;
  createdAt: string;
  updatedAt: string;
  attemptsCount?: number;
  bestScore?: number;
  sourceDocumentName?: string;
}

export type PaletteQuestionStatus =
  | 'not-visited'
  | 'not-answered'
  | 'answered'
  | 'marked-for-review'
  | 'answered-and-marked-for-review';

export interface ExamAttemptState {
  attemptId: string;
  examId: string;
  examTitle: string;
  questions: ExtractedQuestion[];
  settings: ExamSettings;
  startedAt: number; // timestamp ms
  remainingSeconds: number;
  currentQuestionIndex: number;
  answers: Record<string, number>; // questionId -> selectedOptionIndex (0, 1, 2, 3)
  visitedQuestions: Record<string, boolean>; // questionId -> boolean
  markedForReview: Record<string, boolean>; // questionId -> boolean
  isSubmitted: boolean;
  lastSavedAt: number;
}

export interface AttemptAnswerReview {
  questionId: string;
  questionNumber: number;
  questionText: string;
  options: string[];
  userAnswer: number | null;
  correctAnswer: number | null;
  isCorrect: boolean;
  isMarkedForReview: boolean;
  status: 'correct' | 'incorrect' | 'unanswered';
  marksAwarded: number;
  explanation?: string;
  timeSpentSeconds?: number;
}

export interface ExamResult {
  attemptId: string;
  examId: string;
  examTitle: string;
  category: string;
  startedAt: string;
  submittedAt: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  markedForReviewCount: number;
  score: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  timeTakenSeconds: number;
  totalDurationSeconds: number;
  averageTimePerQuestionSeconds: number;
  performanceGrade: 'Excellent' | 'Very Good' | 'Good' | 'Needs Improvement' | 'Keep Practicing';
  feedbackText: string;
  settings: ExamSettings;
  questionReviews: AttemptAnswerReview[];
}

export interface UserStats {
  totalExamsTaken: number;
  examsCompleted: number;
  averageScorePercentage: number;
  bestScorePercentage: number;
  totalQuestionsAttempted: number;
  overallAccuracy: number;
  totalTimeSpentSeconds: number;
}

export interface UserProfile {
  name: string;
  email: string;
  targetExam: string;
  theme: 'light' | 'dark' | 'system';
}
