"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  PostFeedItemDto,
  CreatePostDto,
  UpdatePostDto,
  PostCommentDto,
  CreatePostCommentDto,
  PostLikeStateDto,
  PostFeedItemDtoPagedResult,
} from "@/types/post";
import { UserPublicProfileDto } from "@/types/user";
import { useAuthStore } from "@/store/authStore";

export const useFeedQueries = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  const enrichWithProfiles = async <
    T extends {
      userId: number;
      repostSourceUserId?: number | null;
      authorName?: string;
      authorAvatar?: string | null;
      authorHeadline?: string | null;
      user?: any;
    },
  >(
    items: T[],
  ): Promise<T[]> => {
    if (!items.length) return items;

    const userIdsInItems = items.map((i) => i.userId);
    const repostUserIds = items
      .map((i) => i.repostSourceUserId)
      .filter(Boolean) as number[];
    const uniqueUserIds = Array.from(
      new Set([...userIdsInItems, ...repostUserIds]),
    ).filter(Boolean);

    if (!uniqueUserIds.length) return items;

    try {
      // Parallel fetch all profiles using the specific /Profile/by-user/{id} endpoint
      // while using queryClient to cache results and avoid redundant network calls
      const profilePromises = uniqueUserIds.map((userId) =>
        queryClient.fetchQuery({
          queryKey: ["profiles", "basic", "user", userId],
          queryFn: async () => {
            const res = await api.get(`/Profile/by-user/${userId}`);
            return res.data?.data ?? res.data;
          },
          staleTime: 5 * 60 * 1000, // 5 minutes cache
        }),
      );

      const profilesData = await Promise.all(profilePromises);
      const profiles = profilesData.filter(Boolean);
      const profileMap = new Map(profiles.map((p) => [p.userId || p.id, p]));

      return items.map((item) => {
        const profile = profileMap.get(item.userId);
        if (profile) {
          const authorName =
            profile.fullName ||
            (profile.firstName
              ? `${profile.firstName} ${profile.lastName || ""}`.trim()
              : null) ||
            "Collaborator";
          const authorAvatar = profile.photoUrl || profile.avatarUrl || null;
          const authorHeadline = profile.headline || profile.title || null;

          return {
            ...item,
            authorName,
            authorAvatar,
            authorHeadline,
            user: {
              id: profile.userId || profile.id,
              name: authorName,
              imageUrl: authorAvatar,
              headline: authorHeadline,
            },
          };
        }
        return item;
      });
    } catch (error) {
      console.error("Failed to enrich items with profiles:", error);
      return items;
    }
  };

  // GET /api/Post/feed
  const useGetFeed = (params?: { PageNumber?: number; PageSize?: number }) => {
    return useQuery<PostFeedItemDto[]>({
      queryKey: ["feed", params],
      queryFn: async () => {
        const res = await api.get("/Post/feed", { params });
        const data = res.data?.data ?? res.data ?? [];
        const items = Array.isArray(data) ? data : (data.items ?? []);
        return enrichWithProfiles(items);
      },
    });
  };

  // GET /api/Post
  const useGetPosts = () => {
    return useQuery<PostFeedItemDto[]>({
      queryKey: ["posts"],
      queryFn: async () => {
        const res = await api.get("/Post");
        const data = res.data?.data ?? res.data ?? [];
        return enrichWithProfiles(data);
      },
    });
  };

  // GET /api/Post/{id}
  const useGetPostById = (id: number) => {
    return useQuery<PostFeedItemDto>({
      queryKey: ["posts", id],
      queryFn: async () => {
        const res = await api.get(`/Post/${id}`);
        const data = res.data?.data ?? res.data;
        if (!data) return data;
        const enriched = await enrichWithProfiles([data]);
        return enriched[0];
      },
      enabled: !!id,
    });
  };

  // POST /api/Post
  const useCreatePost = () => {
    return useMutation<void, Error, CreatePostDto>({
      mutationFn: async (data) => {
        const res = await api.post("/Post", data);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["feed"] });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    });
  };

  // PUT /api/Post/{id}
  const useUpdatePost = (id: number) => {
    return useMutation<void, Error, UpdatePostDto>({
      mutationFn: async (data) => {
        const res = await api.put(`/Post/${id}`, data);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["feed"] });
        queryClient.invalidateQueries({ queryKey: ["posts", id] });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    });
  };

  // DELETE /api/Post/{id}
  const useDeletePost = () => {
    return useMutation<void, Error, number>({
      mutationFn: async (id) => {
        await api.delete(`/Post/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["feed"] });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    });
  };

  // POST /api/Post/{postId}/like
  const useLikePost = (postId: number) => {
    return useMutation<PostLikeStateDto, Error, void>({
      mutationFn: async () => {
        const res = await api.post(`/Post/${postId}/like`);
        return res.data?.data ?? res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["feed"] });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        queryClient.invalidateQueries({ queryKey: ["posts", postId] });
      },
    });
  };

  // POST /api/Post/{postId}/repost
  const useRepost = (postId: number) => {
    return useMutation<void, Error, void>({
      mutationFn: async () => {
        const res = await api.post(`/Post/${postId}/repost`);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["feed"] });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        queryClient.invalidateQueries({ queryKey: ["posts", postId] });
      },
    });
  };

  // GET /api/Post/{postId}/comments
  const useGetComments = (postId: number, isEnabled: boolean = true) => {
    return useQuery<PostCommentDto[]>({
      queryKey: ["posts", postId, "comments"],
      queryFn: async () => {
        const res = await api.get(`/Post/${postId}/comments`);
        let data = res.data?.data ?? res.data ?? [];

        if (currentUser?.userId) {
          const currentUserId = Number(currentUser.userId);
          data = [...data].sort((a, b) => {
            if (a.userId === currentUserId && b.userId !== currentUserId)
              return -1;
            if (a.userId !== currentUserId && b.userId === currentUserId)
              return 1;
            return 0; // Keep relative order for others
          });
        }

        return enrichWithProfiles(data);
      },
      enabled: !!postId && isEnabled,
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
        queryClient.invalidateQueries({
          queryKey: ["posts", postId, "comments"],
        });
        queryClient.invalidateQueries({ queryKey: ["feed"] });
      },
    });
  };

  return {
    useGetFeed,
    useGetPosts,
    useGetPostById,
    useCreatePost,
    useUpdatePost,
    useDeletePost,
    useLikePost,
    useRepost,
    useGetComments,
    useAddComment,
  };
};
