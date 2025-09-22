export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'client' | 'admin';
  company?: string;
}

export interface Brief {
  id: string;
  clientId: string;
  projectName: string;
  projectDescription: string;
  websiteType: string;
  brandName: string;
  brandSlogan?: string;
  mainColor: string;
  secondaryColor?: string;
  fontPreference: string;
  moodTheme: string[];
  referenceLinks: string[];
  logoAssets?: string;
  additionalNotes?: string;
  status: 'pending' | 'reviewed' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
  deliverables: Deliverable[];
}

export interface Deliverable {
  id: string;
  briefId: string;
  title: string;
  description: string;
  link: string;
  type: 'figma' | 'prototype' | 'website' | 'document';
  addedAt: string;
}

export interface Discussion {
  id: string;
  briefId: string;
  userId: string;
  message: string;
  timestamp: string;
  isFromAdmin: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  briefId: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  type: 'status_update' | 'new_message' | 'deliverable_added';
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@fts.com',
    password: 'admin123',
    name: 'FTS Admin',
    role: 'admin',
    company: 'PT Fujiyama Technology Solutions'
  },
  {
    id: '2',
    email: 'client@demo.com',
    password: 'client123',
    name: 'John Anderson',
    role: 'client',
    company: 'Demo Corp'
  },
  {
    id: '3',
    email: 'sarah@boutique.com',
    password: 'client123',
    name: 'Sarah Williams',
    role: 'client',
    company: 'Boutique Fashion'
  }
];

// Mock Briefs
export const mockBriefs: Brief[] = [
  {
    id: '1',
    clientId: '2',
    projectName: 'Corporate Website Redesign',
    projectDescription: 'Complete redesign of our corporate website to reflect our new brand identity and improve user experience.',
    websiteType: 'Corporate',
    brandName: 'Demo Corp',
    brandSlogan: 'Innovation Through Technology',
    mainColor: '#2563eb',
    secondaryColor: '#1e40af',
    fontPreference: 'Modern',
    moodTheme: ['Professional', 'Minimalist'],
    referenceLinks: ['https://stripe.com', 'https://linear.app'],
    logoAssets: 'logo-files.zip',
    additionalNotes: 'Please focus on mobile responsiveness and fast loading times.',
    status: 'in-progress',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    deliverables: [
      {
        id: '1',
        briefId: '1',
        title: 'Wireframes & Initial Design',
        description: 'Initial wireframes and design concepts',
        link: 'https://figma.com/demo-wireframes',
        type: 'figma',
        addedAt: '2024-01-18T09:00:00Z'
      }
    ]
  },
  {
    id: '2',
    clientId: '3',
    projectName: 'E-commerce Fashion Store',
    projectDescription: 'Modern e-commerce platform for our fashion boutique with inventory management and customer accounts.',
    websiteType: 'E-commerce',
    brandName: 'Boutique Fashion',
    brandSlogan: 'Style Meets Elegance',
    mainColor: '#ec4899',
    secondaryColor: '#be185d',
    fontPreference: 'Elegant',
    moodTheme: ['Elegant', 'Fun'],
    referenceLinks: ['https://shopify.com', 'https://glossier.com'],
    additionalNotes: 'Need integration with payment gateways and shipping providers.',
    status: 'pending',
    createdAt: '2024-01-22T16:20:00Z',
    updatedAt: '2024-01-22T16:20:00Z',
    deliverables: []
  }
];

// Mock Discussions
export const mockDiscussions: Discussion[] = [
  {
    id: '1',
    briefId: '1',
    userId: '1',
    message: 'Thanks for the detailed brief! We\'ll start with wireframes and get back to you within 3-5 business days.',
    timestamp: '2024-01-16T09:00:00Z',
    isFromAdmin: true
  },
  {
    id: '2',
    briefId: '1',
    userId: '2',
    message: 'Looks great! Could we explore a slightly darker shade for the secondary color?',
    timestamp: '2024-01-19T11:30:00Z',
    isFromAdmin: false
  },
  {
    id: '3',
    briefId: '1',
    userId: '1',
    message: 'Absolutely! I\'ve uploaded revised designs with the darker secondary color. Please review and let us know your thoughts.',
    timestamp: '2024-01-20T14:30:00Z',
    isFromAdmin: true
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '2',
    briefId: '1',
    title: 'Status Updated',
    message: 'Your project "Corporate Website Redesign" status changed to In Progress',
    isRead: false,
    timestamp: '2024-01-20T14:30:00Z',
    type: 'status_update'
  },
  {
    id: '2',
    userId: '2',
    briefId: '1',
    title: 'New Deliverable',
    message: 'Wireframes & Initial Design has been added to your project',
    isRead: false,
    timestamp: '2024-01-18T09:00:00Z',
    type: 'deliverable_added'
  },
  {
    id: '3',
    userId: '1',
    briefId: '2',
    title: 'New Project Brief',
    message: 'Sarah Williams submitted a new project brief: E-commerce Fashion Store',
    isRead: true,
    timestamp: '2024-01-22T16:20:00Z',
    type: 'status_update'
  }
];

export const websiteTypes = [
  'Corporate',
  'E-commerce',
  'Portfolio',
  'Hotel/Hospitality',
  'Restaurant',
  'Healthcare',
  'Education',
  'Non-profit',
  'Blog/News',
  'Entertainment'
];

export const fontPreferences = [
  'Modern',
  'Classic',
  'Playful',
  'Minimalist',
  'Elegant'
];

export const moodThemes = [
  'Elegant',
  'Minimalist',
  'Fun',
  'Professional',
  'Techy',
  'Creative',
  'Bold',
  'Warm'
];