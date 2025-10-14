import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between bg-gray-200 p-4 shadow-sm">
      <div className="text-xl font-bold">MUSA</div>
      <input
        type="text"
        placeholder="Search"
        className="px-4 py-2 rounded-md border border-gray-300 w-1/2"
      />
      <img src="/assets/Icons/user.svg" alt="User" className="w-8 h-8 rounded-full" />
    </nav>
  );
};

export default Navbar;
