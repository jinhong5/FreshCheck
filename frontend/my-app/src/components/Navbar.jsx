import React, { useEffect, useContext } from "react";
import { useTheme } from '../contexts/ThemeContext';
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from './userContext.jsx';
import './Navbar.css';

import IconButton from '@mui/material/IconButton';
import { Brightness4, Brightness7, Check } from '@mui/icons-material'; // MUI icons

/**
 * Creates a top nav bar for any page
 * 
 * @returns A top screen navbar HTML dom
 */
export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const { loggedIn, logout } = useContext(UserContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className="general-navbar">
      <div className="nav-left">
        <Link to="/" className="link">Home</Link>
        <Link to="/dashboard" className="link">Dashboard</Link>
        <Link to="/new-entry" className="link">New Entry</Link>
      </div>
      <div className="nav-right">
        {/* Dark Mode Icon */}
        <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 2 }}>
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        {
          loggedIn ? (
            <button id="logout" onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login" className="link" id="login">Login</Link>
          )
        }
      </div>
    </nav>
  );
}