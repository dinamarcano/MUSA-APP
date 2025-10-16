import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Boards from './Boards';
import Bookmarks from './Bookmarks'; // Asegúrate de importar Bookmarks
import Preferences from './Preferences';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'boards' | 'bookmarks' | 'preferences'>('boards');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar setPage={setActiveTab} />

        {/* Tabs de navegación */}
        <div className="flex space-x-4 px-6 py-3 border-b bg-white">
          <button
            onClick={() => setActiveTab('boards')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'boards' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Tableros
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'bookmarks' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Guardados
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'preferences' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Personalización
          </button>
        </div>

        {/* Contenido dinámico - AQUÍ ESTÁ EL CAMBIO */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'boards' && <Boards />}
          {activeTab === 'bookmarks' && <Bookmarks />} {/* Cambia esto */}
          {activeTab === 'preferences' && <Preferences />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;