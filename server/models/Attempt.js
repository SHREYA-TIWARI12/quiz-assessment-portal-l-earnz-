import mongoose from 'mongoose';
const attemptSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ question: mongoose.Schema.Types.ObjectId, selectedAnswer: Number, isCorrect: Boolean }],
  score: { type: Number, required: true }, totalPoints: { type: Number, required: true },
  percentage: { type: Number, required: true }, passMark: { type: Number, min: 0, max: 100 },
  passed: { type: Boolean }, submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });
attemptSchema.index({ quiz: 1, student: 1 });
export default mongoose.model('Attempt', attemptSchema);
