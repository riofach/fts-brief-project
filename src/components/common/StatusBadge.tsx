import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Brief } from '@/data/mockData';

interface StatusBadgeProps {
  status: Brief['status'];
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: Brief['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          className: 'status-pending'
        };
      case 'reviewed':
        return {
          label: 'Reviewed',
          className: 'status-reviewed'
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          className: 'status-in-progress'
        };
      case 'completed':
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