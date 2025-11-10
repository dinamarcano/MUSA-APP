import React from 'react';

interface SearchResult {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  searchTerm: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, searchTerm }) => {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 bg-gray-50 rounded-lg p-8">
        <div className="text-gray-500 text-lg mb-4">
          No se encontraron resultados para "{searchTerm}"
        </div>
        <div className="text-gray-400 text-sm">
          Intenta con otros términos de búsqueda
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Resultados de búsqueda
        </h1>
        <p className="text-gray-600">
          Se encontraron {results.length} resultados para "{searchTerm}"
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <img
                src={result.imageUrl}
                alt={result.title}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                {result.title}
              </h3>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {result.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;