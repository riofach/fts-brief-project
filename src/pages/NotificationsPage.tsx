import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, MessageSquare, FileText, CheckCircle2, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications, useUnreadNotificationsCount, useMarkAllNotificationsRead, useDeleteReadNotifications, useMarkNotificationRead } from '@/hooks/useNotifications';
import type { Notification } from '@/api/types';
import { useBrief } from '@/hooks/useBriefs';
import LoadingState from '@/components/common/LoadingState';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Component to fetch brief details for notification
const BriefName: React.FC<{ briefId: string }> = ({ briefId }) => {
  const { data: brief } = useBrief(briefId);
  
  if (!brief) return null;
  
  return <span>Project: {brief.projectName}</span>;
};

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  
  // Use real API hooks
  const { data: notifications = [], isLoading: isLoadingNotifications } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();
  const { mutate: markAsRead } = useMarkNotificationRead();
  const { mutate: deleteRead, isPending: isDeletingRead } = useDeleteReadNotifications();
  
  // Note: Notifications are already filtered by user in the backend
  const sortedNotifications = [...notifications]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'STATUS_UPDATE':
        return <CheckCircle2 className="h-5 w-5 text-primary" />;
      case 'NEW_MESSAGE':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'DELIVERABLE_ADDED':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const handleClearRead = () => {
    deleteRead();
  };

  if (isLoadingNotifications) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  const hasReadNotifications = notifications.some(n => n.isRead);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <Bell className="mr-3 h-8 w-8" />
                Notifications
              </h1>
              <p className="mt-2 text-muted-foreground">
                Stay updated with your project progress
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-2">
              {hasReadNotifications && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      disabled={isDeletingRead}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Read
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center">
                        <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                        Clear Read Notifications
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete all read notifications? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClearRead}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeletingRead ? 'Deleting...' : 'Delete All'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {unreadCount > 0 && (
                <Button 
                  onClick={() => markAllAsRead()} 
                  variant="default"
                  disabled={isMarkingAll}
                >
                  Mark all as read ({unreadCount})
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
            <CardDescription>
              {sortedNotifications.length === 0 
                ? "No notifications yet" 
                : `${sortedNotifications.length} total notifications`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No notifications</h3>
                <p className="mt-2 text-muted-foreground">
                  You'll see notifications here when there are updates to your projects
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedNotifications.map((notification) => {
                  return (
                    <Link
                      key={notification.id}
                      to={`${user?.role === 'ADMIN' ? '/admin' : ''}/brief/${notification.briefId}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className={`border rounded-lg p-4 transition-colors hover:bg-muted/30 ${
                        !notification.isRead ? 'bg-primary/5 border-primary/20' : ''
                      }`}>
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-foreground">
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <Badge variant="default" className="text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              {notification.brief?.projectName ? (
                                <span>Project: {notification.brief.projectName}</span>
                              ) : (
                                <BriefName briefId={notification.briefId} />
                              )}
                              <span>
                                {new Date(notification.timestamp).toLocaleDateString()} at{' '}
                                {new Date(notification.timestamp).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;