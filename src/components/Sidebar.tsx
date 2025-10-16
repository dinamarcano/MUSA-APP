import React, { useState } from "react";
import {
  HiHome,
  HiBell,
  HiMail,
  HiUser,
  HiChevronLeft,
  HiSearch,
  HiSparkles,
} from "react-icons/hi";

const Sidebar: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null);

  const notifications = [
    { id: 1, title: "¿Sigues buscando publicaciones?", description: "Explora ideas relacionadas con Arte", type: "suggestion" },
    { id: 2, title: "¿Sigues buscando publicaciones?", description: "Explora ideas relacionadas con Pintura", type: "suggestion" },
    { id: 3, title: "Esta idea tiene tu estilo", description: "Podría gustarte", type: "recommendation" },
    { id: 4, title: "Nueva inspiración para ti", description: "Podría inspirarte", type: "recommendation" },
  ];

  const handleNotificationClick = (id: number) => setSelectedNotification(id);
  const handleBackClick = () => (selectedNotification !== null ? setSelectedNotification(null) : setShowNotifications(false));

  const getNotificationDetails = (id: number) => {
    const notification = notifications.find((n) => n.id === id);
    if (!notification) return null;

    switch (notification.type) {
      case "suggestion":
        return {
          title: "Explorar Ideas",
          content: `Te sugerimos explorar más contenido sobre ${notification.description.split("con ")[1]}. Hemos encontrado nuevas publicaciones que podrían interesarte.`,
          icon: <HiSearch className="w-12 h-12 text-blue-500 mx-auto" />,
        };
      case "recommendation":
        return {
          title: "Recomendación Personalizada",
          content:
            "Basado en tu actividad reciente, hemos encontrado contenido que se adapta a tus preferencias y podría inspirarte en tus próximos proyectos creativos.",
          icon: <HiSparkles className="w-12 h-12 text-purple-500 mx-auto" />,
        };
      default:
        return null;
    }
  };

  return (
    <>
      {/* Sidebar desktop */}
      <div className="hidden md:flex w-16 bg-white border-r border-gray-200 text-gray-700 min-h-screen flex-col items-center py-4 relative">
        <div className="space-y-6">
          <button className="p-3 hover:bg-blue-50 rounded-xl text-gray-600 hover:text-blue-600 transition" title="Inicio">
            <HiHome className="w-6 h-6" />
          </button>

          <button
            className="relative p-3 hover:bg-blue-50 rounded-xl text-gray-600 hover:text-blue-600 transition"
            onClick={() => setShowNotifications(true)}
            title="Notificaciones"
          >
            <HiBell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <button className="p-3 hover:bg-blue-50 rounded-xl text-gray-600 hover:text-blue-600 transition" title="Mensajes">
            <HiMail className="w-6 h-6" />
          </button>
        </div>

        {showNotifications && (
          <div className="fixed left-16 top-0 w-80 h-full bg-white border-l border-gray-200 shadow-xl z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 flex items-center space-x-3">
              <button
                onClick={handleBackClick}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 transition"
              >
                <HiChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedNotification !== null ? "Notificación" : "NOTIFICACIONES"}
              </h2>
            </div>

            {/* Contenido */}
            <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
              {selectedNotification === null ? (
                <>
                  <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">Notificaciones</h3>
                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-4 border border-gray-200 rounded-xl hover:bg-blue-50 cursor-pointer hover:border-blue-200 transition"
                        onClick={() => handleNotificationClick(n.id)}
                      >
                        <div className="font-medium text-gray-800 text-sm mb-1">{n.title}</div>
                        <div className="text-gray-600 text-xs">{n.description}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                (() => {
                  const details = getNotificationDetails(selectedNotification);
                  if (!details) return null;
                  return (
                    <div className="space-y-6 text-center">
                      {details.icon}
                      <h3 className="font-bold text-gray-800 text-lg">{details.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{details.content}</p>

                      <div className="flex space-x-3 pt-4">
                        <button className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-xl text-sm hover:bg-blue-600 transition">
                          Explorar
                        </button>
                        <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl text-sm hover:bg-gray-50 transition">
                          Más tarde
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
