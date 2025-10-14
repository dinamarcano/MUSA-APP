import React from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
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
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r hidden md:block">
          <Sidebar />
        </aside>

        {/* Galería principal */}
        <section className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Gallery />
        </section>
      </main>
    </div>
  );
};

export default MainPage;
