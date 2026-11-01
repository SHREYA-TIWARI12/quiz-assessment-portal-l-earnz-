import {Link,Navigate,useLocation} from 'react-router-dom';

export default function Result(){
  const {state}=useLocation();
  if(!state)return <Navigate to="/dashboard" replace/>;
  return <div className="result-page">
    <section className="result card">
      <p className="eyebrow">{state.quiz.subject||'General'}{state.quiz.topic?` · ${state.quiz.topic}`:''}</p>
      <h1>{state.quiz.title}</h1>
      <p className={`result-status ${state.passed?'passed':'not-passed'}`}>{state.passed?'Congratulations, you passed!':'Keep practicing — you did not reach the pass mark.'}</p>
      <div className="score">{state.score}<span> / {state.totalPoints} marks</span></div>
      <p>You scored <strong>{state.percentage}%</strong>. Pass mark: {state.passMark}%.</p>
      <Link className="button" to="/dashboard">Return to dashboard</Link>
    </section>
    {state.guidance?.length>0&&<section className="guidance card"><h2>How to improve</h2><ul>{state.guidance.map((item,index)=><li key={index}>{item}</li>)}</ul>{state.quiz.syllabus&&<p><strong>Syllabus focus:</strong> {state.quiz.syllabus}</p>}</section>}
    {state.review?.length>0&&<section className="review">
      <h2>Answer review</h2>
      {state.review.map((question,index)=><article className="card review-question" key={index}>
        <div className="row"><h3>Question {index+1}</h3><strong>{question.earnedPoints}/{question.points} marks</strong></div>
        <p>{question.text}</p>
        {question.options.map((option,optionIndex)=>{
          const correct=optionIndex===question.correctAnswer;
          const selected=optionIndex===question.selectedAnswer;
          return <p className={`review-option ${correct?'correct':selected?'incorrect':''}`} key={optionIndex}>
            {String.fromCharCode(65+optionIndex)}. {option}{correct?' · Correct answer':selected?' · Your answer':''}
          </p>;
        })}
        {question.explanation&&<p className="explanation"><strong>Why:</strong> {question.explanation}</p>}
      </article>)}
    </section>}
  </div>;
}
