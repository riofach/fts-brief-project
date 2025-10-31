import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { websiteTypes, fontPreferences, moodThemes } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const CreateBrief: React.FC = () => {
  const { user } = useAuth();
  const { createBrief } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    websiteType: '',
    brandName: '',
    brandSlogan: '',
    mainColor: '#2563eb',
    secondaryColor: '',
    fontPreference: '',
    moodTheme: [] as string[],
    referenceLinks: [''],
    logoAssets: '',
    additionalNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMoodThemeChange = (theme: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      moodTheme: checked 
        ? [...prev.moodTheme, theme]
        : prev.moodTheme.filter(t => t !== theme)
    }));
  };

  const addReferenceLink = () => {
    setFormData(prev => ({
      ...prev,
      referenceLinks: [...prev.referenceLinks, '']
    }));
  };

  const updateReferenceLink = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      referenceLinks: prev.referenceLinks.map((link, i) => i === index ? value : link)
    }));
  };

  const removeReferenceLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      referenceLinks: prev.referenceLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Validation
    if (!formData.projectName || !formData.projectDescription || !formData.websiteType || !formData.brandName) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter out empty reference links
      const referenceLinks = formData.referenceLinks.filter(link => link.trim() !== '');
      
      const briefId = createBrief({
        clientId: user.id,
        projectName: formData.projectName,
        projectDescription: formData.projectDescription,
        websiteType: formData.websiteType,
        brandName: formData.brandName,
        brandSlogan: formData.brandSlogan || undefined,
        mainColor: formData.mainColor,
        secondaryColor: formData.secondaryColor || undefined,
        fontPreference: formData.fontPreference,
        moodTheme: formData.moodTheme,
        referenceLinks,
        logoAssets: formData.logoAssets || undefined,
        additionalNotes: formData.additionalNotes || undefined,
        status: 'pending'
      });

      toast({
        title: "Brief created successfully!",
        description: "Your project brief has been submitted for review",
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error creating brief",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Create Project Brief</h1>
          <p className="mt-2 text-muted-foreground">
            Provide detailed information about your project to help us deliver the best results
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Tell us about your project and brand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    placeholder="e.g., Corporate Website Redesign"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="websiteType">Website Type *</Label>
                  <Select value={formData.websiteType} onValueChange={(value) => handleInputChange('websiteType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select website type" />
                    </SelectTrigger>
                    <SelectContent>
                      {websiteTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription">Project Description *</Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Describe your project goals, target audience, and key requirements..."
                  value={formData.projectDescription}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name *</Label>
                  <Input
                    id="brandName"
                    placeholder="Your company/brand name"
                    value={formData.brandName}
                    onChange={(e) => handleInputChange('brandName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brandSlogan">Brand Slogan (Optional)</Label>
                  <Input
                    id="brandSlogan"
                    placeholder="Your brand tagline or slogan"
                    value={formData.brandSlogan}
                    onChange={(e) => handleInputChange('brandSlogan', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Design Preferences */}
          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle>Design Preferences</CardTitle>
              <CardDescription>
                Help us understand your visual preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mainColor">Main Color *</Label>
                  <div className="flex items-center space-x-3">
                    <Input
                      id="mainColor"
                      type="color"
                      value={formData.mainColor}
                      onChange={(e) => handleInputChange('mainColor', e.target.value)}
                      className="w-20 h-10 p-1 border rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={formData.mainColor}
                      onChange={(e) => handleInputChange('mainColor', e.target.value)}
                      placeholder="#2563eb"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color (Optional)</Label>
                  <div className="flex items-center space-x-3">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="w-20 h-10 p-1 border rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      placeholder="#1e40af"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontPreference">Font Preference</Label>
                <Select value={formData.fontPreference} onValueChange={(value) => handleInputChange('fontPreference', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select font style" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontPreferences.map(font => (
                      <SelectItem key={font} value={font}>{font}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Mood/Theme (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {moodThemes.map(theme => (
                    <div key={theme} className="flex items-center space-x-2">
                      <Checkbox
                        id={theme}
                        checked={formData.moodTheme.includes(theme)}
                        onCheckedChange={(checked) => handleMoodThemeChange(theme, checked as boolean)}
                      />
                      <Label htmlFor={theme} className="text-sm">{theme}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* References and Assets */}
          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle>References and Assets</CardTitle>
              <CardDescription>
                Share inspiration and any existing brand materials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Reference Links</Label>
                {formData.referenceLinks.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="https://example.com"
                      value={link}
                      onChange={(e) => updateReferenceLink(index, e.target.value)}
                      className="flex-1"
                    />
                    {formData.referenceLinks.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeReferenceLink(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addReferenceLink}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reference Link
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoAssets">Logo/Assets</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="mt-4">
                    <Label htmlFor="logoAssets" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-foreground">
                        Upload logo and brand assets
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        PNG, JPG, PDF up to 10MB (Mock upload)
                      </span>
                    </Label>
                    <Input
                      id="logoAssets"
                      type="text"
                      placeholder="logo-files.zip (simulated upload)"
                      value={formData.logoAssets}
                      onChange={(e) => handleInputChange('logoAssets', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any specific requirements, preferences, or additional information..."
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="shadow-glow">
              {isSubmitting ? 'Creating Brief...' : 'Create Brief'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBrief;