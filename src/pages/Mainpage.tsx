import React from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar_temp";
import Gallery from "../Components/Gallery/Gallery";

const MainPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-red-50">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </header>

      {/* Contenido principal */}
      <main className="flex flex-1">
        {/* Sidebar solo en desktop */}
        <aside className="w-16 bg-white border-r hidden md:block">
          <Sidebar />
        </aside>

        {/* Galería principal - con padding bottom para móvil */}
        <section className="flex-1 p-4 md:p-8 overflow-y-auto pb-20 md:pb-8">
          <Gallery />
        </section>
      </main>

      {/* Sidebar móvil (se renderiza como bottom nav) */}
      <div className="md:hidden">
        <Sidebar />
      </div>
    </div>
  );
};

export default MainPage;