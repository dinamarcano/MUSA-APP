// src/utils/supabaseComments.ts
import supabase from "../supabaseClient";
import type { Comment as UiComment } from "../types/posts";

interface SupaCommentRow {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string | null;
  text: string;
  created_at: string;
}

const mapRowToComment = (row: SupaCommentRow): UiComment => ({
  id: row.id,
  author: row.author_name ?? "Usuario",
  text: row.text,
  createdAt: row.created_at,
  postId: row.post_id as any,
});

export async function getAllComments(): Promise<Record<string, UiComment[]>> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error al obtener todos los comentarios desde Supabase", error);
    return {};
  }

  const byPostId: Record<string, UiComment[]> = {};
  (data as SupaCommentRow[]).forEach((row) => {
    const key = String(row.post_id);
    if (!byPostId[key]) byPostId[key] = [];
    byPostId[key].push(mapRowToComment(row));
  });
  return byPostId;
}

export async function addComment(
  postId: string,
  userId: string,
  authorName: string,
  text: string
): Promise<UiComment> {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: userId,
      author_name: authorName,
      text,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Error al agregar comentario en Supabase", error);
    throw error;
  }
  return mapRowToComment(data as SupaCommentRow);
}

export async function deleteComment(commentId: number | string): Promise<void> {
  const { error } = await supabase.from("comments").delete().eq("id", String(commentId));
  if (error) {
    console.error("Error al eliminar comentario en Supabase", error);
    throw error;
  }
}

export async function initializeComments(): Promise<void> {
  return Promise.resolve();
}
