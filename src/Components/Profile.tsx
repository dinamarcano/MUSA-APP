import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface User {
  id: number;
  name?: string;
  username?: string;
  avatar?: string;
  email?: string;
}

interface Post {
  id: number;
  userId: number;
  image: string;
  title?: string;
  description?: string;
  tags?: string[];
  filename?: string;
  createdAt?: string;
}

export default function Profile() {
  const params = useParams();
  const navigate = useNavigate();
  const paramId = params.id;
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [, setPostsError] = useState<string | null>(null);

  const API_URL = (import.meta && (import.meta as any).env?.VITE_API_URL) || "http://localhost:3001";

  // Estados para modales
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  
  // Estados para edición de perfil
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [editAvatarFileData, setEditAvatarFileData] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Estados para creación de posts
  const [createImageUrl, setCreateImageUrl] = useState("");
  const [createFileData, setCreateFileData] = useState(""); 
  const [newImageName, setNewImageName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createTags, setCreateTags] = useState("");

  // Estado para tabs
  const [activeTab, setActiveTab] = useState<"publicaciones" | "guardados">("publicaciones");

  const getLocalCurrentUser = () => {
    const cu = localStorage.getItem("currentUser");
    if (!cu) return null;
    try {
      return JSON.parse(cu);
    } catch {
      return null;
    }
  };

  const tryGetPosts = async (targetId: string) => {
    try {
      const res = await axios.get(`${API_URL}/posts?userId=${targetId}`);
      return res.data || [];
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return [];
      } else {
        throw err;
      }
    }
  };

  const tryPost = async (payload: any) => {
    try {
      const res = await axios.post(`${API_URL}/posts`, payload);
      return res.data;
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    const fetchData = async (targetId?: string) => {
      if (!targetId) return;
      try {
        const userRes = await axios.get(`${API_URL}/users/${targetId}`);
        setUser(userRes.data);
        setEditName(userRes.data?.name || "");
        setEditUsername(userRes.data?.username || "");
        setEditAvatarUrl(userRes.data?.avatar || "");
      } catch (err) {
        console.error("Error fetching user data:", err);
        navigate("/login", { replace: true });
        return;
      }
      try {
        setPostsError(null);
        const data = await tryGetPosts(targetId);
        setPosts(data);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setPostsError("Error al cargar las publicaciones");
      }
    };

    if (paramId) fetchData(paramId);
    else {
      const cu = getLocalCurrentUser();
      if (cu?.id) fetchData(String(cu.id));
      else navigate("/login", { replace: true });
    }
  }, [paramId, navigate, API_URL]);

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") resolve(reader.result);
        else reject(new Error("No se pudo leer el archivo"));
      };
      reader.onerror = () => reject(new Error("Error leyendo archivo"));
      reader.readAsDataURL(file);
    });

  const handleCreateFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageName(file.name);
    try {
      const dataUrl = await fileToDataUrl(file);
      setCreateFileData(dataUrl);
      setCreateImageUrl("");
    } catch (err) {
      console.error(err);
      alert("No se pudo leer el archivo seleccionado.");
    }
  };

  const handleEditAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setEditAvatarFileData(dataUrl);
      setEditAvatarUrl("");
    } catch (err) {
      console.error(err);
      alert("No se pudo leer el archivo seleccionado.");
    }
  };

  const handleCreatePost = async () => {
    const cu = getLocalCurrentUser();
    const targetUserId = paramId ?? String(cu?.id ?? user?.id);
    const imageToSend = createFileData || createImageUrl;
    if (!imageToSend || !targetUserId) {
      alert("Proporciona una URL o sube una imagen antes de publicar.");
      return;
    }
    setCreating(true);
    try {
      const payload = {
        userId: targetUserId,
        image: imageToSend,
        filename: newImageName || undefined,
        title: createTitle || undefined,
        description: createDescription || undefined,
        tags: createTags ? createTags.split(",").map(t => t.trim()).filter(Boolean) : undefined,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: []
      };
      const created = await tryPost(payload);
      setPosts(prev => [created, ...prev]);
      setCreateImageUrl("");
      setCreateFileData("");
      setNewImageName("");
      setCreateTitle("");
      setCreateDescription("");
      setCreateTags("");
      setCreateOpen(false);
    } catch (err: any) {
      console.error("Error creating post:", err);
      alert("No se pudo crear el post. Revisa la consola.");
    } finally {
      setCreating(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    const id = user.id;
    const avatarToSend = editAvatarFileData || editAvatarUrl || user.avatar;
    const payload: Partial<User> = {
      name: editName || undefined,
      username: editUsername || undefined,
      avatar: avatarToSend || undefined,
    };
    setSavingProfile(true);
    try {
      const res = await axios.patch(`${API_URL}/users/${id}`, payload);
      setUser(res.data);
      const cu = getLocalCurrentUser();
      if (cu) {
        const updated = { ...cu, name: res.data.name ?? cu.name, avatar: res.data.avatar ?? cu.avatar };
        localStorage.setItem("currentUser", JSON.stringify(updated));
      }
      setEditOpen(false);
      setEditAvatarFileData("");
      setEditAvatarUrl(res.data.avatar || "");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("No se pudo guardar el perfil.");
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando perfil...</p>
      </div>
    );
  }

  const localCU = getLocalCurrentUser();
  const displayLabel = user.name || user.username || localCU?.email || String(localCU?.id) || "Usuario";
  const userInitials = displayLabel.split(' ').map((n: any[]) => n[0]).join('').toUpperCase().slice(0, 2);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header del perfil - Estilo Bookmarks */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          {/* Avatar */}
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={displayLabel}
              className="w-20 h-20 rounded-full object-cover shadow"
            />
          ) : (
            <div className="w-20 h-20 bg-linear-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {userInitials}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{displayLabel}</h1>
                {user.username && <p className="text-gray-500">@{user.username}</p>}
                {!user.username && localCU?.email && <p className="text-gray-500">{localCU.email}</p>}
              </div>
              <button 
                onClick={() => setEditOpen(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Editar perfil
              </button>
              <button
                onClick={() => setCreateOpen(true)}
                className="px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-medium hover:bg-red-800 transition-colors"
              >
                + Crear publicación
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("publicaciones")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "publicaciones"
                  ? "border-red-800 text-gray-800"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Publicaciones
            </button>
            <button
              onClick={() => setActiveTab("guardados")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "guardados"
                  ? "border-red-800 text-gray-800"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Guardados
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido de Publicaciones */}
      {activeTab === "publicaciones" && (
        <>
          {/* Header de publicaciones */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Publicaciones
            </h2>
            <p className="text-gray-600">
              {posts.length} {posts.length === 1 ? "publicación" : "publicaciones"}
            </p>
          </div>

          {/* Grid de publicaciones - Estilo Bookmarks */}
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Aún no hay publicaciones
              </h3>
              <p className="text-gray-500">
                Las publicaciones que crees aparecerán aquí.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => {
                    navigate(`/post/${post.id}`);
                  }}
                >
                  {/* Imagen */}
                  <div className="h-48 bg-gray-100 overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title || `post-${post.id}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Imagen+no+disponible`;
                      }}
                    />
                  </div>

                  {/* Contenido */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-red-800 transition-colors">
                        {post.title || "Sin título"}
                      </h3>
                    </div>

                    {post.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {post.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center">
                      {post.tags && post.tags.length > 0 && (
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          {post.tags[0]}
                        </span>
                      )}
                      {post.createdAt && (
                        <span className="text-xs text-gray-500">
                          {formatDate(post.createdAt)}
                        </span>
                      )}
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
                <div className="text-2xl font-bold text-red-600">
                  {posts.length}
                </div>
                <div className="text-sm text-gray-600">Total publicaciones</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(posts.flatMap(p => p.tags || [])).size}
                </div>
                <div className="text-sm text-gray-600">Etiquetas únicas</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">
                  {posts.filter(p => p.createdAt).length}
                </div>
                <div className="text-sm text-gray-600">Con fecha</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-orange-600">
                  {posts.filter(p => p.title).length}
                </div>
                <div className="text-sm text-gray-600">Con título</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Contenido de Guardados (placeholder por ahora) */}
      {activeTab === "guardados" && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Funcionalidad en desarrollo
          </h3>
          <p className="text-gray-500">
            Los elementos guardados aparecerán aquí próximamente.
          </p>
        </div>
      )}

      {/* Modal de Editar Perfil */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Editar perfil</h3>
            <div className="grid gap-3">
              <label className="text-sm font-medium">Nombre</label>
              <input 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <label className="text-sm font-medium">Nombre de usuario</label>
              <input 
                value={editUsername} 
                onChange={(e) => setEditUsername(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <label className="text-sm font-medium">Avatar (URL)</label>
              <input 
                value={editAvatarUrl} 
                onChange={(e) => setEditAvatarUrl(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <label className="text-sm font-medium">o sube un archivo</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleEditAvatarFile} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />

              {(editAvatarFileData || editAvatarUrl) && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Previsualización:</p>
                  <img src={editAvatarFileData || editAvatarUrl} alt="avatar-preview" className="w-28 h-28 object-cover rounded-lg mt-2" />
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button 
                  onClick={() => setEditOpen(false)} 
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveProfile} 
                  disabled={savingProfile}
                  className="px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 transition-colors disabled:opacity-50"
                >
                  {savingProfile ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Crear Publicación */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Crear publicación</h3>

            <div className="grid gap-3">
              <label className="text-sm font-medium">Título</label>
              <input 
                value={createTitle} 
                onChange={(e) => setCreateTitle(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <label className="text-sm font-medium">Descripción</label>
              <textarea 
                value={createDescription} 
                onChange={(e) => setCreateDescription(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" 
                rows={3} 
              />

              <label className="text-sm font-medium">Tags (separados por coma)</label>
              <input 
                value={createTags} 
                onChange={(e) => setCreateTags(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" 
                placeholder="arte, pintura, óleo" 
              />

              <label className="text-sm font-medium">URL de imagen</label>
              <input 
                value={createImageUrl} 
                onChange={(e) => setCreateImageUrl(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <label className="text-sm font-medium">o sube una imagen</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleCreateFileChange} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />

              {createFileData && (
                <div>
                  <p className="text-sm text-gray-600">Previsualización:</p>
                  <img src={createFileData} alt="preview" className="w-48 h-48 object-cover rounded-lg mt-2" />
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button 
                  onClick={() => setCreateOpen(false)} 
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleCreatePost} 
                  disabled={creating}
                  className="px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 transition-colors disabled:opacity-50"
                >
                  {creating ? "Publicando..." : "Publicar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}