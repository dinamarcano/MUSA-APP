import React from 'react';

const Bookmarks: React.FC = () => {
  const savedItems = [
    { id: 1, title: 'Ilustración futurista', author: 'Marcos R.' },
    { id: 2, title: 'Diseño UX minimalista', author: 'Lucía G.' },
    { id: 3, title: 'Póster surrealista', author: 'Caro P.' },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Publicaciones guardadas</h2>
      <div className="grid grid-cols-2 gap-4">
        {savedItems.map((item) => (
          <div key={item.id} className="p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <h3 className="font-bold text-gray-800">{item.title}</h3>
            <p className="text-sm text-gray-600">por {item.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
