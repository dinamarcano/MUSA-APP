import React from 'react';
import { useNavigate } from "react-router-dom";
import ImageMosaic from '../../components/ImageMosaic';
import logo from "../../assets/logo/LOGO (2).png";
import img1 from "../../assets/imagenes/image 1.png"; 
import img2 from "../../assets/imagenes/image 2.png";
import img3 from "../../assets/imagenes/image 3.png";
import img4 from "../../assets/imagenes/image 4.png";
import img5 from "../../assets/imagenes/image 5.png";
import img6 from "../../assets/imagenes/image 6.png";
import img7 from "../../assets/imagenes/image 7.png"; 

const PreferencesPage = () => {
  const navigate = useNavigate();
  const buttonBgColor = "bg-[#8D1E3A]";

  const handleContinue = () => {
    navigate("/home");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Datos de las categorías de arte
  const artCategories = [
    { id: 1, image: img1, title: "Pintura Clásica", subtitle: "Obras maestras tradicionales" },
    { id: 2, image: img2, title: "Música", subtitle: "Instrumentos y composición" },
    { id: 3, image: img3, title: "Retrato", subtitle: "Arte figurativo humano" },
    { id: 4, image: img4, title: "Arte Urbano", subtitle: "Expresiones citadinas" },
    { id: 5, image: img5, title: "Arte Contemporáneo", subtitle: "Expresiones modernas" },
    { id: 6, image: img6, title: "Paisajismo", subtitle: "Naturaleza y escenarios" },
    { id: 7, image: img7, title: "Arte Digital", subtitle: "Tecnología y creatividad" }
  ];

  return (
    <div className="min-h-screen bg-white md:flex relative">
      
      {/* BOTÓN DE ATRÁS */}
      <div className="absolute top-0 left-0 pt-4 pl-4 md:hidden z-10"> 
        <button 
          onClick={handleGoBack}
          className="text-gray-900 p-2 rounded-full transition hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a7.5 7.5 0 010 15h-3" />
          </svg>
        </button>
      </div>
      
      {/* COMPONENTE REUTILIZABLE */}
      <ImageMosaic showTitle={true} />

      {/* PARTE DERECHA: SELECCIÓN DE GUSTOS */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 overflow-y-auto h-screen">
        
        <div className="w-full max-w-full md:max-w-md bg-white rounded-none md:rounded-3xl p-0 md:p-8 md:shadow-2xl max-h-[90vh] overflow-y-auto">
          
          <div className="flex flex-col items-center pt-6 px-4 md:pt-0 text-center">
             
             <img 
               src={logo} 
               alt="Musa" 
               className="w-14 h-14 object-contain mb-4 mt-6 md:mb-6 md:mt-0" 
             />
             
             {/* TÍTULO Y SUBTÍTULO */}
             <h1 className="text-2xl font-bold text-gray-800 text-center">Personaliza tus gustos</h1>
             <p className="text-gray-600 text-sm mt-2 mb-6 text-center">El arte se vive mejor en comunidad</p>
          </div>

          {/* BOTÓN CONTINUAR (PRIMERO) */}
          <div className="px-4">
            <button 
              onClick={handleContinue}
              className={`w-full ${buttonBgColor} text-white py-3 rounded-xl font-semibold hover:bg-red-900 transition duration-150 shadow-lg cursor-pointer mb-6`}
            >
              Continuar
            </button>
          </div>

          {/* GRID DE CATEGORÍAS */}
          <div className="grid grid-cols-2 gap-4 px-4 pb-6">
            {artCategories.map((category) => (
              <div 
                key={category.id}
                className="group cursor-pointer transition-all duration-300 hover:scale-105"
              >
                <div className="rounded-xl overflow-hidden shadow-lg mb-2">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-32 object-cover"
                  />
                </div>
                {/* TÍTULO NO DESTACADO */}
                <div className="text-center">
                  <h3 className="text-gray-800 font-medium text-sm">{category.title}</h3>
                  <p className="text-gray-500 text-xs mt-1">{category.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;