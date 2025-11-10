import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Obtener usuarios de la API falsa
      const response = await axios.get('http://localhost:3001/users');
      const users = response.data;

      // 2. Buscar usuario que coincida
      const user = users.find((user: any) => 
        user.email === email && user.password === password
      );

      if (user) {
        // 3. Login exitoso
        console.log('Login exitoso:', user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        onLogin();
        navigate('/');
      } else {
        // 4. Login fallido
        setError('Email o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error de conexión. Intenta nuevamente.');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white-900 to-white-800 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Accede a tu galería en musa
        </h1>
        
        <p className="text-center text-gray-600 mb-8">
          El arte se vive mejor en comunidad
        </p>

        {/* Mostrar error si existe */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ingresa tu correo electrónico"
              required
            />
          </div>

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

          <button
            type="submit"
            className="w-full bg-red-800 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200 font-medium text-base"
          >
            Iniciar sesión
          </button>

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