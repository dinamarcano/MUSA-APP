import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { getCommentsByArtwork, addArtworkComment, deleteArtworkComment, type UiArtworkComment } from "../utils/supabaseArtworksComments";
import { toggleArtworkLike, getArtworkLikeState } from "../utils/supabaseArtworksLikes";

interface ArtworkModalProps {
  open: boolean;
  onClose: () => void;
  artwork: { id: string; image: string; title?: string; description?: string };
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({ open, onClose, artwork }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<UiArtworkComment[]>([]);
  const [text, setText] = useState("");
  const [likes, setLikes] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!open) return;
      setLoading(true);
      try {
        const cs = await getCommentsByArtwork(artwork.id);
        setComments(cs);
        if (user) {
          const state = await getArtworkLikeState(artwork.id, user.id);
          setLikes(state.count);
          setLikedByMe(state.likedByUser);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, artwork.id, user]);

  const handleLike = async () => {
    if (!user) return alert("Inicia sesión para dar like.");
    const r = await toggleArtworkLike(artwork.id, user.id);
    setLikes(r.count);
    setLikedByMe(r.likedByUser);
  };

  const handleAdd = async () => {
    if (!user) return alert("Inicia sesión para comentar.");
    if (!text.trim()) return;
    const c = await addArtworkComment(artwork.id, user.id, user.email ?? "Usuario", text.trim());
    setComments((prev) => [...prev, c]);
    setText("");
  };

  const handleDelete = async (id: string | number) => {
    await deleteArtworkComment(id);
    setComments((prev) => prev.filter((c) => String(c.id) !== String(id)));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="bg-black/5">
            <img
              src={artwork.image}
              alt={artwork.title || `art-${artwork.id}`}
              className="w-full h-[70vh] object-contain bg-black"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Imagen+no+disponible";
              }}
            />
          </div>
          <div className="p-4 flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold">{artwork.title || "Sin título"}</h3>
                {artwork.description && (
                  <p className="text-sm text-gray-600">{artwork.description}</p>
                )}
              </div>
              <button onClick={onClose} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Cerrar</button>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={handleLike}
                className={`px-3 py-1 rounded text-sm ${likedByMe ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                {likedByMe ? "❤️" : "🤍"} {likes}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 border-t pt-3">
              {loading ? (
                <div>Cargando...</div>
              ) : comments.length === 0 ? (
                <div className="text-gray-500 text-sm">Sé el primero en comentar.</div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="border rounded p-2">
                    <div className="text-sm font-medium">{c.author}</div>
                    <div className="text-sm">{c.text}</div>
                    <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-xs text-red-600 hover:underline mt-1"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribe un comentario..."
                className="flex-1 border rounded px-3 py-2"
              />
              <button onClick={handleAdd} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkModal;
