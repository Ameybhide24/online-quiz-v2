import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../App.css';


const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      alert('Registration successful!');
      navigate('/');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 >Register</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <button type="submit">Register</button>
        </form>
        <br></br>
        <p>Already have an account? <Link to="/">Login here</Link></p>
      </div>
      
    </div>
  );
};

export default Register;
