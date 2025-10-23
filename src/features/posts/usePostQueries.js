import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '../../shared/hooks/useAxios';
import useAxiosSecure from '../../shared/hooks/useAxiosSecure';
import Swal from 'sweetalert2';

// Query Keys
export const postKeys = {
  all: ['posts'],
  lists: () => [...postKeys.all, 'list'],
  list: (filters) => [...postKeys.lists(), { filters }],
  details: () => [...postKeys.all, 'detail'],
  detail: (id) => [...postKeys.details(), id],
  userPosts: (email) => [...postKeys.all, 'user', email],
  volunteerRequests: () => [...postKeys.all, 'volunteer-requests'],
  userRequests: (email) => [...postKeys.volunteerRequests(), 'user', email],
};

// Custom hook for all post-related operations
export const usePostQueries = () => {
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ==================== QUERIES ====================

  // Fetch all posts with optional filters
  const usePosts = (filters = {}) => {
    return useQuery({
      queryKey: postKeys.list(filters),
      queryFn: async () => {
        const response = await axiosPublic.get('/posts', { params: filters });
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Fetch single post by ID
  const usePost = (id) => {
    return useQuery({
      queryKey: postKeys.detail(id),
      queryFn: async () => {
        const response = await axiosPublic.get(`/posts/${id}`);
        return response.data;
      },
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Fetch user's own posts
  const useUserPosts = (userEmail) => {
    return useQuery({
      queryKey: postKeys.userPosts(userEmail),
      queryFn: async () => {
        const response = await axiosSecure.get('/posts', { 
          params: { organizerEmail: userEmail } 
        });
        return response.data;
      },
      enabled: !!userEmail,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Fetch volunteer requests for a user
  const useUserVolunteerRequests = (userEmail) => {
    return useQuery({
      queryKey: postKeys.userRequests(userEmail),
      queryFn: async () => {
        const response = await axiosSecure.get('/volunteer-requests', { 
          params: { email: userEmail } 
        });
        return response.data;
      },
      enabled: !!userEmail,
      staleTime: 2 * 60 * 1000,
    });
  };

  // ==================== MUTATIONS ====================

  // Create new post
  const useCreatePost = () => {
    return useMutation({
      mutationFn: async (postData) => {
        const response = await axiosSecure.post('/posts', postData);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate and refetch posts list
        queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        queryClient.invalidateQueries({ queryKey: postKeys.all });
        
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Post created successfully!',
          text: 'Your volunteer opportunity is now live.',
          showConfirmButton: false,
          timer: 2000
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to create post',
        });
      },
    });
  };

  // Update existing post
  const useUpdatePost = () => {
    return useMutation({
      mutationFn: async ({ id, postData }) => {
        const response = await axiosSecure.put(`/posts/${id}`, postData);
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Update the specific post in cache
        queryClient.setQueryData(postKeys.detail(variables.id), data);
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        queryClient.invalidateQueries({ queryKey: postKeys.all });
        
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Your post has been updated successfully.',
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

  // Delete post
  const useDeletePost = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await axiosSecure.delete(`/posts/${id}`);
        return response.data;
      },
      onSuccess: (_, id) => {
        // Remove from cache
        queryClient.removeQueries({ queryKey: postKeys.detail(id) });
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        queryClient.invalidateQueries({ queryKey: postKeys.all });
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Your post has been successfully deleted.',
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

  // Apply for volunteer opportunity
  const useApplyForPost = () => {
    return useMutation({
      mutationFn: async (applicationData) => {
        const response = await axiosSecure.post('/volunteer-requests', applicationData);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate volunteer requests
        queryClient.invalidateQueries({ queryKey: postKeys.volunteerRequests() });
        
        Swal.fire({
          icon: 'success',
          title: 'Application Submitted!',
          text: 'Your application has been submitted successfully.',
          confirmButtonText: 'Great!'
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Application Failed',
          text: error.message || 'Failed to submit application',
        });
      },
    });
  };

  // Cancel volunteer request
  const useCancelVolunteerRequest = () => {
    return useMutation({
      mutationFn: async (requestId) => {
        const response = await axiosSecure.delete(`/volunteer-requests/${requestId}`);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate volunteer requests
        queryClient.invalidateQueries({ queryKey: postKeys.volunteerRequests() });
        
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your request has been successfully cancelled.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to cancel request',
        });
      },
    });
  };

  // Decrease volunteer count (when someone applies)
  const useDecreaseVolunteerCount = () => {
    return useMutation({
      mutationFn: async (postId) => {
        const response = await axiosSecure.patch(`/posts/${postId}/decrease-volunteers`);
        return response.data;
      },
      onSuccess: (data, postId) => {
        // Invalidate the specific post and posts list
        queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
        queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      },
      onError: (error) => {
        console.error('Failed to decrease volunteer count:', error);
      },
    });
  };

  // ==================== UTILITY FUNCTIONS ====================

  // Prefetch a post (useful for hover effects)
  const prefetchPost = (id) => {
    queryClient.prefetchQuery({
      queryKey: postKeys.detail(id),
      queryFn: async () => {
        const response = await axiosPublic.get(`/posts/${id}`);
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  // Optimistic update for like/save actions
  const useOptimisticLike = () => {
    return useMutation({
      mutationFn: async ({ postId, isLiked }) => {
        // This would be your actual API call
        const response = await axiosSecure.patch(`/posts/${postId}/like`, { isLiked });
        return response.data;
      },
      onMutate: async ({ postId, isLiked }) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });
        
        // Snapshot previous value
        const previousPost = queryClient.getQueryData(postKeys.detail(postId));
        
        // Optimistically update
        queryClient.setQueryData(postKeys.detail(postId), (old) => ({
          ...old,
          isLiked,
          likesCount: old.likesCount + (isLiked ? 1 : -1)
        }));
        
        return { previousPost };
      },
      onError: (err, variables, context) => {
        // Rollback on error
        if (context?.previousPost) {
          queryClient.setQueryData(postKeys.detail(variables.postId), context.previousPost);
        }
      },
      onSettled: (data, error, variables) => {
        // Always refetch after error or success
        queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      },
    });
  };

  // ==================== RETURN ALL HOOKS ====================

  return {
    // Queries
    usePosts,
    usePost,
    useUserPosts,
    useUserVolunteerRequests,
    
    // Mutations
    useCreatePost,
    useUpdatePost,
    useDeletePost,
    useApplyForPost,
    useCancelVolunteerRequest,
    useDecreaseVolunteerCount,
    useOptimisticLike,
    
    // Utilities
    prefetchPost,
    
    // Query Keys (for external use)
    postKeys,
  };
};

export default usePostQueries;
