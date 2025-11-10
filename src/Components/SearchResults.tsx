import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface SearchResult {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
  artist?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  searchTerm: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, searchTerm }) => {
  const navigate = useNavigate();

 
  const handleImageClick = (result: SearchResult) => {
   
    navigate(`/search-post/${result.id}`);
  };

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 bg-gray-50 rounded-lg p-8 w-full">
        <div className="text-gray-500 text-lg mb-4 text-center">
          No se encontraron resultados para "{searchTerm}"
        </div>
        <div className="text-gray-400 text-sm text-center">
          Intenta con otros términos de búsqueda
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Resultados de búsqueda
        </h1>
        <p className="text-gray-600 text-lg">
          Se encontraron {results.length} resultados para "{searchTerm}"
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => handleImageClick(result)}
          >
            <div className="aspect-w-1 aspect-h-1 bg-gray-100">
              <img
                src={result.imageUrl}
                alt={result.title}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm leading-tight">
                {result.title}
              </h3>
              <div className="flex flex-col space-y-1">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                  {result.category}
                </span>
                {result.artist && (
                  <span className="text-xs text-gray-500">
                    por {result.artist}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;