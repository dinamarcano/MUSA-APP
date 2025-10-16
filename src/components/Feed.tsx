import React, { useState, useMemo } from "react";
import {
  HiHeart,
  HiChat,
  HiShare,
  HiUpload,
  HiLightBulb,
} from "react-icons/hi";

const Feed: React.FC = () => {
  const [newPost, setNewPost] = useState({
    image: "",
    description: "",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Camila Torres",
      username: "@camitorres",
      image:
        "https://images.unsplash.com/photo-1526481280690-0aaadf8ec2c8?auto=format&fit=crop&w=900&q=60",
      description: "Explorando colores y texturas en el arte urbano 🎨",
      caption: "Murales que transforman la ciudad con vida y movimiento.",
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
      caption: "Retratos modernos con luz natural.",
      likes: 189,
      comments: 15,
    },
  ]);

  // Subir imagen
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setNewPost({ ...newPost, image: url });
    }
  };

  // Publicar imagen
  const handlePostSubmit = () => {
    if (!newPost.image || !newPost.description.trim()) {
      alert("Por favor, sube una imagen y escribe una descripción.");
      return;
    }

    const newEntry = {
      id: posts.length + 1,
      author: "Tú 😎",
      username: "@francisco",
      image: newPost.image,
      description: newPost.description,
      caption: "Publicación reciente de tu galería.",
      likes: 0,
      comments: 0,
    };

    setPosts([newEntry, ...posts]);
    setNewPost({ image: "", description: "" });
    setPreview(null);
  };

  // 💡 Recomendaciones de publicaciones automáticas
  const recommendedPosts = useMemo(() => {
    if (!posts.length) return [];

    const lastDesc = posts[0].description.toLowerCase();

    if (lastDesc.includes("urbano") || lastDesc.includes("graffiti")) {
      return [
        {
          id: 101,
          author: "Laura Rivas",
          username: "@artelaura",
          image:
            "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=60",
          description: "Murales con mensajes sociales 🌍",
        },
        {
          id: 102,
          author: "David Muñoz",
          username: "@davmu",
          image:
            "https://images.unsplash.com/photo-1520975918318-3a4d57df7d1c?auto=format&fit=crop&w=900&q=60",
          description: "Graffiti experimental con colores neón ⚡",
        },
        {
          id: 103,
          author: "Nina Vega",
          username: "@ninavega",
          image:
            "https://images.unsplash.com/photo-1545156521-77bd85671d45?auto=format&fit=crop&w=900&q=60",
          description: "Paredes que cuentan historias urbanas 🏙️",
        },
      ];
    } else if (lastDesc.includes("retrato") || lastDesc.includes("rostro")) {
      return [
        {
          id: 201,
          author: "Carlos Mejía",
          username: "@cmejia",
          image:
            "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=900&q=60",
          description: "Retrato en estudio con luz cálida 🎭",
        },
        {
          id: 202,
          author: "Mariana Soto",
          username: "@mariso",
          image:
            "https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=900&q=60",
          description: "Ilustración digital de rostros emocionales 💫",
        },
        {
          id: 203,
          author: "Leo Garzón",
          username: "@leogar",
          image:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=60",
          description: "Fotografía de retrato en blanco y negro 🖤",
        },
      ];
    } else if (lastDesc.includes("naturaleza") || lastDesc.includes("paisaje")) {
      return [
        {
          id: 301,
          author: "Sofía Campos",
          username: "@sofiart",
          image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=60",
          description: "Paisajes que respiran tranquilidad 🍃",
        },
        {
          id: 302,
          author: "Tomás Rivera",
          username: "@tomi_rv",
          image:
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=60",
          description: "Montañas y cielos que inspiran libertad 🌄",
        },
        {
          id: 303,
          author: "Marta Valdés",
          username: "@valdesm",
          image:
            "https://images.unsplash.com/photo-1526481280690-0aaadf8ec2c8?auto=format&fit=crop&w=900&q=60",
          description: "Tonos verdes y bruma matutina 🌿",
        },
      ];
    } else {
      return [
        {
          id: 401,
          author: "Inés Lozano",
          username: "@ineslozano",
          image:
            "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=900&q=60",
          description: "Diseño experimental con tintas metálicas ✨",
        },
        {
          id: 402,
          author: "Felipe Duarte",
          username: "@fduarte",
          image:
            "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=900&q=60",
          description: "Composiciones inspiradas en el caos visual 🎨",
        },
        {
          id: 403,
          author: "Ana López",
          username: "@analpz",
          image:
            "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=900&q=60",
          description: "Arte digital con movimiento y color 💫",
        },
      ];
    }
  }, [posts]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* 🟢 Crear publicación */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <HiUpload className="text-blue-500" /> Nueva publicación
        </h2>

        {preview ? (
          <img
            src={preview}
            alt="Vista previa"
            className="w-full h-64 object-cover rounded-xl mb-3"
          />
        ) : (
          <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <p className="text-gray-500">Haz clic para subir una imagen</p>
          </label>
        )}

        <textarea
          placeholder="Escribe una descripción..."
          value={newPost.description}
          onChange={(e) =>
            setNewPost({ ...newPost, description: e.target.value })
          }
          className="w-full mt-3 border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
        ></textarea>

        <button
          onClick={handlePostSubmit}
          className="mt-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-xl transition"
        >
          Publicar
        </button>
      </div>

      {/* 🔵 Feed principal */}
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
        >
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

          <img
            src={post.image}
            alt={post.description}
            className="w-full h-80 object-cover"
          />

          <div className="p-4">
            <p className="text-gray-700 text-sm mb-2">{post.description}</p>
            <p className="text-gray-500 text-xs italic mb-3">{post.caption}</p>

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

      {/* 💡 Más ideas (sugerencias visuales) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <HiLightBulb className="text-yellow-500" /> Más ideas para ti
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendedPosts.map((idea) => (
            <div
              key={idea.id}
              className="rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition bg-white"
            >
              <img
                src={idea.image}
                alt={idea.description}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <h4 className="text-sm font-semibold text-gray-800">
                  {idea.author}
                </h4>
                <p className="text-xs text-gray-500 mb-1">{idea.username}</p>
                <p className="text-gray-600 text-sm">{idea.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
