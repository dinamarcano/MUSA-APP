import { useState } from "react";
import Navbar from "./Components/Navbar";
import Board from "./Components/Boards";
import Profile from "./Components/Profile";
import Preferences from "./Components/Preferences";
import Sidebar from "./Components/Sidebar";
import Bookmarks from "./Components/Bookmarks";
import MainPage from "./pages/Mainpage";
import './index.css'

export default function App() {
  const [currentView, setCurrentView] = useState<"main" | "dashboard">("main");
  const [dashboardPage, setDashboardPage] = useState<"boards" | "profile" | "preferences" | "bookmarks">("boards");

  // Si estamos en la vista principal, mostrar MainPage
  if (currentView === "main") {
    return <MainPage />;
  }

  // Si estamos en el dashboard, mostrar la interfaz completa
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar fijo */}
      <Sidebar setPage={setDashboardPage} onGoToMain={() => setCurrentView("main")} />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col">
        {/* Navbar SOLO con onGoToMain */}
        <Navbar onGoToMain={() => setCurrentView("main")} />

        {/* Contenido dinámico del dashboard */}
        <main className="flex-1 p-6 overflow-y-auto">
          {dashboardPage === "boards" && <Board />}
          {dashboardPage === "profile" && <Profile />}
          {dashboardPage === "preferences" && <Preferences />}
          {dashboardPage === "bookmarks" && <Bookmarks />}
        </main>
      </div>
    </div>
  );
}