import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateQuiz from "./pages/CreateQuiz";
import AttemptQuiz from "./pages/AttemptQuiz";
import MySubmissions from "./pages/MySubmissions";
import QuizSubmissions from "./pages/QuizSubmissions";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <Router>
      <Navbar user={user} logout={logout} />

      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/create-quiz"
          element={
            user?.role === "teacher" ? (
              <CreateQuiz />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/create-quiz/:quizId"
          element={
            user?.role === "teacher" ? (
              <CreateQuiz />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/submit-quiz/:quizId"
          element={
            user?.role === "student" ? (
              <AttemptQuiz />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/submissions/:quizId"
          element={
            user?.role === "teacher" ? (
              <MySubmissions user={user} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/quiz/:quizId/submissions"
          element={
            user?.role === "teacher" ? (
              <QuizSubmissions />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/submissions"
          element={
            user?.role === "student" ? (
              <MySubmissions user={user} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
