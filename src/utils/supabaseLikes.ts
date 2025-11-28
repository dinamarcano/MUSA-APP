import supabase from "../supabaseClient";

export interface LikeData {
  count: number;
  likedByUser: boolean;
}

export async function getAllLikes(
  currentUserId?: string
): Promise<Record<string, LikeData>> {
  const { data, error } = await supabase
    .from("post_likes")
    .select("post_id,user_id"); // todas las filas

  if (error) {
    console.error("Error al obtener likes desde Supabase", error);
    return {};
  }

  const byPostId: Record<string, LikeData> = {};

  (data ?? []).forEach((row: any) => {
    const key = String(row.post_id);
    if (!byPostId[key]) {
      byPostId[key] = { count: 0, likedByUser: false };
    }
    byPostId[key].count += 1;
    if (currentUserId && row.user_id === currentUserId) {
      byPostId[key].likedByUser = true;
    }
  });

  return byPostId;
}

export async function initializeLikes(): Promise<void> {
  return Promise.resolve();
}

export async function toggleLike(
  postId: number | string,
  userId: string
): Promise<LikeData> {
  const id = String(postId);

  // 1) ¿Existe like del usuario?
  const { data: existing, error: findErr } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (findErr && (findErr as any).code !== "PGRST116") {
    console.error("Error buscando like en Supabase", findErr);
    throw findErr;
  }

  // 2) Insertar / borrar
  if (existing) {
    const { error: delErr } = await supabase
      .from("post_likes")
      .delete()
      .eq("id", existing.id);
    if (delErr) {
      console.error("Error eliminando like en Supabase", delErr);
      throw delErr;
    }
  } else {
    const { error: insErr } = await supabase
      .from("post_likes")
      .insert({ post_id: id, user_id: userId }); // v2: sin returning
    if (insErr) {
      console.error("Error insertando like en Supabase", insErr);
      throw insErr;
    }
  }

  // 3) Contar SIEMPRE desde post_likes (nos olvidamos de likes_count)
  const { count, error: cntErr } = await supabase
    .from("post_likes")
    .select("*", { head: true, count: "exact" })
    .eq("post_id", id);
  if (cntErr) {
    console.error("Error contando likes en Supabase", cntErr);
    throw cntErr;
  }

  return {
    count: count ?? 0,
    likedByUser: !existing,
  };
}
