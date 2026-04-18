'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Post, PostCommentDto } from '@/types/post';

export const useFeed = () => {
  const queryClient = useQueryClient();

  const useGetFeed = () => {
    return useQuery<Post[]>({
      queryKey: ['feed'],
      queryFn: async () => {
        const response = await api.get('/Post/feed');
        // If wrapped in ApiResponseWrapper, adjust here
        return response.data.data ?? response.data ?? null;
      },
    });
  };

  const useCreatePost = () => {
    return useMutation({
      mutationFn: async (content: string) => {
        const response = await api.post('/Post', { content });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['feed'] });
      },
    });
  };

  const useLikePost = () => {
    return useMutation({
      mutationFn: async (postId: number) => {
        const response = await api.post(`/Post/${postId}/like`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['feed'] });
      },
    });
  };

  const useGetComments = (postId: number) => {
    return useQuery<PostCommentDto[]>({
      queryKey: ['comments', postId],
      queryFn: async () => {
        const response = await api.get(`/Post/${postId}/comments`);
        return response.data.data ?? response.data ?? null;
      },
      enabled: !!postId,
    });
  };

  const useAddComment = (postId: number) => {
    return useMutation({
      mutationFn: async (content: string) => {
        const response = await api.post(`/Post/${postId}/comments`, { content });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        queryClient.invalidateQueries({ queryKey: ['feed'] });
      },
    });
  };

  return {
    useGetFeed,
    useCreatePost,
    useLikePost,
    useGetComments,
    useAddComment,
  };
};
