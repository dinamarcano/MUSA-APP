import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";   // ajusta ruta
import { useAuth } from "../AuthContext";       // ajusta ruta

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
  filename?: string;
  createdAt?: string;
  likes?: number;
  comments?: any[];
}

const Profile: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();


  const paramId = params.id as string | undefined;

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [, setPostsError] = useState<string | null>(null);

  // Modales
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  // Edición de perfil
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [editAvatarFileData, setEditAvatarFileData] = useState<string | null>(
    null
  );
  const [savingProfile, setSavingProfile] = useState(false);

  // Creación de posts
  const [createImageUrl, setCreateImageUrl] = useState("");
  const [createFileData, setCreateFileData] = useState<string | null>(null);
  const [newImageName, setNewImageName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createTags, setCreateTags] = useState("");

  const [createAsGallery, setCreateAsGallery] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<"publicaciones" | "guardados">(
    "publicaciones"
  );

  // Helpers de mapeo
  const mapProfileRowToUser = (row: any): User => ({
    id: row.id,
    name: row.name ?? undefined,
    username: row.username ?? undefined,
    avatar: row.avatar ?? undefined,
    email: row.email ?? undefined,
  });

  const mapPostRowToPost = (row: any): Post => ({
    id: row.id,
    userId: row.user_id,
    image: row.image_url,
    title: row.title ?? "",
    description: row.description ?? "",
    tags: row.tags ?? [],
    filename: row.filename ?? undefined,
    createdAt: row.created_at,
    likes: row.likes_count ?? 0,
    comments: [], // se puede rellenar aparte si lo necesitas
  });

  useEffect(() => {
    const fetchData = async (targetId?: string) => {
      if (!targetId) return;

      // 1. Perfil desde Supabase
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", targetId)
          .maybeSingle();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching user data", error);
          navigate("/login", { replace: true });
          return;
        }

        if (!data) {
          setUser({
            id: targetId,
            email: authUser?.email,
          } as any);
        } else {
          setUser(mapProfileRowToUser(data));
        }
      } catch (err) {
        console.error("Error fetching user data (catch)", err);
        navigate("/login", { replace: true });
        return;
      }

      // 2. Posts del usuario
      try {
        setPostsError(null);
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", targetId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPosts((data ?? []).map(mapPostRowToPost));
      } catch (err) {
        console.error("Error fetching posts", err);
        setPostsError("Error al cargar las publicaciones");
      }
    };

    if (authLoading) return;

    const targetId = paramId ?? authUser?.id ?? undefined;

    if (targetId) {
      fetchData(targetId);
    } else {
      navigate("/login", { replace: true });
    }
  }, [paramId, navigate, authUser, authLoading]);


  const [createFile, setCreateFile] = useState<File | null>(null);
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

  const handleCreateFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewImageName(file.name);
    setCreateFile(file);          // <-- guarda el File
    const dataUrl = await fileToDataUrl(file);
    setCreateFileData(dataUrl);
    setCreateImageUrl("");        // si subes archivo, vacía el campo URL
  };

  // En Profile.tsx (o utils/uploads.ts)
  const uploadToGallery = async (file: File, userId: string): Promise<string> => {
    const bucket = "gallery";
    const ext = file.name.split(".").pop() || "jpg";
    const filePath = `${userId}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,            // opcional: reemplazar si el nombre ya existe
        contentType: file.type,  // envía el MIME correcto
      });                        // la API de upload admite estas opciones
    if (error) throw error;      // [web:16]

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;       // usa esta URL pública en tu tabla
  };                              // [web:20]


  // por ejemplo en Profile.tsx o en un util aparte
  const uploadImageToBucket = async (
    file: File,
    userId: string
  ): Promise<string> => {
    const bucket = "posts-media"; // nombre del bucket
    const filePath = `${userId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error subiendo archivo a Storage", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    // data.publicUrl es la URL pública si el bucket es público
    return data.publicUrl;
  };


  // estados (arriba, junto a otros)
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);

  // handler de input file (reemplaza el tuyo)
  const handleEditAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setEditAvatarFile(file);
      const dataUrl = await fileToDataUrl(file);
      setEditAvatarFileData(dataUrl);  // para previsualizar
      setEditAvatarUrl('');            // limpia URL manual si subes archivo
    } catch (err) {
      console.error(err);
      alert("No se pudo leer el archivo seleccionado.");
    }
  };

  // helper para subir al bucket 'avatars'
  const uploadAvatarToBucket = async (file: File, userId: string): Promise<string> => {
    const bucket = 'avatars';
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `${userId}/avatar.${ext}`; // carpeta por usuario
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,              // reemplaza el avatar anterior
        contentType: file.type,
      });
    if (error) {
      console.error('Error subiendo avatar', error);
      throw error;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;         // URL pública del avatar
  };

  const handleCreatePost = async () => {
    const targetUserId = paramId ?? authUser?.id ?? user?.id;
    if (!targetUserId) {
      alert("No se pudo determinar el usuario para el post.");
      return;
    }

    let imageUrlToSave = createImageUrl;

    try {
      setCreating(true);

      // Sube al bucket correcto según el destino
      if (createFile) {
        imageUrlToSave = createAsGallery
          ? await uploadToGallery(createFile, targetUserId)     // -> bucket gallery
          : await uploadImageToBucket(createFile, targetUserId); // -> bucket posts-media
      }

      if (!imageUrlToSave) {
        alert("Proporciona una URL o sube una imagen antes de publicar.");
        setCreating(false);
        return;
      }

      const tagsArray = createTags
        ? createTags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      if (createAsGallery) {
        // artworks (galería personal)
        const { error } = await supabase.from("artworks").insert({
          user_id: targetUserId,
          image_url: imageUrlToSave,
          title: createTitle || null,
          description: createDescription || null,
          tags: tagsArray.length ? tagsArray : null,
        });
        if (error) throw error;
      } else {
        // posts (muro público)
        const { data, error } = await supabase
          .from("posts")
          .insert({
            user_id: targetUserId,
            image_url: imageUrlToSave,
            title: createTitle || null,
            description: createDescription || null,
            tags: tagsArray.length ? tagsArray : null,
          })
          .select()
          .single();
        if (error || !data) throw error;
        setPosts((prev) => [mapPostRowToPost(data), ...prev]);
      }

      // limpiar UI
      setCreateImageUrl("");
      setCreateFile(null);
      setCreateFileData(null);
      setNewImageName("");
      setCreateTitle("");
      setCreateDescription("");
      setCreateTags("");
      setCreateAsGallery(false);
      setCreateOpen(false);
    } catch (err) {
      console.error("Error creating item", err);
      alert("No se pudo crear. Revisa la consola.");
    } finally {
      setCreating(false);
    }
  };


  const handleSaveProfile = async () => {
    if (!user) return;
    const id = user.id;

    // si hay archivo, súbelo a 'avatars' y usa su URL pública
    let avatarUrlToSave = editAvatarUrl || user.avatar || null;
    try {
      if (editAvatarFile) {
        avatarUrlToSave = await uploadAvatarToBucket(editAvatarFile, id);
      }
    } catch (e) {
      alert('No se pudo subir el avatar. Revisa la consola.');
      return;
    }

    const payload: any = {
      id,
      name: editName || null,
      username: editUsername || null,
      avatar: avatarUrlToSave,
    };

    setSavingProfile(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();
      if (error || !data) throw error;

      const updated = mapProfileRowToUser(data);
      setUser(updated);
      setEditAvatarFileData(null);
      setEditAvatarFile(null);
      setEditAvatarUrl(updated.avatar ?? '');
      setEditOpen(false);
    } catch (err) {
      console.error('Error saving profile', err);
      alert('No se pudo guardar el perfil.');
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

  const displayLabel =
    user.name || user.username || user.email || String(user.id) || "Usuario";
  const userInitials = displayLabel
    .split(" ")
    .map((n: any) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
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
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {userInitials}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {displayLabel}
                </h1>
                {user.username && (
                  <p className="text-gray-500">@{user.username}</p>
                )}
                {!user.username && user.email && (
                  <p className="text-gray-500">{user.email}</p>
                )}
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
                Crear publicación
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("publicaciones")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "publicaciones"
                ? "border-red-800 text-gray-800"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Publicaciones
            </button>
            <button
              onClick={() => setActiveTab("guardados")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "guardados"
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Publicaciones
            </h2>
            <p className="text-gray-600">
              {posts.length}{" "}
              {posts.length === 1 ? "publicación" : "publicaciones"}
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
                  onClick={() => navigate(`/post/profile/${post.id}`)}
                >
                  {/* Imagen */}
                  <div className="h-48 bg-gray-100 overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title || `post-${post.id}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Imagen+no+disponible";
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
                  {new Set(
                    posts.flatMap((p) => p.tags || [])
                  ).size.toString()}
                </div>
                <div className="text-sm text-gray-600">Etiquetas únicas</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">
                  {posts.filter((p) => !!p.createdAt).length}
                </div>
                <div className="text-sm text-gray-600">Con fecha</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-orange-600">
                  {posts.filter((p) => !!p.title).length}
                </div>
                <div className="text-sm text-gray-600">Con título</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Contenido de Guardados (placeholder) */}
      {activeTab === "guardados" && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📌</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Funcionalidad en desarrollo
          </h3>
          <p className="text-gray-500">
            Los elementos guardados aparecerán aquí próximamente.
          </p>
        </div>
      )}

      {/* Modal Editar Perfil */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Editar perfil</h3>
            <div className="grid gap-3">
              <label className="text-sm font-medium">
                Nombre
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </label>
              <label className="text-sm font-medium">
                Nombre de usuario
                <input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </label>
              <label className="text-sm font-medium">
                Avatar URL
                <input
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </label>
              <label className="text-sm font-medium">
                o sube un archivo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditAvatarFile}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </label>
              {editAvatarFileData && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Previsualización:</p>
                  <img
                    src={editAvatarFileData}
                    alt="avatar-preview"
                    className="w-28 h-28 object-cover rounded-lg mt-2"
                  />
                </div>
              )}
            </div>
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
      )}

      {/* Modal Crear Publicación */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Crear publicación</h3>
            <div className="grid gap-3">
              <label className="text-sm font-medium">
                Título
                <input
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </label>
              <label className="text-sm font-medium">
                Descripción
                <textarea
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                />
              </label>
              <label className="text-sm font-medium">
                Tags (separados por coma)
                <input
                  value={createTags}
                  onChange={(e) => setCreateTags(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="arte, pintura, óleo"
                />
              </label>
              <label className="text-sm font-medium">
                URL de imagen
                <input
                  value={createImageUrl}
                  onChange={(e) => {
                    setCreateImageUrl(e.target.value);
                    setCreateFileData(null);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </label>
              <label className="text-sm font-medium">
                o sube una imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCreateFileChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={createAsGallery}
                  onChange={(e) => setCreateAsGallery(e.target.checked)}
                  className="rounded"
                />
                Guardar en mi galería (no como post)
              </label>
              {createFileData && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Previsualización:</p>
                  <img
                    src={createFileData}
                    alt="preview"
                    className="w-48 h-48 object-cover rounded-lg mt-2"
                  />
                </div>
              )}
            </div>
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
      )}
    </div>
  );
};

export default Profile;
