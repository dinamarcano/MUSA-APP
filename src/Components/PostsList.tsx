import React, { useEffect, useState } from "react";
import { getPosts, createPost, toggleLike, updatePost } from "../utils/api";
import type { Post } from "../types/posts";
import Comments from "./Comments";

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState({
    title: "",
    image: "",
    description: "",
    author: "",
  });

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.image)
      return alert("Completa al menos título e imagen.");
    const newPost = await createPost(form);
    setPosts([newPost, ...posts]);
    setForm({ title: "", image: "", description: "", author: "" });
  };

  const handleLike = async (post: Post) => {
    const updated = await toggleLike(post);
    setPosts(posts.map((p) => (p.id === post.id ? updated : p)));
  };

  // 💬 Nueva función para manejar comentarios
  const handleAddComment = (postId: number, text: string) => {
    const updatedPosts = posts.map((p) =>
      p.id === postId
        ? {
            ...p,
            comments: [
              ...p.comments,
              {
                id: Date.now(),
                author: "Usuario",
                text,
                createdAt: new Date().toISOString(),
              },
            ],
          }
        : p
    );

    setPosts(updatedPosts);

    // ✅ Guardar el cambio en localStorage
    const updated = updatedPosts.find((p) => p.id === postId);
    if (updated) updatePost(updated);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Publicaciones</h2>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-4">
        <h4 className="font-semibold mb-2">Crear nueva obra</h4>
        <input
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-2"
        />
        <input
          name="image"
          placeholder="URL de la imagen"
          value={form.image}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-2"
        />
        <input
          name="author"
          placeholder="Autor"
          value={form.author}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-2"
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Publicar
        </button>
      </form>

      {/* Lista de publicaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((p) => (
          <article key={p.id} className="bg-white rounded shadow p-3">
            <img
              src={p.image}
              alt={p.title}
              className="rounded w-full h-56 object-cover"
            />
            <h3 className="text-lg font-semibold mt-2">{p.title}</h3>
            <p className="text-sm text-gray-600">{p.description}</p>

            <div className="flex items-center gap-3 mt-2">
              <button onClick={() => handleLike(p)}>
                {p.likedByMe ? "💖" : "🤍"} {p.likes}
              </button>
            </div>

            {/* ✅ Ahora Comments usa onAddComment */}
            <Comments post={p} onAddComment={handleAddComment} />
          </article>
        ))}
      </div>
    </div>
  );
};

export default PostsList;
