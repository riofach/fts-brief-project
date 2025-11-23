import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, User, Clock, X, Filter, Trash2, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useSearchDiscussions, useAdminDiscussions, useDeleteDiscussion, getDiscussionErrorMessage } from '@/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import type { Discussion } from '@/api';
import { useDebounce } from '@/hooks/useDebounce';

interface DiscussionSearchProps {
  briefId?: string;
  showFilters?: boolean;
  onSelectDiscussion?: (discussion: Discussion) => void;
  className?: string;
}

interface SearchFilters {
  briefId?: string;
  userId?: string;
  limit?: number;
}

export const DiscussionSearch: React.FC<DiscussionSearchProps> = ({
  briefId,
  showFilters = true,
  onSelectDiscussion,
  className = '',
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    briefId,
    limit: 50,
  });
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Enable search when we have a query
  useEffect(() => {
    setIsSearchEnabled(debouncedSearchQuery.trim().length > 0);
  }, [debouncedSearchQuery]);

  // Use search discussions hook when search is enabled
  const {
    data: searchResults = [],
    isLoading: isSearching,
    error: searchError,
    refetch: searchDiscussions,
  } = useSearchDiscussions(debouncedSearchQuery, isSearchEnabled);

  // Get admin discussions for context
  const {
    discussions: allDiscussions = [],
    isLoading: isLoadingAll,
  } = useAdminDiscussions(briefId, !isSearchEnabled);

  // Admin delete discussion hook
  const { mutate: deleteDiscussion, isPending: isDeleting } = useDeleteDiscussion();

  // Check if current user is admin
  const isAdmin = user?.role === 'ADMIN';

  // Handle discussion deletion
  const handleDeleteDiscussion = (discussionId: string, discussionMessage: string) => {
    deleteDiscussion(discussionId, {
      onSuccess: () => {
        toast({
          title: "Message deleted",
          description: "The discussion message has been removed",
        });
        // Refresh search results if currently searching
        if (isSearchEnabled) {
          searchDiscussions();
        }
      },
      onError: (error: any) => {
        console.error('Failed to delete discussion:', error);
        const errorMessage = getDiscussionErrorMessage(
          error.response?.data?.error?.code || 'INTERNAL_SERVER_ERROR'
        );
        toast({
          title: "Error deleting message",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  };

  // Handle search
  const handleSearch = () => {
    if (debouncedSearchQuery.trim()) {
      searchDiscussions();
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get user initials for avatar
  const getUserInitials = (userName: string) => {
    return userName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle discussion selection
  const handleDiscussionClick = (discussion: Discussion) => {
    if (onSelectDiscussion) {
      onSelectDiscussion(discussion);
    }
  };

  // Get error message if search fails
  const getErrorMessage = () => {
    if (searchError && isSearchEnabled) {
      return getDiscussionErrorMessage(searchError.response?.data?.error?.code || 'INTERNAL_SERVER_ERROR');
    }
    return null;
  };

  const errorMessage = getErrorMessage();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Discussion Search
          </CardTitle>
          <CardDescription>
            Search through discussion messages across all briefs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Search messages, user names, or project names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={!debouncedSearchQuery.trim() || isSearching}
              className="shrink-0"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Filters (optional) */}
          {showFilters && (
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="limit">Results per page</Label>
                <Select
                  value={filters.limit?.toString()}
                  onValueChange={(value) =>
                    setFilters(prev => ({ ...prev, limit: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 results</SelectItem>
                    <SelectItem value="25">25 results</SelectItem>
                    <SelectItem value="50">50 results</SelectItem>
                    <SelectItem value="100">100 results</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {isSearchEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Search Results
              </span>
              <Badge variant="secondary">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
            <CardDescription>
              Showing results for "{debouncedSearchQuery}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage ? (
              <div className="text-center py-8">
                <div className="text-destructive mb-2">Search failed</div>
                <p className="text-sm text-muted-foreground">{errorMessage}</p>
                <Button
                  onClick={handleSearch}
                  variant="outline"
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : isSearching ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No discussions found</h3>
                <p className="text-muted-foreground">
                  No messages match your search criteria
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((discussion: Discussion) => (
                  <Card
                    key={discussion.id}
                    className={`transition-colors ${!isAdmin ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                    onClick={() => !isAdmin && handleDiscussionClick(discussion)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getUserInitials(discussion.user?.name || 'Unknown')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">
                                {discussion.user?.name || 'Unknown User'}
                              </span>
                              {discussion.isFromAdmin && (
                                <Badge variant="secondary" className="text-xs">FTS</Badge>
                              )}
                              {discussion.brief?.projectName && (
                                <Badge variant="outline" className="text-xs">
                                  {discussion.brief.projectName}
                                </Badge>
                              )}
                            </div>
                            
                            {/* Admin Delete Button */}
                            {isAdmin && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
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
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {discussion.message}
                          </p>
                          
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatTimestamp(discussion.timestamp)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Context: Recent Discussions (when not searching) */}
      {!isSearchEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Recent Discussions
            </CardTitle>
            <CardDescription>
              Latest messages from all briefs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAll ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : allDiscussions.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No discussions yet</h3>
                <p className="text-muted-foreground">
                  No messages have been posted
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {allDiscussions.slice(0, 10).map((discussion: Discussion) => (
                  <div
                    key={discussion.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border relative group"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getUserInitials(discussion.user?.name || 'Unknown')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">
                            {discussion.user?.name || 'Unknown User'}
                          </span>
                          {discussion.isFromAdmin && (
                            <Badge variant="secondary" className="text-xs">FTS</Badge>
                          )}
                        </div>
                        
                        {/* Admin Delete Button for Recent Discussions */}
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
                      
                      <p className="text-sm text-muted-foreground mb-1">
                        {discussion.message}
                      </p>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatTimestamp(discussion.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {allDiscussions.length > 10 && (
                  <div className="text-center pt-4">
                    <Button variant="outline">
                      Load More Discussions
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DiscussionSearch;
