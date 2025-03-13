import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../App.css';


const AttemptQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/quizzes/${id}`);
        setQuiz(res.data);
        setAnswers(res.data.questions.map(q => ({ questionId: q._id, selectedOption: -1 })));
      } catch (err) {
        alert(err.message);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswerChange = (questionIdx, optionIdx) => {
    setAnswers({ ...answers, [questionIdx]: optionIdx });
  };

  const handleSubmit = async () => {
    try {
      await API.post(`/submissions/${id}`, { answers });
      alert('Quiz submitted!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  if (!quiz) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>{quiz.title}</h2>
      <form className="quiz-submit-form" onSubmit={handleSubmit}>
        {quiz.questions.map((question, qIdx) => (
          <div key={qIdx} className="question-block">
            <p><strong>Q{qIdx + 1}:</strong> {question.questionText}</p>
            <div className="options-container">
              {question.options.map((option, oIdx) => (
                <label key={oIdx}>
                  <input
                    type="radio"
                    name={`question-${qIdx}`}
                    value={oIdx}
                    checked={answers[qIdx] === oIdx}
                    onChange={() => handleAnswerChange(qIdx, oIdx)}
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit">Submit Quiz</button>
      </form>
    </div>
  );
};

export default AttemptQuiz;
