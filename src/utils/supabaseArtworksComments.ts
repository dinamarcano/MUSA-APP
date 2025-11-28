import supabase from "../supabaseClient";

export interface UiArtworkComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  artworkId: string;
}

const mapRow = (r: any): UiArtworkComment => ({
  id: r.id,
  author: r.author_name ?? "Usuario",
  text: r.text,
  createdAt: r.created_at,
  artworkId: r.artwork_id,
});

export async function getCommentsByArtwork(artworkId: string) {
  const { data, error } = await supabase
    .from("artwork_comments")
    .select("*")
    .eq("artwork_id", artworkId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function addArtworkComment(
  artworkId: string,
  userId: string,
  authorName: string,
  text: string
) {
  const { data, error } = await supabase
    .from("artwork_comments")
    .insert({ artwork_id: artworkId, user_id: userId, author_name: authorName, text })
    .select()
    .single();
  if (error || !data) throw error ?? new Error("insert failed");
  return mapRow(data);
}

export async function deleteArtworkComment(commentId: string | number) {
  const { error } = await supabase.from("artwork_comments").delete().eq("id", String(commentId));
  if (error) throw error;
}
