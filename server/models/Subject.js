import mongoose from 'mongoose';
const chapterSchema = new mongoose.Schema({ title:{type:String,required:true,trim:true,maxlength:100}, details:{type:String,trim:true,maxlength:1000,default:''} },{_id:true});
const subjectSchema = new mongoose.Schema({ title:{type:String,required:true,trim:true,unique:true,maxlength:80}, details:{type:String,trim:true,maxlength:1000,default:''}, chapters:{type:[chapterSchema],default:[]} },{timestamps:true});
export default mongoose.model('Subject',subjectSchema);
