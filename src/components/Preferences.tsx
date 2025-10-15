import React from "react";

const categories = [
  { name: "Pintura", img: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Oil_painting_landscape.jpg" },
  { name: "Cubismo", img: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Cubism_painting.jpg" },
  { name: "Arte Abstracto", img: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Abstract_art.jpg" },
  { name: "Surrealismo", img: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Surrealist_painting.jpg" },
  { name: "Barroco", img: "https://upload.wikimedia.org/wikipedia/commons/8/88/Baroque_painting.jpg" },
  { name: "Street Art", img: "https://upload.wikimedia.org/wikipedia/commons/9/92/Street_art_mural.jpg" },
  { name: "Pop Art", img: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Pop_art.jpg" },
  { name: "Rococó", img: "https://upload.wikimedia.org/wikipedia/commons/9/91/Rococo_painting.jpg" },
  { name: "Minimalismo", img: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Minimalist_art.jpg" },
];

export default function Preferences() {
  return (
    <section className="text-center">
      <h2 className="text-2xl font-bold mb-2">Personaliza tus gustos</h2>
      <p className="text-gray-500 mb-6">El arte se vive mejor en comunidad</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div
            key={c.name}
            className="cursor-pointer hover:scale-105 transition-transform rounded-xl overflow-hidden shadow-md"
          >
            <img src={c.img} alt={c.name} className="h-40 w-full object-cover" />
            <p className="py-2 font-semibold">{c.name}</p>
          </div>
        ))}
      </div>

      <button className="bg-red-700 text-white px-6 py-2 rounded-full mt-8 hover:bg-red-800">
        Continuar
      </button>
    </section>
  );
}
