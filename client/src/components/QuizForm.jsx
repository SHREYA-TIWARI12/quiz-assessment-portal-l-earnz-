import {useState} from 'react';

const blank=()=>({text:'',options:['','','',''],correctAnswer:0,points:1});

export default function QuizForm({initial,onSave}){
  const [data,setData]=useState(initial||{title:'',description:'',subject:'General',chapter:'',syllabus:'',duration:15,passMark:50,published:false,questions:[blank()]});
  const [error,setError]=useState('');
  const set=(key,value)=>setData(current=>({...current,[key]:value}));
  const qset=(i,key,value)=>setData(current=>({...current,questions:current.questions.map((q,n)=>n===i?{...q,[key]:value}:q)}));
  const totalMarks=data.questions.reduce((total,question)=>total+(Number(question.points)||0),0);
  const submit=e=>{e.preventDefault();setError('');onSave(data).catch(e=>setError(e.response?.data?.message||'Could not save quiz.'))};

  return <form className="editor" onSubmit={submit}>
    {error&&<p className="error">{error}</p>}
    <label>Title<input required maxLength="120" value={data.title} onChange={e=>set('title',e.target.value)}/></label>
    <label>Description<textarea maxLength="1000" value={data.description} onChange={e=>set('description',e.target.value)}/></label>
    <div className="row">
      <label>Subject<input required maxLength="80" placeholder="e.g. Mathematics" value={data.subject||''} onChange={e=>set('subject',e.target.value)}/></label>
      <label>Chapter<input required maxLength="100" placeholder="e.g. Linear Algebra" value={data.chapter??data.topic??''} onChange={e=>set('chapter',e.target.value)}/></label>
    </div>
    <label>Syllabus unit or learning outcome<input maxLength="160" placeholder="e.g. Solve linear equations and inequalities" value={data.syllabus||''} onChange={e=>set('syllabus',e.target.value)}/></label>
    <div className="row">
      <label>Duration (minutes)<input required type="number" min="1" max="480" value={data.duration} onChange={e=>set('duration',+e.target.value)}/></label>
      <label>Pass mark (%)<input type="number" min="0" max="100" value={data.passMark??50} onChange={e=>set('passMark',+e.target.value)}/></label>
    </div>
    <p className="marks-summary">Total marks: <strong>{totalMarks}</strong></p>
    <label className="check"><input type="checkbox" checked={data.published} onChange={e=>set('published',e.target.checked)}/> Published</label>
    {data.questions.map((q,i)=><section className="question-edit" key={q._id||i}>
      <div className="row"><h3>Question {i+1}</h3>{data.questions.length>1&&<button type="button" className="danger small" onClick={()=>setData(current=>({...current,questions:current.questions.filter((_,n)=>n!==i)}))}>Remove</button>}</div>
      <textarea required placeholder="Question text" value={q.text} onChange={e=>qset(i,'text',e.target.value)}/>
      {q.options.map((option,n)=><label className="option-edit" key={n}><input type="radio" name={`answer-${i}`} checked={q.correctAnswer===n} onChange={()=>qset(i,'correctAnswer',n)}/><input required placeholder={`Option ${n+1}`} value={option} onChange={e=>qset(i,'options',q.options.map((current,j)=>j===n?e.target.value:current))}/></label>)}
      <label>Points<input required type="number" min="1" max="100" value={q.points} onChange={e=>qset(i,'points',+e.target.value)}/></label>
      <label>Improvement explanation<textarea maxLength="1000" placeholder="Explain why the correct answer is right or what to revise." value={q.explanation||''} onChange={e=>qset(i,'explanation',e.target.value)}/></label>
    </section>)}
    <button type="button" className="secondary" onClick={()=>setData(current=>({...current,questions:[...current.questions,blank()]}))}>+ Add question</button>
    <button type="submit">Save quiz</button>
  </form>;
}
