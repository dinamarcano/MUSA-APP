import React from 'react';
import img1 from '../../assets/imagenes/image 1.png'; 
import img2 from '../../assets/imagenes/image 2.png';
import img3 from '../../assets/imagenes/image 3.png';
import img4 from '../../assets/imagenes/image 4.png';
import img5 from '../../assets/imagenes/image 5.png';
import img6 from '../../assets/imagenes/image 6.png';
import img7 from '../../assets/imagenes/image 7.png'; 

interface ImageMosaicProps {
  showTitle?: boolean;
}

const ImageMosaic: React.FC<ImageMosaicProps> = ({ showTitle = true }) => {
  const imageClasses = "w-full h-full object-cover transition duration-300 hover:scale-105";

  return (
    <div className="hidden md:block md:w-1/2 p-4 md:p-8 bg-gray-900 overflow-hidden relative h-screen">
      
      {showTitle && (
        <div className="mb-4 text-white">
          <h2 className="text-3xl font-serif">Musa App.</h2>
          <p className="text-gray-400 text-sm">El arte se vive mejor en comunidad.</p>
        </div>
      )}
      
      <div className="grid grid-cols-4 grid-rows-4 gap-3 h-[calc(100vh-100px)]"> 
        <div className="col-span-2 row-span-2 rounded-xl overflow-hidden shadow-xl">
          <img src={img1} alt="Obra de arte Van Gogh" className={imageClasses} />
        </div>
        <div className="col-span-1 row-span-2 rounded-xl overflow-hidden shadow-xl">
          <img src={img3} alt="Retrato artístico" className={imageClasses} />
        </div>
        <div className="col-span-1 row-span-4 rounded-xl overflow-hidden shadow-xl">
          <img src={img2} alt="Mano tocando piano" className={imageClasses} />
        </div>
        <div className="col-span-1 row-span-2 rounded-xl overflow-hidden shadow-xl">
          <img src={img4} alt="Faroles urbanos" className={imageClasses} />
        </div>
        <div className="col-span-1 row-span-2 rounded-xl overflow-hidden shadow-xl">
          <img src={img5} alt="Mujer con flores" className={imageClasses} />
        </div>
        <div className="col-span-1 row-span-1 rounded-xl overflow-hidden shadow-xl">
          <img src={img6} alt="Pintor en la costa" className={imageClasses} />
        </div>
        <div className="col-span-1 row-span-1 rounded-xl overflow-hidden shadow-xl">
          <img src={img7} alt="Muelle al atardecer" className={imageClasses} />
        </div>
      </div>
    </div>
  );
};

export default ImageMosaic;