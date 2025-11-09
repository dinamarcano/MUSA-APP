import { useState, useEffect } from "react";
import { artworks as initialArtworks } from "../assets/data/artworks";
import Comments from "./Comments";
import type { Post } from "../types/posts";
import {
  getAllComments,
  addComment as addCommentApi,
  initializeComments,
} from "../utils/commentsApi";
import {
  getAllLikes,
  toggleLike as toggleLikeApi,
  initializeLikes,
} from "../utils/likesApi";

export default function Board() {
  const [artworks, setArtworks] = useState(
    initialArtworks.map((a) => ({
      ...a,
      comments: [], // Se cargarán desde comments.json
      likes: 0,
      likedByMe: false,
    }))
  );

  const [openComments, setOpenComments] = useState<number | null>(null);

  // Inicializar comentarios y likes al cargar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        // Inicializar comentarios y likes desde el JSON
        await initializeComments();
        await initializeLikes();
        
        // Cargar todos los comentarios y likes
        const allComments = await getAllComments();
        const allLikes = await getAllLikes();
        
        // Actualizar artworks con los comentarios y likes cargados
        setArtworks((prev) =>
          prev.map((a) => {
            const postIdStr = a.id.toString();
            const likeData = allLikes[postIdStr];
            return {
              ...a,
              comments: allComments[postIdStr] || [],
              likes: likeData?.count || 0,
              likedByMe: likeData?.likedByUser || false,
            };
          })
        );
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    loadData();
  }, []);

  // 💬 Agregar comentario usando axios
  const handleAddComment = async (artworkId: number, text: string) => {
    try {
      // Agregar comentario usando la API
      const newComment = await addCommentApi(artworkId, {
        author: "Usuario",
        text,
      });

      // Actualizar el estado local
      setArtworks((prev) =>
        prev.map((a) =>
          a.id === artworkId
            ? {
                ...a,
                comments: [...a.comments, newComment],
              }
            : a
        )
      );
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      alert("Error al agregar el comentario. Por favor, intenta de nuevo.");
    }
  };

  // ❤️ Likes usando la API
  const handleLike = async (id: number) => {
    try {
      // Alternar like usando la API
      const newLikeState = await toggleLikeApi(id);

      // Actualizar el estado local
      setArtworks((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                likedByMe: newLikeState.likedByUser,
                likes: newLikeState.count,
              }
            : a
        )
      );
    } catch (error) {
      console.error("Error al alternar like:", error);
      alert("Error al actualizar el like. Por favor, intenta de nuevo.");
    }
  };

  return (
    <section className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-8">Mis obras favoritas</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {artworks.map((a) => {
          // 👇 Declaramos explícitamente el tipo Post
          const post: Post = {
            id: a.id,
            image: a.image,
            title: a.title,
            description: "",
            author: a.artist,
            likes: a.likes,
            likedByMe: a.likedByMe,
            comments: a.comments,
          };

          return (
            <article
              key={a.id}
              className="relative bg-white rounded-2xl shadow-lg p-4 overflow-hidden"
            >
              {/* Imagen principal (no bloquea clics) */}
              <img
                src={a.image}
                alt={a.title}
                className="w-full h-72 object-cover rounded-2xl hover:scale-105 transition-transform duration-300 pointer-events-none"
              />

              {/* Capa hover visual (no intercepta clics) */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                <button className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors pointer-events-auto">
                  Ver detalles
                </button>
              </div>

              {/* Info de la obra */}
              <div className="mt-3 relative z-10">
                <h3 className="text-lg font-semibold">{a.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{a.artist}</p>

                {/* Botones de interacción */}
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => handleLike(a.id)}
                    className={`z-10 relative flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${
                      a.likedByMe
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {a.likedByMe ? "❤️" : "🤍"} {a.likes}
                  </button>

                  <button
                    onClick={() =>
                      setOpenComments(openComments === a.id ? null : a.id)
                    }
                    className="z-10 relative flex items-center gap-1 px-3 py-1 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    💬 Comentar
                  </button>
                </div>

                {/* Caja de comentarios */}
                {openComments === a.id && (
                  <Comments post={post} onAddComment={handleAddComment} />
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
