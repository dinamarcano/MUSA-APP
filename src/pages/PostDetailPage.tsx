// PostDetails.tsx (versión usando Supabase)
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase  from "../supabaseClient";      // ajusta la ruta si es necesario
import { useAuth } from "../AuthContext";          // ajusta la ruta si es necesario

interface CommentItem {
  id: string;
  author: string;
  text: string;
  createdAt: string;
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
  comments?: CommentItem[];
}

interface User {
  id: string;
  name?: string;
  username?: string;
  avatar?: string;
  email?: string;
}

const PostDetailPage: React.FC = () => {
  const params = useParams();
  const routeId =
    (params as any).postId ??
    (params as any).id ??
    (params as any).post ??
    (params as any).artId ??
    null;

  const { user: authUser } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  // Mapeo de fila de Supabase a la forma que espera la UI actual
  const mapPostRowToPost = (row: any): Post => ({
    id: row.id,
    userId: row.user_id,
    image: row.image_url,
    title: row.title ?? "",
    description: row.description ?? "",
    tags: row.tags ?? [],
    createdAt: row.created_at,
    likes: row.likes_count ?? 0,
    comments: [],
  });

  const mapCommentRowToComment = (row: any): CommentItem => ({
    id: row.id,
    author: row.author_name ?? "Usuario",
    text: row.text,
    createdAt: row.created_at,
  });

  useEffect(() => {
    const loadPostData = async () => {
      setLoading(true);

      if (!routeId) {
        console.warn(
          "No se recibió id de ruta (routeId es null). Revisa la ruta en App.tsx"
        );
        setLoading(false);
        return;
      }

      try {
        // 1. Obtener el post desde Supabase
        const { data: postRow, error: postError } = await supabase
          .from("posts")
          .select("*")
          .eq("id", routeId)
          .single();

        if (postError || !postRow) {
          console.warn("Publicación no encontrada con ID:", routeId, postError);
          setPost(null);
          setLoading(false);
          return;
        }

        const mappedPost = mapPostRowToPost(postRow);
        setPost(mappedPost);

        // 2. Obtener el usuario/autor del post desde profiles
        if (postRow.user_id) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", postRow.user_id)
            .maybeSingle();

          if (!profileError && profile) {
            setUser({
              id: profile.id,
              name: profile.name ?? undefined,
              username: profile.username ?? undefined,
              avatar: profile.avatar ?? undefined,
              email: profile.email ?? undefined,
            });
          } else {
            setUser(null);
          }
        }

        // 3. Obtener comentarios del post
        const { data: commentRows, error: commentsError } = await supabase
          .from("comments")
          .select("*")
          .eq("post_id", postRow.id)
          .order("created_at", { ascending: true });

        if (!commentsError && commentRows) {
          const mappedComments = commentRows.map(mapCommentRowToComment);
          setPost((prev) =>
            prev ? { ...prev, comments: mappedComments } : prev
          );
        }
      } catch (err) {
        console.error("Error fetching post desde Supabase:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    loadPostData();
  }, [routeId]);

  const handleAddComment = async () => {
    if (!commentText.trim() || !post || !authUser) return;

    try {
      const authorLabel =
        user?.username || user?.name || authUser.email || "Usuario actual";

      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: post.id,
          user_id: authUser.id,
          author_name: authorLabel,
          text: commentText.trim(),
        })
        .select()
        .single();

      if (error || !data) throw error;

      const newComment = mapCommentRowToComment(data);

      setPost((prev) =>
        prev
          ? { ...prev, comments: [...(prev.comments || []), newComment] }
          : prev
      );
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("No se pudo guardar el comentario. Revisa Supabase.");
    }
  };

  const handleLike = async () => {
    if (!post || !authUser) return;

    try {
      // Ver si el usuario ya ha dado like
      const { data: existing, error: likeError } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", post.id)
        .eq("user_id", authUser.id)
        .maybeSingle();

      if (likeError && likeError.code !== "PGRST116") {
        throw likeError;
      }

      if (existing) {
        // Ya había like -> quitar
        await supabase.from("post_likes").delete().eq("id", existing.id);
      } else {
        // No había like -> agregar
        await supabase
          .from("post_likes")
          .insert({ post_id: post.id, user_id: authUser.id });
      }

      // Leer likes_count actualizado (idealmente mantenido por trigger)
      const { data: postRow, error: postError } = await supabase
        .from("posts")
        .select("likes_count")
        .eq("id", post.id)
        .single();

      if (postError || !postRow) throw postError;

      setPost((prev) =>
        prev ? { ...prev, likes: postRow.likes_count ?? 0 } : prev
      );
    } catch (err) {
      console.error("Error liking post:", err);
      alert("No se pudo registrar el like. Revisa Supabase.");
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

  const authorLabel =
    user?.name || user?.username || user?.email || "Usuario Anónimo";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Cabecera autor */}
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
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contenido principal */}
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
                e.currentTarget.src =
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

          {/* Likes y contador de comentarios */}
          <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-6">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                disabled={!authUser}
              >
                <span className="text-2xl">❤️</span>
                <span>{post.likes || 0} me gusta</span>
              </button>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-2xl">💬</span>
                <span>{(post.comments || []).length} comentarios</span>
              </div>
            </div>
          </div>

          {/* Comentarios */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Comentarios ({(post.comments || []).length})
            </h3>

            {/* Caja para añadir comentario */}
            {authUser && (
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
            )}

            {/* Lista de comentarios */}
            <div className="space-y-4">
              {(post.comments || []).map((comment) => (
                <div
                  key={String(comment.id)}
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
};

export default PostDetailPage;
