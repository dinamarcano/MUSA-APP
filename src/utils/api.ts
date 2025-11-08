import type { Post } from "../types/posts";

const STORAGE_KEY = "fake_posts_db";

// Obtener todas las publicaciones
export function getPosts(): Post[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Guardar todas las publicaciones en localStorage
function savePosts(posts: Post[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// Crear una nueva publicación
export function createPost(postData: Partial<Post>): Post {
  const posts = getPosts();
  const newPost: Post = {
    id: Date.now(),
    image: postData.image || "",
    title: postData.title || "",
    description: postData.description || "",
    author: postData.author || "Anónimo",
    likes: 0,
    likedByMe: false,
    comments: [],
  };
  const updated = [newPost, ...posts];
  savePosts(updated);
  return newPost;
}

// Alternar el like
export function toggleLike(post: Post): Post {
  const posts = getPosts();
  const updated = posts.map((p) =>
    p.id === post.id
      ? {
          ...p,
          likedByMe: !p.likedByMe,
          likes: p.likedByMe ? p.likes - 1 : p.likes + 1,
        }
      : p
  );
  savePosts(updated);
  return updated.find((p) => p.id === post.id)!;
}

// ✅ Actualizar una publicación (por ejemplo, al agregar comentarios)
export function updatePost(updatedPost: Post): Post {
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === updatedPost.id);
  if (index !== -1) {
    posts[index] = updatedPost;
    savePosts(posts);
  }
  return updatedPost;
}
