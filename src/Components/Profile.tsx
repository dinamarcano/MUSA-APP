
const posts = [
  "https://upload.wikimedia.org/wikipedia/commons/3/3a/Abstract_painting_colorful.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/4/4e/Oil_painting_hands.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/2/28/Rembrandt_-_Self-portrait_with_two_circles.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/9/9a/Cat_in_water_painting.jpg",
];

export default function Profile() {
  return (
    <section className="text-center">
      <img
        src="https://randomuser.me/api/portraits/women/65.jpg"
        alt="perfil"
        className="w-32 h-32 rounded-full mx-auto mb-3 shadow-md"
      />
      <h2 className="font-bold text-xl">María González</h2>
      <p className="text-gray-500">@Mag254</p>
      <button className="bg-red-700 text-white px-4 py-1 rounded-full mt-3 hover:bg-red-800">
        Editar perfil
      </button>

      <div className="flex justify-center gap-6 mt-6 font-semibold">
        <span className="border-b-2 border-red-600">Publicaciones</span>
        <span>Guardados</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {posts.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`obra-${i}`}
            className="rounded-xl hover:scale-105 transition-transform shadow-md"
          />
        ))}
      </div>
    </section>
  );
}
