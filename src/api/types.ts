// Base API configuration and types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page?: number;
    limit?: number;
  };
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

// API Health and Info
export interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

export interface ApiInfoResponse {
  name: string;
  version: string;
  description: string;
  environment: string;
  timestamp: string;
  endpoints: {
    authentication: string;
    briefs: string;
    discussions: string;
  };
}

// Error Codes
export type ErrorCode = 
  | 'UNAUTHORIZED'
  | 'FORBIDDEN' 
  | 'AUTH_FAILED'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'VALIDATION_ERROR'
  | 'BRIEF_NOT_FOUND'
  | 'USER_NOT_FOUND'
  | 'DELIVERABLE_NOT_FOUND'
  | 'DISCUSSION_NOT_FOUND'
  | 'NOTIFICATION_NOT_FOUND'
  | 'ROUTE_NOT_FOUND'
  | 'INTERNAL_SERVER_ERROR';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CLIENT';
  company?: string;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// Brief types
export interface Brief {
  id: string;
  clientId: string;
  projectName: string;
  projectDescription: string;
  websiteType: 'Corporate' | 'E-commerce' | 'Portfolio' | 'Hotel/Hospitality' | 'Restaurant' | 'Healthcare' | 'Education' | 'Non-profit' | 'Blog/News' | 'Entertainment';
  brandName: string;
  brandSlogan?: string;
  mainColor: string; // Hex color code
  secondaryColor?: string; // Hex color code
  fontPreference: 'Modern' | 'Classic' | 'Playful' | 'Minimalist' | 'Elegant';
  moodTheme: string[]; // Array of mood themes
  referenceLinks: string[]; // Array of URLs
  logoAssets?: string; // URL to logo package
  additionalNotes?: string;
  status: 'PENDING' | 'REVIEWED' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  deliverables?: Deliverable[];
  discussions?: Discussion[];
}

export interface BriefsResponse {
  briefs: Brief[];
  total: number;
}

export interface CreateBriefRequest {
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
}

export interface UpdateBriefStatusRequest {
  status: 'PENDING' | 'REVIEWED' | 'IN_PROGRESS' | 'COMPLETED';
}

// Deliverable types
export interface Deliverable {
  id: string;
  briefId: string;
  title: string;
  description: string;
  link: string;
  type: 'FIGMA' | 'PROTOTYPE' | 'WEBSITE' | 'DOCUMENT';
  addedAt: string;
}

export interface CreateDeliverableRequest {
  title: string;
  description: string;
  link: string;
  type: 'FIGMA' | 'PROTOTYPE' | 'WEBSITE' | 'DOCUMENT';
}

// Discussion types
export interface Discussion {
  id: string;
  briefId: string;
  userId: string;
  message: string;
  timestamp: string; // ISO 8601 format
  isFromAdmin: boolean;
  user?: {
    name: string;
    email: string;
  };
  brief?: {
    projectName: string;
  };
}

export interface DiscussionsResponse {
  discussions: Discussion[];
}

export interface MyDiscussionsResponse {
  discussions: (Discussion & {
    brief: {
      projectName: string;
    };
  })[];
}

export interface CreateDiscussionRequest {
  message: string;
}

export interface SearchDiscussionsRequest {
  query?: string;
  briefId?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}

export interface SearchDiscussionsResponse {
  discussions: Discussion[];
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  briefId: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string; // ISO 8601 format
  type: 'STATUS_UPDATE' | 'NEW_MESSAGE' | 'DELIVERABLE_ADDED';
  brief?: {
    projectName: string;
  };
}

export interface NotificationsResponse {
  notifications: Notification[];
}

export interface UnreadNotificationsResponse {
  unreadCount: number;
}

export interface MarkNotificationReadRequest {
  isRead: boolean;
}

// Deliverable types
export interface DeliverablesResponse {
  deliverables: Deliverable[];
}
