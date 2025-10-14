import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col bg-white shadow-md w-16 p-4 space-y-4">
      <img src="/assets/Icons/home.svg" alt="Home" className="w-6 h-6 mx-auto" />
      <img src="/assets/Icons/bell.svg" alt="Bell" className="w-6 h-6 mx-auto" />
      <img src="/assets/Icons/user.svg" alt="User" className="w-6 h-6 mx-auto" />
    </aside>
  );
};

export default Sidebar;
