import React, { useEffect } from "react"
import { useTheme } from '../contexts/ThemeContext';
import { Link, useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from './userContext.jsx';
import './Navbar.css'
import ToggleButton from '@mui/material/ToggleButton';

/**
 * Creates a top nav bar for any page
 * 
 * @returns A top screen navbar HTML dom
 */
export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();

  const { loggedIn, logout } = useContext(UserContext);

  //const loggedIn = localStorage.getItem("token");
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
      <div className="nav-links">
        <Link to="/" className="link">Home</Link>
        <Link to="/dashboard" className="link">Dashboard</Link>
        <Link to="/new-entry" className="link">New Entry</Link>
        <div>
          <label className="switch">
            <input type="checkbox" onChange={() => toggleTheme()} />
            <span className="slider round"></span>
          </label>
        </div>

        <ToggleButton
          value="check"
          selected={selected}
          onChange={() => setSelected((prevSelected) => !prevSelected)}
        >
          <CheckIcon />
        </ToggleButton>

        {
          loggedIn ? <button id="logout" onClick={handleLogout}>Logout</button>
            : <Link to="/login" className="link" id="login">Login</Link>
        }
      </div>
    </nav>
  )
}