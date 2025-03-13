import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateQuiz from './pages/CreateQuiz';
import AttemptQuiz from './pages/AttemptQuiz';
import MySubmissions from './pages/MySubmissions';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-quiz" element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
        <Route path="/quiz/:id" element={<ProtectedRoute><AttemptQuiz /></ProtectedRoute>} />
        <Route path="/submissions" element={<ProtectedRoute><MySubmissions /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
