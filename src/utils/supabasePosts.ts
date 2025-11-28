import supabase from "../supabaseClient";

export interface PostRow {
  id: string;
  user_id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  tags: string[] | null;
  created_at: string;
  likes_count: number;
}

// Tipo UI compatible con tu components (ids string|number)
export interface UiPost {
  id: string;
  userId: string;
  image: string;
  title?: string;
  description?: string;
  tags?: string[];
  createdAt?: string;
  likes: number;
  likedByMe?: boolean;
  comments: any[]; // se mantiene por compatibilidad, vacío aquí
}

const mapRowToUi = (row: PostRow): UiPost => ({
  id: row.id,
  userId: row.user_id,
  image: row.image_url,
  title: row.title ?? "",
  description: row.description ?? "",
  tags: row.tags ?? [],
  createdAt: row.created_at,
  likes: row.likes_count ?? 0,
  likedByMe: false,
  comments: [],
});

// Feed global de posts
export async function getPosts(): Promise<UiPost[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRowToUi);
}

// Crear post para el usuario autenticado
export async function createPost(payload: {
  image: string; // URL (o pública de Storage)
  title?: string;
  description?: string;
  tags?: string[];
}): Promise<UiPost> {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) throw userErr ?? new Error("Sin sesión");
  const userId = userData.user.id;

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: userId,
      image_url: payload.image,
      title: payload.title ?? null,
      description: payload.description ?? null,
      tags: payload.tags ?? null,
    })
    .select()
    .single();

  if (error || !data) throw error ?? new Error("Insert falló");
  return mapRowToUi(data as PostRow);
}

// Alternar like usando post_likes y devolver el post actualizado
export async function toggleLike(post: UiPost): Promise<UiPost> {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) throw userErr ?? new Error("Sin sesión");
  const userId = userData.user.id;

  const { data: existing, error: findErr } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", post.id)
    .eq("user_id", userId)
    .maybeSingle();

  if (findErr && findErr.code !== "PGRST116") throw findErr;

  if (existing) {
    const { error: delErr } = await supabase
      .from("post_likes")
      .delete()
      .eq("id", existing.id);
    if (delErr) throw delErr;
  } else {
    const { error: insErr } = await supabase
      .from("post_likes")
      .insert({ post_id: post.id, user_id: userId });
    if (insErr) throw insErr;
  }

  const { data: postRow, error: postErr } = await supabase
    .from("posts")
    .select("likes_count")
    .eq("id", post.id)
    .single();
  if (postErr || !postRow) throw postErr ?? new Error("No se leyó likes_count");

  return { ...post, likes: (postRow as any).likes_count ?? 0, likedByMe: !existing };
}

// No-op para compatibilidad (antes persistías en localStorage)
export async function updatePost(updated: UiPost): Promise<UiPost> {
  return updated;
}
