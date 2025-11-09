import axios from "axios";

// Configuración centralizada para el sistema de likes
const CONFIG = {
  JSON_URL: "/likes.json", // URL del archivo JSON en public/
  STORAGE_KEY: "likes_db", // Clave para localStorage
} as const;

// Interfaz para la estructura del JSON
interface LikeData {
  count: number;
  likedByUser: boolean;
}

interface LikesData {
  likes: {
    [postId: string]: LikeData;
  };
}

// Cargar likes iniciales desde el JSON usando axios
export async function loadLikesFromJSON(): Promise<LikesData["likes"]> {
  try {
    const response = await axios.get<LikesData>(CONFIG.JSON_URL);
    return response.data.likes || {};
  } catch (error) {
    console.error("Error al cargar likes desde JSON:", error);
    return {};
  }
}

// Obtener likes de un post específico (dinámico por ID)
export async function getLikesByPostId(
  postId: number | string
): Promise<LikeData> {
  try {
    const postIdStr = postId.toString();

    // Primero intentamos cargar desde localStorage (si hay cambios locales)
    const localData = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (localData) {
      const localLikes: LikesData["likes"] = JSON.parse(localData);
      if (localLikes[postIdStr]) {
        return localLikes[postIdStr];
      }
    }

    // Si no hay datos locales, cargamos desde el JSON
    const likesData = await loadLikesFromJSON();
    return (
      likesData[postIdStr] || {
        count: 0,
        likedByUser: false,
      }
    );
  } catch (error) {
    console.error("Error al obtener likes:", error);
    return {
      count: 0,
      likedByUser: false,
    };
  }
}

// Obtener todos los likes (combinando JSON y localStorage)
export async function getAllLikes(): Promise<LikesData["likes"]> {
  try {
    // Cargar likes iniciales desde JSON
    const jsonLikes = await loadLikesFromJSON();

    // Cargar likes locales (si existen)
    const localData = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (localData) {
      const localLikes: LikesData["likes"] = JSON.parse(localData);
      // Combinar: los likes locales tienen prioridad
      return { ...jsonLikes, ...localLikes };
    }

    return jsonLikes;
  } catch (error) {
    console.error("Error al obtener todos los likes:", error);
    return {};
  }
}

// Alternar like de un post (dinámico por ID)
export async function toggleLike(postId: number | string): Promise<LikeData> {
  try {
    // Obtener likes actuales
    const allLikes = await getAllLikes();
    const postIdStr = postId.toString();

    // Obtener el estado actual del like para este post
    const currentLike = allLikes[postIdStr] || {
      count: 0,
      likedByUser: false,
    };

    // Alternar el like
    const newLikeState: LikeData = {
      count: currentLike.likedByUser
        ? currentLike.count - 1
        : currentLike.count + 1,
      likedByUser: !currentLike.likedByUser,
    };

    // Actualizar los likes
    allLikes[postIdStr] = newLikeState;

    // Guardar en localStorage (persistencia local)
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(allLikes));

    return newLikeState;
  } catch (error) {
    console.error("Error al alternar like:", error);
    throw error;
  }
}

// Inicializar likes (cargar desde JSON al inicio de la app)
export async function initializeLikes(): Promise<void> {
  try {
    const jsonLikes = await loadLikesFromJSON();

    // Si no hay datos en localStorage, inicializar con los del JSON
    const localData = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (!localData) {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(jsonLikes));
    } else {
      // Combinar likes del JSON con los locales
      const localLikes: LikesData["likes"] = JSON.parse(localData);
      const merged = { ...jsonLikes, ...localLikes };
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(merged));
    }
  } catch (error) {
    console.error("Error al inicializar likes:", error);
  }
}

