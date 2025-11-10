import axios from "axios";
import type { Comment } from "../types/posts";

const BASE_URL =
  import.meta.env.VITE_JSON_SERVER_URL ?? "http://localhost:3000";

const COMMENTS_ENDPOINT = `${BASE_URL}/comments`;

interface CommentRecord extends Comment {
  postId: number | string;
}

function normalizePostId(postId: number | string): number | string {
  const numeric = Number(postId);
  return Number.isFinite(numeric) ? numeric : postId.toString();
}

function toComment(record: CommentRecord): Comment {
  const { id, author, text, createdAt, postId } = record;
  return {
    id,
    author,
    text,
    createdAt,
    postId,
  };
}

export async function getCommentsByPostId(
  postId: number | string
): Promise<Comment[]> {
  try {
    const normalizedPostId = normalizePostId(postId);
    const response = await axios.get<CommentRecord[]>(COMMENTS_ENDPOINT, {
      params: { postId: normalizedPostId },
    });
    return response.data.map(toComment);
  } catch (error) {
    console.error("Error al obtener comentarios desde json-server:", error);
    return [];
  }
}

export async function getAllComments(): Promise<Record<string, Comment[]>> {
  try {
    const response = await axios.get<CommentRecord[]>(COMMENTS_ENDPOINT);
    return response.data.reduce<Record<string, Comment[]>>(
      (accumulator, record) => {
        const key = record.postId.toString();
        if (!accumulator[key]) {
          accumulator[key] = [];
        }
        accumulator[key].push(toComment(record));
        return accumulator;
      },
      {}
    );
  } catch (error) {
    console.error("Error al obtener todos los comentarios:", error);
    return {};
  }
}

export async function addComment(
  postId: number | string,
  comment: Omit<Comment, "id" | "createdAt" | "postId">
): Promise<Comment> {
  try {
    const normalizedPostId = normalizePostId(postId);
    const payload = {
      postId: normalizedPostId,
      author: comment.author,
      text: comment.text,
      createdAt: new Date().toISOString(),
    };

    const response = await axios.post<CommentRecord>(
      COMMENTS_ENDPOINT,
      payload
    );
    return toComment(response.data);
  } catch (error) {
    console.error("Error al agregar comentario en json-server:", error);
    throw error;
  }
}

export async function deleteComment(commentId: number): Promise<void> {
  try {
    await axios.delete(`${COMMENTS_ENDPOINT}/${commentId}`);
  } catch (error) {
    console.error("Error al eliminar comentario en json-server:", error);
    throw error;
  }
}

export async function initializeComments(): Promise<void> {
  // Ya no es necesario inicializar datos desde archivos locales,
  // pero mantenemos la función para compatibilidad con la llamada existente.
  return Promise.resolve();
}
