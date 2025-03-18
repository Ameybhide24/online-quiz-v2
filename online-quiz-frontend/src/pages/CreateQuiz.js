// import React, { useState } from "react";
// import axios from "axios";
// import "./CreateQuiz.css";
// import "../App.css";
// import API from "../services/api";

// const CreateQuiz = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [duration, setDuration] = useState(0);
//   const [questions, setQuestions] = useState([]);
//   const [message, setMessage] = useState("");

//   const token = localStorage.getItem("token");

//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       {
//         question: "",
//         options: ["", "", "", ""], // default 4 options
//         correctOption: 0,
//       },
//     ]);
//   };

//   const handleQuestionChange = (index, field, value) => {
//     const newQuestions = [...questions];
//     newQuestions[index][field] = value;
//     setQuestions(newQuestions);
//   };

//   const handleOptionChange = (qIdx, optIdx, value) => {
//     const newQuestions = [...questions];
//     newQuestions[qIdx].options[optIdx] = value;
//     setQuestions(newQuestions);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const quizData = {
//       title,
//       description,
//       duration,
//       questions,
//     };

//     try {
//       const response = await API.post("quizzes", quizData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setMessage("Quiz created successfully!");
//       setTitle("");
//       setDescription("");
//       setDuration(0);
//       setQuestions([]);
//     } catch (error) {
//       console.error(error);
//       setMessage(error.response?.data?.message || "Failed to create quiz");
//     }
//   };

//   return (
//     <div className="create-quiz-container">
//       <h2>Create Quiz</h2>
//       {message && (
//         <p className={message.includes("Failed") ? "error" : ""}>{message}</p>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Title:</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label>Description:</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>

//         <div>
//           <label>Duration (minutes):</label>
//           <input
//             type="number"
//             value={duration}
//             onChange={(e) => setDuration(parseInt(e.target.value))}
//           />
//         </div>

//         <h3>Questions</h3>
//         {questions.map((q, qIdx) => (
//           <div key={qIdx} className="question-block">
//             <label>Question {qIdx + 1}:</label>
//             <input
//               type="text"
//               value={q.question}
//               onChange={(e) =>
//                 handleQuestionChange(qIdx, "question", e.target.value)
//               }
//               required
//             />

//             <label>Options:</label>
//             {q.options.map((opt, optIdx) => (
//               <div key={optIdx} className="option-input">
//                 <input
//                   type="text"
//                   placeholder={`Option ${optIdx + 1}`}
//                   value={opt}
//                   onChange={(e) =>
//                     handleOptionChange(qIdx, optIdx, e.target.value)
//                   }
//                   required
//                 />
//               </div>
//             ))}

//             <label>Correct Option (0-{q.options.length - 1}):</label>
//             <input
//               type="number"
//               min="0"
//               max={q.options.length - 1}
//               value={q.correctOption}
//               onChange={(e) =>
//                 handleQuestionChange(
//                   qIdx,
//                   "correctOption",
//                   parseInt(e.target.value)
//                 )
//               }
//               required
//             />
//           </div>
//         ))}

//         <button type="button" onClick={addQuestion}>
//           Add Question
//         </button>

//         <button type="submit">Create Quiz</button>
//       </form>
//     </div>
//   );
// };

// export default CreateQuiz;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./CreateQuiz.css";
import "../App.css";

const CreateQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (quizId) {
      // Fetch quiz details for editing
      const fetchQuiz = async () => {
        try {
          const res = await API.get(`/quizzes/${quizId}`);
          console.log(res);
          const { title, description, duration, questions } = res.data;
          setTitle(title);
          setDescription(description);
          setDuration(duration);
          setQuestions(questions);
        } catch (error) {
          console.error(error);
          setMessage("Failed to load quiz data");
        }
      };
      fetchQuiz();
    }
  }, [quizId]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctOption: 0 },
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIdx, optIdx, value) => {
    const newQuestions = [...questions];
    newQuestions[qIdx].options[optIdx] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quizData = { title, description, duration, questions };

    try {
      if (quizId) {
        await API.put(`/quizzes/${quizId}`, quizData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Quiz updated successfully!");
      } else {
        await API.post("/quizzes", quizData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Quiz created successfully!");
        setTitle("");
        setDescription("");
        setDuration(0);
        setQuestions([]);
      }
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to save quiz");
    }
  };

  return (
    <div className="create-quiz-container">
      <h2>{quizId ? "Edit Quiz" : "Create Quiz"}</h2>
      {message && <p className={message.includes("Failed") ? "error" : ""}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <label>Duration (minutes):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
          />
        </div>

        <h3>Questions</h3>
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="question-block">
            <label>Question {qIdx + 1}:</label>
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIdx, "question", e.target.value)}
              required
            />

            <label>Options:</label>
            {q.options.map((opt, optIdx) => (
              <div key={optIdx} className="option-input">
                <input
                  type="text"
                  placeholder={`Option ${optIdx + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                  required
                />
              </div>
            ))}

            <label>Correct Option (0-{q.options.length - 1}):</label>
            <input
              type="number"
              min="0"
              max={q.options.length - 1}
              value={q.correctOption}
              onChange={(e) => handleQuestionChange(qIdx, "correctOption", parseInt(e.target.value))}
              required
            />
          </div>
        ))}

        <button type="button" onClick={addQuestion}>Add Question</button>
        <button type="submit">{quizId ? "Update Quiz" : "Create Quiz"}</button>
      </form>
    </div>
  );
};

export default CreateQuiz;
