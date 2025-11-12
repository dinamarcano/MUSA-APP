import { useMemo, useState } from "react";
import type { Post } from "../types/posts";

interface Props {
  post: Post;
  onAddComment: (postId: number, text: string) => Promise<void>;
  onDeleteComment: (
    postId: number,
    commentId: Post["comments"][number]["id"]
  ) => Promise<void>;
}

const Comments: React.FC<Props> = ({ post, onAddComment, onDeleteComment }) => {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<
    Post["comments"][number]["id"] | null
  >(null);

  const formattedComments = useMemo(() => {
    return post.comments.map((comment) => {
      const date = comment.createdAt ? new Date(comment.createdAt) : null;
      const formattedTime =
        date && !Number.isNaN(date.getTime())
          ? date.toLocaleString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "short",
            })
          : null;
      return { ...comment, formattedTime };
    });
  }, [post.comments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onAddComment(post.id, text.trim());
      setText("");
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (
    commentId: Post["comments"][number]["id"]
  ) => {
    if (deletingId !== null) return;
    setDeletingId(commentId);
    try {
      await onDeleteComment(post.id, commentId);
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      alert("Error al eliminar el comentario. Intenta nuevamente.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-4 border-t pt-3">
      <h4 className="font-semibold mb-2">
        Comentarios ({post.comments.length})
      </h4>

      {/* Lista de comentarios */}
      <div className="space-y-2 mb-3 max-h-60 overflow-y-auto">
        {post.comments.length === 0 && (
          <p className="text-sm text-gray-500">Aún no hay comentarios.</p>
        )}
        {formattedComments.map((c) => (
          <div
            key={c.id}
            className="bg-gray-100 rounded p-2 text-sm border border-gray-200"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-gray-800">{c.author}</p>
                {c.formattedTime && (
                  <p className="text-xs text-gray-500">{c.formattedTime}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                disabled={deletingId === c.id}
                className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                aria-label="Eliminar comentario"
              >
                {deletingId === c.id ? "..." : "✕"}
              </button>
            </div>
            <p className="text-gray-600">{c.text}</p>
          </div>
        ))}
      </div>

      {/* Formulario para comentar */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un comentario..."
          disabled={isSubmitting}
          className="flex-1 border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
};

export default Comments;