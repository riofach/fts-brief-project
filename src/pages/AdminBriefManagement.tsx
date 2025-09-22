import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Upload, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/layout/Navbar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { Brief, Deliverable } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const AdminBriefManagement: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getBriefById, updateBriefStatus, addDeliverable } = useApp();
  const navigate = useNavigate();
  
  const [newDeliverable, setNewDeliverable] = useState({
    title: '',
    description: '',
    link: '',
    type: 'figma' as Deliverable['type']
  });
  const [isAddingDeliverable, setIsAddingDeliverable] = useState(false);

  const brief = getBriefById(id);

  if (!brief) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Brief not found</h1>
            <p className="mt-2 text-muted-foreground">The requested brief could not be found.</p>
            <Link to="/admin">
              <Button className="mt-4">Back to Admin Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = (newStatus: Brief['status']) => {
    updateBriefStatus(brief.id, newStatus);
    toast({
      title: "Status updated",
      description: `Brief status changed to ${newStatus.replace('-', ' ')}`,
    });
  };

  const handleAddDeliverable = () => {
    if (!newDeliverable.title || !newDeliverable.link) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsAddingDeliverable(true);
    try {
      addDeliverable(brief.id, {
        briefId: brief.id,
        title: newDeliverable.title,
        description: newDeliverable.description,
        link: newDeliverable.link,
        type: newDeliverable.type
      });
      
      setNewDeliverable({
        title: '',
        description: '',
        link: '',
        type: 'figma'
      });
      
      toast({
        title: "Deliverable added",
        description: "The deliverable has been added to the project",
      });
    } catch (error) {
      toast({
        title: "Error adding deliverable",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsAddingDeliverable(false);
    }
  };

  if (user?.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={`/admin/brief/${brief.id}`}
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Brief Details
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Manage Brief</h1>
              <p className="mt-2 text-muted-foreground">
                {brief.projectName} • {brief.brandName}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <StatusBadge status={brief.status} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Management */}
          <Card className="card-gradient shadow-lg">
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
              <CardDescription>
                Update the current status of this project brief
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Current Status</Label>
                <div className="mt-2">
                  <StatusBadge status={brief.status} />
                </div>
              </div>
              
              <div>
                <Label>Update Status</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button
                    variant={brief.status === 'pending' ? 'default' : 'outline'}
                    onClick={() => handleStatusUpdate('pending')}
                    disabled={brief.status === 'pending'}
                    size="sm"
                  >
                    Pending
                  </Button>
                  <Button
                    variant={brief.status === 'reviewed' ? 'default' : 'outline'}
                    onClick={() => handleStatusUpdate('reviewed')}
                    disabled={brief.status === 'reviewed'}
                    size="sm"
                  >
                    Reviewed
                  </Button>
                  <Button
                    variant={brief.status === 'in-progress' ? 'default' : 'outline'}
                    onClick={() => handleStatusUpdate('in-progress')}
                    disabled={brief.status === 'in-progress'}
                    size="sm"
                  >
                    In Progress
                  </Button>
                  <Button
                    variant={brief.status === 'completed' ? 'default' : 'outline'}
                    onClick={() => handleStatusUpdate('completed')}
                    disabled={brief.status === 'completed'}
                    size="sm"
                  >
                    Completed
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Deliverable */}
          <Card className="card-gradient shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5" />
                Add Deliverable
              </CardTitle>
              <CardDescription>
                Share files, links, or documents with the client
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="deliverable-title">Title *</Label>
                <Input
                  id="deliverable-title"
                  value={newDeliverable.title}
                  onChange={(e) => setNewDeliverable(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Initial Wireframes"
                />
              </div>
              
              <div>
                <Label htmlFor="deliverable-description">Description</Label>
                <Textarea
                  id="deliverable-description"
                  value={newDeliverable.description}
                  onChange={(e) => setNewDeliverable(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the deliverable"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="deliverable-link">Link/URL *</Label>
                <Input
                  id="deliverable-link"
                  value={newDeliverable.link}
                  onChange={(e) => setNewDeliverable(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="https://figma.com/..."
                />
              </div>
              
              <div>
                <Label htmlFor="deliverable-type">Type</Label>
                <Select
                  value={newDeliverable.type}
                  onValueChange={(value: Deliverable['type']) => 
                    setNewDeliverable(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="figma">Figma Design</SelectItem>
                    <SelectItem value="prototype">Prototype</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleAddDeliverable}
                disabled={!newDeliverable.title || !newDeliverable.link || isAddingDeliverable}
                className="w-full shadow-glow"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isAddingDeliverable ? 'Adding...' : 'Add Deliverable'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Current Deliverables */}
        {brief.deliverables.length > 0 && (
          <Card className="card-gradient shadow-lg mt-8">
            <CardHeader>
              <CardTitle>Current Deliverables</CardTitle>
              <CardDescription>
                Files and links already shared with the client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {brief.deliverables.map((deliverable) => (
                  <div key={deliverable.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{deliverable.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{deliverable.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-muted-foreground">
                            Type: {deliverable.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Added: {new Date(deliverable.addedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <a 
                        href={deliverable.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
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
    </div>
  );
};

export default AdminBriefManagement;