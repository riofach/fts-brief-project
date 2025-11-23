import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../api/client';
import type { Deliverable, CreateDeliverableRequest } from '../api/types';
import { queryKeys } from '../lib/queryClient';
import type { Brief } from '../api/types';

// Hook to fetch deliverables for a brief
export const useBriefDeliverables = (briefId?: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.briefs.deliverables(briefId || ''),
    queryFn: async () => {
      if (!briefId) return [];
      const response = await api.get(`/briefs/${briefId}/deliverables`);
      return response.data.data.deliverables || [];
    },
    enabled: enabled && !!briefId,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) {
        return false;
      }
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Hook to add a new deliverable (admin only)
export const useAddDeliverable = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      briefId,
      deliverableData,
    }: {
      briefId: string;
      deliverableData: CreateDeliverableRequest;
    }): Promise<Deliverable> => {
      const response = await api.post(`/briefs/${briefId}/deliverables`, deliverableData);
      return response.data.data;
    },
    onSuccess: (newDeliverable, variables) => {
      // Update the deliverables cache for the brief
      queryClient.setQueryData<Deliverable[]>(
        queryKeys.briefs.deliverables(variables.briefId),
        (oldDeliverables = []) => [newDeliverable, ...oldDeliverables]
      );
      
      // Update the brief detail cache to include the new deliverable
      queryClient.setQueryData<Brief | undefined>(
        queryKeys.briefs.detail(variables.briefId),
        (oldBrief) => {
          if (!oldBrief) return oldBrief;
          return {
            ...oldBrief,
            deliverables: [newDeliverable, ...(oldBrief.deliverables || [])],
            updatedAt: new Date().toISOString(),
          };
        }
      );
      
      // Invalidate other deliverables queries
      queryClient.invalidateQueries({ queryKey: queryKeys.briefs.deliverables(variables.briefId) });
      
      toast.success('Deliverable added successfully');
    },
  });
};

export default {
  useBriefDeliverables,
  useAddDeliverable,
};
