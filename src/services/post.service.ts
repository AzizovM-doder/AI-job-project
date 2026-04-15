import api from '@/src/lib/api';

export interface Post {
  id: string;
  authorName: string;
  authorId: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export const postService = {
  getFeed: async (page = 1, pageSize = 10): Promise<any> => {
    const response = await api.get('/Posts', { params: { page, pageSize } });
    return response.data;
  },

  createPost: async (content: string): Promise<Post> => {
    const response = await api.post('/Posts', { content });
    return response.data.data;
  },

  likePost: async (postId: string): Promise<void> => {
    await api.post(`/Posts/${postId}/Like`);
  },

  commentOnPost: async (postId: string, content: string): Promise<any> => {
    const response = await api.post(`/Posts/${postId}/Comments`, { content });
    return response.data.data;
  },
};
