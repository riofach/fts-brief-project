import React, { createContext, useContext, useState, useEffect } from 'react';
import { Brief, Discussion, Notification, Deliverable, mockBriefs, mockDiscussions, mockNotifications } from '../data/mockData';
import { useAuth } from './AuthContext';

interface AppContextType {
  briefs: Brief[];
  discussions: Discussion[];
  notifications: Notification[];
  
  // Brief operations
  createBrief: (briefData: Omit<Brief, 'id' | 'createdAt' | 'updatedAt' | 'deliverables'>) => string;
  updateBriefStatus: (briefId: string, status: Brief['status']) => void;
  addDeliverable: (briefId: string, deliverable: Omit<Deliverable, 'id' | 'addedAt'>) => void;
  
  // Discussion operations
  addDiscussion: (briefId: string, message: string) => void;
  
  // Notification operations
  markNotificationAsRead: (notificationId: string) => void;
  getUnreadNotifications: () => Notification[];
  
  // Data fetching
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
  const [briefs, setBriefs] = useState<Brief[]>(mockBriefs);
  const [discussions, setDiscussions] = useState<Discussion[]>(mockDiscussions);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const createBrief = (briefData: Omit<Brief, 'id' | 'createdAt' | 'updatedAt' | 'deliverables'>): string => {
    const newBrief: Brief = {
      ...briefData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deliverables: []
    };
    
    setBriefs(prev => [...prev, newBrief]);
    
    // Create notification for admins
    const adminNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: '1', // Admin user ID
      briefId: newBrief.id,
      title: 'New Project Brief',
      message: `${user?.name} submitted a new project brief: ${newBrief.projectName}`,
      isRead: false,
      timestamp: new Date().toISOString(),
      type: 'status_update'
    };
    
    setNotifications(prev => [...prev, adminNotification]);
    
    return newBrief.id;
  };

  const updateBriefStatus = (briefId: string, status: Brief['status']) => {
    setBriefs(prev => prev.map(brief => 
      brief.id === briefId 
        ? { ...brief, status, updatedAt: new Date().toISOString() }
        : brief
    ));
    
    // Create notification for client
    const brief = briefs.find(b => b.id === briefId);
    if (brief) {
      const clientNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        userId: brief.clientId,
        briefId,
        title: 'Status Updated',
        message: `Your project "${brief.projectName}" status changed to ${status.replace('-', ' ')}`,
        isRead: false,
        timestamp: new Date().toISOString(),
        type: 'status_update'
      };
      
      setNotifications(prev => [...prev, clientNotification]);
    }
  };

  const addDeliverable = (briefId: string, deliverable: Omit<Deliverable, 'id' | 'addedAt'>) => {
    const newDeliverable: Deliverable = {
      ...deliverable,
      id: Math.random().toString(36).substr(2, 9),
      addedAt: new Date().toISOString()
    };
    
    setBriefs(prev => prev.map(brief => 
      brief.id === briefId 
        ? { 
            ...brief, 
            deliverables: [...brief.deliverables, newDeliverable],
            updatedAt: new Date().toISOString()
          }
        : brief
    ));
    
    // Create notification for client
    const brief = briefs.find(b => b.id === briefId);
    if (brief) {
      const clientNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        userId: brief.clientId,
        briefId,
        title: 'New Deliverable',
        message: `${deliverable.title} has been added to your project`,
        isRead: false,
        timestamp: new Date().toISOString(),
        type: 'deliverable_added'
      };
      
      setNotifications(prev => [...prev, clientNotification]);
    }
  };

  const addDiscussion = (briefId: string, message: string) => {
    if (!user) return;
    
    const newDiscussion: Discussion = {
      id: Math.random().toString(36).substr(2, 9),
      briefId,
      userId: user.id,
      message,
      timestamp: new Date().toISOString(),
      isFromAdmin: user.role === 'admin'
    };
    
    setDiscussions(prev => [...prev, newDiscussion]);
    
    // Create notification for the other party
    const brief = briefs.find(b => b.id === briefId);
    if (brief) {
      const targetUserId = user.role === 'admin' ? brief.clientId : '1'; // Admin user ID
      const notification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        userId: targetUserId,
        briefId,
        title: 'New Message',
        message: `${user.name} sent a new message on "${brief.projectName}"`,
        isRead: false,
        timestamp: new Date().toISOString(),
        type: 'new_message'
      };
      
      setNotifications(prev => [...prev, notification]);
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const getUnreadNotifications = (): Notification[] => {
    if (!user) return [];
    return notifications.filter(n => n.userId === user.id && !n.isRead);
  };

  const getBriefById = (id: string): Brief | undefined => {
    return briefs.find(brief => brief.id === id);
  };

  const getBriefsByClientId = (clientId: string): Brief[] => {
    return briefs.filter(brief => brief.clientId === clientId);
  };

  const getDiscussionsByBriefId = (briefId: string): Discussion[] => {
    return discussions.filter(discussion => discussion.briefId === briefId);
  };

  return (
    <AppContext.Provider value={{
      briefs,
      discussions,
      notifications,
      createBrief,
      updateBriefStatus,
      addDeliverable,
      addDiscussion,
      markNotificationAsRead,
      getUnreadNotifications,
      getBriefById,
      getBriefsByClientId,
      getDiscussionsByBriefId
    }}>
      {children}
    </AppContext.Provider>
  );
};