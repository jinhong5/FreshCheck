import { Routes, Route } from "react-router-dom";
import './App.css'
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';


function App() {

  return (
    <ThemeProvider>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
