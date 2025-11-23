import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Brief } from '@/data/mockData';

interface StatusBadgeProps {
  status: Brief['status'];
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: Brief['status']) => {
    // Normalize status to lowercase for comparison
    const normalizedStatus = status.toLowerCase().replace(/-/g, '_');
    
    switch (normalizedStatus) {
      case 'pending':
      case 'p':
        return {
          label: 'Pending',
          className: 'status-pending'
        };
      case 'reviewed':
      case 'review':
        return {
          label: 'Reviewed',
          className: 'status-reviewed'
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          className: 'status-in-progress'
        };
      case 'completed':
      case 'complete':
        return {
          label: 'Completed',
          className: 'status-completed'
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-muted'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant="outline" 
      className={`${config.className} ${className || ''}`}
    >
      {config.label}
    </Badge>
  );
};