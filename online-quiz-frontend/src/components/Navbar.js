import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const Navbar = ({ user, logout }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h3>Online Quiz</h3>
      </div>

      {/* Only show dashboard and logout if user is logged in */}
      {user && (
        <div className="navbar-right">
          <span>
            Welcome, {user.email} ({user.role})
          </span>

          <Link to="/dashboard">
            <button>Go to Dashboard</button>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
