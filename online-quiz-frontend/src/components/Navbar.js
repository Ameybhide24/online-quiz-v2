import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  
  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link> |{' '}
      <Link to="/submissions">My Submissions</Link> |{' '}
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
