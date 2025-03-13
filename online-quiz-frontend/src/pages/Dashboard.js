import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';


const Dashboard = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await API.get('/quizzes');
        setQuizzes(res.data);
      } catch (err) {
        alert(err.message);
      }
    };

    fetchQuizzes();
  }, []);

  const handleStartQuiz = (quizId) => {
    navigate(`/submit-quiz/${quizId}`);
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Available Quizzes</h2>

      <div className="quiz-list">
        {quizzes.map(quiz => (
          <div key={quiz._id} className="quiz-card">
            <h3 className="quiz-title">{quiz.title}</h3>
            <p className="quiz-description">{quiz.description}</p>
            <div className="quiz-buttons">
              <Link to={`/quiz/${quiz._id}`}>
                <button className="btn btn-primary">Attempt Quiz</button>
              </Link>
              {/* <button className="btn btn-secondary" onClick={() => handleStartQuiz(quiz._id)}>
                Start Quiz
              </button> */}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-actions">
        <Link to="/create-quiz">
          <button className="btn btn-create">Create Quiz (Teachers)</button>
        </Link>
        <Link to="/submissions">
          <button className="btn btn-view">My Submissions</button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
