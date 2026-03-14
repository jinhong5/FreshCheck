import React, { useEffect } from "react"
import { useTheme } from '../contexts/ThemeContext';

import './Navbar.css'

/**
 * Creates a top nav bar for any page
 * 
 * @returns A top screen navbar HTML dom
 */
export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();

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
        <button onClick={() => toggleTheme()}>Dark Mode: {darkMode ? "On" : "Off"}</button>
      </div>
    </nav>
  )
}