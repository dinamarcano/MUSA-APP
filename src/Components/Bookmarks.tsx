import { useState } from "react";
import PostsList from "./PostsList"; // ← nuevo import

interface SavedItem {
  id: number;
  title: string;
  author: string;
  image: string;
  category: string;
  savedDate: string;
}

const Bookmarks: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"publicaciones" | "guardados">(
    "guardados"
  );

  const savedItems: SavedItem[] = [
    {
      id: 1,
      title: "Ilustración futurista",
      author: "Marcos R.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/b/b4/Vincent_Willem_van_Gogh_128.jpg",
      category: "Ilustración",
      savedDate: "2024-01-15",
    },
    {
      id: 2,
      title: "Diseño UX minimalista",
      author: "Lucía G.",
      image:
        "https://i.pinimg.com/736x/95/5d/7b/955d7bc13fccbc8da479b178772a74f9.jpg",
      category: "Diseño",
      savedDate: "2024-01-14",
    },
    {
      id: 3,
      title: "Póster surrealista",
      author: "Caro P.",
      image:
        "https://i.pinimg.com/736x/99/27/5b/99275b999fa4411b1c05b6657ac887d1.jpg",
      category: "Arte",
      savedDate: "2024-01-13",
    },
    {
      id: 4,
      title: "Tipografía experimental",
      author: "Alex M.",
      image:
        "https://img.wikioo.org/ADC/art.nsf/get_large_image_wikioo?Open&ra=5ZKGLP",
      category: "Tipografía",
      savedDate: "2024-01-12",
    },
    {
      id: 5,
      title: "Fotografía urbana",
      author: "David T.",
      image:
        "https://i.pinimg.com/736x/32/85/ce/3285ce2e048ca689d8eb9384528cacb1.jpg",
      category: "Fotografía",
      savedDate: "2024-01-11",
    },
    {
      id: 6,
      title: "Animación 3D",
      author: "Sofía L.",
      image:
        "https://i.pinimg.com/1200x/24/5b/6b/245b6b5e8e41fb5767f9d1528697755e.jpg",
      category: "Animación",
      savedDate: "2024-01-10",
    },
  ];

  const categories = ["all", ...new Set(savedItems.map((item) => item.category))];

  const filteredItems =
    filter === "all"
      ? savedItems
      : savedItems.filter((item) => item.category === filter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header del perfil */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            MG
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  María Gonzalez
                </h1>
                <p className="text-gray-500">@Mozg264</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Editor perfil
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("publicaciones")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "publicaciones"
                  ? "border-red-800 text-black-800"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Publicaciones
            </button>
            <button
              onClick={() => setActiveTab("guardados")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "guardados"
                  ? "border-red-800 text-black-800"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Guardados
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido de Guardados */}
      {activeTab === "guardados" && (
        <>
          {/* Header de guardados */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Publicaciones guardadas
            </h2>
            <p className="text-gray-600">
              {savedItems.length}{" "}
              {savedItems.length === 1
                ? "elemento guardado"
                : "elementos guardados"}
            </p>
          </div>

          {/* Filtros */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === category
                      ? "bg-red-800 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category === "all" ? "Todos" : category}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de elementos guardados */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No hay elementos guardados
              </h3>
              <p className="text-gray-500">
                Los elementos que guardes aparecerán aquí.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group"
                >
                  {/* Imagen */}
                  <div className="h-48 bg-gray-100 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=${encodeURIComponent(
                          item.category
                        )}`;
                      }}
                    />
                    <button
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Eliminar de guardados"
                    >
                      ❤️
                    </button>
                  </div>

                  {/* Contenido */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-blue-900 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">
                      por {item.author}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="inline-block px-3 py-1 bg-red-100 text-black-800 text-xs font-medium rounded-full">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        Guardado {formatDate(item.savedDate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Estadísticas */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-black-600">
                  {savedItems.length}
                </div>
                <div className="text-sm text-gray-600">Total guardados</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-green-600">
                  {categories.length - 1}
                </div>
                <div className="text-sm text-gray-600">Categorías</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(savedItems.map((item) => item.author)).size}
                </div>
                <div className="text-sm text-gray-600">Autores únicos</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.ceil(savedItems.length / 7)}
                </div>
                <div className="text-sm text-gray-600">Guardados/semana</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Contenido de Publicaciones */}
      {activeTab === "publicaciones" && (
        <div className="mt-10">
          <PostsList /> {/* ← ahora carga las publicaciones reales */}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
