import React from "react";

const artworks = [
  "https://upload.wikimedia.org/wikipedia/commons/5/57/Vincent_van_Gogh_-_Caf%C3%A9_Terrace_at_Night.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/5/5f/Vincent_van_Gogh_-_Sunflowers_-_VGM_F458.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/0/0a/Starry_Night_Over_the_Rhone.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/6/6b/Pop_art_portrait.jpg",
];

export default function Board() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Mis obras favoritas</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {artworks.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`obra-${i}`}
            className="rounded-xl hover:scale-105 transition-transform shadow-md"
          />
        ))}
        <div className="flex items-center justify-center bg-gray-100 rounded-xl cursor-pointer text-4xl font-bold text-gray-400 hover:text-red-600">
          +
        </div>
      </div>
    </section>
  );
}
