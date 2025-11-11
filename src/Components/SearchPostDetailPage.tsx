
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiHeart, HiArrowLeft, HiChatAlt } from 'react-icons/hi';


const searchImageDatabase: Record<number, any> = {
  1: {
    id: 1,
    title: "Cómic Superhéroe",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800",
    artist: "Artista Cómic",
    description: "Obra de arte de cómic featuring superhéroes"
  },
  2: {
    id: 2,
    title: "Personaje Manga", 
    image: "https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=800",
    artist: "Mangaka",
    description: "Personaje de manga estilo japonés"
  },
  3: {
    id: 3,
    title: "Viñeta Cómic",
    image: "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=800",
    artist: "Ilustrador",
    description: "Viñeta de cómic tradicional"
  },
  4: {
    id: 4,
    title: "Grafiti Urbano",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800", 
    artist: "Artista Urbano",
    description: "Arte de grafiti en pared urbana"
  },
  5: {
    id: 5,
    title: "Arte Callejero",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800",
    artist: "Grafitero", 
    description: "Expresión artística callejera"
  },
  6: {
    id: 6,
    title: "Diseño Moderno",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    artist: "Diseñador Gráfico",
    description: "Diseño gráfico contemporáneo"
  },
  7: {
    id: 7, 
    title: "Tipografía Creativa",
    image: "https://images.unsplash.com/photo-1586339949216-35c2747cc36d?w=800",
    artist: "Tipógrafo",
    description: "Arte tipográfico innovador"
  },
  8: {
    id: 8,
    title: "Arte Callejero",
    image: "https://images.unsplash.com/photo-1550482768-3148e430efc8?w=800",
    artist: "Artista Callejero",
    description: "Expresión artística urbana"
  },
  9: {
    id: 9,
    title: "Sketch a Lápiz", 
    image: "https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=800",
    artist: "Dibujante",
    description: "Boceto a lápiz detallado"
  },
  10: {
    id: 10,
    title: "Criatura Fantástica",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
    artist: "Artista Fantástico",
    description: "Criatura de fantasía mitológica"
  }
};

const SearchPostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    setTimeout(() => {
      if (id) {
        const foundArtwork = searchImageDatabase[parseInt(id)];
        setArtwork(foundArtwork);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleBack = () => navigate(-1);

  const handleAuthorClick = () => {
    if (artwork) {
      
      alert(`Navegando al perfil de ${artwork.artist}`);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-gray-600">Cargando...</div></div>;
  if (!artwork) return <div className="flex items-center justify-center min-h-screen"><div className="text-gray-600">Publicación no encontrada</div></div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button onClick={handleBack} className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
            <HiArrowLeft className="w-6 h-6" />
            <span className="font-medium">Atrás</span>
          </button>
          <div className="text-xl font-bold text-gray-900">MUSA</div>
          <div className="w-6"></div>
        </div>
      </header>

      <main className="flex flex-1">
        <aside className="w-16 bg-white border-r border-gray-200 hidden md:block" />
        <section className="flex-1 max-w-4xl mx-auto p-4 md:p-8 w-full">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative">
              <img 
                src={artwork.image} 
                alt={artwork.title} 
                className="w-full h-auto max-h-[600px] object-contain bg-gray-100"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={handleAuthorClick}>
                <img 
                  src="https://static.vecteezy.com/system/resources/previews/034/371/675/non_2x/person-silhouette-icon-user-icon-vector.jpg" 
                  alt={artwork.artist} 
                  className="w-10 h-10 rounded-full border border-gray-300 object-cover" 
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{artwork.artist}</h3>
                  <p className="text-sm text-gray-500">Artista</p>
                </div>
              </div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{artwork.title}</h1>
                <p className="text-gray-600">{artwork.description}</p>
              </div>
              <div className="flex items-center space-x-6 border-t border-b border-gray-200 py-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-700">
                  <HiHeart className="w-5 h-5 text-red-500" />
                  <span className="font-medium">0 me gusta</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <HiChatAlt className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">0 comentarios</span>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  <HiHeart className="w-5 h-5" />
                  <span>Me gusta</span>
                </button>
                <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <HiChatAlt className="w-5 h-5" />
                  <span>Comentar</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40" />
    </div>
  );
};

export default SearchPostDetailPage;