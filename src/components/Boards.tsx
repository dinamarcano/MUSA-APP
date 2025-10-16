
const artworks = [
  "https://upload.wikimedia.org/wikipedia/commons/b/b4/Vincent_Willem_van_Gogh_128.jpg",
  "https://i.pinimg.com/736x/95/5d/7b/955d7bc13fccbc8da479b178772a74f9.jpg",
  "https://i.pinimg.com/736x/99/27/5b/99275b999fa4411b1c05b6657ac887d1.jpg",
  "https://i.pinimg.com/1200x/ab/39/09/ab3909fbc7bdfe1edd352124948aaf1c.jpg",
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
