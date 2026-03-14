import { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  const toggleTheme = () => {
    const currMode = darkMode;
    setDarkMode(prev => !prev);
    localStorage.setItem("darkMode", !currMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}