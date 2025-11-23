# API Integration Guide

This guide explains how the frontend integrates with the backend API in the FTS Brief Management System.

## Architecture Overview

The application uses a layered architecture for API integration:

1.  **API Client Layer** (`src/api/client.ts`): Axios instance with interceptors for auth and error handling.
2.  **Type Definitions** (`src/api/types.ts`): TypeScript interfaces matching backend responses.
3.  **Data Fetching Hooks** (`src/hooks/`): Custom React hooks using TanStack Query for data management.
4.  **Global Configuration** (`src/lib/queryClient.ts`): QueryClient setup with caching and error strategies.

## Adding New API Endpoints

### 1. Define Types

Add request/response interfaces in `src/api/types.ts`:

```typescript
export interface NewFeature {
  id: string;
  name: string;
}

export interface CreateFeatureRequest {
  name: string;
}
```

### 2. Create/Update Hooks

Create a new hook file or update an existing one in `src/hooks/`. Use `useQuery` for fetching and `useMutation` for modifying data.

**Fetching Data:**

```typescript
export const useFeatures = () => {
  return useQuery({
    queryKey: ['features'],
    queryFn: async () => {
      const response = await api.get('/features');
      return response.data.data;
    },
  });
};
```

**Mutating Data:**

```typescript
export const useCreateFeature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFeatureRequest) => {
      const response = await api.post('/features', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast.success('Feature created!');
    },
  });
};
```

### 3. Error Handling

- **Global Errors**: 5xx errors and mutations are automatically handled by `queryClient` (shows toast).
- **Specific Errors**: Use `onError` callback in mutations or check `error` object in queries.
- **Auth Errors**: 401 errors trigger automatic token refresh or logout.

### 4. Caching Strategy

- **Stale Time**: Default is 5 minutes for queries.
- **Invalidation**: Always invalidate relevant query keys after a successful mutation to keep UI in sync.
- **Optimistic Updates**: Implement for high-frequency actions (like messaging) to improve UX.

## Key Files

- `src/api/client.ts`: Axios configuration, interceptors.
- `src/lib/queryClient.ts`: QueryClient config, query keys factory.
- `src/hooks/useAuth.ts`: Authentication logic (login, logout, user data).
- `src/hooks/useBriefs.ts`: Brief management hooks.

## Best Practices

1.  **Use Query Keys Factory**: Define keys in `src/lib/queryClient.ts` to avoid typos.
2.  **Type Safety**: Always type API responses.
3.  **Loading States**: Use `isLoading` from hooks to show skeletons/spinners.
4.  **Separation**: Keep API calls inside hooks, not components.
