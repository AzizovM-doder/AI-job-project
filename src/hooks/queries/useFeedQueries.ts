'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { 
  PostFeedItemDto, 
  CreatePostDto, 
  UpdatePostDto, 
  PostCommentDto, 
  CreatePostCommentDto,
  PostLikeStateDto,
  PostFeedItemDtoPagedResult
} from '@/types/post';

export const useFeedQueries = () => {
  const queryClient = useQueryClient();

  // GET /api/Post/feed
  const useGetFeed = (params?: { PageNumber?: number, PageSize?: number }) => {
    return useQuery<PostFeedItemDto[]>({
      queryKey: ['feed', params],
      queryFn: async () => {
        const res = await api.get('/Post/feed', { params });
        // The API returns PostFeedItemDtoPagedResult or just items[]?
        // Swagger says GET /api/Post/feed returns 200 Success with PostFeedItemDto[] context in schemas
        const data = res.data?.data ?? res.data ?? [];
        return Array.isArray(data) ? data : data.items ?? [];
      },
    });
  };

  // POST /api/Post
  const useCreatePost = () => {
    return useMutation<void, Error, CreatePostDto>({
      mutationFn: async (data) => {
        const res = await api.post('/Post', data);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['feed'] });
      },
    });
  };

  // POST /api/Post/{postId}/like
  const useLikePost = () => {
    return useMutation<PostLikeStateDto, Error, number>({
      mutationFn: async (postId) => {
        const res = await api.post(`/Post/${postId}/like`);
        return res.data?.data ?? res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['feed'] });
      },
    });
  };

  // POST /api/Post/{postId}/repost
  const useRepost = () => {
    return useMutation<void, Error, number>({
      mutationFn: async (postId) => {
        const res = await api.post(`/Post/${postId}/repost`);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['feed'] });
      },
    });
  };

  // GET /api/Post/{postId}/comments
  const useGetComments = (postId: number) => {
    return useQuery<PostCommentDto[]>({
      queryKey: ['posts', postId, 'comments'],
      queryFn: async () => {
        const res = await api.get(`/Post/${postId}/comments`);
        return res.data?.data ?? res.data ?? [];
      },
      enabled: !!postId,
    });
  };

  // POST /api/Post/{postId}/comments
  const useAddComment = (postId: number) => {
    return useMutation<PostCommentDto, Error, CreatePostCommentDto>({
      mutationFn: async (data) => {
        const res = await api.post(`/Post/${postId}/comments`, data);
        return res.data?.data ?? res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts', postId, 'comments'] });
        queryClient.invalidateQueries({ queryKey: ['feed'] });
      },
    });
  };

  return {
    useGetFeed,
    useCreatePost,
    useLikePost,
    useRepost,
    useGetComments,
    useAddComment,
  };
};
