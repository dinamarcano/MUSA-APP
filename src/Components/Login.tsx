import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación real
    console.log('Iniciando sesión...', { username, password });
    
    // Simulamos login exitoso
    onLogin();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-900 to-white-800 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Título principal */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Accede a tu galería en musa
        </h1>
        
        {/* Subtítulo */}
        <p className="text-center text-gray-600 mb-8">
          El arte se vive mejor en comunidad
        </p>

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Usuario */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {/* Botón Iniciar Sesión */}
          <button
            type="submit"
            className="w-full bg-red-800 text-white py-3 px-4 rounded-lg hover:bg-red-800 transition duration-200 font-medium text-base"
          >
            Iniciar sesión
          </button>

          {/* Enlaces adicionales */}
          <div className="flex flex-col space-y-4 text-center">
            <Link 
              to="/reset-password" 
              className="text-black-600 hover:text-black-800 transition duration-200 text-sm"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            
            <div className="border-t border-gray-200 pt-4">
              <Link 
                to="/create-account" 
                className="text-black-600 hover:text-black-800 transition duration-200 font-medium text-sm"
              >
                Registrate
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;