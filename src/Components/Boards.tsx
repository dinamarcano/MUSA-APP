import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Comments from "./Comments";
import { getPosts, type UiPost } from "../utils/supabasePosts";
import {
  getAllComments,
  addComment as addCommentApi,
  deleteComment as deleteCommentApi,
} from "../utils/supabaseComments";
import { toggleLike, getAllLikes } from "../utils/supabaseLikes";

type PostForUI = UiPost;

export default function Board() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [posts, setPosts] = useState<PostForUI[]>([]);
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState<Set<string>>(new Set());

  const handleLike = async (postId: string) => {
    if (!authUser) return alert("Inicia sesión para dar like.");
    if (liking.has(postId)) return;              // guard
    setLiking(prev => new Set(prev).add(postId));

    let prevLiked = false, prevCount = 0;
    // Optimista
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      prevLiked = !!p.likedByMe; prevCount = p.likes ?? 0;
      const nextLiked = !prevLiked;
      const nextCount = Math.max(prevCount + (nextLiked ? 1 : -1), 0);
      return { ...p, likedByMe: nextLiked, likes: nextCount };
    }));

    try {
      console.debug("before", { prevLiked, prevCount });
      const updated = await toggleLike(postId, authUser.id);
      console.debug("after", updated);
      setPosts(prev => prev.map(p => p.id === postId
        ? { ...p, likes: updated.count, likedByMe: updated.likedByUser }
        : p));
    } catch (e) {
      // Revertir si backend falló (síntoma de RLS/trigger)
      setPosts(prev => prev.map(p => p.id === postId
        ? { ...p, likedByMe: prevLiked, likes: prevCount }
        : p));
    } finally {
      setLiking(prev => { const s = new Set(prev); s.delete(postId); return s; });
    }
  };


  useEffect(() => {
    const load = async () => {
      try {
        const feed = await getPosts();                       // posts de Supabase
        const byPost = await getAllComments();               // comentarios agrupados
        const likesMap = await getAllLikes(authUser?.id);    // { postId: {count, likedByUser} }

        const merged = feed.map((p) => {
          const like = likesMap[p.id] ?? { count: 0, likedByUser: false };
          return {
            ...p,
            likes: like.count,
            likedByMe: like.likedByUser,
            comments: byPost[p.id] ?? [],
          };
        });

        setPosts(merged);
      } catch (e) {
        console.error("Error cargando feed", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authUser?.id]);

  const displayName = () => authUser?.email ?? "Usuario";

  const handleAddComment = async (postId: string, text: string) => {
    if (!authUser) {
      alert("Inicia sesión para comentar.");
      return;
    }
    try {
      const newComment = await addCommentApi(postId, authUser.id, displayName(), text);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
        )
      );
    } catch (e) {
      console.error("Error al agregar comentario", e);
      alert("No se pudo agregar el comentario.");
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string | number) => {
    try {
      await deleteCommentApi(commentId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, comments: p.comments.filter((c: any) => String(c.id) !== String(commentId)) }
            : p
        )
      );
    } catch (e) {
      console.error("Error al eliminar comentario", e);
      alert("No se pudo eliminar el comentario.");
    }
  };

  const toDetail = (postId: string) => {
    navigate(`/post/profile/${postId}`);
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-8">Mis obras</h2>
        <div>Cargando...</div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-8">Mis obras</h2>

      {posts.length === 0 ? (
        <div className="text-gray-600">Aún no hay publicaciones.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((p) => {
            // Adaptación mínima al tipo esperado por Comments
            const postForComments = {
              id: p.id,
              image: p.image,
              title: p.title ?? "",
              description: p.description ?? "",
              author: "", // si necesitas, consulta profiles
              likes: p.likes,
              likedByMe: !!p.likedByMe,
              comments: p.comments,
            };

            return (
              <article
                key={p.id}
                className="relative bg-white rounded-2xl shadow-lg p-4 overflow-hidden group"
              >
                <img
                  src={p.image}
                  alt={p.title || `post-${p.id}`}
                  className="w-full h-72 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => toDetail(p.id)}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Imagen+no+disponible";
                  }}
                />

                <div className="mt-3 relative z-10">
                  <h3 className="text-lg font-semibold">{p.title || "Sin título"}</h3>
                  {p.description && (
                    <p className="text-gray-600 text-sm mb-2">{p.description}</p>
                  )}

                  <div className="flex items-center gap-3 mb-2">
                    <button
                      onClick={() => handleLike(p.id)}
                      className={`z-10 relative flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${p.likedByMe ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {p.likedByMe ? "❤️" : "🤍"} {p.likes}
                    </button>

                    <button
                      onClick={() => setOpenComments(openComments === p.id ? null : p.id)}
                      className="z-10 relative flex items-center gap-1 px-3 py-1 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      💬 Comentar
                    </button>
                  </div>

                  {openComments === p.id && (
                    <Comments
                      post={postForComments as any}
                      onAddComment={(id, text) => handleAddComment(String(id), text)}
                      onDeleteComment={(id, cId) => handleDeleteComment(String(id), cId)}
                    />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
