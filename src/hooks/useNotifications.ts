import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api, { handleApiResponse } from '../api/client';
import { queryKeys } from '../lib/queryClient';
import type { Notification, NotificationsResponse, UnreadNotificationsResponse } from '../api/types';

// Hook to fetch notifications
export const useNotifications = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.notifications.lists(),
    queryFn: async () => {
      const response = await api.get<NotificationsResponse>('/notifications');
      return handleApiResponse(response).notifications;
    },
    enabled,
  });
};

// Hook to fetch unread count
export const useUnreadNotificationsCount = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.notifications.unread,
    queryFn: async () => {
      const response = await api.get<UnreadNotificationsResponse>('/notifications/unread');
      return handleApiResponse(response).unreadCount;
    },
    enabled,
    // Refetch more frequently for real-time feel
    refetchInterval: 30000, // 30 seconds
  });
};

// Hook to mark notification as read
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.put(`/notifications/${notificationId}/read`, { isRead: true });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      // Invalidate notifications list and unread count
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};

// Hook to mark all notifications as read
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.put('/notifications/read-all');
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success('All notifications marked as read');
    },
  });
};

export default {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
};
