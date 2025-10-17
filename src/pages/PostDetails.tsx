import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiHeart, HiArrowLeft, HiChatAlt } from 'react-icons/hi';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postData = {
    id: id,
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Vincent_Willem_van_Gogh_128.jpg",
    title: "Girasoles",
    description: "Una reinterpretación moderna de la obra clásica de Van Gogh",
    author: {
      name: "Daniele Gomez",
      avatar: "https://static.vecteezy.com/system/resources/previews/034/371/675/non_2x/person-silhouette-icon-user-icon-vector.jpg",
      followers: "1.2K seguidores"
    },
    likes: 245,
    comments: 36,
    publishedDate: "Publicado hace 2 días"
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAuthorClick = () => {
    navigate(`/profile/${postData.author.name}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <HiArrowLeft className="w-6 h-6" />
            <span className="font-medium">Atrás</span>
          </button>
          
          <div className="text-xl font-bold text-gray-900">MUSA</div>
          
          <div className="w-6"></div> {/* Espacio para balancear */}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-16 bg-white border-r border-gray-200 hidden md:block">
          {/* Tu componente Sidebar aquí */}
        </aside>

        {/* Contenido del post */}
        <section className="flex-1 max-w-4xl mx-auto p-4 md:p-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Imagen del post */}
            <div className="relative">
              <img 
                src={postData.image} 
                alt={postData.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Información del post */}
            <div className="p-6">
              {/* Autor */}
              <div 
                className="flex items-center space-x-3 mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={handleAuthorClick}
              >
                <img 
                  src={postData.author.avatar} 
                  alt={postData.author.name}
                  className="w-10 h-10 rounded-full border border-gray-300"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{postData.author.name}</h3>
                  <p className="text-sm text-gray-500">{postData.author.followers}</p>
                </div>
              </div>

              {/* Título y descripción */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{postData.title}</h1>
                <p className="text-gray-600">{postData.description}</p>
                <p className="text-sm text-gray-400 mt-2">{postData.publishedDate}</p>
              </div>

              {/* Estadísticas */}
              <div className="flex items-center space-x-6 border-t border-b border-gray-200 py-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-700">
                  <HiHeart className="w-5 h-5 text-red-500" />
                  <span className="font-medium">{postData.likes} me gusta</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <HiChatAlt className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{postData.comments} comentarios</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors">
                  <HiHeart className="w-5 h-5" />
                  <span>Me gusta</span>
                </button>
                <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <HiChatAlt className="w-5 h-5" />
                  <span>Comentar</span>
                </button>
              </div>

              {/* Sección de comentarios (puedes expandir esto) */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-4">Comentarios</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">¡Hermosa interpretación! Los colores son increíbles. 🎨</p>
                  </div>
                  {/* Más comentarios aquí */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation para móvil */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        {/* Tu bottom navigation aquí */}
      </div>
    </div>
  );
};

export default PostDetail;