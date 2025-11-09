import axios from "axios";
import type { Comment } from "../types/posts";

// Configuración centralizada para el sistema de comentarios
const CONFIG = {
  JSON_URL: "/comments.json", // URL del archivo JSON en public/
  STORAGE_KEY: "comments_db", // Clave para localStorage
} as const;

// Interfaz para la estructura del JSON
interface CommentsData {
  comments: {
    [postId: string]: Comment[];
  };
}

// Cargar comentarios iniciales desde el JSON usando axios
export async function loadCommentsFromJSON(): Promise<
  CommentsData["comments"]
> {
  try {
    const response = await axios.get<CommentsData>(CONFIG.JSON_URL);
    return response.data.comments || {};
  } catch (error) {
    console.error("Error al cargar comentarios desde JSON:", error);
    return {};
  }
}

// Obtener comentarios de un post específico (dinámico por ID)
export async function getCommentsByPostId(
  postId: number | string
): Promise<Comment[]> {
  try {
    const postIdStr = postId.toString();

    // Primero intentamos cargar desde localStorage (si hay cambios locales)
    const localData = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (localData) {
      const localComments: CommentsData["comments"] = JSON.parse(localData);
      if (localComments[postIdStr]) {
        return localComments[postIdStr];
      }
    }

    // Si no hay datos locales, cargamos desde el JSON
    const commentsData = await loadCommentsFromJSON();
    return commentsData[postIdStr] || [];
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    return [];
  }
}

// Obtener todos los comentarios (combinando JSON y localStorage)
export async function getAllComments(): Promise<CommentsData["comments"]> {
  try {
    // Cargar comentarios iniciales desde JSON
    const jsonComments = await loadCommentsFromJSON();

    // Cargar comentarios locales (si existen)
    const localData = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (localData) {
      const localComments: CommentsData["comments"] = JSON.parse(localData);
      // Combinar: los comentarios locales tienen prioridad
      return { ...jsonComments, ...localComments };
    }

    return jsonComments;
  } catch (error) {
    console.error("Error al obtener todos los comentarios:", error);
    return {};
  }
}

// Agregar un comentario a un post (dinámico por ID)
export async function addComment(
  postId: number | string,
  comment: Omit<Comment, "id" | "createdAt">
): Promise<Comment> {
  try {
    // Obtener comentarios actuales
    const allComments = await getAllComments();
    const postIdStr = postId.toString();

    // Crear el nuevo comentario
    const newComment: Comment = {
      id: Date.now(),
      ...comment,
      createdAt: new Date().toISOString(),
    };

    // Si el post no existe, crear un array vacío para él (dinámico)
    if (!allComments[postIdStr]) {
      allComments[postIdStr] = [];
    }

    // Agregar el comentario al array del post
    const postComments = allComments[postIdStr];
    allComments[postIdStr] = [...postComments, newComment];

    // Guardar en localStorage (persistencia local)
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(allComments));

    return newComment;
  } catch (error) {
    console.error("Error al agregar comentario:", error);
    throw error;
  }
}

// Eliminar un comentario (dinámico por ID)
export async function deleteComment(
  postId: number | string,
  commentId: number
): Promise<void> {
  try {
    const allComments = await getAllComments();
    const postIdStr = postId.toString();

    if (allComments[postIdStr]) {
      allComments[postIdStr] = allComments[postIdStr].filter(
        (c) => c.id !== commentId
      );
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(allComments));
    }
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    throw error;
  }
}

// Inicializar comentarios (cargar desde JSON al inicio de la app)
export async function initializeComments(): Promise<void> {
  try {
    const jsonComments = await loadCommentsFromJSON();

    // Si no hay datos en localStorage, inicializar con los del JSON
    const localData = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (!localData) {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(jsonComments));
    } else {
      // Combinar comentarios del JSON con los locales
      const localComments: CommentsData["comments"] = JSON.parse(localData);
      const merged = { ...jsonComments, ...localComments };
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(merged));
    }
  } catch (error) {
    console.error("Error al inicializar comentarios:", error);
  }
}
