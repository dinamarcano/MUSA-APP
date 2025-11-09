export interface Comment {
  id: number;
  author: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: number;
  image: string;
  title: string;
  description: string;
  author: string;
  likes: number;
  likedByMe?: boolean;
  comments: Comment[];
}