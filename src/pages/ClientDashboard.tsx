import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useBriefsByClient } from '@/api';
import { useNavigate } from 'react-router-dom';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  // Use TanStack Query to fetch user's briefs, only when authenticated
  const { data: userBriefs = [], isLoading: briefsLoading, error: briefsError } = useBriefsByClient(user?.id, isAuthenticated);
  const navigate = useNavigate();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
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
      total: userBriefs.length,
      pending: userBriefs.filter(b => b.status === 'pending').length,
      inProgress: userBriefs.filter(b => b.status === 'in-progress').length,
      completed: userBriefs.filter(b => b.status === 'completed').length
    };
    return stats;
  };

  const stats = getStatusStats();

  // Show loading state
  if (briefsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (briefsError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Error loading briefs</h1>
            <p className="text-muted-foreground mt-2">Failed to load your project briefs. Please try again.</p>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your project briefs and track their progress
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link to="/create-brief">
              <Button className="shadow-glow">
                <Plus className="mr-2 h-4 w-4" />
                Create New Brief
              </Button>
            </Link>
          </div>
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
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
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

        {/* Briefs List */}
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle>My Project Briefs</CardTitle>
            <CardDescription>
              View and manage all your submitted project briefs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userBriefs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No project briefs yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Get started by creating your first project brief
                </p>
                <div className="mt-6">
                  <Link to="/create-brief">
                    <Button className="shadow-glow">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Brief
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {userBriefs.map((brief) => (
                  <div key={brief.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(brief.status)}
                          <h3 className="font-semibold text-foreground">{brief.projectName}</h3>
                          <StatusBadge status={brief.status} />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {brief.projectDescription}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Type: {brief.websiteType}</span>
                          <span>Brand: {brief.brandName}</span>
                          <span>Created: {new Date(brief.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link to={`/brief/${brief.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
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
      </div>
    </div>
  );
};

export default ClientDashboard;