import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Board from "./Components/Boards";
import Profile from "./Components/Profile";
import Preferences from "./Components/Preferences";
import Sidebar from "./Components/Sidebar";
import Bookmarks from "./Components/Bookmarks";
import MainPage from "./pages/Mainpage";
import PostDetail from "./pages/PostDetails";
import './index.css'

const Dashboard: React.FC = () => {
  const [dashboardPage, setDashboardPage] = useState<"boards" | "profile" | "preferences" | "bookmarks">("boards");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar fijo */}
      <Sidebar setPage={setDashboardPage} onGoToMain={() => window.location.href = '/'} />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar onGoToMain={() => window.location.href = '/'} />

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
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          {/* Ruta principal con tu lógica de vista actual */}
          <Route path="/" element={<MainPage />} />
          
          {/* Ruta para el detalle del post */}
          <Route path="/post/:id" element={<PostDetail />} />
          
          {/* Ruta para el dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}