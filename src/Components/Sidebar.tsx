import React, { useState } from 'react';
import { 
  HiHome, 
  HiBell, 
  HiChevronLeft,
  HiSearch,
  HiSparkles,
} from 'react-icons/hi';
import { 
  RiArtboardFill,
  RiSettings3Fill
} from 'react-icons/ri';

interface SidebarProps {
  setPage?: (page: 'boards' | 'preferences') => void;
  onGoToMain?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setPage, onGoToMain }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null);

  const notifications = [
    {
      id: 1,
      title: "¿Sigues buscando publicaciones?",
      description: "Explora ideas relacionadas con Arte",
      type: "suggestion"
    },
    {
      id: 2,
      title: "¿Sigues buscando publicaciones?",
      description: "Explora ideas relacionadas con Pintura",
      type: "suggestion"
    },
    {
      id: 3,
      title: "Esta idea tiene tu estilo",
      description: "Podría gustarte",
      type: "recommendation"
    },
    {
      id: 4,
      title: "Nueva inspiración para ti",
      description: "podría inspirarte",
      type: "recommendation"
    }
  ];

  // Menu items sin "Guardados"
  const menuItems = [
    { icon: HiHome, label: 'Inicio', action: () => onGoToMain?.() },
    { icon: RiArtboardFill, label: 'Tableros', action: () => setPage?.('boards') },
    { icon: RiSettings3Fill, label: 'Preferencias', action: () => setPage?.('preferences') },
  ];

  const handleNotificationClick = (id: number) => {
    setSelectedNotification(id);
  };

  const handleBackClick = () => {
    if (selectedNotification !== null) {
      setSelectedNotification(null);
    } else {
      setShowNotifications(false);
    }
  };

  const getNotificationDetails = (id: number) => {
    const notification = notifications.find(n => n.id === id);
    if (!notification) return null;

    switch (notification.type) {
      case 'suggestion':
        return {
          title: "Explorar Ideas",
          content: `Te sugerimos explorar más contenido sobre ${notification.description.split('con ')[1]}. Hemos encontrado nuevas publicaciones que podrían interesarte.`,
          icon: <HiSearch className="w-12 h-12 text-blue-500 mx-auto" />
        };
      case 'recommendation':
        return {
          title: "Recomendación Personalizada",
          content: "Basado en tu actividad reciente, hemos encontrado contenido que se adapta a tus preferencias y podría inspirarte en tus próximos proyectos creativos.",
          icon: <HiSparkles className="w-12 h-12 text-purple-500 mx-auto" />
        };
      default:
        return null;
    }
  };

  return (
    <>
      {/* Sidebar para desktop */}
      <div className="hidden md:flex w-16 bg-white border-r border-gray-200 text-gray-700 min-h-screen flex-col items-center py-4 fixed left-0 top-0 h-full overflow-y-auto">
        
        <div className="space-y-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button 
                key={index}
                className="p-3 hover:bg-blue-50 rounded-xl transition-all duration-200 text-gray-600 hover:text-blue-600"
                title={item.label}
                onClick={item.action}
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          })}
          
          <div className="border-t border-gray-200 my-2"></div>
          
          {/* Botón de notificaciones */}
          <button 
            className="relative p-3 hover:bg-blue-50 rounded-xl transition-all duration-200 text-gray-600 hover:text-blue-600"
            onClick={() => setShowNotifications(true)}
            title="Notificaciones"
          >
            <HiBell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        {/* Panel de notificaciones */}
        {showNotifications && (
          <div className="fixed left-16 top-0 w-80 h-full bg-white border-l border-gray-200 shadow-xl z-50 overflow-hidden">
            
            {/* Header del panel */}
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleBackClick}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                >
                  <HiChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedNotification !== null ? 'Notificación' : 'NOTIFICACIONES'}
                </h2>
              </div>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
              
              {selectedNotification === null ? (
                <>
                  <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">Notificaciones</h3>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className="p-4 border border-gray-200 rounded-xl hover:bg-blue-50 cursor-pointer transition-all duration-200 hover:border-blue-200"
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="font-medium text-gray-800 text-sm mb-1">
                          {notification.title}
                        </div>
                        <div className="text-gray-600 text-xs">
                          {notification.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  {(() => {
                    const details = getNotificationDetails(selectedNotification);
                    if (!details) return null;
                    
                    return (
                      <>
                        {details.icon}
                        <h3 className="font-bold text-gray-800 text-center text-lg">
                          {details.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed text-center">
                          {details.content}
                        </p>
                        
                        <div className="flex space-x-3 pt-4">
                          <button className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-xl text-sm hover:bg-blue-600 transition-colors font-medium">
                            Explorar
                          </button>
                          <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl text-sm hover:bg-gray-50 transition-colors font-medium">
                            Más tarde
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar para móvil */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
        <div className="flex justify-around items-center py-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            // Cambiar "Tableros" por "Favoritos" solo en móvil
            const label = item.label === 'Tableros' ? 'Favoritos' : item.label;
            return (
              <button 
                key={index}
                className="flex flex-col items-center space-y-1 p-2 hover:bg-blue-50 rounded-xl transition-all duration-200 text-gray-600 hover:text-blue-600 min-w-0 flex-1"
                title={item.label}
                onClick={item.action}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs truncate max-w-[60px]">{label}</span>
              </button>
            );
          })}
          
          {/* Botón de notificaciones móvil */}
          <button 
            className="relative flex flex-col items-center space-y-1 p-2 hover:bg-blue-50 rounded-xl transition-all duration-200 text-gray-600 hover:text-blue-600 min-w-0 flex-1"
            onClick={() => setShowNotifications(true)}
            title="Notificaciones"
          >
            <HiBell className="w-5 h-5" />
            <span className="text-xs">Notis</span>
            <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </div>

      {/* Overlay de notificaciones para móvil */}
      {showNotifications && (
        <div className="md:hidden fixed inset-0 bg-white z-50 overflow-hidden">
          
          <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleBackClick}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              >
                <HiChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedNotification !== null ? 'Notificación' : 'NOTIFICACIONES'}
              </h2>
            </div>
          </div>

          <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
            
            {selectedNotification === null ? (
              <>
                <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">Notificaciones</h3>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className="p-4 border border-gray-200 rounded-xl hover:bg-blue-50 cursor-pointer transition-all duration-200 hover:border-blue-200"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="font-medium text-gray-800 text-sm mb-1">
                        {notification.title}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {notification.description}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-6">
                {(() => {
                  const details = getNotificationDetails(selectedNotification);
                  if (!details) return null;
                  
                  return (
                    <>
                      {details.icon}
                      <h3 className="font-bold text-gray-800 text-center text-lg">
                        {details.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed text-center">
                        {details.content}
                      </p>
                      
                      <div className="flex space-x-3 pt-4">
                        <button className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-xl text-sm hover:bg-blue-600 transition-colors font-medium">
                          Explorar
                        </button>
                        <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl text-sm hover:bg-gray-50 transition-colors font-medium">
                          Más tarde
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Espacio para el contenido principal cuando sidebar es fija */}
      <div className="md:ml-16"></div>
    </>
  );
};

export default Sidebar;