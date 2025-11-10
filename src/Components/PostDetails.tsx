import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Post {
  id: number | string;
  userId: number | string;
  image: string;
  title?: string;
  description?: string;
  tags?: string[];
  filename?: string;
  createdAt?: string;
  likes?: number;
  comments?: CommentItem[];
}

interface CommentItem {
  id: number | string;
  author: string;
  text: string;
  createdAt: string;
}

interface User {
  id: number | string;
  name?: string;
  username?: string;
  avatar?: string;
  email?: string;
}

export default function PostDetails() {
  const params = useParams();
  const routeId = (params as any).postId ?? (params as any).id ?? (params as any).post ?? (params as any).artId ?? null;
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = (import.meta && (import.meta as any).env?.VITE_API_URL) || "http://localhost:3001";

  const getLocalCurrentUser = () => {
    try {
      const cu = localStorage.getItem("currentUser");
      return cu ? JSON.parse(cu) : null;
    } catch {
      return null;
    }
  };

  // intenta GET por id (ruta) y por query ?id=
  const tryGetPostById = async (id: string | number) => {
    const directCandidates = [
      `${API_URL}/posts/${encodeURIComponent(String(id))}`,
      `${API_URL}/api/posts/${encodeURIComponent(String(id))}`
    ];
    const queryCandidates = [
      `${API_URL}/posts?id=${encodeURIComponent(String(id))}`,
      `${API_URL}/api/posts?id=${encodeURIComponent(String(id))}`
    ];

    for (const url of directCandidates) {
      try {
        console.debug("Intentando GET directo:", url);
        const res = await axios.get(url);
        console.debug("Respuesta directa:", res.status, res.data);
        return res.data;
      } catch (err: any) {
        console.debug("Fallo GET directo:", url, err?.response?.status);
        if (err?.response?.status === 404) continue;
        throw err;
      }
    }

    // query fallback (json-server devuelve array)
    for (const url of queryCandidates) {
      try {
        console.debug("Intentando GET por query:", url);
        const res = await axios.get(url);
        console.debug("Respuesta query:", res.status, res.data);
        const arr = res.data;
        if (Array.isArray(arr) && arr.length > 0) return arr[0];
      } catch (err: any) {
        console.debug("Fallo GET query:", url, err?.response?.status);
        if (err?.response?.status === 404) continue;
        throw err;
      }
    }

    return null;
  };

  const tryGetAllPosts = async () => {
    const candidates = [
      `${API_URL}/posts`,
      `${API_URL}/api/posts`
    ];
    for (const url of candidates) {
      try {
        console.debug("Intentando GET all:", url);
        const res = await axios.get(url);
        console.debug("GET all OK:", url, res.status);
        return res.data || [];
      } catch (err: any) {
        console.debug("Fallo GET all:", url, err?.response?.status);
        if (err?.response?.status === 404) continue;
        throw err;
      }
    }
    return [];
  };

  const tryPatchPost = async (id: string | number, payload: any) => {
    const candidates = [
      `${API_URL}/posts/${encodeURIComponent(String(id))}`,
      `${API_URL}/api/posts/${encodeURIComponent(String(id))}`
    ];
    for (const url of candidates) {
      try {
        const res = await axios.patch(url, payload);
        return res.data;
      } catch (err: any) {
        if (err?.response?.status === 404) continue;
        throw err;
      }
    }
    throw new Error("PATCH failed for all candidates");
  };

  useEffect(() => {
    const loadPostData = async () => {
      setLoading(true);
      if (!routeId) {
        console.warn("No se recibió id de ruta (routeId es null). Revisa la ruta en App.tsx");
        setLoading(false);
        return;
      }
      try {
        console.log("Buscando post ID:", routeId);
        const direct = await tryGetPostById(routeId);
        if (direct) {
          setPost(direct);
          if (direct.userId != null) {
            try {
              const userRes = await axios.get(`${API_URL}/users/${encodeURIComponent(String(direct.userId))}`);
              setUser(userRes.data);
            } catch {
              const local = getLocalCurrentUser();
              if (local && String(local.id) === String(direct.userId)) setUser(local);
              else setUser(null);
            }
          }
          setLoading(false);
          return;
        }

        console.log("GET por id falló. Intentando cargar todos los posts y buscar coincidencia...");
        const all = await tryGetAllPosts();
        const found = all.find((p: Post) => String(p.id) === String(routeId));
        if (found) {
          setPost(found);
          if (found.userId != null) {
            try {
              const userRes = await axios.get(`${API_URL}/users/${encodeURIComponent(String(found.userId))}`);
              setUser(userRes.data);
            } catch {
              const local = getLocalCurrentUser();
              if (local && String(local.id) === String(found.userId)) setUser(local);
              else setUser(null);
            }
          }
          setLoading(false);
          return;
        }

        console.warn("Publicación no encontrada con ID:", routeId);
        console.warn("Artwork no encontrado");
        setPost(null);
      } catch (err) {
        console.error("Error fetching post:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    loadPostData();
  }, [routeId, API_URL]);

  const handleAddComment = async () => {
    if (!commentText.trim() || !post) return;
    const newComment: CommentItem = {
      id: Date.now(),
      author: getLocalCurrentUser()?.email || "Usuario Actual",
      text: commentText.trim(),
      createdAt: new Date().toISOString()
    };
    const updatedComments = [...(post.comments || []), newComment];
    const updatedPost = { ...post, comments: updatedComments };
    try {
      await tryPatchPost(post.id, { comments: updatedComments });
      setPost(updatedPost);
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("No se pudo guardar el comentario. Revisa el backend.");
    }
  };

  const handleLike = async () => {
    if (!post) return;
    const updatedLikes = (post.likes || 0) + 1;
    const updatedPost = { ...post, likes: updatedLikes };
    try {
      await tryPatchPost(post.id, { likes: updatedLikes });
      setPost(updatedPost);
    } catch (err) {
      console.error("Error liking post:", err);
      alert("No se pudo registrar el like. Revisa el backend.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando publicación...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Publicación no encontrada</p>
      </div>
    );
  }

  const authorLabel = user?.name || user?.username || user?.email || "Usuario Anónimo";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={authorLabel}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                {String(authorLabel).charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-800">{authorLabel}</h3>
              {post.createdAt && (
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {post.title && <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>}

          <div className="mb-6 rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt={post.title || "Publicación"}
              className="w-full h-auto max-h-96 object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Imagen+no+disponible";
              }}
            />
          </div>

          {post.description && <div className="mb-6"><p className="text-gray-700 leading-relaxed">{post.description}</p></div>}

          {post.tags && post.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-6">
            <div className="flex items-center space-x-6">
              <button onClick={handleLike} className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                <span className="text-2xl">❤️</span>
                <span>{post.likes || 0} me gusta</span>
              </button>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-2xl">💬</span>
                <span>{(post.comments || []).length} comentarios</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Comentarios ({(post.comments || []).length})</h3>

            <div className="mb-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Añade un comentario..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Comentar
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {(post.comments || []).map((comment) => (
                <div key={String(comment.id)} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-800">{comment.author}</span>
                    <span className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString("es-ES")}</span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}

              {(post.comments || []).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}