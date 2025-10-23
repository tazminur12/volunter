import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '../../shared/hooks/useAxios';
import useAxiosSecure from '../../shared/hooks/useAxiosSecure';
import Swal from 'sweetalert2';

// Query Keys
export const ratingKeys = {
  all: ['ratings'],
  lists: () => [...ratingKeys.all, 'list'],
  list: (filters) => [...ratingKeys.lists(), { filters }],
  details: () => [...ratingKeys.all, 'detail'],
  detail: (id) => [...ratingKeys.details(), id],
  postRatings: (postId) => [...ratingKeys.all, 'post', postId],
  userRatings: (userEmail) => [...ratingKeys.all, 'user', userEmail],
  adminRatings: () => [...ratingKeys.all, 'admin'],
  stats: () => [...ratingKeys.all, 'stats'],
};

// Custom hook for all rating-related operations
export const useRatingQueries = () => {
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ==================== QUERIES ====================

  // Fetch ratings for a specific post
  const usePostRatings = (postId) => {
    return useQuery({
      queryKey: ratingKeys.postRatings(postId),
      queryFn: async () => {
        const response = await axiosSecure.get(`/ratings/post/${postId}`);
        return response.data;
      },
      enabled: !!postId,
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Fetch user's own ratings
  const useUserRatings = (userEmail) => {
    return useQuery({
      queryKey: ratingKeys.userRatings(userEmail),
      queryFn: async () => {
        const response = await axiosSecure.get('/my-ratings');
        return response.data;
      },
      enabled: !!userEmail,
      staleTime: 2 * 60 * 1000,
    });
  };

  // Fetch all ratings (admin only)
  const useAllRatings = (filters = {}) => {
    return useQuery({
      queryKey: ratingKeys.list(filters),
      queryFn: async () => {
        const response = await axiosSecure.get('/admin/ratings', { params: filters });
        return response.data;
      },
      staleTime: 1 * 60 * 1000, // 1 minute
    });
  };

  // Fetch rating statistics
  const useRatingStats = () => {
    return useQuery({
      queryKey: ratingKeys.stats(),
      queryFn: async () => {
        const response = await axiosSecure.get('/ratings/stats');
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Fetch single rating by ID
  const useRating = (id) => {
    return useQuery({
      queryKey: ratingKeys.detail(id),
      queryFn: async () => {
        const response = await axiosSecure.get(`/ratings/${id}`);
        return response.data;
      },
      enabled: !!id,
      staleTime: 2 * 60 * 1000,
    });
  };

  // ==================== MUTATIONS ====================

  // Create new rating
  const useCreateRating = () => {
    return useMutation({
      mutationFn: async (ratingData) => {
        const response = await axiosSecure.post('/ratings', ratingData);
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ratingKeys.postRatings(variables.postId) });
        queryClient.invalidateQueries({ queryKey: ratingKeys.userRatings(variables.reviewerEmail) });
        queryClient.invalidateQueries({ queryKey: ratingKeys.all });
        queryClient.invalidateQueries({ queryKey: ratingKeys.stats() });
        
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Rating submitted!',
          text: 'Thank you for your feedback.',
          showConfirmButton: false,
          timer: 2000
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to submit rating',
        });
      },
    });
  };

  // Update existing rating
  const useUpdateRating = () => {
    return useMutation({
      mutationFn: async ({ id, ratingData }) => {
        const response = await axiosSecure.put(`/ratings/${id}`, ratingData);
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Update the specific rating in cache
        queryClient.setQueryData(ratingKeys.detail(variables.id), data);
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ratingKeys.postRatings(data.rating?.postId) });
        queryClient.invalidateQueries({ queryKey: ratingKeys.userRatings(data.rating?.reviewerEmail) });
        queryClient.invalidateQueries({ queryKey: ratingKeys.all });
        queryClient.invalidateQueries({ queryKey: ratingKeys.stats() });
        
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Your rating has been updated successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to update rating',
        });
      },
    });
  };

  // Delete rating
  const useDeleteRating = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await axiosSecure.delete(`/ratings/${id}`);
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Remove from cache
        queryClient.removeQueries({ queryKey: ratingKeys.detail(variables) });
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ratingKeys.all });
        queryClient.invalidateQueries({ queryKey: ratingKeys.stats() });
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Rating has been successfully deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete rating',
        });
      },
    });
  };

  // Admin delete rating
  const useAdminDeleteRating = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await axiosSecure.delete(`/ratings/${id}`);
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Remove from cache
        queryClient.removeQueries({ queryKey: ratingKeys.detail(variables) });
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ratingKeys.all });
        queryClient.invalidateQueries({ queryKey: ratingKeys.adminRatings() });
        queryClient.invalidateQueries({ queryKey: ratingKeys.stats() });
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Rating has been successfully deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete rating',
        });
      },
    });
  };

  // ==================== UTILITY FUNCTIONS ====================

  // Prefetch post ratings (useful for hover effects)
  const prefetchPostRatings = (postId) => {
    queryClient.prefetchQuery({
      queryKey: ratingKeys.postRatings(postId),
      queryFn: async () => {
        const response = await axiosSecure.get(`/ratings/post/${postId}`);
        return response.data;
      },
      staleTime: 2 * 60 * 1000,
    });
  };

  // Calculate average rating from ratings array
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return sum / ratings.length;
  };

  // Get rating distribution (count of each star rating)
  const getRatingDistribution = (ratings) => {
    if (!ratings || ratings.length === 0) return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    return ratings.reduce((dist, rating) => {
      dist[rating.rating] = (dist[rating.rating] || 0) + 1;
      return dist;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  };

  // Check if user has already rated a post
  const hasUserRated = (ratings, userEmail) => {
    if (!ratings || !userEmail) return false;
    return ratings.some(rating => rating.reviewerEmail === userEmail);
  };

  // Get user's rating for a specific post
  const getUserRating = (ratings, userEmail) => {
    if (!ratings || !userEmail) return null;
    return ratings.find(rating => rating.reviewerEmail === userEmail) || null;
  };

  // ==================== OPTIMISTIC UPDATES ====================

  // Optimistic rating update
  const useOptimisticRatingUpdate = () => {
    return useMutation({
      mutationFn: async ({ id, ratingData }) => {
        const response = await axiosSecure.put(`/ratings/${id}`, ratingData);
        return response.data;
      },
      onMutate: async ({ id, ratingData }) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: ratingKeys.detail(id) });
        
        // Snapshot previous value
        const previousRating = queryClient.getQueryData(ratingKeys.detail(id));
        
        // Optimistically update
        queryClient.setQueryData(ratingKeys.detail(id), (old) => ({
          ...old,
          ...ratingData,
          updatedAt: new Date().toISOString()
        }));
        
        return { previousRating };
      },
      onError: (err, variables, context) => {
        // Rollback on error
        if (context?.previousRating) {
          queryClient.setQueryData(ratingKeys.detail(variables.id), context.previousRating);
        }
      },
      onSettled: (data, error, variables) => {
        // Always refetch after error or success
        queryClient.invalidateQueries({ queryKey: ratingKeys.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: ratingKeys.all });
      },
    });
  };

  // ==================== RETURN ALL HOOKS ====================

  return {
    // Queries
    usePostRatings,
    useUserRatings,
    useAllRatings,
    useRatingStats,
    useRating,
    
    // Mutations
    useCreateRating,
    useUpdateRating,
    useDeleteRating,
    useAdminDeleteRating,
    useOptimisticRatingUpdate,
    
    // Utilities
    prefetchPostRatings,
    calculateAverageRating,
    getRatingDistribution,
    hasUserRated,
    getUserRating,
    
    // Query Keys (for external use)
    ratingKeys,
  };
};

export default useRatingQueries;
