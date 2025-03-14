import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../App.css";

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await API.get("/submissions/my-submissions");
        setSubmissions(res.data);
      } catch (err) {
        alert(err.message);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="container">
      <h2>My Submissions</h2>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        submissions.map((submission) => (
          <div key={submission._id} className="submission-card">
            <h4>{submission.quizTitle}</h4>
            <p>
              <strong>Score:</strong> {submission.score}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(submission.submittedAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default MySubmissions;
