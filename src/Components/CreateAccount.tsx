import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface CreateAccountProps {
  onContinue: () => void;
}

const CreateAccount: React.FC<CreateAccountProps> = ({ onContinue }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creando cuenta...', { email, password, birthDate });
    
    onContinue();
    
    navigate('/preferencias');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-900 to-white-600 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8 text-black">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Crea tu cuenta en</h2>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Musa</h2>
        <p className="text-xl mt-4">El arte se vive mejor en comunidad</p>
      </div>

      {/* Formulario de creación de cuenta */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Ingresa tu correo electrónico"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Crea una contraseña"
              required
            />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-4 italic">
              Este arte es una técnica, conmista y simulada.
            </p>
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="w-full bg-red-800 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200 font-medium"
            >
              Continuar
            </button>
            
            <div className="flex justify-between text-sm">
              <Link 
                to="/reset-password" 
                className="text-black-600 hover:text-red-800 transition duration-200"
              >
                ¿Olvidaste tu contraseña?
              </Link>
              <Link 
                to="/login" 
                className="text-black-600 hover:text-red-800 transition duration-200"
              >
                ¿Ya tienes cuenta?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;