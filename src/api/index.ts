// API client exports
export { api, healthCheck, isOnline, handleApiResponse, handleApiError } from './client';
export * from './types';

// API modules
export { authApi, tokenUtils } from './auth';

// Briefs hooks
export {
  useBriefs,
  useBriefsByClient,
  useBrief,
  useCreateBrief,
  useUpdateBriefStatus,
  useOptimisticBriefUpdate,
  getBriefErrorMessage,
} from '../hooks/useBriefs';

// Deliverables hooks
export {
  useBriefDeliverables,
  useAddDeliverable,
} from '../hooks/useDeliverables';

// Discussions hooks
export {
  useBriefDiscussions,
  useMyDiscussions,
  useSearchDiscussions,
  usePostDiscussion,
  useDeleteDiscussion,
  useOptimisticDiscussionUpdate,
  useDiscussions,
  useAdminDiscussions,
  getDiscussionErrorMessage,
} from '../hooks/useDiscussions';

// Utility hooks
export { useDebounce } from '../hooks/useDebounce';

// User hooks
export * from '../hooks/useUsers';

// Notification hooks
export {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '../hooks/useNotifications';
