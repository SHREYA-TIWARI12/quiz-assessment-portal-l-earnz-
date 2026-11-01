import mongoose from 'mongoose';
const questionSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  options: { type: [String], validate: v => v.length === 4 },
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
  points: { type: Number, default: 1, min: 1, max: 100 },
  explanation: { type: String, trim: true, maxlength: 1000, default: '' }
}, { _id: true });
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 1000 },
  subject: { type: String, trim: true, maxlength: 80, default: 'General' },
  topic: { type: String, trim: true, maxlength: 80, default: '' },
  chapter: { type: String, trim: true, maxlength: 100, default: '' },
  syllabus: { type: String, trim: true, maxlength: 160, default: '' },
  duration: { type: Number, required: true, min: 1, max: 480 },
  passMark: { type: Number, default: 50, min: 0, max: 100 },
  published: { type: Boolean, default: false },
  questions: { type: [questionSchema], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
export default mongoose.model('Quiz', quizSchema);
