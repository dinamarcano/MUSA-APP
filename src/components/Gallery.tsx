import React from "react";
import { HiStar } from "react-icons/hi";

const Gallery: React.FC = () => {
  const highlights = [
    {
      id: 1,
      title: "Luz y Sombras",
      author: "Ana Gómez",
      image:
        "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 2,
      title: "Sueños en color",
      author: "Miguel Ramírez",
      image:
        "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 3,
      title: "Calle y Arte",
      author: "Valeria Ríos",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=60",
    },
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <HiStar className="text-yellow-500" /> Destacados
      </h2>

      {highlights.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-40 object-cover"
          />
          <div className="p-3">
            <h3 className="text-sm font-semibold text-gray-800">
              {item.title}
            </h3>
            <p className="text-xs text-gray-500">por {item.author}</p>
          </div>
        </div>
      ))}

      <div className="pt-4">
        <button className="w-full bg-blue-500 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-600 transition">
          Ver más
        </button>
      </div>
    </div>
  );
};

export default Gallery;
