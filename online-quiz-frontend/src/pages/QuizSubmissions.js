import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useParams } from "react-router-dom";
import "../App.css";

const QuizSubmissions = () => {
  const { quizId } = useParams(); // Get quizId from the URL params
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ mean: 0, median: 0 });

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await API.get(`/submissions/${quizId}`);
        setSubmissions(res.data);

        if (res.data.length > 0) {
          calculateStats(res.data);
        }
      } catch (err) {
        alert(err.message || "Failed to fetch submissions");
      }
    };

    fetchSubmissions();
  }, [quizId]);

  const calculateStats = (data) => {
    const scores = data.map((sub) => sub.score);
    const total = scores.reduce((acc, score) => acc + score, 0);
    const mean = total / scores.length;

    const sortedScores = [...scores].sort((a, b) => a - b);
    let median;
    const mid = Math.floor(sortedScores.length / 2);

    if (sortedScores.length % 2 === 0) {
      median = (sortedScores[mid - 1] + sortedScores[mid]) / 2;
    } else {
      median = sortedScores[mid];
    }

    setStats({ mean: mean.toFixed(2), median: median.toFixed(2) });
  };

  return (
    <div className="container">
      <h2>Submissions for Quiz</h2>

      {submissions.length > 0 && (
        <div className="stats-container">
          <h3>Statistics</h3>
          <p>
            <strong>Mean:</strong> {stats.mean}
          </p>
          <p>
            <strong>Median:</strong> {stats.median}
          </p>
        </div>
      )}

      {submissions.length === 0 ? (
        <p>No submissions found for this quiz.</p>
      ) : (
        submissions.map((submission) => (
          <div key={submission._id} className="submission-card">
            <h4>Student: {submission.student.name}</h4>
            <p>
              <strong>Email:</strong> {submission.student.email}
            </p>
            <p>
              <strong>Score:</strong> {submission.score}
            </p>
            <p>
              <strong>Submitted At:</strong>{" "}
              {new Date(submission.submittedAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default QuizSubmissions;
