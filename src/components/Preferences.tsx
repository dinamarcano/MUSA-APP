import { useState } from "react";

const categories = [
  { name: "Pintura", img: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Vincent_Willem_van_Gogh_128.jpg" },
  { name: "Cubismo", img: "https://i.pinimg.com/736x/95/5d/7b/955d7bc13fccbc8da479b178772a74f9.jpg" },
  { name: "Arte Abstracto", img: "https://i.pinimg.com/736x/99/27/5b/99275b999fa4411b1c05b6657ac887d1.jpg" },
  { name: "Surrealismo", img: "https://img.wikioo.org/ADC/art.nsf/get_large_image_wikioo?Open&ra=5ZKGLP" },
  { name: "Barroco", img: "https://i.pinimg.com/736x/32/85/ce/3285ce2e048ca689d8eb9384528cacb1.jpg" },
  { name: "Street Art", img: "https://i.pinimg.com/1200x/24/5b/6b/245b6b5e8e41fb5767f9d1528697755e.jpg" },
  { name: "Pop Art", img: "https://i.pinimg.com/1200x/ab/39/09/ab3909fbc7bdfe1edd352124948aaf1c.jpg" },
  { name: "Rococó", img: "https://i.pinimg.com/1200x/27/a5/85/27a5850485833fa717741e680b2cf44a.jpg" },
  { name: "Minimalismo", img: "https://i.pinimg.com/736x/9b/0e/ab/9b0eabe006aceee3d00618c6c882bcd1.jpg" },
  { name: "Bauhaus", img: "https://i.pinimg.com/1200x/0f/1a/86/0f1a86e4e6792baf7d8f6544b18a7c21.jpg" },
];

export default function Preferences() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-white px-6 py-10">
      {/* Logo opcional arriba */}
      <div className="flex items-center justify-center mb-6">
      <img src="/logo.png" alt="Logo" className="w-20 h-20" />
      
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Personaliza tus gustos
      </h2>
      <p className="text-gray-500 mb-8">
        El arte se vive mejor en comunidad
      </p>

      {/* Cuadrícula de categorías */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl">
        {categories.map((c) => (
          <div
            key={c.name}
            onClick={() => toggleSelect(c.name)}
            className={`cursor-pointer rounded-2xl overflow-hidden shadow-md hover:scale-105 transform transition-all duration-300 border-4 ${
              selected.includes(c.name)
                ? "border-red-700"
                : "border-transparent"
            }`}
          >
            <img
              src={c.img}
              alt={c.name}
              className="h-40 w-full object-cover"
            />
            <p className="py-3 text-center font-semibold text-gray-800">
              {c.name}
            </p>
          </div>
        ))}
      </div>

      {/* Botón continuar */}
      <button
        className="bg-red-700 text-white px-8 py-3 rounded-full mt-10 hover:bg-red-800 transition-colors shadow-lg"
        onClick={() => alert(`Has seleccionado: ${selected.join(", ")}`)}
      >
        Continuar
      </button>
    </section>
  );
}
