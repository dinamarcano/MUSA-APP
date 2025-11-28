import React, { useState, useRef, useEffect } from 'react';
import { HiSearch, HiX, HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

interface NavbarProps {
  onGoToMain?: () => void;
  onSearchResults?: (results: any[], searchTerm: string) => void;
}

interface SearchResult {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
}

const Navbar: React.FC<NavbarProps> = ({ onGoToMain, onSearchResults }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Usar Supabase AuthContext
  const { user } = useAuth();

  const recentSearches = [
    { term: 'Arte comic', category: '' },
    { term: 'Grafiti', category: '' },
    { term: 'Diseño grafico', category: '' },
    { term: 'Arte Street', category: '' },
    { term: 'Arte Sketch', category: '' },
    { term: 'Arte fantastico', category: '' },
  ];

  // Simulación de base de datos de imágenes
  const imageDatabase: Record<string, SearchResult[]> = {
    'arte comic': [
      { id: 1, title: 'Cómic Superhéroe', imageUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300', category: 'Arte Cómic' },
      { id: 2, title: 'Personaje Manga', imageUrl: 'https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=300', category: 'Arte Cómic' },
      { id: 3, title: 'Viñeta Cómic', imageUrl: 'https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=300', category: 'Arte Cómic' },
    ],
    grafiti: [
      { id: 4, title: 'Grafiti Urbano', imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300', category: 'Grafiti' },
      { id: 5, title: 'Arte Callejero', imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300', category: 'Grafiti' },
    ],
    'diseño grafico': [
      { id: 6, title: 'Diseño Moderno', imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300', category: 'Diseño Gráfico' },
      { id: 7, title: 'Tipografía Creativa', imageUrl: 'https://images.unsplash.com/photo-1586339949216-35c2747cc36d?w=300', category: 'Diseño Gráfico' },
    ],
    'arte street': [
      { id: 8, title: 'Arte Callejero', imageUrl: 'https://images.unsplash.com/photo-1550482768-3148e430efc8?w=300', category: 'Arte Street' },
    ],
    'arte sketch': [
      { id: 9, title: 'Sketch a Lápiz', imageUrl: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=300', category: 'Arte Sketch' },
    ],
    'arte fantastico': [
      { id: 10, title: 'Criatura Fantástica', imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300', category: 'Arte Fantástico' },
    ],
  };

  // Filtrar búsquedas recientes
  const filteredSearches = recentSearches.filter((s) =>
    s.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (term: string) => {
    const key = term.toLowerCase();
    setSearchTerm(term);
    setCurrentSearch(term);
    setIsSearchOpen(false);
    setShowResults(true);
    const results = imageDatabase[key] || [];
    if (onSearchResults) onSearchResults(results, term);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      handleSearch(searchTerm.trim());
    }
  };

  const clearSearch = () => setSearchTerm('');

  const goBack = () => {
    setShowResults(false);
    setCurrentSearch('');
    setSearchTerm('');
    if (onSearchResults) onSearchResults([], '');
  };

  const goToProfile = () => {
    if (user?.id) {
      navigate("/dashboard", { state: { page: "profile" } });
    } else {
      alert("Primero inicia sesión para ver tu perfil.");
      navigate("/login");
    }
  };

  // Vista de resultados
  if (showResults) {
    return (
      <nav className="flex items-center justify-between bg-white p-4 shadow-sm border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button onClick={goBack} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors" >
            <HiArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>
          <div className="text-lg font-semibold text-gray-800">
            Resultados para: "{currentSearch}"
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <img
            src="https://static.vecteezy.com/system/resources/previews/034/371/675/non_2x/person-silhouette-icon-user-icon-vector.jpg"
            alt="User"
            onClick={goToProfile}
            className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
          />
        </div>
      </nav>
    );
  }

  // Navbar principal
  return (
    <nav className="flex items-center justify-between bg-white p-4 shadow-sm border-b border-gray-200">
      <div
        className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
        onClick={() => onGoToMain?.()}
      >
        MUSA
      </div>
      <div ref={searchRef} className="relative w-1/2 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-2 pl-10 pr-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiSearch className="w-4 h-4 text-gray-500" />
          </div>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-200 rounded-r-lg transition-colors"
            >
              <HiX className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </button>
          )}
        </div>

        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 z-50 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-sm">BUSQUEDA</h3>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <HiX className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <HiSearch className="w-4 h-4 mr-2 text-gray-500" />
                {searchTerm ? `Resultados para "${searchTerm}"` : 'Búsquedas recientes'}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {filteredSearches.length > 0 ? (
                  filteredSearches.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(s.term)}
                      className="text-left p-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-red-700 rounded-md transition-all duration-200 border border-gray-100 hover:border-red-200 hover:shadow-sm flex items-start"
                    >
                      <HiSearch className="w-3 h-3 mt-0.5 mr-2 text-gray-400 shrink-0" />
                      <span>{s.term}</span>
                    </button>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-4 text-gray-500">
                    No se encontraron resultados para "{searchTerm}"
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <img
          src="https://static.vecteezy.com/system/resources/previews/034/371/675/non_2x/person-silhouette-icon-user-icon-vector.jpg"
          alt="User"
          onClick={goToProfile}
          className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
        />
      </div>
    </nav>
  );
};

export default Navbar;