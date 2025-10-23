import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '../../shared/hooks/useAxios';
import useAxiosSecure from '../../shared/hooks/useAxiosSecure';
import useAuth from '../../shared/hooks/useAuth';
import Swal from 'sweetalert2';

// Query Keys
export const eventKeys = {
  all: ['events'],
  lists: () => [...eventKeys.all, 'list'],
  list: (filters) => [...eventKeys.lists(), { filters }],
  details: () => [...eventKeys.all, 'detail'],
  detail: (id) => [...eventKeys.details(), id],
  userEvents: (userId, type) => [...eventKeys.all, 'user', userId, type],
  analytics: (id) => [...eventKeys.all, 'analytics', id],
};

// Custom hook for all event-related operations
export const useEventQueries = () => {
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // ==================== QUERIES ====================

  // Fetch all events with optional filters
  const useEvents = (filters = {}) => {
    return useQuery({
      queryKey: eventKeys.list(filters),
      queryFn: async () => {
        try {
          const response = await axiosSecure.get('/events', { params: filters });
          return response.data;
        } catch (error) {
          // If secure request fails, try public request as fallback
          if (error.response?.status === 401 || error.response?.status === 403) {
            const response = await axiosPublic.get('/events', { params: filters });
            return response.data;
          }
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Fetch single event by ID
  const useEvent = (id) => {
    return useQuery({
      queryKey: eventKeys.detail(id),
      queryFn: async () => {
        try {
          const response = await axiosSecure.get(`/events/${id}`);
          return response.data;
        } catch (error) {
          // If secure request fails, try public request as fallback
          if (error.response?.status === 401 || error.response?.status === 403) {
            const response = await axiosPublic.get(`/events/${id}`);
            return response.data;
          }
          throw error;
        }
      },
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Fetch user's events (created, joined, or all)
  const useUserEvents = (userId, type = 'all') => {
    return useQuery({
      queryKey: eventKeys.userEvents(userId, type),
      queryFn: async () => {
        const response = await axiosSecure.get(`/events/user/${userId}`, { 
          params: { type } 
        });
        return response.data;
      },
      enabled: !!userId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Fetch event analytics
  const useEventAnalytics = (eventId) => {
    return useQuery({
      queryKey: eventKeys.analytics(eventId),
      queryFn: async () => {
        const response = await axiosSecure.get(`/events/analytics/${eventId}`);
        return response.data;
      },
      enabled: !!eventId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // ==================== MUTATIONS ====================

  // Create new event
  const useCreateEvent = () => {
    return useMutation({
      mutationFn: async (eventData) => {
        // Include the createdBy field with the current user's email
        const eventDataWithCreator = {
          ...eventData,
          createdBy: user?.email
        };
        const response = await axiosSecure.post('/events', eventDataWithCreator);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate and refetch events list
        queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
        queryClient.invalidateQueries({ queryKey: eventKeys.all });
        
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Event created successfully!',
          text: 'Your event is now live and ready for volunteers.',
          showConfirmButton: false,
          timer: 2000
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to create event',
        });
      },
    });
  };

  // Update existing event
  const useUpdateEvent = () => {
    return useMutation({
      mutationFn: async ({ id, eventData, createdBy }) => {
        const response = await axiosSecure.put(`/events/${id}`, { 
          ...eventData, 
          createdBy: createdBy || user?.email
        });
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Update the specific event in cache
        queryClient.setQueryData(eventKeys.detail(variables.id), data);
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
        queryClient.invalidateQueries({ queryKey: eventKeys.all });
        
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Your event has been updated successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to update event',
        });
      },
    });
  };

  // Delete event
  const useDeleteEvent = () => {
    return useMutation({
      mutationFn: async ({ id, createdBy }) => {
        const response = await axiosSecure.delete(`/events/${id}`, { 
          data: { createdBy: createdBy || user?.email } 
        });
        return response.data;
      },
      onSuccess: (_, variables) => {
        // Remove from cache
        queryClient.removeQueries({ queryKey: eventKeys.detail(variables.id) });
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
        queryClient.invalidateQueries({ queryKey: eventKeys.all });
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Your event has been successfully deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete event',
        });
      },
    });
  };

  // Join event
  const useJoinEvent = () => {
    return useMutation({
      mutationFn: async ({ eventId, userEmail }) => {
        const response = await axiosSecure.post(`/events/${eventId}/join`, { 
          userEmail: userEmail || user?.email 
        });
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate the specific event and events list
        queryClient.invalidateQueries({ queryKey: eventKeys.detail(variables.eventId) });
        queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
        queryClient.invalidateQueries({ queryKey: eventKeys.all });
        
        Swal.fire({
          icon: 'success',
          title: 'Successfully Joined!',
          text: 'You have successfully joined the event.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Join Failed',
          text: error.response?.data?.message || 'Failed to join event',
        });
      },
    });
  };

  // Check-in to event
  const useCheckInEvent = () => {
    return useMutation({
      mutationFn: async ({ eventId, checkInCode, userEmail }) => {
        const response = await axiosSecure.post(`/events/${eventId}/checkin`, { 
          checkInCode, 
          userEmail: userEmail || user?.email 
        });
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate the specific event and analytics
        queryClient.invalidateQueries({ queryKey: eventKeys.detail(variables.eventId) });
        queryClient.invalidateQueries({ queryKey: eventKeys.analytics(variables.eventId) });
        queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
        
        Swal.fire({
          icon: 'success',
          title: 'Check-in Successful!',
          text: 'You have successfully checked in to the event.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Check-in Failed',
          text: error.response?.data?.message || 'Failed to check in to event',
        });
      },
    });
  };

  // ==================== UTILITY FUNCTIONS ====================

  // Prefetch an event (useful for hover effects)
  const prefetchEvent = (id) => {
    queryClient.prefetchQuery({
      queryKey: eventKeys.detail(id),
      queryFn: async () => {
        const response = await axiosPublic.get(`/events/${id}`);
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  // Generate check-in code (utility function)
  const generateCheckInCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // ==================== RETURN ALL HOOKS ====================

  return {
    // Queries
    useEvents,
    useEvent,
    useUserEvents,
    useEventAnalytics,
    
    // Mutations
    useCreateEvent,
    useUpdateEvent,
    useDeleteEvent,
    useJoinEvent,
    useCheckInEvent,
    
    // Utilities
    prefetchEvent,
    generateCheckInCode,
    
    // Query Keys (for external use)
    eventKeys,
  };
};

export default useEventQueries;
