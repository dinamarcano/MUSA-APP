import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/register/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Ruta para el registro */}
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Ruta por defecto - redirige al login */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;