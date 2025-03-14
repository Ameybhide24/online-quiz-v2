import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await API.get("/quizzes");
        setQuizzes(res.data);
      } catch (err) {
        alert(err.message || "Failed to fetch quizzes");
      }
    };

    if (user) {
      fetchQuizzes();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {user.name}!</h2>

        {user.role === "teacher" && (
          <Link to="/create-quiz">
            <button className="btn btn-create">Create New Quiz</button>
          </Link>
        )}
      </div>

      {user.role === "student" && (
        <div>
          <div>
            <Link to="/submissions">
              <button className="btn btn-view">My Submissions</button>
            </Link>
          </div>
          <h3>Available Quizzes</h3>
          {quizzes.length === 0 && <p>No quizzes available.</p>}
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card">
              <h3>{quiz.title}</h3>
              <p>{quiz.description}</p>
              <button onClick={() => navigate(`/submit-quiz/${quiz._id}`)}>
                Attempt Quiz
              </button>
            </div>
          ))}
        </div>
      )}

      {user.role === "teacher" && (
        <div>
          <h3>Your Quizzes</h3>
          {quizzes.filter((quiz) => quiz.creator._id === user._id).length ===
            0 && <p>You haven't created any quizzes yet.</p>}

          {quizzes
            .filter((quiz) => quiz.creator._id === user._id)
            .map((quiz) => (
              <div key={quiz._id} className="quiz-card">
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p>
                <Link to={`/quiz/${quiz._id}/submissions`}>
                  <button>View Submissions</button>
                </Link>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
