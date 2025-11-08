import { useState } from "react";
import { artworks as initialArtworks } from "../assets/data/artworks";
import Comments from "./Comments";
import type { Post } from "../types/posts";

export default function Board() {
  const [artworks, setArtworks] = useState(
    initialArtworks.map((a) => ({
      ...a,
      comments: a.comments || [],
      likes: 0,
      likedByMe: false,
    }))
  );

  const [openComments, setOpenComments] = useState<number | null>(null);

  // 💬 Agregar comentario directamente
  const handleAddComment = (artworkId: number, text: string) => {
    setArtworks((prev) =>
      prev.map((a) =>
        a.id === artworkId
          ? {
              ...a,
              comments: [
                ...a.comments,
                {
                  id: Date.now(),
                  author: "Usuario",
                  text,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : a
      )
    );
  };

  // ❤️ Likes
  const handleLike = (id: number) => {
    setArtworks((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              likedByMe: !a.likedByMe,
              likes: a.likedByMe ? a.likes - 1 : a.likes + 1,
            }
          : a
      )
    );
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
