import express from 'express'; import Subject from '../models/Subject.js'; import {protect,adminOnly} from '../middleware/auth.js';
const router=express.Router();
const valid=s=>s.title?.trim()&&Array.isArray(s.chapters)&&s.chapters.every(c=>c.title?.trim());
router.get('/',protect,async(req,res,next)=>{try{res.json(await Subject.find().sort('title'))}catch(e){next(e)}});
router.post('/',protect,adminOnly,async(req,res,next)=>{try{if(!valid(req.body))return res.status(400).json({message:'A subject title and valid chapter titles are required.'});res.status(201).json(await Subject.create(req.body))}catch(e){next(e)}});
router.put('/:id',protect,adminOnly,async(req,res,next)=>{try{if(!valid(req.body))return res.status(400).json({message:'A subject title and valid chapter titles are required.'});const subject=await Subject.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!subject)return res.status(404).json({message:'Subject not found.'});res.json(subject)}catch(e){next(e)}});
router.delete('/:id',protect,adminOnly,async(req,res,next)=>{try{const subject=await Subject.findByIdAndDelete(req.params.id);if(!subject)return res.status(404).json({message:'Subject not found.'});res.status(204).end()}catch(e){next(e)}});
export default router;
