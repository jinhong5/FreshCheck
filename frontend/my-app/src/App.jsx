import { Routes, Route } from "react-router-dom";
import './App.css'
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Camera from './pages/Camera.jsx';
import Home from './pages/Home.jsx';


function App() {

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="new-entry" element={<Camera />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App


