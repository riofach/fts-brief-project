// API client exports
export { api, healthCheck, isOnline, handleApiResponse, handleApiError } from './client';
export * from './types';

// API modules
export { authApi, tokenUtils } from './auth';

// TODO: Add other API modules as they're implemented
// export { briefsApi } from './briefs';
// export { discussionsApi } from './discussions';
// export { notificationsApi } from './notifications';
// export { deliverablesApi } from './deliverables';
