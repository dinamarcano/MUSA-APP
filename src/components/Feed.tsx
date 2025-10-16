import React from "react";
import { HiHeart, HiChat, HiShare } from "react-icons/hi";

const Feed: React.FC = () => {
  const posts = [
    {
      id: 1,
      author: "Camila Torres",
      username: "@camitorres",
      image:
        "https://images.unsplash.com/photo-1526481280690-0aaadf8ec2c8?auto=format&fit=crop&w=900&q=60",
      description: "Explorando colores y texturas en el arte urbano 🎨",
      likes: 245,
      comments: 32,
    },
    {
      id: 2,
      author: "Santiago Pérez",
      username: "@santipz",
      image:
        "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=900&q=60",
      description: "Inspirado en la energía de la ciudad ⚡",
      likes: 189,
      comments: 15,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4">
            <img
              src="https://static.vecteezy.com/system/resources/previews/034/371/675/non_2x/person-silhouette-icon-user-icon-vector.jpg"
              alt={post.author}
              className="w-10 h-10 rounded-full border border-gray-300"
            />
            <div>
              <h3 className="text-gray-900 font-semibold text-sm">
                {post.author}
              </h3>
              <p className="text-gray-500 text-xs">{post.username}</p>
            </div>
          </div>

          {/* Imagen */}
          <img
            src={post.image}
            alt={post.description}
            className="w-full h-80 object-cover"
          />

          {/* Descripción */}
          <div className="p-4">
            <p className="text-gray-700 text-sm mb-4">{post.description}</p>

            {/* Acciones */}
            <div className="flex items-center justify-between text-gray-600 text-sm">
              <div className="flex gap-6">
                <button className="flex items-center gap-1 hover:text-red-500 transition">
                  <HiHeart className="w-5 h-5" /> {post.likes}
                </button>
                <button className="flex items-center gap-1 hover:text-blue-500 transition">
                  <HiChat className="w-5 h-5" /> {post.comments}
                </button>
                <button className="flex items-center gap-1 hover:text-green-500 transition">
                  <HiShare className="w-5 h-5" /> Compartir
                </button>
              </div>
              <span className="text-xs text-gray-400">Hace 2h</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
