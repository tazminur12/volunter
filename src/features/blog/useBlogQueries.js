import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '../../shared/hooks/useAxios';
import useAxiosSecure from '../../shared/hooks/useAxiosSecure';
import Swal from 'sweetalert2';

// Query Keys
export const blogKeys = {
  all: ['blog'],
  lists: () => [...blogKeys.all, 'list'],
  list: (filters) => [...blogKeys.lists(), { filters }],
  details: () => [...blogKeys.all, 'detail'],
  detail: (id) => [...blogKeys.details(), id],
  userPosts: (email) => [...blogKeys.all, 'user', email],
  featured: () => [...blogKeys.all, 'featured'],
  categories: () => [...blogKeys.all, 'categories'],
  ratings: (postId) => [...blogKeys.all, 'ratings', postId],
};

// Custom hook for all blog-related operations
export const useBlogQueries = () => {
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ==================== QUERIES ====================

  // Fetch all blog posts with optional filters
  const useBlogPosts = (filters = {}) => {
    return useQuery({
      queryKey: blogKeys.list(filters),
      queryFn: async () => {
        try {
          // Try to get posts from both endpoints and merge them
          let allPosts = [];
          let hasPosts = false;
          
          // Try the main blog posts endpoint first
          try {
            const response = await axiosSecure.get('/blog-posts');
            
            if (response.data.success && response.data.blogPosts) {
              allPosts = [...allPosts, ...response.data.blogPosts];
              hasPosts = true;
            } else if (response.data.blogPosts) {
              allPosts = [...allPosts, ...response.data.blogPosts];
              hasPosts = true;
            }
          } catch {
            // Silently handle error
          }
          
          // Try the user's blog posts endpoint
          try {
            const userResponse = await axiosSecure.get('/my-blog-posts');
            
            if (userResponse.data.blogPosts && userResponse.data.blogPosts.length > 0) {
              // Merge posts, avoiding duplicates by ID
              const existingIds = new Set(allPosts.map(post => post._id));
              const newPosts = userResponse.data.blogPosts.filter(post => !existingIds.has(post._id));
              
              if (newPosts.length > 0) {
                allPosts = [...allPosts, ...newPosts];
              }
              
              hasPosts = true;
            }
          } catch {
            // Silently handle error
          }
          
          if (hasPosts && allPosts.length > 0) {
            // Fetch ratings for each post to calculate average ratings
            const postsWithRatings = await Promise.all(
              allPosts.map(async (post) => {
                try {
                  const ratingResponse = await axiosSecure.get(`/ratings/post/${post._id}`);
                  if (ratingResponse.data.success && ratingResponse.data.ratings.length > 0) {
                    const averageRating = ratingResponse.data.ratings.reduce((sum, r) => sum + r.rating, 0) / ratingResponse.data.ratings.length;
                    return { ...post, averageRating, ratingCount: ratingResponse.data.ratings.length };
                  }
                  return { ...post, averageRating: 0, ratingCount: 0 };
                } catch {
                  return { ...post, averageRating: 0, ratingCount: 0 };
                }
              })
            );
            
            return { blogPosts: postsWithRatings, success: true };
          } else {
            return { blogPosts: [], success: false, message: 'No blog posts found' };
          }
        } catch (error) {
          throw new Error(`Failed to load blog posts: ${error.message}`);
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Fetch single blog post by ID
  const useBlogPost = (id) => {
    return useQuery({
      queryKey: blogKeys.detail(id),
      queryFn: async () => {
        try {
          // Try the main blog posts endpoint first
          try {
            const response = await axiosSecure.get(`/blog-posts/${id}`);
            
            if (response.data.success && response.data.blogPost) {
              const post = response.data.blogPost;
              // Fetch rating data for this post
              try {
                const ratingResponse = await axiosSecure.get(`/ratings/post/${post._id}`);
                if (ratingResponse.data.success && ratingResponse.data.ratings.length > 0) {
                  const averageRating = ratingResponse.data.ratings.reduce((sum, r) => sum + r.rating, 0) / ratingResponse.data.ratings.length;
                  return { ...post, averageRating, ratingCount: ratingResponse.data.ratings.length };
                } else {
                  return { ...post, averageRating: 0, ratingCount: 0 };
                }
              } catch {
                return { ...post, averageRating: 0, ratingCount: 0 };
              }
            } else if (response.data.blogPost) {
              const post = response.data.blogPost;
              // Fetch rating data for this post
              try {
                const ratingResponse = await axiosSecure.get(`/ratings/post/${post._id}`);
                if (ratingResponse.data.success && ratingResponse.data.ratings.length > 0) {
                  const averageRating = ratingResponse.data.ratings.reduce((sum, r) => sum + r.rating, 0) / ratingResponse.data.ratings.length;
                  return { ...post, averageRating, ratingCount: ratingResponse.data.ratings.length };
                } else {
                  return { ...post, averageRating: 0, ratingCount: 0 };
                }
              } catch {
                return { ...post, averageRating: 0, ratingCount: 0 };
              }
            } else if (response.data) {
              // If the response is the blog post directly
              const post = response.data;
              // Fetch rating data for this post
              try {
                const ratingResponse = await axiosSecure.get(`/ratings/post/${post._id}`);
                if (ratingResponse.data.success && ratingResponse.data.ratings.length > 0) {
                  const averageRating = ratingResponse.data.ratings.reduce((sum, r) => sum + r.rating, 0) / ratingResponse.data.ratings.length;
                  return { ...post, averageRating, ratingCount: ratingResponse.data.ratings.length };
                } else {
                  return { ...post, averageRating: 0, ratingCount: 0 };
                }
              } catch {
                return { ...post, averageRating: 0, ratingCount: 0 };
              }
            }
          } catch {
            // Silently handle error
          }
          
          // If main endpoint failed, try to find the post in user's blog posts
          try {
            const userResponse = await axiosSecure.get('/my-blog-posts');
            
            if (userResponse.data.blogPosts && userResponse.data.blogPosts.length > 0) {
              const foundPost = userResponse.data.blogPosts.find(post => post._id === id);
              
              if (foundPost) {
                // Fetch rating data for this post
                try {
                  const ratingResponse = await axiosSecure.get(`/ratings/post/${foundPost._id}`);
                  if (ratingResponse.data.success && ratingResponse.data.ratings.length > 0) {
                    const averageRating = ratingResponse.data.ratings.reduce((sum, r) => sum + r.rating, 0) / ratingResponse.data.ratings.length;
                    return { ...foundPost, averageRating, ratingCount: ratingResponse.data.ratings.length };
                  } else {
                    return { ...foundPost, averageRating: 0, ratingCount: 0 };
                  }
                } catch {
                  return { ...foundPost, averageRating: 0, ratingCount: 0 };
                }
              }
            }
          } catch {
            // Silently handle error
          }
          
          throw new Error('Blog post not found');
        } catch (error) {
          if (error.response?.status === 404) {
            throw new Error('Blog post not found');
          } else if (error.code === 'ERR_NETWORK') {
            throw new Error('Cannot connect to backend server. Please check if your backend is running.');
          } else {
            throw new Error('Failed to load blog post. Please try again later.');
          }
        }
      },
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Fetch user's own blog posts
  const useUserBlogPosts = (userEmail) => {
    return useQuery({
      queryKey: blogKeys.userPosts(userEmail),
      queryFn: async () => {
        const response = await axiosSecure.get('/my-blog-posts');
        return response.data;
      },
      enabled: !!userEmail,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Fetch featured blog posts
  const useFeaturedBlogPosts = () => {
    return useQuery({
      queryKey: blogKeys.featured(),
      queryFn: async () => {
        const response = await axiosSecure.get('/blog-posts', { 
          params: { featured: true } 
        });
        return response.data;
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Fetch blog categories/tags
  const useBlogCategories = () => {
    return useQuery({
      queryKey: blogKeys.categories(),
      queryFn: async () => {
        const response = await axiosSecure.get('/blog-posts');
        const posts = response.data.blogPosts || [];
        const allTags = [...new Set(posts.flatMap(post => post.tags || []))];
        return allTags;
      },
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  };

  // Fetch ratings for a specific blog post
  const useBlogPostRatings = (postId) => {
    return useQuery({
      queryKey: blogKeys.ratings(postId),
      queryFn: async () => {
        const response = await axiosSecure.get(`/ratings/post/${postId}`);
        return response.data;
      },
      enabled: !!postId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // ==================== MUTATIONS ====================

  // Create new blog post
  const useCreateBlogPost = () => {
    return useMutation({
      mutationFn: async (postData) => {
        const response = await axiosSecure.post('/blog-posts', postData);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate and refetch blog posts list
        queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
        queryClient.invalidateQueries({ queryKey: blogKeys.all });
        
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Blog post created successfully!',
          text: 'Your blog post is now live.',
          showConfirmButton: false,
          timer: 2000
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to create blog post',
        });
      },
    });
  };

  // Update existing blog post
  const useUpdateBlogPost = () => {
    return useMutation({
      mutationFn: async ({ id, postData }) => {
        const response = await axiosSecure.put(`/blog-posts/${id}`, postData);
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Update the specific post in cache
        queryClient.setQueryData(blogKeys.detail(variables.id), data);
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
        queryClient.invalidateQueries({ queryKey: blogKeys.all });
        
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Your blog post has been updated successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to update blog post',
        });
      },
    });
  };

  // Delete blog post
  const useDeleteBlogPost = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await axiosSecure.delete(`/blog-posts/${id}`);
        return response.data;
      },
      onSuccess: (_, id) => {
        // Remove from cache
        queryClient.removeQueries({ queryKey: blogKeys.detail(id) });
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
        queryClient.invalidateQueries({ queryKey: blogKeys.all });
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Your blog post has been successfully deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to delete blog post',
        });
      },
    });
  };

  // Like/Unlike blog post
  const useLikeBlogPost = () => {
    return useMutation({
      mutationFn: async ({ postId, action }) => {
        const response = await axiosSecure.patch(`/blog-posts/${postId}/like`, { action });
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate the specific post and posts list
        queryClient.invalidateQueries({ queryKey: blogKeys.detail(variables.postId) });
        queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      },
      onError: (error) => {
        console.error('Failed to update like:', error);
      },
    });
  };

  // ==================== UTILITY FUNCTIONS ====================

  // Upload image to ImgBB
  const uploadImageToImgBB = async (file) => {
    try {
      // Check if ImgBB API key is available
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
      if (!apiKey) {
        throw new Error('ImgBB API key not configured. Please add VITE_IMGBB_API_KEY to your environment variables.');
      }
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        return data.data.url;
      } else {
        throw new Error('Failed to upload image to ImgBB');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Prefetch a blog post (useful for hover effects)
  const prefetchBlogPost = (id) => {
    queryClient.prefetchQuery({
      queryKey: blogKeys.detail(id),
      queryFn: async () => {
        const response = await axiosSecure.get(`/blog-posts/${id}`);
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  // Optimistic update for like/save actions
  const useOptimisticLike = () => {
    return useMutation({
      mutationFn: async ({ postId, isLiked }) => {
        const response = await axiosSecure.patch(`/blog-posts/${postId}/like`, { 
          action: isLiked ? 'like' : 'unlike' 
        });
        return response.data;
      },
      onMutate: async ({ postId, isLiked }) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: blogKeys.detail(postId) });
        
        // Snapshot previous value
        const previousPost = queryClient.getQueryData(blogKeys.detail(postId));
        
        // Optimistically update
        queryClient.setQueryData(blogKeys.detail(postId), (old) => ({
          ...old,
          isLiked,
          likes: (old.likes || 0) + (isLiked ? 1 : -1)
        }));
        
        return { previousPost };
      },
      onError: (err, variables, context) => {
        // Rollback on error
        if (context?.previousPost) {
          queryClient.setQueryData(blogKeys.detail(variables.postId), context.previousPost);
        }
      },
      onSettled: (data, error, variables) => {
        // Always refetch after error or success
        queryClient.invalidateQueries({ queryKey: blogKeys.detail(variables.postId) });
      },
    });
  };

  // ==================== RETURN ALL HOOKS ====================

  return {
    // Queries
    useBlogPosts,
    useBlogPost,
    useUserBlogPosts,
    useFeaturedBlogPosts,
    useBlogCategories,
    useBlogPostRatings,
    
    // Mutations
    useCreateBlogPost,
    useUpdateBlogPost,
    useDeleteBlogPost,
    useLikeBlogPost,
    useOptimisticLike,
    
    // Utilities
    uploadImageToImgBB,
    prefetchBlogPost,
    
    // Query Keys (for external use)
    blogKeys,
  };
};

export default useBlogQueries;
