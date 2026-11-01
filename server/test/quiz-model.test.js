import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import Quiz from '../models/Quiz.js';
import Attempt from '../models/Attempt.js';

test('quiz subjects, topics, and pass marks have usable defaults', () => {
  const quiz = new Quiz({
    title: 'Algebra basics',
    duration: 20,
    createdBy: new mongoose.Types.ObjectId(),
    questions: [{ text: '1 + 1?', options: ['1', '2', '3', '4'], correctAnswer: 1 }]
  });

  assert.equal(quiz.subject, 'General');
  assert.equal(quiz.topic, '');
  assert.equal(quiz.passMark, 50);
  assert.equal(quiz.validateSync(), undefined);
});

test('quiz pass marks are percentages from zero to one hundred', () => {
  const quiz = new Quiz({
    title: 'Invalid threshold',
    duration: 20,
    passMark: 101,
    createdBy: new mongoose.Types.ObjectId(),
    questions: [{ text: '1 + 1?', options: ['1', '2', '3', '4'], correctAnswer: 1 }]
  });

  assert.equal(quiz.validateSync().errors.passMark.kind, 'max');
});

test('legacy attempts can derive their pass mark from the linked quiz', () => {
  const attempt = new Attempt({
    quiz: new mongoose.Types.ObjectId(),
    student: new mongoose.Types.ObjectId(),
    score: 8,
    totalPoints: 10,
    percentage: 80
  });

  assert.equal(attempt.passMark, undefined);
  assert.equal(attempt.passed, undefined);
});
