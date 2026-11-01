import {useEffect,useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import api from '../services/api';
import {useAuth} from '../context/AuthContext';

export default function Dashboard(){
  const {user}=useAuth();
  const [quizzes,setQuizzes]=useState([]);
  const [history,setHistory]=useState([]);
  const [error,setError]=useState('');
  const [search,setSearch]=useState('');
  const [subject,setSubject]=useState('All subjects');
  const [chapter,setChapter]=useState('All chapters');
  useEffect(()=>{
    Promise.all([api.get('/quizzes'),user.role==='student'?api.get('/attempts/my/history'):Promise.resolve({data:[]})])
      .then(([quizResponse,historyResponse])=>{setQuizzes(quizResponse.data);setHistory(historyResponse.data)})
      .catch(e=>setError(e.response?.data?.message||'Unable to load dashboard.'));
  },[user.role]);

  const subjects=useMemo(()=>['All subjects',...new Set(quizzes.map(quiz=>quiz.subject||'General'))],[quizzes]);
  const chapters=useMemo(()=>['All chapters',...new Set(quizzes.filter(quiz=>subject==='All subjects'||(quiz.subject||'General')===subject).map(quiz=>quiz.chapter||quiz.topic).filter(Boolean))],[quizzes,subject]);
  const visibleQuizzes=useMemo(()=>{
    const query=search.trim().toLowerCase();
    return quizzes.filter(quiz=>(subject==='All subjects'||(quiz.subject||'General')===subject)&&(chapter==='All chapters'||(quiz.chapter||quiz.topic)===chapter)&&(!query||`${quiz.title} ${quiz.description} ${quiz.subject||''} ${quiz.chapter||quiz.topic||''} ${quiz.syllabus||''}`.toLowerCase().includes(query)));
  },[quizzes,search,subject,chapter]);
  const average=history.length?Math.round(history.reduce((total,attempt)=>total+attempt.percentage,0)/history.length):0;
  const subjectProgress=useMemo(()=>subjects.slice(1).map(name=>{const available=quizzes.filter(q=>(q.subject||'General')===name).length;const attempts=history.filter(a=>(a.quiz?.subject||'General')===name);return {name,available,completed:attempts.length,average:attempts.length?Math.round(attempts.reduce((sum,a)=>sum+a.percentage,0)/attempts.length):null}}),[subjects,quizzes,history]);

  if(user.role==='admin')return <div><h1>Admin dashboard</h1><p>Create, publish, and maintain every assessment from one place.</p><Link className="button" to="/admin">Manage quizzes</Link>{error&&<p className="error">{error}</p>}<section className="grid">{quizzes.map(quiz=><article className="card" key={quiz._id}><p className="eyebrow">{quiz.subject||'General'}{quiz.topic?` · ${quiz.topic}`:''}</p><h2>{quiz.title}</h2><p>{quiz.questions.length} questions · {quiz.questions.reduce((sum,q)=>sum+q.points,0)} marks · {quiz.published?'Published':'Draft'}</p></article>)}</section></div>;

  return <div>
    <h1>Hi, {user.name}</h1>
    {error&&<p className="error">{error}</p>}
    <section className="stats">
      <article className="stat card"><span>Assessments available</span><strong>{quizzes.length}</strong></article>
      <article className="stat card"><span>Completed</span><strong>{history.length}</strong></article>
      <article className="stat card"><span>Average score</span><strong>{average}%</strong></article>
    </section>
    <h2>Subject progress</h2>
    <section className="grid">{subjectProgress.map(item=><button type="button" className="card subject-option" key={item.name} onClick={()=>{setSubject(item.name);setChapter('All chapters')}}><p className="eyebrow">{item.name}</p><h3>{item.completed}/{item.available} completed</h3><p>{item.average===null?'Select to view chapter quizzes.':`Average score: ${item.average}%`}</p><span>View quizzes</span></button>)}</section>
    <div className="row section-heading"><div><h2>Available assessments</h2><p>Find a quiz by title, subject, or topic.</p></div></div>
    <section className="filters">
      <label className="search-field">Search<input type="search" placeholder="Search quizzes…" value={search} onChange={e=>setSearch(e.target.value)}/></label>
      <label>Subject<select value={subject} onChange={e=>{setSubject(e.target.value);setChapter('All chapters')}}>{subjects.map(item=><option key={item}>{item}</option>)}</select></label>
      <label>Chapter<select value={chapter} onChange={e=>setChapter(e.target.value)}>{chapters.map(item=><option key={item}>{item}</option>)}</select></label>
      {(subject!=='All subjects'||chapter!=='All chapters'||search)&&<button type="button" className="secondary" onClick={()=>{setSubject('All subjects');setChapter('All chapters');setSearch('')}}>Clear filters</button>}
    </section>
    <section className="grid">{visibleQuizzes.map(quiz=><article className="card quiz-card" key={quiz._id}>
      <p className="eyebrow">{quiz.subject||'General'}{quiz.topic?` · ${quiz.topic}`:''}</p>
      <h2>{quiz.title}</h2><p>{quiz.description||'Test your knowledge with this assessment.'}</p>
      <p>{quiz.questions.length} questions · {quiz.questions.reduce((sum,q)=>sum+q.points,0)} marks · {quiz.duration} min</p>
      <p>Pass mark: {quiz.passMark??50}%</p>
      <Link className="button" to={`/quiz/${quiz._id}`}>Start assessment</Link>
    </article>)}{!visibleQuizzes.length&&<p>{quizzes.length?'No assessments match your filters.':'No assessments are available yet.'}</p>}</section>
    <h2>Attempt history</h2>
    <section className="card table">{history.length?history.map(attempt=><div key={attempt._id}>
      <span><strong>{attempt.quiz?.title||'Deleted quiz'}</strong><small>{attempt.quiz?.subject||'General'}{attempt.quiz?.topic?` · ${attempt.quiz.topic}`:''} · {new Date(attempt.submittedAt).toLocaleDateString()}</small></span>
      <span className="history-score"><strong>{attempt.score}/{attempt.totalPoints} · {attempt.percentage}%</strong><small className={attempt.passed?'passed':'not-passed'}>{attempt.passed?'Passed':`Not passed · ${attempt.passMark}% required`}</small></span>
    </div>):<p>Your completed assessments will appear here.</p>}</section>
  </div>;
}
