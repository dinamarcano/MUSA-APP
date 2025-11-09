import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiHeart, HiArrowLeft, HiChatAlt } from 'react-icons/hi';
import { artworks } from '../assets/data/artworks';
import { getCommentsByPostId, addComment as addCommentApi, initializeComments } from '../utils/commentsApi';
import { getLikesByPostId, toggleLike as toggleLikeApi, initializeLikes } from '../utils/likesApi';
import type { Comment } from '../types/posts';
import Comments from '../Components/Comments';
import type { Post } from '../types/posts';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(artworks.find(a => a.id.toString() === id));
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Cargar datos del artwork, comentarios y likes
  useEffect(() => {
    const loadPostData = async () => {
      try {
        // Inicializar comentarios y likes desde JSON
        await initializeComments();
        await initializeLikes();
        
        // Buscar el artwork por ID
        const foundArtwork = artworks.find(a => a.id.toString() === id);
        if (!foundArtwork) {
          console.error('Artwork no encontrado');
          return;
        }
        
        setArtwork(foundArtwork);
        
        // Cargar likes del post
        const likeData = await getLikesByPostId(id || '');
        setLikesCount(likeData.count);
        setLiked(likeData.likedByUser);
        
        // Cargar comentarios del post
        const postComments = await getCommentsByPostId(id || '');
        setComments(postComments);
      } catch (error) {
        console.error('Error al cargar datos del post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPostData();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAuthorClick = () => {
    if (artwork) {
      navigate(`/profile/${artwork.artist}`);
    }
  };

  const handleLike = async () => {
    try {
      if (!id) return;
      
      // Alternar like usando la API
      const newLikeState = await toggleLikeApi(id);
      
      // Actualizar el estado local
      setLiked(newLikeState.likedByUser);
      setLikesCount(newLikeState.count);
    } catch (error) {
      console.error('Error al alternar like:', error);
      alert("Error al actualizar el like. Por favor, intenta de nuevo.");
    }
  };

  const handleAddComment = async (postId: number, text: string) => {
    try {
      const newComment = await addCommentApi(postId, {
        author: "Usuario",
        text,
      });

      setComments(prev => [...prev, newComment]);
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      alert("Error al agregar el comentario. Por favor, intenta de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Publicación no encontrada</div>
      </div>
    );
  }

  // Crear objeto Post para el componente Comments
  const post: Post = {
    id: artwork.id,
    image: artwork.image,
    title: artwork.title,
    description: "",
    author: artwork.artist,
    likes: likesCount,
    likedByMe: liked,
    comments: comments,
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
          
          <div className="w-6"></div> 
        </div>
      </header>

      <main className="flex flex-1">
        <aside className="w-16 bg-white border-r border-gray-200 hidden md:block">
        </aside>

        {/* Contenido del post */}
        <section className="flex-1 max-w-4xl mx-auto p-4 md:p-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Imagen del post */}
            <div className="relative">
              <img 
                src={artwork.image} 
                alt={artwork.title}
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
                  src="https://static.vecteezy.com/system/resources/previews/034/371/675/non_2x/person-silhouette-icon-user-icon-vector.jpg" 
                  alt={artwork.artist}
                  className="w-10 h-10 rounded-full border border-gray-300"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{artwork.artist}</h3>
                  <p className="text-sm text-gray-500">Artista</p>
                </div>
              </div>

              {/* Título y descripción */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{artwork.title}</h1>
                <p className="text-gray-600">Obra de arte destacada</p>
              </div>

              {/* Estadísticas */}
              <div className="flex items-center space-x-6 border-t border-b border-gray-200 py-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-700">
                  <HiHeart className="w-5 h-5 text-red-500" />
                  <span className="font-medium">{likesCount} me gusta</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <HiChatAlt className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{comments.length} comentarios</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex space-x-4">
                <button 
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                    liked 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <HiHeart className="w-5 h-5" />
                  <span>{liked ? 'Te gusta' : 'Me gusta'}</span>
                </button>
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <HiChatAlt className="w-5 h-5" />
                  <span>Comentar</span>
                </button>
              </div>

              {/* Sección de comentarios */}
              {showComments && (
                <div className="mt-6">
                  <Comments post={post} onAddComment={handleAddComment} />
                </div>
              )}

              {/* Mostrar comentarios si no están en el componente Comments */}
              {!showComments && comments.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Comentarios ({comments.length})</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {comments.slice(0, 3).map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-800 text-sm mb-1">{comment.author}</p>
                        <p className="text-gray-600">{comment.text}</p>
                      </div>
                    ))}
                    {comments.length > 3 && (
                      <button 
                        onClick={() => setShowComments(true)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Ver todos los comentarios ({comments.length})
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation para móvil */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      </div>
    </div>
  );
};

export default PostDetail;
