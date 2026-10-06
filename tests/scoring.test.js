const assert = require('assert');

// 1. Test Scoring Engine Logic directly
function calculateScore(attempt) {
  const { questions, answers, settings } = attempt;
  const marksPerQuestion = settings.marksPerQuestion || 1;
  const negativeMarks = settings.negativeMarkingEnabled ? (settings.negativeMarks || 0.25) : 0;
  
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  questions.forEach(q => {
    const userAns = answers[q.id];
    if (userAns !== undefined && userAns !== null) {
      if (userAns === q.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    } else {
      unanswered++;
    }
  });

  const rawScore = (correct * marksPerQuestion) - (incorrect * negativeMarks);
  const score = Math.round(rawScore * 100) / 100;
  const total = questions.length;
  const maxScore = total * marksPerQuestion;
  const accuracy = (correct + incorrect) > 0 ? Math.round((correct / (correct + incorrect)) * 10000) / 100 : 0;

  return { correct, incorrect, unanswered, score, maxScore, accuracy };
}

// Test case 1: Perfect score
const mockQuestions = [
  { id: 'q1', correctAnswer: 0 },
  { id: 'q2', correctAnswer: 1 },
  { id: 'q3', correctAnswer: 2 },
  { id: 'q4', correctAnswer: 3 },
];

const res1 = calculateScore({
  questions: mockQuestions,
  answers: { q1: 0, q2: 1, q3: 2, q4: 3 },
  settings: { marksPerQuestion: 2, negativeMarkingEnabled: true, negativeMarks: 0.5 }
});
assert.strictEqual(res1.correct, 4);
assert.strictEqual(res1.score, 8);
assert.strictEqual(res1.accuracy, 100);

// Test case 2: Mixed with negative marking
const res2 = calculateScore({
  questions: mockQuestions,
  answers: { q1: 0, q2: 0, q3: 2 }, // q2 wrong, q4 unanswered
  settings: { marksPerQuestion: 1, negativeMarkingEnabled: true, negativeMarks: 0.25 }
});
assert.strictEqual(res2.correct, 2);
assert.strictEqual(res2.incorrect, 1);
assert.strictEqual(res2.unanswered, 1);
assert.strictEqual(res2.score, 1.75); // 2 - 0.25 = 1.75
assert.strictEqual(res2.accuracy, 66.67);

console.log('✅ Scoring engine tests passed successfully!');
