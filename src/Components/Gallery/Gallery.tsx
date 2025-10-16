import React from 'react';
import { artworks } from '../../assets/data/artworks';
import ImageCard from '../ImageCard';

const Gallery: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {artworks.map((art) => (
        <ImageCard key={art.id} artwork={art} />
      ))}
    </div>
  );
};

export default Gallery;
