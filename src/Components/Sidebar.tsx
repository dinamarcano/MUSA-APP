// Sidebar.tsx
import React, { useState } from "react";
import {
  HiHome,
  HiBell,
  HiChevronLeft,
  HiSearch,
  HiSparkles,
} from "react-icons/hi";
import { RiArtboardFill, RiSettings3Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

interface SidebarProps {
  setPage?: (page: "boards" | "preferences") => void;
  onGoToMain?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setPage, onGoToMain }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<
    number | null
  >(null);
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      title: "¿Sigues buscando publicaciones?",
      description: "Explora ideas relacionadas con Arte",
      type: "suggestion",
    },
    {
      id: 2,
      title: "¿Sigues buscando publicaciones?",
      description: "Explora ideas relacionadas con Pintura",
      type: "suggestion",
    },
    {
      id: 3,
      title: "Esta idea tiene tu estilo",
      description: "Podría gustarte",
      type: "recommendation",
    },
    {
      id: 4,
      title: "Nueva inspiración para ti",
      description: "podría inspirarte",
      type: "recommendation",
    },
  ];

  const menuItems = [
    { icon: HiHome, label: "Inicio", action: () => onGoToMain?.() },
    { icon: RiArtboardFill, label: "Tableros", action: () => setPage?.("boards") },
    {
      icon: RiSettings3Fill,
      label: "Preferencias",
      action: () => setPage?.("preferences"),
    },
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

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error al cerrar sesión Supabase", error);
      }
    } catch (err) {
      console.error("Error inesperado en signOut", err);
    }

    try {
      ["currentUser", "userData", "bookmarks"].forEach((key) =>
        localStorage.removeItem(key)
      );
    } catch {
      // ignorar errores de localStorage
    }

    navigate("/login");
  };

  const getNotificationDetails = (id: number) => {
    const notification = notifications.find((n) => n.id === id);
    if (!notification) return null;

    switch (notification.type) {
      case "suggestion":
        return {
          title: "Explorar Ideas",
          content: `Te sugerimos explorar más contenido sobre ${
            notification.description.split("con ")[1]
          }. Hemos encontrado nuevas publicaciones que podrían interesarte.`,
          icon: <HiSparkles className="w-6 h-6 text-yellow-400" />,
        };
      case "recommendation":
        return {
          title: "Recomendación Personalizada",
          content:
            "Basado en tu actividad reciente, hemos encontrado contenido que se adapta a tus preferencias y podría inspirarte en tus próximos proyectos creativos.",
          icon: <HiSearch className="w-6 h-6 text-blue-400" />,
        };
      default:
        return null;
    }
  };

  return (
    <>
      {/* Sidebar desktop fija en el lateral */}
      <aside className="hidden md:flex md:flex-col md:w-16 bg-white border-r border-gray-200 text-gray-700 min-h-screen items-center py-4 space-y-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.action}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
              title={item.label}
            >
              <Icon className="w-6 h-6 text-gray-700" />
            </button>
          );
        })}

        <button
          onClick={() => setShowNotifications(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
          title="Notificaciones"
        >
          <HiBell className="w-6 h-6 text-gray-700" />
        </button>

        {/* Logout desktop */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-100"
            title="Cerrar sesión"
          >
            <HiChevronLeft className="w-6 h-6 text-red-600 rotate-180" />
          </button>
        </div>
      </aside>

      {/* Bottom Navigation Bar para móvil */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
        <div className="flex justify-around items-center py-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const label = item.label === "Tableros" ? "Tableros" : item.label;
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

          {/* Notificaciones móvil */}
          <button
            className="relative flex flex-col items-center space-y-1 p-2 hover:bg-blue-50 rounded-xl transition-all duration-200 text-gray-600 hover:text-blue-600 min-w-0 flex-1"
            onClick={() => setShowNotifications(true)}
            title="Notificaciones"
          >
            <HiBell className="w-5 h-5" />
            <span className="text-xs">Notis</span>
            <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>

          {/* NUEVO: Logout móvil */}
          <button
            className="flex flex-col items-center space-y-1 p-2 hover:bg-red-50 rounded-xl transition-all duration-200 text-gray-600 hover:text-red-600 min-w-0 flex-1"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <HiChevronLeft className="w-5 h-5 rotate-180" />
            <span className="text-xs">Salir</span>
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
                {selectedNotification !== null
                  ? "Notificación"
                  : "NOTIFICACIONES"}
              </h2>
            </div>
          </div>

          <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
            {selectedNotification === null ? (
              <>
                <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">
                  Notificaciones
                </h3>
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
    </>
  );
};

export default Sidebar;
