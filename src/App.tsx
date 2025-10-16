import { useState } from "react";
import Navbar from "./components/Navbar";
import Board from "./components/Boards";
import Profile from "./components/Profile";
import Preferences from "./components/Preferences";
import Sidebar from "./components/Sidebar";
import Bookmarks from "./components/Bookmarks";

export default function App() {
  // Actualiza el tipo para que coincida con Navbar
  const [page, setPage] = useState<"boards" | "profile" | "preferences" | "bookmarks">("boards");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col">
        {/* Navbar con control de página */}
        <Navbar setPage={setPage} />

        {/* Contenido dinámico */}
        <main className="flex-1 p-6 overflow-y-auto">
          {page === "boards" && <Board />}
          {page === "profile" && <Profile />}
          {page === "preferences" && <Preferences />}
          {/* Agrega el caso para bookmarks si necesitas */}
          {page === "bookmarks" && <div>Bookmarks Page</div>}
        </main>
      </div>
    </div>
  );
}