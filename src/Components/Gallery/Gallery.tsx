import React from 'react';
import { useNavigate } from 'react-router-dom';
import { artworks } from '../../assets/data/artworks';
import ImageCard from '../ImageCard';

const Gallery: React.FC = () => {
  const navigate = useNavigate();

  const handleImageClick = (postId: string) => {
    navigate(`/post/${postId}`);

    
  };
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {artworks.map((art) => (
        <div key={art.id} onClick={() => handleImageClick(art.id)} style={{ cursor: 'pointer' }}>
          <ImageCard artwork={art} />
        </div>
      ))}
    </div>
  );
};

export default Gallery;

