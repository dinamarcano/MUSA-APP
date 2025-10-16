import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/register/LoginPage";
import PasswordResetPage from "./pages/register/PasswordResetPage";
import PreferencesPage from "./pages/register/PreferencesPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Ruta para Registro */}
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Ruta para Restablecer Contraseña */}
        <Route path="/reset-password" element={<PasswordResetPage />} />
        
        {/* Ruta para Personalización de Gustos */}
        <Route path="/preferences" element={<PreferencesPage />} />
        
        {/* Ruta por defecto - redirige al Login */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;