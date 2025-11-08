import { useState } from "react";
import type { Post } from "../types/posts";

interface Props {
  post: Post;
  onAddComment: (postId: number, text: string) => void;
}

const Comments: React.FC<Props> = ({ post, onAddComment }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment(post.id, text.trim()); // 👈 llama la función que viene desde Boards
    setText("");
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
        {post.comments.map((c) => (
          <div
            key={c.id}
            className="bg-gray-100 rounded p-2 text-sm border border-gray-200"
          >
            <p className="font-medium text-gray-800">{c.author}</p>
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
          className="flex-1 border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Comments;
