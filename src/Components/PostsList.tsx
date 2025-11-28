import React, { useEffect, useState } from "react";
import { getPosts, createPost, toggleLike, type UiPost } from "../utils/supabasePosts";

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<UiPost[]>([]);
  const [form, setForm] = useState({
    title: "",
    image: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (e) {
        console.error("Error cargando feed", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.image) return alert("Completa al menos título e imagen.");
    try {
      const created = await createPost({
        image: form.image,
        title: form.title,
        description: form.description,
      });
      setPosts((prev) => [created, ...prev]);
      setForm({ title: "", image: "", description: "" });
    } catch (err) {
      console.error("Error creando post", err);
      alert("No se pudo crear el post.");
    }
  };

  const handleLike = async (post: UiPost) => {
    try {
      const updated = await toggleLike(post);
      setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
    } catch (err) {
      console.error("Error alternando like", err);
      alert("No se pudo actualizar el like.");
    }
  };

  if (loading) {
    return <div className="p-4">Cargando feed...</div>;
  }

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((p) => (
          <article key={p.id} className="bg-white rounded shadow p-3">
            <img
              src={p.image}
              alt={p.title}
              className="rounded w-full h-56 object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Imagen+no+disponible";
              }}
            />
            <h3 className="text-lg font-semibold mt-2">{p.title}</h3>
            {p.description && (
              <p className="text-sm text-gray-600">{p.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <button onClick={() => handleLike(p)}>
                {p.likedByMe ? "💖" : "🤍"} {p.likes}
              </button>
            </div>
          </article>
        ))}
        {posts.length === 0 && (
          <div className="text-gray-600">Aún no hay publicaciones.</div>
        )}
      </div>
    </div>
  );
};

export default PostsList;
