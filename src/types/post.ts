export interface Post {
  id: number;
  userId: number;
  content: string | null;
  imageUrl: string | null;
  createdAt: string;
  repostOfPostId: number | null;
  repostSourceUserId: number | null;
  likeCount: number;
  likedByMe: boolean;
  repostCount: number;
  authorName?: string;
  authorAvatar?: string | null;
  authorHeadline?: string | null;
  commentsCount?: number;
  user?: {
    id: number;
    name: string | null;
    imageUrl: string | null;
    headline: string | null;
  };
}

export type PostFeedItemDto = Post;

export interface PostCommentDto {
  id: number;
  postId: number;
  userId: number;
  content: string | null;
  createdAt: string;
  authorName?: string;
  authorAvatar?: string | null;
  authorHeadline?: string | null;
  user?: {
    id: number;
    name: string | null;
    imageUrl: string | null;
    headline: string | null;
  };
}

export interface PostLikeStateDto {
  postId: number;
  likeCount: number;
  likedByMe: boolean;
}

export interface CreatePostDto {
  content: string | null;
  imageUrl: string | null;
}

export interface UpdatePostDto {
  content: string | null;
  imageUrl: string | null;
}

export interface CreatePostCommentDto {
  content: string | null;
}

export interface PostFeedItemDtoPagedResult {
  items: PostFeedItemDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PostResponse {
  statusCode: number;
  description: string[] | null;
  data: Post;
}
