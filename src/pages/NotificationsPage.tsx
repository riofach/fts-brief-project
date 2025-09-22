import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, MessageSquare, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { Notification } from '@/data/mockData';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { notifications, markNotificationAsRead, getBriefById } = useApp();
  
  const userNotifications = notifications
    .filter(n => n.userId === user?.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'status_update':
        return <CheckCircle2 className="h-5 w-5 text-primary" />;
      case 'new_message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'deliverable_added':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
  };

  const markAllAsRead = () => {
    userNotifications
      .filter(n => !n.isRead)
      .forEach(n => markNotificationAsRead(n.id));
  };

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={user?.role === 'admin' ? '/admin' : '/dashboard'}
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
            {unreadCount > 0 && (
              <div className="mt-4 sm:mt-0">
                <Button onClick={markAllAsRead} variant="outline">
                  Mark all as read ({unreadCount})
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <Card className="card-gradient shadow-lg">
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
            <CardDescription>
              {userNotifications.length === 0 
                ? "No notifications yet" 
                : `${userNotifications.length} total notifications`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No notifications</h3>
                <p className="mt-2 text-muted-foreground">
                  You'll see notifications here when there are updates to your projects
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userNotifications.map((notification) => {
                  const brief = getBriefById(notification.briefId);
                  
                  return (
                    <Link
                      key={notification.id}
                      to={`${user?.role === 'admin' ? '/admin' : ''}/brief/${notification.briefId}`}
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
                              {brief && (
                                <span>Project: {brief.projectName}</span>
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