export interface Post {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
}

export interface PostComment {
  id: number;
  postId: number;
  content: string;
  authorId: number;
  authorName: string;
  createdAt: string;
}
