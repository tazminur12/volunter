import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '../../shared/hooks/useAxios';
import useAxiosSecure from '../../shared/hooks/useAxiosSecure';
import useAuth from '../../shared/hooks/useAuth';
import Swal from 'sweetalert2';

// Query Keys for Impact Feed
export const impactFeedKeys = {
  all: ['impact-feed'],
  lists: () => [...impactFeedKeys.all, 'list'],
  list: (filters) => [...impactFeedKeys.lists(), { filters }],
  details: () => [...impactFeedKeys.all, 'detail'],
  detail: (id) => [...impactFeedKeys.details(), id],
  userPosts: (email) => [...impactFeedKeys.all, 'user', email],
  comments: (postId) => [...impactFeedKeys.all, 'comments', postId],
  likes: (postId) => [...impactFeedKeys.all, 'likes', postId],
};

// Custom hook for all impact feed operations
export const useImpactFeedQueries = () => {
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // ==================== QUERIES ====================

  // Fetch all impact feed posts with optional filters
  const useImpactFeedPosts = (filters = {}) => {
    return useQuery({
      queryKey: impactFeedKeys.list(filters),
      queryFn: async () => {
        try {
          // Map frontend filters to backend API parameters
          const apiParams = {
            category: filters.category === 'all' ? undefined : filters.category,
            sortBy: filters.sortBy === 'newest' ? 'createdAt' : 
                   filters.sortBy === 'oldest' ? 'createdAt' : 
                   filters.sortBy === 'mostLiked' ? 'likesCount' : 
                   filters.sortBy === 'mostCommented' ? 'commentsCount' : 'createdAt',
            sortOrder: filters.sortBy === 'oldest' ? 'asc' : 'desc',
            page: filters.page || 1,
            limit: filters.limit || 10
          };

          const response = await axiosPublic.get('/impact-feed', { params: apiParams });
          return response.data || { posts: [], pagination: {} };
        } catch (error) {
          // If the API endpoint doesn't exist yet, return empty array
          if (error.response?.status === 404) {
            return { posts: [], pagination: {} };
          }
          throw error;
        }
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: false, // Don't retry on 404 errors
    });
  };

  // Fetch single impact post by ID
  const useImpactPost = (id) => {
    return useQuery({
      queryKey: impactFeedKeys.detail(id),
      queryFn: async () => {
        try {
          const response = await axiosPublic.get(`/impact-feed/${id}`);
          return response.data;
        } catch (error) {
          if (error.response?.status === 404) {
            return null;
          }
          throw error;
        }
      },
      enabled: !!id,
      staleTime: 2 * 60 * 1000,
      retry: false,
    });
  };

  // Fetch user's own impact posts
  const useUserImpactPosts = (userEmail) => {
    return useQuery({
      queryKey: impactFeedKeys.userPosts(userEmail),
      queryFn: async () => {
        try {
          const response = await axiosSecure.get('/impact-feed', { 
            params: { userEmail } 
          });
          return response.data || { posts: [], pagination: {} };
        } catch (error) {
          if (error.response?.status === 404) {
            return { posts: [], pagination: {} };
          }
          throw error;
        }
      },
      enabled: !!userEmail,
      staleTime: 2 * 60 * 1000,
      retry: false,
    });
  };

  // Fetch comments for a post
  const usePostComments = (postId) => {
    return useQuery({
      queryKey: impactFeedKeys.comments(postId),
      queryFn: async () => {
        try {
          const response = await axiosPublic.get(`/impact-feed/${postId}/comments`);
          return response.data || { comments: [], pagination: {} };
        } catch (error) {
          if (error.response?.status === 404) {
            return { comments: [], pagination: {} };
          }
          throw error;
        }
      },
      enabled: !!postId,
      staleTime: 1 * 60 * 1000, // 1 minute
      retry: false,
    });
  };

  // ==================== MUTATIONS ====================

  // Create new impact post
  const useCreateImpactPost = () => {
    return useMutation({
      mutationFn: async (postData) => {
        if (!user?.email) {
          throw new Error('User must be logged in to create a post');
        }
        
        // Map frontend data to backend API structure
        const apiData = {
          title: postData.title,
          description: postData.content, // Map content to description
          content: postData.content,
          images: postData.images || [],
          category: postData.category || 'general',
          tags: postData.tags || [],
          createdBy: user.email // Add user email
        };
        
        console.log('Sending post data:', apiData);
        const response = await axiosSecure.post('/impact-feed', apiData);
        console.log('Post creation response:', response.data);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate and refetch impact feed
        queryClient.invalidateQueries({ queryKey: impactFeedKeys.lists() });
        queryClient.invalidateQueries({ queryKey: impactFeedKeys.all });
        
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Post shared successfully!',
          text: 'Your impact story is now live on the community wall.',
          showConfirmButton: false,
          timer: 2000
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to share your story',
        });
      },
    });
  };

  // Update existing impact post
  const useUpdateImpactPost = () => {
    return useMutation({
      mutationFn: async ({ id, postData }) => {
        if (!user?.email) {
          throw new Error('User must be logged in to update a post');
        }
        
        // Map frontend data to backend API structure
        const apiData = {
          title: postData.title,
          description: postData.content, // Map content to description
          content: postData.content,
          images: postData.images || [],
          category: postData.category || 'general',
          tags: postData.tags || [],
          createdBy: user.email // Add user email
        };
        
        const response = await axiosSecure.put(`/impact-feed/${id}`, apiData);
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Update the specific post in cache
        queryClient.setQueryData(impactFeedKeys.detail(variables.id), data);
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: impactFeedKeys.lists() });
        queryClient.invalidateQueries({ queryKey: impactFeedKeys.all });
        
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Your impact story has been updated successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to update post',
        });
      },
    });
  };

  // Delete impact post
  const useDeleteImpactPost = () => {
    return useMutation({
      mutationFn: async (id) => {
        if (!user?.email) {
          throw new Error('User must be logged in to delete a post');
        }
        
        const response = await axiosSecure.delete(`/impact-feed/${id}`, {
          data: { createdBy: user.email }
        });
        return response.data;
      },
      onSuccess: (_, id) => {
        // Remove from cache
        queryClient.removeQueries({ queryKey: impactFeedKeys.detail(id) });
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: impactFeedKeys.lists() });
        queryClient.invalidateQueries({ queryKey: impactFeedKeys.all });
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Your impact story has been successfully deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to delete post',
        });
      },
    });
  };

  // Like/Unlike a post
  const useToggleLike = () => {
    return useMutation({
      mutationFn: async ({ postId, isLiked }) => {
        if (!user?.email) {
          throw new Error('User must be logged in to like a post');
        }
        
        const response = await axiosSecure.patch(`/impact-feed/${postId}/like`, { 
          isLiked,
          userEmail: user.email 
        });
        return response.data;
      },
      onMutate: async ({ postId, isLiked }) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: impactFeedKeys.detail(postId) });
        await queryClient.cancelQueries({ queryKey: impactFeedKeys.lists() });
        
        // Snapshot previous values
        const previousPost = queryClient.getQueryData(impactFeedKeys.detail(postId));
        const previousList = queryClient.getQueryData(impactFeedKeys.lists());
        
        // Optimistically update post detail
        if (previousPost) {
          queryClient.setQueryData(impactFeedKeys.detail(postId), (old) => ({
            ...old,
            isLiked,
            likesCount: old.likesCount + (isLiked ? 1 : -1)
          }));
        }
        
        // Optimistically update posts list
        if (previousList) {
          queryClient.setQueryData(impactFeedKeys.lists(), (old) => {
            if (old.posts) {
              return {
                ...old,
                posts: old.posts.map(post => 
                  post._id === postId 
                    ? { ...post, isLiked, likesCount: post.likesCount + (isLiked ? 1 : -1) }
                    : post
                )
              };
            }
            return old;
          });
        }
        
        return { previousPost, previousList };
      },
      onError: (err, variables, context) => {
        // Rollback on error
        if (context?.previousPost) {
          queryClient.setQueryData(impactFeedKeys.detail(variables.postId), context.previousPost);
        }
        if (context?.previousList) {
          queryClient.setQueryData(impactFeedKeys.lists(), context.previousList);
        }
      },
      onSettled: (data, error, variables) => {
        // Always refetch after error or success
        queryClient.invalidateQueries({ queryKey: impactFeedKeys.detail(variables.postId) });
        queryClient.invalidateQueries({ queryKey: impactFeedKeys.lists() });
      },
    });
  };

  // Add comment to a post
  const useAddComment = () => {
    return useMutation({
      mutationFn: async ({ postId, comment }) => {
        if (!user?.email) {
          throw new Error('User must be logged in to add a comment');
        }
        
        const response = await axiosSecure.post(`/impact-feed/${postId}/comments`, { 
          comment,
          authorEmail: user.email 
        });
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate comments for this post
        queryClient.invalidateQueries({ queryKey: impactFeedKeys.comments(variables.postId) });
        // Update post comment count
        queryClient.invalidateQueries({ queryKey: impactFeedKeys.detail(variables.postId) });
        queryClient.invalidateQueries({ queryKey: impactFeedKeys.lists() });
        
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Comment added!',
          showConfirmButton: false,
          timer: 1500
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to add comment',
        });
      },
    });
  };

  // Delete comment
  const useDeleteComment = () => {
    return useMutation({
      mutationFn: async ({ postId, commentId }) => {
        if (!user?.email) {
          throw new Error('User must be logged in to delete a comment');
        }
        
        const response = await axiosSecure.delete(`/impact-feed/${postId}/comments/${commentId}`, {
          data: { userEmail: user.email }
        });
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate comments for this post
        queryClient.invalidateQueries({ queryKey: impactFeedKeys.comments(variables.postId) });
        // Update post comment count
        queryClient.invalidateQueries({ queryKey: impactFeedKeys.detail(variables.postId) });
        queryClient.invalidateQueries({ queryKey: impactFeedKeys.lists() });
        
        Swal.fire({
          title: 'Comment deleted!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to delete comment',
        });
      },
    });
  };

  // Share post (increment share count)
  const useSharePost = () => {
    return useMutation({
      mutationFn: async (postId) => {
        const response = await axiosSecure.patch(`/impact-feed/${postId}/share`);
        return response.data;
      },
      onSuccess: (data, postId) => {
        // Update share count optimistically
        queryClient.setQueryData(impactFeedKeys.detail(postId), (old) => ({
          ...old,
          sharesCount: old.sharesCount + 1
        }));
        
        queryClient.setQueryData(impactFeedKeys.lists(), (old) => {
          if (old.posts) {
            return {
              ...old,
              posts: old.posts.map(post => 
                post._id === postId 
                  ? { ...post, sharesCount: post.sharesCount + 1 }
                  : post
              )
            };
          }
          return old;
        });
        
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Post shared!',
          showConfirmButton: false,
          timer: 1500
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to share post',
        });
      },
    });
  };

  // ==================== UTILITY FUNCTIONS ====================

  // Prefetch an impact post (useful for hover effects)
  const prefetchImpactPost = (id) => {
    queryClient.prefetchQuery({
      queryKey: impactFeedKeys.detail(id),
      queryFn: async () => {
        const response = await axiosPublic.get(`/impact-feed/${id}`);
        return response.data;
      },
      staleTime: 2 * 60 * 1000,
    });
  };

  // ==================== RETURN ALL HOOKS ====================

  return {
    // Queries
    useImpactFeedPosts,
    useImpactPost,
    useUserImpactPosts,
    usePostComments,
    
    // Mutations
    useCreateImpactPost,
    useUpdateImpactPost,
    useDeleteImpactPost,
    useToggleLike,
    useAddComment,
    useDeleteComment,
    useSharePost,
    
    // Utilities
    prefetchImpactPost,
    
    // Query Keys (for external use)
    impactFeedKeys,
  };
};

export default useImpactFeedQueries;
