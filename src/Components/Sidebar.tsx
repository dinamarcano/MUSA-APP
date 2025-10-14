import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-16 bg-white border-r border-gray-200 text-gray-700 min-h-screen flex flex-col items-center py-4">
      {/* Iconos */}
      <div className="space-y-4">
        <button className="p-2 hover:bg-gray-100 rounded">🏠</button>
        <button className="p-2 hover:bg-gray-100 rounded">🔍</button>
        <button className="p-2 hover:bg-gray-100 rounded">📧</button>
      </div>
    </div>
  );
};

export default Sidebar;