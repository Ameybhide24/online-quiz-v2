import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

const AttemptQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/quizzes/${quizId}`);
        const quizData = res.data;
        setQuiz(quizData);
        const initialAnswers = quizData.questions.map((q) => ({
          questionId: q._id,
          selectedOption: -1,
        }));
        setAnswers(initialAnswers);
      } catch (err) {
        console.error(err);
        alert(err.message || "Error fetching quiz");
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (questionIdx, optionIdx) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[questionIdx] = {
        ...updatedAnswers[questionIdx],
        selectedOption: optionIdx,
      };
      return updatedAnswers;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const unanswered = answers.find((a) => a.selectedOption === -1);
    if (unanswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      await API.post(`/submissions/${quizId}`, { answers });
      alert("Quiz submitted!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting quiz");
    }
  };

  if (!quiz) return <div className="container">Loading quiz...</div>;

  return (
    <div className="container">
      <h2>{quiz.title}</h2>

      <form className="quiz-submit-form" onSubmit={handleSubmit}>
        {quiz.questions.map((question, qIdx) => (
          <div key={qIdx} className="question-block">
            <p>
              <strong>Q{qIdx + 1}:</strong> {question.question}
            </p>
            <br></br>
            <div className="options-container">
              {question.options.map((option, oIdx) => (
                <label key={oIdx} style={{ display: "block", margin: "4px 0" }}>
                  <input
                    type="radio"
                    name={`question-${qIdx}`}
                    value={oIdx}
                    checked={answers[qIdx]?.selectedOption === oIdx}
                    onChange={() => handleAnswerChange(qIdx, oIdx)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button type="submit" style={{ marginTop: "20px" }}>
          Submit Quiz
        </button>
      </form>
    </div>
  );
};

export default AttemptQuiz;
