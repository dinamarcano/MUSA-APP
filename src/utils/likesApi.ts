import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_JSON_SERVER_URL ?? "http://localhost:3001";

const LIKES_ENDPOINT = `${BASE_URL}/likes`;

export interface LikeData {
  count: number;
  likedByUser: boolean;
}

interface LikeRecord extends LikeData {
  id: number;
  postId: number | string;
}

function normalizePostId(postId: number | string): number | string {
  const numeric = Number(postId);
  return Number.isFinite(numeric) ? numeric : postId.toString();
}

function toLike(record: LikeRecord): LikeData {
  return {
    count: record.count,
    likedByUser: record.likedByUser,
  };
}

async function findLikeRecord(
  postId: number | string
): Promise<LikeRecord | undefined> {
  const normalizedPostId = normalizePostId(postId);
  const response = await axios.get<LikeRecord[]>(LIKES_ENDPOINT, {
    params: { postId: normalizedPostId },
  });
  return response.data[0];
}

export async function getLikesByPostId(
  postId: number | string
): Promise<LikeData> {
  try {
    const record = await findLikeRecord(postId);
    if (!record) {
      return {
        count: 0,
        likedByUser: false,
      };
    }
    return toLike(record);
  } catch (error) {
    console.error("Error al obtener likes desde json-server:", error);
    return {
      count: 0,
      likedByUser: false,
    };
  }
}

export async function getAllLikes(): Promise<
  Record<string, LikeData>
> {
  try {
    const response = await axios.get<LikeRecord[]>(LIKES_ENDPOINT);
    return response.data.reduce<Record<string, LikeData>>(
      (accumulator, record) => {
        const key = record.postId.toString();
        accumulator[key] = toLike(record);
        return accumulator;
      },
      {}
    );
  } catch (error) {
    console.error("Error al obtener todos los likes:", error);
    return {};
  }
}

export async function toggleLike(postId: number | string): Promise<LikeData> {
  try {
    const existing = await findLikeRecord(postId);
    const normalizedPostId = normalizePostId(postId);

    if (!existing) {
      const response = await axios.post<LikeRecord>(LIKES_ENDPOINT, {
        postId: normalizedPostId,
        count: 1,
        likedByUser: true,
      });
      return toLike(response.data);
    }

    const nextState: LikeData = {
      count: existing.likedByUser
        ? Math.max(existing.count - 1, 0)
        : existing.count + 1,
      likedByUser: !existing.likedByUser,
    };

    const response = await axios.patch<LikeRecord>(
      `${LIKES_ENDPOINT}/${existing.id}`,
      nextState
    );
    return toLike(response.data);
  } catch (error) {
    console.error("Error al alternar like en json-server:", error);
    throw error;
  }
}

export async function initializeLikes(): Promise<void> {
  // La inicialización ya no es necesaria, pero se mantiene por compatibilidad.
  return Promise.resolve();
}
