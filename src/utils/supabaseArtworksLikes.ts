import supabase from "../supabaseClient";

export async function getArtworkLikeState(artworkId: string, userId: string) {
  const { data: likeRow, error: findErr } = await supabase
    .from("artwork_likes")
    .select("id")
    .eq("artwork_id", artworkId)
    .eq("user_id", userId)
    .maybeSingle();
  if (findErr && findErr.code !== "PGRST116") throw findErr;

  const { count, error: cntErr } = await supabase
    .from("artwork_likes")
    .select("*", { count: "exact", head: true })
    .eq("artwork_id", artworkId);
  if (cntErr) throw cntErr;

  return { likedByUser: !!likeRow, count: count ?? 0 };
}

export async function toggleArtworkLike(artworkId: string, userId: string) {
  const { data: existing, error: findErr } = await supabase
    .from("artwork_likes")
    .select("id")
    .eq("artwork_id", artworkId)
    .eq("user_id", userId)
    .maybeSingle();
  if (findErr && findErr.code !== "PGRST116") throw findErr;

  if (existing) {
    const { error: delErr } = await supabase
      .from("artwork_likes")
      .delete()
      .eq("id", existing.id);
    if (delErr) throw delErr;
  } else {
    const { error: insErr } = await supabase
      .from("artwork_likes")
      .insert({ artwork_id: artworkId, user_id: userId });
    if (insErr) throw insErr;
  }

  const { data: row, error: postErr } = await supabase
    .from("artworks")
    .select("likes_count")
    .eq("id", artworkId)
    .single();
  if (postErr || !row) throw postErr ?? new Error("No likes_count");

  return { likedByUser: !existing, count: (row as any).likes_count ?? 0 };
}
