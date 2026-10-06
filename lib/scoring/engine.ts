import { ExamAttemptState, ExamResult, AttemptAnswerReview, ExtractedQuestion, ExamSettings } from '@/types';

export function calculateExamResult(attempt: ExamAttemptState): ExamResult {
  const { questions, answers, markedForReview, settings, startedAt, remainingSeconds } = attempt;
  
  const totalQuestions = questions.length;
  const marksPerQuestion = settings.marksPerQuestion || 1;
  const negativeMarks = settings.negativeMarkingEnabled ? (settings.negativeMarks || 0.25) : 0;
  const maxScore = totalQuestions * marksPerQuestion;
  const totalDurationSeconds = settings.durationMinutes * 60;
  const timeTakenSeconds = Math.max(0, totalDurationSeconds - (remainingSeconds || 0));

  let attempted = 0;
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;
  let markedForReviewCount = 0;

  const questionReviews: AttemptAnswerReview[] = questions.map((q, idx) => {
    const userAnswer = answers[q.id] !== undefined ? answers[q.id] : null;
    const isMarked = !!markedForReview[q.id];
    if (isMarked) markedForReviewCount++;

    let status: 'correct' | 'incorrect' | 'unanswered' = 'unanswered';
    let isCorrect = false;
    let marksAwarded = 0;

    if (userAnswer !== null) {
      attempted++;
      if (q.correctAnswer !== null && userAnswer === q.correctAnswer) {
        correct++;
        isCorrect = true;
        status = 'correct';
        marksAwarded = marksPerQuestion;
      } else {
        incorrect++;
        isCorrect = false;
        status = 'incorrect';
        marksAwarded = -negativeMarks;
      }
    } else {
      unanswered++;
      status = 'unanswered';
      marksAwarded = 0;
    }

    return {
      questionId: q.id,
      questionNumber: idx + 1,
      questionText: q.questionText,
      options: q.options,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      isMarkedForReview: isMarked,
      status,
      marksAwarded,
      explanation: q.explanation || 'No explanation provided for this question.',
    };
  });

  const rawScore = (correct * marksPerQuestion) - (incorrect * negativeMarks);
  const score = Math.round(rawScore * 100) / 100;
  const percentage = maxScore > 0 ? Math.round((Math.max(0, score) / maxScore) * 10000) / 100 : 0;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 10000) / 100 : 0;
  const averageTimePerQuestionSeconds = attempted > 0 ? Math.round(timeTakenSeconds / attempted) : Math.round(timeTakenSeconds / Math.max(1, totalQuestions));

  let performanceGrade: ExamResult['performanceGrade'] = 'Keep Practicing';
  let feedbackText = 'Focus on core concepts, analyze your mistakes, and practice regularly to improve speed and accuracy.';

  if (percentage >= 90) {
    performanceGrade = 'Excellent';
    feedbackText = 'Outstanding performance! You have mastered these topics with high precision and strong time management.';
  } else if (percentage >= 75) {
    performanceGrade = 'Very Good';
    feedbackText = 'Great job! You have a solid grasp of most concepts. Minor revisions on tricky questions will push you into the top percentile.';
  } else if (percentage >= 60) {
    performanceGrade = 'Good';
    feedbackText = 'Good effort! Focus on eliminating negative marks and practicing high-yield problem patterns.';
  } else if (percentage >= 40) {
    performanceGrade = 'Needs Improvement';
    feedbackText = 'You have basic familiarity but need to work on concept clarity and avoid guessing where negative marking applies.';
  }

  return {
    attemptId: attempt.attemptId,
    examId: attempt.examId,
    examTitle: attempt.examTitle,
    category: settings.category || 'General Mock Test',
    startedAt: new Date(startedAt).toISOString(),
    submittedAt: new Date().toISOString(),
    totalQuestions,
    attempted,
    correct,
    incorrect,
    unanswered,
    markedForReviewCount,
    score,
    maxScore,
    percentage,
    accuracy,
    timeTakenSeconds,
    totalDurationSeconds,
    averageTimePerQuestionSeconds,
    performanceGrade,
    feedbackText,
    settings,
    questionReviews,
  };
}
