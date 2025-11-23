import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Clock, CheckCircle2, AlertCircle, Filter, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/layout/Navbar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DiscussionSearch } from '@/components/discussion/DiscussionSearch';
import { ClientNameDisplay } from '@/components/users/ClientNameDisplay';
import { useAuth } from '@/contexts/AuthContext';
import { useBriefs, useMyDiscussions } from '@/api';
import type { Brief } from '@/api';
import LoadingState from '@/components/common/LoadingState';

// TODO: Implement proper client name display
// We need to:
// 1. Create /api/users/:id endpoint in backend 
// 2. Add useUser hook to fetch user info
// 3. Replace "Client ID" with actual client name
// 
// For now, showing Client ID is the correct approach
// (prevents misleading fake names that don't match database)

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  // Use TanStack Query hooks for real data, only when authenticated
  const { data: briefs = [], isLoading: briefsLoading, error: briefsError } = useBriefs(isAuthenticated);
  const { data: myDiscussions = [], isLoading: discussionsLoading } = useMyDiscussions(isAuthenticated);
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('briefs');
  
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'reviewed':
        return <AlertCircle className="h-4 w-4 text-info" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-primary" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusStats = () => {
    const stats = {
      total: briefs.length,
      pending: briefs.filter(b => b.status === 'PENDING').length,
      inProgress: briefs.filter(b => b.status === 'IN_PROGRESS').length,
      completed: briefs.filter(b => b.status === 'COMPLETED').length
    };
    return stats;
  };

  const getFilteredBriefs = () => {
    let filtered = briefs;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(brief => brief.status === statusFilter);
    }
    
    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  };

  const stats = getStatusStats();
  const filteredBriefs = getFilteredBriefs();
  
  // Show loading state
  if (briefsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  // Show error state
  if (briefsError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Error loading dashboard</h1>
            <p className="text-muted-foreground mt-2">Failed to load dashboard data. Please try again.</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage all project briefs and collaborate with clients
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Briefs</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="briefs" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Brief Management
            </TabsTrigger>
            <TabsTrigger value="discussions" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Discussion Search
            </TabsTrigger>
          </TabsList>
          
          {/* Briefs Tab */}
          <TabsContent value="briefs" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REVIEWED">Reviewed</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Briefs List */}
            <Card>
              <CardHeader>
                <CardTitle>All Project Briefs</CardTitle>
                <CardDescription>
                  Manage and review project briefs from all clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredBriefs.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold text-foreground">No briefs found</h3>
                    <p className="mt-2 text-muted-foreground">
                      No briefs match your current filters
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBriefs.map((brief) => (
                      <div key={brief.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-lg text-foreground">
                                <Link to={`/admin/brief/${brief.id}/manage`}>
                                  {brief.projectName}
                                </Link>
                              </h3>
                              <StatusBadge status={brief.status} />
                            </div>
                            <div className="text-muted-foreground mb-2 flex items-center gap-2">
                              <ClientNameDisplay clientId={brief.clientId} showLabel={true} />
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {brief.projectDescription}
                            </p>
                            <div className="flex items-center space-x-4 mt-3 text-xs text-muted-foreground">
                              <span>Created {new Date(brief.createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>Updated {new Date(brief.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Link to={`/admin/brief/${brief.id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                            <Link to={`/admin/brief/${brief.id}/manage`}>
                              <Button variant="default" size="sm">
                                Manage
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Discussions Tab */}
          <TabsContent value="discussions">
            <DiscussionSearch
              showFilters={true}
              onSelectDiscussion={(discussion) => {
                // Handle discussion selection - could navigate to brief or open modal
                console.log('Selected discussion:', discussion);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
