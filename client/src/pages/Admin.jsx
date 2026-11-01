import {useEffect,useState} from 'react';import {Link,useNavigate,useParams} from 'react-router-dom';import api from '../services/api';import QuizForm from '../components/QuizForm';
export function AdminList(){
  const [items,setItems]=useState([]),[error,setError]=useState('');
  const load=()=>api.get('/quizzes').then(r=>setItems(r.data)).catch(e=>setError(e.response?.data?.message||'Could not load quizzes.'));
  useEffect(load,[]);
  const remove=async id=>{if(confirm('Delete this quiz and all attempts?')){try{await api.delete(`/quizzes/${id}`);load()}catch(e){setError(e.response?.data?.message||'Could not delete quiz.')}}};
  return <div><div className="row"><div><h1>Manage assessments</h1><p>Create drafts and publish them when ready.</p></div><span><Link className="button secondary" to="/admin/subjects">Subjects</Link> <Link className="button" to="/admin/new">New quiz</Link></span></div>
    {error&&<p className="error">{error}</p>}
    <section className="card table">{items.map(quiz=><div key={quiz._id}>
      <span><strong>{quiz.title}</strong><small>{quiz.subject||'General'}{quiz.topic?` · ${quiz.topic}`:''} · {quiz.questions.length} questions · {quiz.questions.reduce((sum,q)=>sum+q.points,0)} marks · {quiz.duration} min · Pass: {quiz.passMark??50}% · {quiz.published?'Published':'Draft'}</small></span>
      <span><Link to={`/admin/${quiz._id}`}>Edit</Link><button className="link danger-text" onClick={()=>remove(quiz._id)}>Delete</button></span>
    </div>)}{!items.length&&<p>No quizzes yet.</p>}</section>
  </div>;
}
export function AdminEditor(){
  const {id}=useParams(),go=useNavigate(),[quiz,setQuiz]=useState(),[error,setError]=useState('');
  useEffect(()=>{if(id)api.get(`/quizzes/${id}`).then(r=>setQuiz({...r.data,chapter:r.data.chapter||r.data.topic||''})).catch(e=>setError(e.response?.data?.message||'Could not load quiz.'));else setQuiz({title:'',description:'',subject:'General',chapter:'',syllabus:'',duration:15,passMark:50,published:false,questions:[{text:'',options:['','','',''],correctAnswer:0,points:1}]})},[id]);
  if(error)return <p className="error">{error}</p>;
  if(!quiz)return <p>Loading editor…</p>;
  return <div><h1>{id?'Edit assessment':'Create assessment'}</h1><QuizForm initial={quiz} onSave={data=>(id?api.put(`/quizzes/${id}`,data):api.post('/quizzes',data)).then(()=>go('/admin'))}/></div>;
}
