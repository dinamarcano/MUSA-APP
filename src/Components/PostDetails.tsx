// src/Components/PostDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import { useAuth } from "../AuthContext";
import { toggleLike } from "../utils/supabaseLikes";

interface UiComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface UiPost {
  id: string;
  userId: string;
  image: string;
  title?: string;
  description?: string;
  tags?: string[];
  createdAt?: string;
}

interface UiUser {
  id: string;
  name?: string;
  username?: string;
  avatar?: string;
  email?: string;
}

const PostDetails: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const { user: authUser } = useAuth();

  const [post, setPost] = useState<UiPost | null>(null);
  const [author, setAuthor] = useState<UiUser | null>(null);
  const [comments, setComments] = useState<UiComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [likes, setLikes] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [loading, setLoading] = useState(true);

  const canDelete = authUser && post && authUser.id === post.userId;

  // ---------- helpers de carga ----------
  const loadPost = async (id: string) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      id: data.id,
      userId: data.user_id,
      image: data.image_url,
      title: data.title ?? "",
      description: data.description ?? "",
      tags: data.tags ?? [],
      createdAt: data.created_at ?? undefined,
    } as UiPost;
  };

  const loadAuthor = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,name,username,avatar,email")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      id: data.id,
      name: data.name ?? undefined,
      username: data.username ?? undefined,
      avatar: data.avatar ?? undefined,
      email: data.email ?? undefined,
    } as UiUser;
  };

  const loadComments = async (id: string) => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", id)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((r: any) => ({
      id: r.id,
      author: r.author_name ?? "Usuario",
      text: r.text,
      createdAt: r.created_at,
    })) as UiComment[];
  };

  const loadLikeState = async (id: string, userId?: string) => {
    const { count, error } = await supabase
      .from("post_likes")
      .select("*", { head: true, count: "exact" })
      .eq("post_id", id);
    if (error) throw error;
    setLikes(count ?? 0);

    if (userId) {
      const { data: likeRow, error: findErr } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", id)
        .eq("user_id", userId)
        .maybeSingle();
      if (findErr && (findErr as any).code !== "PGRST116") throw findErr;
      setLikedByMe(!!likeRow);
    }
  };

  const handleDelete = async () => {
    if (!post || !authUser) return;
    if (!window.confirm("¿Seguro que quieres borrar esta publicación?")) return;

    try {
      await supabase.from("posts").delete().eq("id", post.id);
      // si tienes ON DELETE CASCADE en comments/post_likes, se limpian solos
      navigate("/"); // o navigate(-1) o navigate("/dashboard");
    } catch (e) {
      console.error("Error borrando post", e);
      alert("No se pudo borrar la publicación.");
    }
  };

  // en el JSX, en la barra de acciones (donde está like/comentarios):
  <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-6">
    <div className="flex items-center space-x-6">
      {/* botón de like igual que antes */}
    </div>
    {canDelete && (
      <button
        onClick={handleDelete}
        className="px-3 py-1 rounded bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200"
      >
        Borrar post
      </button>
    )}
  </div>;

// ---------- efecto de carga ----------
useEffect(() => {
  const run = async () => {
    if (!postId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const p = await loadPost(postId);
      if (!p) {
        setPost(null);
        setLoading(false);
        return;
      }
      setPost(p);

      const [u, cs] = await Promise.all([
        loadAuthor(p.userId).catch(() => null),
        loadComments(p.id),
      ]);
      setAuthor(u);
      setComments(cs);
      await loadLikeState(p.id, authUser?.id);
    } catch (e) {
      console.error("Error cargando detalle de post", e);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };
  run();
}, [postId, authUser?.id]);

// ---------- acciones ----------
const handleAddComment = async () => {
  if (!post || !authUser) {
    alert("Inicia sesión para comentar.");
    return;
  }
  if (!commentText.trim()) return;

  const text = commentText.trim();
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: post.id,
        user_id: authUser.id,
        author_name: authUser.email ?? "Usuario",
        text,
      })
      .select()
      .single(); // v2: insert + select para devolver la fila [web:119][web:120]
    if (error || !data) throw error;

    const newComment: UiComment = {
      id: data.id,
      author: data.author_name ?? "Usuario",
      text: data.text,
      createdAt: data.created_at,
    };
    setComments((prev) => [...prev, newComment]);
    setCommentText("");
  } catch (e) {
    console.error("Error agregando comentario", e);
    alert("No se pudo guardar el comentario.");
  }
};

const handleLikeClick = async () => {
  if (!post || !authUser) {
    alert("Inicia sesión para dar like.");
    return;
  }
  try {
    // opcional: update optimista
    setLikedByMe((prev) => !prev);
    setLikes((prev) => Math.max(prev + (likedByMe ? -1 : 1), 0));

    const updated = await toggleLike(post.id, authUser.id);
    setLikes(updated.count);
    setLikedByMe(updated.likedByUser);
  } catch (e) {
    console.error("Error alternando like", e);
    alert("No se pudo actualizar el like.");
  }
};

// ---------- render ----------
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

const authorLabel =
  author?.name || author?.username || author?.email || "Usuario Anónimo";

return (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header autor */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {author?.avatar ? (
            <img
              src={author.avatar}
              alt={authorLabel}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
              {authorLabel.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-800">{authorLabel}</h3>
            {post.createdAt && (
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {post.title && (
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {post.title}
          </h1>
        )}

        <div className="mb-6 rounded-lg overflow-hidden">
          <img
            src={post.image}
            alt={post.title || "Publicación"}
            className="w-full h-auto max-h-96 object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Imagen+no+disponible";
            }}
          />
        </div>

        {post.description && (
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">
              {post.description}
            </p>
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Likes y conteo de comentarios */}
        <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-6">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLikeClick}
              className={`flex items-center space-x-2 transition-colors ${likedByMe ? "text-red-600" : "text-gray-600 hover:text-red-600"
                }`}
            >
              <span className="text-2xl">{likedByMe ? "❤️" : "🤍"}</span>
              <span>{likes} me gusta</span>
            </button>
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-2xl">💬</span>
              <span>{comments.length} comentarios</span>
            </div>
          </div>
        </div>

        {/* Comentarios */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Comentarios ({comments.length})
          </h3>

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
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="border-b border-gray-100 pb-4 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-800">
                    {comment.author}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString("es-ES")}
                  </span>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))}

            {comments.length === 0 && (
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
};

export default PostDetails;
