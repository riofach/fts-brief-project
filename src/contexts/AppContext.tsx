import React, { createContext, useContext } from 'react';
import { Brief, Discussion, Notification, Deliverable } from '../api/types';
import { 
  useBriefs, 
  useCreateBrief, 
  useUpdateBriefStatus, 
  useAddDeliverable,
  usePostDiscussion,
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useUnreadNotificationsCount
} from '../api';
import { useAuth } from './AuthContext';

interface AppContextType {
  briefs: Brief[];
  discussions: Discussion[];
  notifications: Notification[];
  isLoading: boolean;
  unreadNotificationsCount: number;
  
  // Brief operations
  createBrief: (briefData: Omit<Brief, 'id' | 'createdAt' | 'updatedAt' | 'deliverables' | 'clientId'>) => Promise<string>;
  updateBriefStatus: (briefId: string, status: Brief['status']) => Promise<void>;
  addDeliverable: (briefId: string, deliverable: Omit<Deliverable, 'id' | 'addedAt' | 'briefId'>) => Promise<void>;
  
  // Discussion operations
  addDiscussion: (briefId: string, message: string) => Promise<void>;
  
  // Notification operations
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  
  // Data fetching helpers
  getBriefById: (id: string) => Brief | undefined;
  getBriefsByClientId: (clientId: string) => Brief[];
  getDiscussionsByBriefId: (briefId: string) => Discussion[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  // Use real API hooks, enabled only when authenticated
  const { data: briefs = [], isLoading: briefsLoading } = useBriefs(isAuthenticated);
  
  // Note: Discussions are now fetched per brief in the components, 
  // so we don't fetch global discussions here to avoid over-fetching
  const discussions: Discussion[] = []; 
  
  const { data: notifications = [] } = useNotifications(isAuthenticated);
  const { data: unreadCount = 0 } = useUnreadNotificationsCount(isAuthenticated);
  
  const createBriefMutation = useCreateBrief();
  const updateBriefStatusMutation = useUpdateBriefStatus();
  const addDeliverableMutation = useAddDeliverable();
  const postDiscussionMutation = usePostDiscussion();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const createBrief = async (briefData: any): Promise<string> => {
    const result = await createBriefMutation.mutateAsync(briefData);
    return result.id;
  };

  const updateBriefStatus = async (briefId: string, status: Brief['status']) => {
    await updateBriefStatusMutation.mutateAsync({ id: briefId, status });
  };

  const addDeliverable = async (briefId: string, deliverable: any) => {
    await addDeliverableMutation.mutateAsync({ briefId, ...deliverable });
  };

  const addDiscussion = async (briefId: string, message: string) => {
    await postDiscussionMutation.mutateAsync({ briefId, message });
  };

  const markNotificationAsRead = async (notificationId: string) => {
    await markReadMutation.mutateAsync(notificationId);
  };
  
  const markAllNotificationsAsRead = async () => {
    await markAllReadMutation.mutateAsync();
  };

  const getBriefById = (id: string): Brief | undefined => {
    return briefs.find(brief => brief.id === id);
  };

  const getBriefsByClientId = (clientId: string): Brief[] => {
    return briefs.filter(brief => brief.clientId === clientId);
  };

  const getDiscussionsByBriefId = (briefId: string): Discussion[] => {
    // Only returns discussions if we had them in state, mostly for backward compat
    return discussions.filter(discussion => discussion.briefId === briefId);
  };

  return (
    <AppContext.Provider value={{
      briefs,
      discussions,
      notifications,
      isLoading: briefsLoading,
      unreadNotificationsCount: unreadCount,
      createBrief,
      updateBriefStatus,
      addDeliverable,
      addDiscussion,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      getBriefById,
      getBriefsByClientId,
      getDiscussionsByBriefId
    }}>
      {children}
    </AppContext.Provider>
  );
};