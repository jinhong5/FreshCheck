import React, { useEffect, useContext } from "react";
import { useTheme } from '../contexts/ThemeContext';
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from './userContext.jsx';
import './Navbar.css';
import { useGoogleLogin } from "@react-oauth/google";

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
  const { login } = useContext(UserContext)

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

  async function handleSuccess(tokenResponse) {
    console.log(tokenResponse);
    console.log(window.location.origin);

    const googleUser = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      }
    ).then(res => res.json());

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: googleUser
      }),
    });

    if (res.ok) {
      const data = await res.json();
      login(data.token);;
      navigate("/");
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: () => console.log("Google Login Failed")
  });

  return (
    <nav className="general-navbar">
      <div className="nav-left">
        <Link to="/" className="link">Home</Link>
        {loggedIn && <Link to="/dashboard" className="link">Dashboard</Link>}
        {loggedIn && <Link to="/new-entry" className="link">Scan an Item</Link>}
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
            <button className="logout" onClick={() => googleLogin()}>
              Login
            </button>
          )
        }
      </div>
    </nav>
  );
}