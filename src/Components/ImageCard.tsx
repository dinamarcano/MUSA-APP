import React from 'react';
import { artworks, type Artwork } from '../assets/data/artworks';

interface Props {
  artwork: Artwork;
}

const ImageCard: React.FC<Props> = ({ artwork }) => {
  return (
    <div className="rounded overflow-hidden shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer">
      <img
        src={artwork.image}
        alt={artwork.title}
        className="w-full h-auto object-cover"
      />
    </div>
  );
};

export default ImageCard;
