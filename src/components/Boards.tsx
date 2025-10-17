import { useState } from 'react';

const artworks = [
  "https://upload.wikimedia.org/wikipedia/commons/b/b4/Vincent_Willem_van_Gogh_128.jpg",
  "https://i.pinimg.com/736x/95/5d/7b/955d7bc13fccbc8da479b178772a74f9.jpg",
  "https://i.pinimg.com/736x/99/27/5b/99275b999fa4411b1c05b6657ac887d1.jpg",
  "https://i.pinimg.com/1200x/ab/39/09/ab3909fbc7bdfe1edd352124948aaf1c.jpg",
];

export default function Board() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <section className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">Mis obras favoritas</h2>
      
      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {artworks.map((url, i) => (
          <div key={i} className="group relative">
            <img
              src={url}
              alt={`obra-${i}`}
              className="w-full h-100 object-cover rounded-2xl hover:scale-105 transition-transform duration-300 shadow-lg group-hover:shadow-xl"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Ver detalles
              </button>
            </div>
          </div>
        ))}
        
        {}
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full h-80 flex flex-col items-center justify-center bg-gray-50 rounded-2xl cursor-pointer border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50 transition-all duration-300 group"
          >
            <div className="text-6xl font-light text-gray-400 group-hover:text-red-500 mb-3 transition-colors">
              +
            </div>
            <p className="text-gray-500 group-hover:text-red-500 font-medium transition-colors">
              Agregar obra
            </p>
          </button>
        </div>
      </div>

      {/*Agregar nueva obra */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Agregar nueva obra</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la imagen
                </label>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  placeholder="Nombre de la obra"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Tu colección de obras
        </h3>
        <p className="text-gray-600">
          {artworks.length} {artworks.length === 1 ? 'obra agregada' : 'obras agregadas'} • 
          Organiza tus obras favoritas en tableros personalizados
        </p>
      </div>
    </section>
  );
}