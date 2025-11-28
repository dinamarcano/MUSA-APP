import supabase from "../supabaseClient";

export interface ArtworkRow {
    id: string;
    user_id: string;
    image_url: string;
    title: string | null;
    description: string | null;
    tags: string[] | null;
    created_at: string;
}
export interface UiArtwork {
    id: string;
    image: string;
    userId: string;
    title?: string;
    description?: string;
    tags?: string[];
    createdAt?: string;
}

const mapRow = (r: ArtworkRow): UiArtwork => ({
  id: r.id,
  userId: r.user_id,
  image: r.image_url,
  title: r.title ?? "",
  description: r.description ?? "",
  tags: r.tags ?? [],
  createdAt: r.created_at,
});

export async function getAllArtworks(): Promise<UiArtwork[]> {
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getArtworksByUser(userId: string): Promise<UiArtwork[]> {
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function createArtworkForUser(userId: string, payload: { image_url: string; title?: string; description?: string; tags?: string[]; }): Promise<UiArtwork> {
    const { data, error } = await supabase.from("artworks").insert({
        user_id: userId,
        image_url: payload.image_url,
        title: payload.title ?? null,
        description: payload.description ?? null,
        tags: payload.tags ?? null,
    }).select().single();
    if (error || !data) throw error ?? new Error("insert failed");
    return mapRow(data as ArtworkRow);
}