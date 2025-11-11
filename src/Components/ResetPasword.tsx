import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      // 2. Obtener usuarios de la API
      const response = await axios.get('http://localhost:3001/users');
      const users = response.data;

      // 3. Buscar usuario por email
      const userIndex = users.findIndex((user: any) => user.email === email);
      
      if (userIndex === -1) {
        alert('No existe una cuenta con este email');
        return;
      }

      // 4. Actualizar contraseña del usuario
      const updatedUser = { ...users[userIndex], password: newPassword };
      await axios.put(`http://localhost:3001/users/${users[userIndex].id}`, updatedUser);

      console.log('Contraseña actualizada exitosamente');
      alert('Contraseña restablecida correctamente');
      
      navigate('/login');
      
    } catch (error) {
      console.error('Error restableciendo contraseña:', error);
      alert('Error al restablecer la contraseña');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-900 to-white-800 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Restablecer Contraseña</h2>
        
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ingresa tu correo electrónico"
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ingresa tu nueva contraseña"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Confirma tu nueva contraseña"
              required
            />
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="w-full bg-red-800 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200 font-medium"
            >
              Restablecer contraseña
            </button>
            
            <Link 
              to="/login" 
              className="text-center text-black-600 hover:text-black-800 transition duration-200"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;