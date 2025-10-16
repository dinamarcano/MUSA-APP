
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Gallery from "../components/Gallery";

const MusaLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar superior */}
      <Navbar />

      {/* Cuerpo principal con Sidebar, Feed y Gallery */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar izquierda */}
        <aside className="hidden md:flex w-16 bg-white border-r border-gray-200">
          <Sidebar />
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto p-6">
          <Feed />
        </main>

        {/* Galería lateral derecha */}
        <aside className="hidden lg:block w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
          <Gallery />
        </aside>
      </div>
    </div>
  );
};

export default MusaLayout;
