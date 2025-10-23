import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '../../shared/hooks/useAxios';
import useAxiosSecure from '../../shared/hooks/useAxiosSecure';
import Swal from 'sweetalert2';

// Query Keys
export const volunteerKeys = {
  all: ['volunteers'],
  lists: () => [...volunteerKeys.all, 'list'],
  list: (filters) => [...volunteerKeys.lists(), { filters }],
  details: () => [...volunteerKeys.all, 'detail'],
  detail: (id) => [...volunteerKeys.details(), id],
  requests: () => [...volunteerKeys.all, 'requests'],
  userRequests: (email) => [...volunteerKeys.requests(), 'user', email],
  postRequests: (postId) => [...volunteerKeys.requests(), 'post', postId],
  organizerRequests: (email) => [...volunteerKeys.requests(), 'organizer', email],
  stats: () => [...volunteerKeys.all, 'stats'],
  applications: (postId) => [...volunteerKeys.all, 'applications', postId],
};

// Custom hook for all volunteer-related operations
export const useVolunteerQueries = () => {
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ==================== QUERIES ====================

  // Fetch all volunteer requests with optional filters
  const useVolunteerRequests = (filters = {}) => {
    return useQuery({
      queryKey: volunteerKeys.list(filters),
      queryFn: async () => {
        const response = await axiosSecure.get('/volunteer-requests', { params: filters });
        return response.data;
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Fetch user's volunteer requests
  const useUserVolunteerRequests = (userEmail) => {
    return useQuery({
      queryKey: volunteerKeys.userRequests(userEmail),
      queryFn: async () => {
        const response = await axiosSecure.get('/volunteer-requests', { 
          params: { volunteerEmail: userEmail } 
        });
        return response.data;
      },
      enabled: !!userEmail,
      staleTime: 2 * 60 * 1000,
    });
  };

  // Fetch volunteer requests for a specific post
  const usePostVolunteerRequests = (postId) => {
    return useQuery({
      queryKey: volunteerKeys.postRequests(postId),
      queryFn: async () => {
        const response = await axiosSecure.get('/volunteer-requests', { 
          params: { postId } 
        });
        return response.data;
      },
      enabled: !!postId,
      staleTime: 2 * 60 * 1000,
    });
  };

  // Fetch volunteer requests for an organizer
  const useOrganizerVolunteerRequests = (organizerEmail) => {
    return useQuery({
      queryKey: volunteerKeys.organizerRequests(organizerEmail),
      queryFn: async () => {
        const response = await axiosSecure.get('/volunteer-requests', { 
          params: { organizerEmail } 
        });
        return response.data;
      },
      enabled: !!organizerEmail,
      staleTime: 2 * 60 * 1000,
    });
  };

  // Fetch volunteer applications for a specific post
  const usePostApplications = (postId) => {
    return useQuery({
      queryKey: volunteerKeys.applications(postId),
      queryFn: async () => {
        const response = await axiosSecure.get(`/volunteer-requests/post/${postId}`);
        return response.data;
      },
      enabled: !!postId,
      staleTime: 1 * 60 * 1000, // 1 minute
    });
  };

  // Fetch single volunteer request by ID
  const useVolunteerRequest = (id) => {
    return useQuery({
      queryKey: volunteerKeys.detail(id),
      queryFn: async () => {
        const response = await axiosSecure.get(`/volunteer-requests/${id}`);
        return response.data;
      },
      enabled: !!id,
      staleTime: 2 * 60 * 1000,
    });
  };

  // Fetch volunteer statistics
  const useVolunteerStats = () => {
    return useQuery({
      queryKey: volunteerKeys.stats(),
      queryFn: async () => {
        const response = await axiosSecure.get('/volunteer-requests/stats');
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // ==================== MUTATIONS ====================

  // Apply for volunteer opportunity
  const useApplyForVolunteer = () => {
    return useMutation({
      mutationFn: async (volunteerData) => {
        const response = await axiosSecure.post('/volunteer-requests', volunteerData);
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: volunteerKeys.requests() });
        queryClient.invalidateQueries({ queryKey: volunteerKeys.userRequests(variables.volunteerEmail) });
        queryClient.invalidateQueries({ queryKey: volunteerKeys.postRequests(variables.postId) });
        queryClient.invalidateQueries({ queryKey: volunteerKeys.organizerRequests(variables.organizerEmail) });
        queryClient.invalidateQueries({ queryKey: volunteerKeys.stats() });
        
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Application Submitted!',
          text: 'Your volunteer application has been submitted successfully.',
          showConfirmButton: false,
          timer: 2000
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Application Failed',
          text: error.response?.data?.message || 'Failed to submit volunteer application',
        });
      },
    });
  };

  // Update volunteer request status
  const useUpdateVolunteerRequestStatus = () => {
    return useMutation({
      mutationFn: async ({ id, status, feedback }) => {
        const response = await axiosSecure.patch(`/volunteer-requests/${id}/status`, { 
          status, 
          feedback 
        });
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Update the specific request in cache
        queryClient.setQueryData(volunteerKeys.detail(variables.id), data);
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: volunteerKeys.requests() });
        queryClient.invalidateQueries({ queryKey: volunteerKeys.userRequests(data.volunteerEmail) });
        queryClient.invalidateQueries({ queryKey: volunteerKeys.postRequests(data.postId) });
        queryClient.invalidateQueries({ queryKey: volunteerKeys.organizerRequests(data.organizerEmail) });
        queryClient.invalidateQueries({ queryKey: volunteerKeys.stats() });
        
        Swal.fire({
          icon: 'success',
          title: 'Status Updated!',
          text: `Volunteer request has been ${variables.status} successfully.`,
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: error.response?.data?.message || 'Failed to update volunteer request status',
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
      onSuccess: (data, variables) => {
        // Remove from cache
        queryClient.removeQueries({ queryKey: volunteerKeys.detail(variables) });
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: volunteerKeys.requests() });
        queryClient.invalidateQueries({ queryKey: volunteerKeys.userRequests(data.volunteerEmail) });
        queryClient.invalidateQueries({ queryKey: volunteerKeys.postRequests(data.postId) });
        queryClient.invalidateQueries({ queryKey: volunteerKeys.organizerRequests(data.organizerEmail) });
        queryClient.invalidateQueries({ queryKey: volunteerKeys.stats() });
        
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your volunteer request has been successfully cancelled.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Cancellation Failed',
          text: error.response?.data?.message || 'Failed to cancel volunteer request',
        });
      },
    });
  };

  // Bulk update volunteer request statuses
  const useBulkUpdateVolunteerRequests = () => {
    return useMutation({
      mutationFn: async ({ requestIds, status, feedback }) => {
        const response = await axiosSecure.patch('/volunteer-requests/bulk-update', {
          requestIds,
          status,
          feedback
        });
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate all related queries
        queryClient.invalidateQueries({ queryKey: volunteerKeys.requests() });
        queryClient.invalidateQueries({ queryKey: volunteerKeys.all });
        queryClient.invalidateQueries({ queryKey: volunteerKeys.stats() });
        
        Swal.fire({
          icon: 'success',
          title: 'Bulk Update Complete!',
          text: `${variables.requestIds.length} volunteer requests have been ${variables.status} successfully.`,
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Bulk Update Failed',
          text: error.response?.data?.message || 'Failed to update volunteer requests',
        });
      },
    });
  };

  // Delete volunteer request (admin only)
  const useDeleteVolunteerRequest = () => {
    return useMutation({
      mutationFn: async (requestId) => {
        const response = await axiosSecure.delete(`/volunteer-requests/${requestId}`);
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Remove from cache
        queryClient.removeQueries({ queryKey: volunteerKeys.detail(variables) });
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: volunteerKeys.requests() });
        queryClient.invalidateQueries({ queryKey: volunteerKeys.all });
        queryClient.invalidateQueries({ queryKey: volunteerKeys.stats() });
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Volunteer request has been successfully deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Deletion Failed',
          text: error.response?.data?.message || 'Failed to delete volunteer request',
        });
      },
    });
  };

  // ==================== UTILITY FUNCTIONS ====================

  // Prefetch volunteer request (useful for hover effects)
  const prefetchVolunteerRequest = (id) => {
    queryClient.prefetchQuery({
      queryKey: volunteerKeys.detail(id),
      queryFn: async () => {
        const response = await axiosSecure.get(`/volunteer-requests/${id}`);
        return response.data;
      },
      staleTime: 2 * 60 * 1000,
    });
  };

  // Get status badge configuration
  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: '⏳',
        label: 'Pending'
      },
      approved: { 
        color: 'bg-green-100 text-green-800', 
        icon: '✅',
        label: 'Approved'
      },
      rejected: { 
        color: 'bg-red-100 text-red-800', 
        icon: '❌',
        label: 'Rejected'
      },
      completed: { 
        color: 'bg-blue-100 text-blue-800', 
        icon: '🏆',
        label: 'Completed'
      },
      cancelled: { 
        color: 'bg-gray-100 text-gray-800', 
        icon: '🚫',
        label: 'Cancelled'
      },
    };
    return configs[status] || { 
      color: 'bg-gray-100 text-gray-800', 
      icon: '❓',
      label: 'Unknown'
    };
  };

  // Filter requests by status
  const filterRequestsByStatus = (requests, status) => {
    if (!requests || !Array.isArray(requests)) return [];
    return requests.filter(request => request.status === status);
  };

  // Get request statistics
  const getRequestStats = (requests) => {
    if (!requests || !Array.isArray(requests)) {
      return { total: 0, pending: 0, approved: 0, rejected: 0, completed: 0, cancelled: 0 };
    }
    
    return requests.reduce((stats, request) => {
      stats.total++;
      stats[request.status] = (stats[request.status] || 0) + 1;
      return stats;
    }, { total: 0, pending: 0, approved: 0, rejected: 0, completed: 0, cancelled: 0 });
  };

  // Check if user can apply for a post
  const canUserApply = (userEmail, postId, existingRequests = []) => {
    if (!userEmail || !postId) return false;
    return !existingRequests.some(request => 
      request.volunteerEmail === userEmail && 
      request.postId === postId && 
      ['pending', 'approved'].includes(request.status)
    );
  };

  // ==================== OPTIMISTIC UPDATES ====================

  // Optimistic status update
  const useOptimisticStatusUpdate = () => {
    return useMutation({
      mutationFn: async ({ id, status, feedback }) => {
        const response = await axiosSecure.patch(`/volunteer-requests/${id}/status`, { 
          status, 
          feedback 
        });
        return response.data;
      },
      onMutate: async ({ id, status, feedback }) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: volunteerKeys.detail(id) });
        
        // Snapshot previous value
        const previousRequest = queryClient.getQueryData(volunteerKeys.detail(id));
        
        // Optimistically update
        queryClient.setQueryData(volunteerKeys.detail(id), (old) => ({
          ...old,
          status,
          feedback,
          updatedAt: new Date().toISOString()
        }));
        
        return { previousRequest };
      },
      onError: (err, variables, context) => {
        // Rollback on error
        if (context?.previousRequest) {
          queryClient.setQueryData(volunteerKeys.detail(variables.id), context.previousRequest);
        }
      },
      onSettled: (data, error, variables) => {
        // Always refetch after error or success
        queryClient.invalidateQueries({ queryKey: volunteerKeys.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: volunteerKeys.requests() });
      },
    });
  };

  // ==================== RETURN ALL HOOKS ====================

  return {
    // Queries
    useVolunteerRequests,
    useUserVolunteerRequests,
    usePostVolunteerRequests,
    useOrganizerVolunteerRequests,
    usePostApplications,
    useVolunteerRequest,
    useVolunteerStats,
    
    // Mutations
    useApplyForVolunteer,
    useUpdateVolunteerRequestStatus,
    useCancelVolunteerRequest,
    useBulkUpdateVolunteerRequests,
    useDeleteVolunteerRequest,
    useOptimisticStatusUpdate,
    
    // Utilities
    prefetchVolunteerRequest,
    getStatusConfig,
    filterRequestsByStatus,
    getRequestStats,
    canUserApply,
    
    // Query Keys (for external use)
    volunteerKeys,
  };
};

export default useVolunteerQueries;
