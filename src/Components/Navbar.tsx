import React, { useState, useRef, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const recentSearches = [
    { term: "Arte comic", category: "" },
    { term: "Grafiti", category: "" },
    { term: "Diseño grafico", category: "" },
    { term: "Arte Street", category: "" },
    { term: "Arte Sketch", category: "" },
    { term: "Arte fantastico", category: "" }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearchOpen(false);
    console.log('Buscando:', term);
  };

  return (
    <nav className="flex items-center justify-between bg-white p-4 shadow-sm border-b border-gray-200">
      {/* Logo */}
      <div className="text-xl font-bold text-gray-900">MUSA</div>
      
      {/* Barra de búsqueda */}
      <div ref={searchRef} className="relative w-1/2 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full px-4 py-2 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">🔍</span>
          </div>
        </div>

        {/* Panel de búsquedas recientes */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 z-50 overflow-hidden">
            {/* Header del panel */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-bold text-gray-800 text-sm">BUSQUEDA</h3>
            </div>
            
            {/* Búsquedas recientes */}
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Busquedas recientes</h4>
              <div className="grid grid-cols-2 gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search.term)}
                    className="text-left p-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors border border-gray-100 hover:border-blue-200"
                  >
                    {search.term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Usuario */}
      <div className="flex items-center space-x-3">
        <div className="text-sm text-gray-600"></div>
        <img 
          src="https://static.vecteezy.com/system/resources/previews/034/371/675/non_2x/person-silhouette-icon-user-icon-vector.jpg" 
          alt="User" 
          className="w-8 h-8 rounded-full border border-gray-300" 
        />
      </div>
    </nav>
  );
};

export default Navbar;