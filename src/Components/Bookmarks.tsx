import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

interface User {
  id: string;
  name?: string;
  username?: string;
  avatar?: string;
  email?: string;
}

interface Post {
  id: string;
  userId: string;
  image: string;
  title?: string;
  description?: string;
  tags?: string[];
  createdAt?: string;
}

const savedItems = [
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

export default function Bookmarks() {
  const params = useParams();
  const navigate = useNavigate();
  const routeId = (params as any).id ?? (params as any).userId ?? null;
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"publicaciones" | "guardados">(
    "publicaciones"
  );
  const API_URL =
    (import.meta && (import.meta as any).env?.VITE_API_URL) ||
    "http://localhost:3001";

  const getLocalCurrentUser = (): User | null => {
    try {
      const cu = localStorage.getItem("currentUser");
      return cu ? JSON.parse(cu) : null;
    } catch {
      return null;
    }
  };

  // bookmarks stored in localStorage with shape: { [userId]: string[] }
  const getBookmarksForUser = (userId: string): string[] => {
    try {
      const raw = localStorage.getItem("bookmarks");
      if (!raw) return [];
      const obj = JSON.parse(raw);
      if (!obj || typeof obj !== "object") return [];
      const arr = obj[userId];
      return Array.isArray(arr) ? arr.map(String) : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const loadProfile = async (targetId?: string) => {
      const idToUse = targetId || getLocalCurrentUser()?.id;
      if (!idToUse) return;
      // load user info
      try {
        const res = await axios.get(
          `${API_URL}/users/${encodeURIComponent(String(idToUse))}`
        );
        setUser(res.data);
      } catch (err) {
        const local = getLocalCurrentUser();
        if (local && String(local.id) === String(idToUse)) setUser(local);
        else setUser(null);
      }

      // publicaciones (mis posts) - mismo comportamiento que Profile
      try {
        const postsRes = await axios.get(`${API_URL}/posts`, {
          params: { userId: idToUse },
        });
        setPosts(postsRes.data || []);
      } catch {
        setPosts([]);
      }

      // guardados: cargar bookmarks y resolver posts
      try {
        const bookmarkIds = getBookmarksForUser(String(idToUse));
        if (bookmarkIds.length === 0) {
          setSavedPosts([]);
        } else {
          // intento simple: obtener todos posts y filtrar (compatible con json-server)
          const allRes = await axios.get(`${API_URL}/posts`);
          const allPosts: Post[] = allRes.data || [];
          const filtered = allPosts.filter((p) =>
            bookmarkIds.includes(String(p.id))
          );
          setSavedPosts(filtered);
        }
      } catch {
        setSavedPosts([]);
      }
    };

    if (routeId) loadProfile(routeId);
    else {
      const local = getLocalCurrentUser();
      if (local?.id) loadProfile(local.id);
      else loadProfile(undefined);
    }
  }, [routeId, API_URL]);

  const openPost = (postId: string) => {
    navigate(`/post/profile/${postId}`);
  };

  const displayLabel = user?.name || user?.username || user?.email || "Usuario";

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header perfil */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user?.avatar || "/assets/default-avatar.png"}
          alt={displayLabel}
          className="w-24 h-24 rounded-full object-cover shadow"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{displayLabel}</h1>
          {user?.username && (
            <p className="text-sm text-gray-500">@{user.username}</p>
          )}
          {!user?.username && user?.email && (
            <p className="text-sm text-gray-500">{user.email}</p>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate(`/dashboard`)} className="px-3 py-2 border rounded">
            Volver
          </button>
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-edit-profile'))} className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300">
            Editar perfil
          </button>
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-create-post'))} className="bg-red-700 text-white px-3 py-2 rounded hover:bg-red-800">
            + Crear publicación
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("publicaciones")}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "publicaciones"
                ? "border-red-800 text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Publicaciones
          </button>
          <button
            onClick={() => setActiveTab("guardados")}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "guardados"
                ? "border-red-800 text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Guardados
          </button>
        </nav>
      </div>

      {/* Contenido */}
      {activeTab === "publicaciones" ? (
        <>
          {posts.length === 0 ? (
            <p className="text-gray-500">Aún no hay publicaciones.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {posts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => openPost(p.id)}
                  className="rounded overflow-hidden shadow group"
                >
                  <img
                    src={p.image}
                    alt={p.title || `post-${p.id}`}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="p-2">
                    {p.title && (
                      <h3 className="text-sm font-semibold">{p.title}</h3>
                    )}
                    {p.tags && (
                      <p className="text-xs text-gray-400 mt-1">
                        {p.tags.map((t) => `#${t}`).join(" ")}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {savedPosts.length === 0 ? (
            savedItems.length === 0 ? (
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
                {savedItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group"
                  >
                    <div className="h-48 bg-gray-100 overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                        ❤️
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        por {item.author}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="inline-block px-3 py-1 bg-red-100 text-black text-xs font-medium rounded-full">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          Guardado{" "}
                          {new Date(item.savedDate).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {savedPosts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => openPost(p.id)}
                  className="rounded overflow-hidden shadow group"
                >
                  <img
                    src={p.image}
                    alt={p.title || `post-${p.id}`}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="p-2">
                    {p.title && (
                      <h3 className="text-sm font-semibold">{p.title}</h3>
                    )}
                    {p.tags && (
                      <p className="text-xs text-gray-400 mt-1">
                        {p.tags.map((t) => `#${t}`).join(" ")}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
