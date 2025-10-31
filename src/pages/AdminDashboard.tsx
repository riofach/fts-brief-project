import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Clock, CheckCircle2, AlertCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/layout/Navbar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { mockUsers } from '@/data/mockData';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { briefs } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  
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

  const getClientName = (clientId: string) => {
    const client = mockUsers.find(u => u.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const getStatusStats = () => {
    const stats = {
      total: briefs.length,
      pending: briefs.filter(b => b.status === 'pending').length,
      inProgress: briefs.filter(b => b.status === 'in-progress').length,
      completed: briefs.filter(b => b.status === 'completed').length
    };
    return stats;
  };

  const getFilteredBriefs = () => {
    let filtered = briefs;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(brief => brief.status === statusFilter);
    }
    
    if (clientFilter !== 'all') {
      filtered = filtered.filter(brief => brief.clientId === clientFilter);
    }
    
    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  };

  const stats = getStatusStats();
  const filteredBriefs = getFilteredBriefs();
  const clients = mockUsers.filter(u => u.role === 'client');

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
                  <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                  <p className="text-2xl font-bold text-foreground">{clients.length}</p>
                </div>
                <Users className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Briefs List */}
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>All Project Briefs</CardTitle>
                <CardDescription>
                  Review, manage and collaborate on client project briefs
                </CardDescription>
              </div>
              
              {/* Filters */}
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredBriefs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No briefs found</h3>
                <p className="mt-2 text-muted-foreground">
                  {briefs.length === 0 
                    ? "No project briefs have been submitted yet" 
                    : "No briefs match your current filters"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBriefs.map((brief) => (
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
                          <span>Client: {getClientName(brief.clientId)}</span>
                          <span>Type: {brief.websiteType}</span>
                          <span>Brand: {brief.brandName}</span>
                          <span>Updated: {new Date(brief.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link to={`/admin/brief/${brief.id}`}>
                          <Button variant="outline" size="sm">
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
      </div>
    </div>
  );
};

export default AdminDashboard;