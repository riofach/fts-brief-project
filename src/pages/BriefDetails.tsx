import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Send, ExternalLink, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/layout/Navbar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useBrief, useAddDeliverable, useBriefDiscussions, usePostDiscussion, useDeleteDiscussion, useBriefDeliverables } from '@/api';
import type { CreateDeliverableRequest, Discussion, Deliverable } from '@/api';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, AlertTriangle } from 'lucide-react';
import LoadingState, { LoadingSpinner } from '@/components/common/LoadingState';

const BriefDetails: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  // Use TanStack Query hooks for real data
  const { data: brief, isLoading: briefLoading, error: briefError } = useBrief(id);
  const { data: deliverables = [], isLoading: isDeliverablesLoading } = useBriefDeliverables(id);
  const { mutate: addDeliverable, isPending: isAddingDeliverable } = useAddDeliverable();
  
  // Use discussion hooks
  const { data: discussions = [], isLoading: discussionsLoading, error: discussionsError } = useBriefDiscussions(id);
  const { mutate: postDiscussion, isPending: isPostingDiscussion } = usePostDiscussion();
  const { mutate: deleteDiscussion, isPending: isDeleting } = useDeleteDiscussion();
  
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  
  // Check if current user is admin
  const isAdmin = user?.role === 'ADMIN';

  // Handle discussion deletion
  const handleDeleteDiscussion = (discussionId: string, discussionMessage: string) => {
    deleteDiscussion(discussionId);
  };

  // Show loading state
  if (briefLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  // Show error state
  if (briefError || !brief) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Brief not found</h1>
            <p className="mt-2 text-muted-foreground">
              {briefError ? 'Failed to load brief data.' : 'The requested brief could not be found.'}
            </p>
            <Link to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}>
              <Button className="mt-4">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canManage = user?.role === 'ADMIN';
  const isOwner = user?.id === brief.clientId;

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !brief?.id) return;

    postDiscussion(
      { briefId: brief.id, message: newMessage.trim() },
      {
        onSuccess: () => {
          setNewMessage('');
        }
      }
    );
  };

  const getDeliverableIcon = (type: string) => {
    switch (type) {
      case 'figma':
        return '🎨';
      case 'prototype':
        return '🔗';
      case 'website':
        return '🌐';
      case 'document':
        return '📄';
      default:
        return '📁';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <h1 className="text-3xl font-bold text-foreground">{brief.projectName}</h1>
              <p className="mt-2 text-muted-foreground">
                Client ID: {brief.clientId}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <StatusBadge status={brief.status} />
              {canManage && (
                <Link to={`/admin/brief/${brief.id}/manage`}>
                  <Button>Manage Brief</Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Details */}
            <Card className="bg-card shadow-lg">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="mt-1 text-foreground">{brief.projectDescription}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Website Type</Label>
                    <p className="mt-1 text-foreground">{brief.websiteType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Brand Name</Label>
                    <p className="mt-1 text-foreground">{brief.brandName}</p>
                  </div>
                </div>

                {brief.brandSlogan && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Brand Slogan</Label>
                    <p className="mt-1 text-foreground italic">"{brief.brandSlogan}"</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Main Color</Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: brief.mainColor }}
                      />
                      <span className="text-foreground">{brief.mainColor}</span>
                    </div>
                  </div>
                  {brief.secondaryColor && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Secondary Color</Label>
                      <div className="mt-1 flex items-center space-x-2">
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: brief.secondaryColor }}
                        />
                        <span className="text-foreground">{brief.secondaryColor}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Font Preference</Label>
                  <p className="mt-1 text-foreground">{brief.fontPreference}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Mood & Theme</Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {brief.moodTheme?.map(theme => (
                      <Badge key={theme} variant="secondary">{theme}</Badge>
                    ))}
                  </div>
                </div>

                {brief.referenceLinks && brief.referenceLinks.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Reference Links</Label>
                    <div className="mt-1 space-y-2">
                      {brief.referenceLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:underline"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {brief.logoAssets && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Logo/Assets</Label>
                    <div className="mt-1 flex items-center text-foreground">
                      <FileText className="mr-2 h-4 w-4" />
                      {brief.logoAssets}
                    </div>
                  </div>
                )}

                {brief.additionalNotes && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Additional Notes</Label>
                    <p className="mt-1 text-foreground">{brief.additionalNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deliverables */}
            {deliverables && deliverables.length > 0 && (
              <Card className="bg-card shadow-lg">
                <CardHeader>
                  <CardTitle>Deliverables</CardTitle>
                  <CardDescription>
                    Files and links shared by the FTS team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deliverables.map((deliverable) => (
                      <div key={deliverable.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="text-2xl">{getDeliverableIcon(deliverable.type)}</div>
                            <div>
                              <h4 className="font-medium text-foreground">{deliverable.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{deliverable.description}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                Added {new Date(deliverable.addedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <a 
                            href={deliverable.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-shrink-0"
                          >
                            <Button size="sm" variant="outline">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card className="bg-card shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Project Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <StatusBadge status={brief.status} />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <p className="mt-1 text-sm text-foreground">
                    {new Date(brief.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                  <p className="mt-1 text-sm text-foreground">
                    {new Date(brief.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Discussion */}
            <Card className="bg-card shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Discussion
                </CardTitle>
                <CardDescription>
                  Communicate with the {user?.role === 'ADMIN' ? 'client' : 'FTS team'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {discussionsLoading ? (
                    <LoadingState />
                  ) : discussionsError ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Failed to load messages. Please refresh the page.
                    </p>
                  ) : !discussions || discussions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No messages yet. Start the conversation!
                    </p>
                  ) : (
                    discussions?.map((discussion: Discussion) => {
                      // Handle both mock data format and real API data
                      const authorName = discussion.user?.name || 'Unknown User';
                      const authorInitial = authorName.charAt(0).toUpperCase();
                      
                      return (
                        <div key={discussion.id} className={`flex ${discussion.userId === user?.id ? 'justify-end' : 'justify-start'} relative group`}>
                          <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                            discussion.userId === user?.id 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {authorInitial}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-medium">
                                  {authorName}
                                </span>
                                {discussion.isFromAdmin && (
                                  <Badge variant="secondary" className="text-xs">FTS</Badge>
                                )}
                              </div>
                              
                              {/* Admin Delete Button */}
                              {isAdmin && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="flex items-center">
                                        <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                                        Delete Message
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this message? This action cannot be undone.
                                        <br /><br />
                                        <strong>Message:</strong> "{discussion.message}"
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteDiscussion(discussion.id, discussion.message)}
                                        disabled={isDeleting}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                            <p className="text-sm">{discussion.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(discussion.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={3}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isPostingDiscussion}
                    className="w-full shadow-glow"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isPostingDiscussion ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefDetails;