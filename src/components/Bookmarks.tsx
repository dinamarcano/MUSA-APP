import { useState } from 'react';

interface SavedItem {
  id: number;
  title: string;
  author: string;
  image?: string;
  category: string;
  savedDate: string;
}

const Bookmarks: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const savedItems: SavedItem[] = [
    { 
      id: 1, 
      title: 'Ilustración futurista', 
      author: 'Marcos R.',
      category: 'Ilustración',
      savedDate: '2024-01-15'
    },
    { 
      id: 2, 
      title: 'Diseño UX minimalista', 
      author: 'Lucía G.',
      category: 'Diseño',
      savedDate: '2024-01-14'
    },
    { 
      id: 3, 
      title: 'Póster surrealista', 
      author: 'Caro P.',
      category: 'Arte',
      savedDate: '2024-01-13'
    },
    { 
      id: 4, 
      title: 'Tipografía experimental', 
      author: 'Alex M.',
      category: 'Tipografía',
      savedDate: '2024-01-12'
    },
    { 
      id: 5, 
      title: 'Fotografía urbana', 
      author: 'David T.',
      category: 'Fotografía',
      savedDate: '2024-01-11'
    },
    { 
      id: 6, 
      title: 'Animación 3D', 
      author: 'Sofía L.',
      category: 'Animación',
      savedDate: '2024-01-10'
    },
  ];

  const categories = ['all', ...new Set(savedItems.map(item => item.category))];

  const filteredItems = filter === 'all' 
    ? savedItems 
    : savedItems.filter(item => item.category === filter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Publicaciones guardadas</h2>
        <p className="text-gray-600">
          {savedItems.length} {savedItems.length === 1 ? 'elemento guardado' : 'elementos guardados'}
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === category 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'Todos' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de elementos guardados */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay elementos guardados</h3>
          <p className="text-gray-500">Los elementos que guardes aparecerán aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group"
            >
              {/* Imagen placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-4xl opacity-70 group-hover:scale-110 transition-transform">
                  {item.category === 'Ilustración' && '🎨'}
                  {item.category === 'Diseño' && '💻'}
                  {item.category === 'Arte' && '🖼️'}
                  {item.category === 'Tipografía' && '🔤'}
                  {item.category === 'Fotografía' && '📸'}
                  {item.category === 'Animación' && '🎬'}
                  {!['Ilustración', 'Diseño', 'Arte', 'Tipografía', 'Fotografía', 'Animación'].includes(item.category) && '📌'}
                </div>
              </div>
              
              {/* Contenido */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <button className="text-red-400 hover:text-red-600 transition-colors" title="Eliminar de guardados">
                    ❤️
                  </button>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">por {item.author}</p>
                
                <div className="flex justify-between items-center">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    Guardado {formatDate(item.savedDate)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estadísticas */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{savedItems.length}</div>
            <div className="text-sm text-gray-600">Total guardados</div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {categories.length - 1}
            </div>
            <div className="text-sm text-gray-600">Categorías</div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(savedItems.map(item => item.author)).size}
            </div>
            <div className="text-sm text-gray-600">Autores únicos</div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">
              {Math.ceil(savedItems.length / 7)}
            </div>
            <div className="text-sm text-gray-600">Guardados/semana</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;