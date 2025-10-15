import React, { useState } from 'react';

const Sidebar: React.FC = () => {
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
          image: "🎨"
        };
      case 'recommendation':
        return {
          title: "Recomendación Personalizada",
          content: "Basado en tu actividad reciente, hemos encontrado contenido que se adapta a tus preferencias y podría inspirarte en tus próximos proyectos creativos.",
          image: "💡"
        };
      default:
        return null;
    }
  };

  return (
    <div className="w-16 bg-white border-r border-gray-200 text-gray-700 min-h-screen flex flex-col items-center py-4 relative">
      
      {/* Iconos principales */}
      <div className="space-y-4">
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Inicio"
        >
          🏠
        </button>
        
        {/* Botón de notificaciones */}
        <button 
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setShowNotifications(true)}
          title="Notificaciones"
        >
          🔔
          {/* Indicador de nuevas notificaciones */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Mensajes"
        >
          📧
        </button>
      </div>

      {/* Panel de notificaciones - FIJO */}
      {showNotifications && (
        <div className="fixed left-16 top-0 w-80 h-full bg-white border-l border-gray-200 shadow-lg z-50 overflow-hidden">
          
          {/* Header del panel - FIJO */}
          <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleBackClick}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                ←
              </button>
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedNotification !== null ? 'Notificación' : 'NOTIFICACION COMPU'}
              </h2>
            </div>
          </div>

          {/* Contenido del panel - CON SCROLL */}
          <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
            
            {selectedNotification === null ? (
              /* Vista de lista de notificaciones */
              <>
                <h3 className="font-semibold text-gray-700 mb-4">Notificaciones</h3>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="font-medium text-gray-800 text-sm">
                        {notification.title}
                      </div>
                      <div className="text-gray-600 text-xs mt-1">
                        {notification.description}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Vista detalle de notificación */
              <div className="space-y-4">
                {(() => {
                  const details = getNotificationDetails(selectedNotification);
                  if (!details) return null;
                  
                  return (
                    <>
                      <div className="text-4xl text-center mb-4">
                        {details.image}
                      </div>
                      <h3 className="font-bold text-gray-800 text-center">
                        {details.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {details.content}
                      </p>
                      
                      {/* Botones de acción */}
                      <div className="flex space-x-2 pt-4">
                        <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                          Explorar
                        </button>
                        <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-50 transition-colors">
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
  );
};

export default Sidebar;