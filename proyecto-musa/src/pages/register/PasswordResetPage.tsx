import React from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo/LOGO (2).png";
import img1 from "../../assets/imagenes/image 1.png"; 
import img2 from "../../assets/imagenes/image 2.png";
import img3 from "../../assets/imagenes/image 3.png";
import img4 from "../../assets/imagenes/image 4.png";
import img5 from "../../assets/imagenes/image 5.png";
import img6 from "../../assets/imagenes/image 6.png";
import img7 from "../../assets/imagenes/image 7.png"; 

const PasswordResetPage = () => {
  const navigate = useNavigate();
  const imageClasses = "w-full h-full object-cover transition duration-300 hover:scale-105";

  const IconUser = () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
  );

  const IconEmail = () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
  );

  const inputBgColor = "bg-[#f0f0f0]"; 
  const buttonBgColor = "bg-[#8D1E3A]";

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

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
      
      {/* PARTE IZQUIERDA: MOSAICO (SOLO DESKTOP) */}
      <div className="hidden md:block md:w-1/2 p-4 md:p-8 bg-white overflow-hidden relative h-screen">
        

        
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

      {/* PARTE DERECHA: FORMULARIO DE RESTABLECER CONTRASEÑA */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 overflow-y-auto h-screen">
        
        <div className="w-full max-w-full md:max-w-md bg-white rounded-none md:rounded-3xl p-0 md:p-8 md:shadow-2xl max-h-[90vh] overflow-y-auto">
          
          <div className="flex flex-col items-center pt-6 px-4 md:pt-0 text-center">
             
             <img 
               src={logo} 
               alt="Musa" 
               className="w-14 h-14 object-contain mb-4 mt-6 md:mb-6 md:mt-0" 
             />
             
             {/* TÍTULO ESPECÍFICO PARA RESTABLECER CONTRASEÑA */}
             <h1 className="text-2xl font-bold text-gray-800 text-center">Restablecer contraseña</h1>
             <p className="text-gray-600 text-sm mt-2 mb-6 text-center">
               Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
             </p>
          </div>

          <form className="flex flex-col gap-4 px-4 pb-6 md:pb-0">
            
            {/* Campo Correo Electrónico */}
            <div className={`relative flex items-center ${inputBgColor} rounded-xl px-4 py-3`}>
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <IconEmail />
              </span>
              <input 
                type="email" 
                placeholder="Correo electrónico" 
                className="w-full border-0 bg-transparent focus:ring-0 focus:outline-none placeholder-gray-700 text-gray-800 font-medium pl-10"
              />
            </div>
            
            {/* BOTÓN ENVIAR ENLACE */}
            <button 
              type="submit" 
              className={`w-full ${buttonBgColor} text-white py-3 rounded-xl mt-4 font-semibold hover:bg-red-900 transition duration-150 shadow-lg cursor-pointer`}
            >
              Enviar enlace
            </button>

            {/* VOLVER AL INICIO DE SESIÓN */}
            <div className="text-center mt-4">
              <span className="text-gray-600 text-sm">¿Recordaste tu contraseña? </span>
              <button 
                type="button" 
                onClick={handleLoginClick}
                className="text-gray-800 font-semibold text-sm hover:text-gray-600 transition duration-150"
              >
                Inicia sesión
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;