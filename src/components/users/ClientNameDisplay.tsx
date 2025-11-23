import React from 'react';
import { useUser } from '../../hooks/useUsers';
import { Skeleton } from '../ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ClientNameDisplayProps {
  clientId: string;
  className?: string;
  showLabel?: boolean;
}

export const ClientNameDisplay: React.FC<ClientNameDisplayProps> = ({ 
  clientId, 
  className = '', 
  showLabel = false 
}) => {
  const { data: user, isLoading } = useUser(clientId);
  const displayName = user?.name || clientId || 'Unknown Client';
  const isFallback = !user;

  if (isLoading) {
    return <Skeleton className="h-4 w-32 inline-block align-middle" />;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`${className} ${isFallback ? 'text-muted-foreground' : 'cursor-help border-b border-dotted border-muted-foreground/50'}`}>
            {showLabel && <span className="text-muted-foreground mr-1">Client:</span>}
            {displayName}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {user ? (
            <div className="text-xs space-y-1">
              <p className="font-semibold">{user.name}</p>
              <p>{user.email}</p>
              {user.company && <p className="text-muted-foreground">{user.company}</p>}
              <p className="text-muted-foreground text-[10px] uppercase tracking-wider">{user.role}</p>
            </div>
          ) : (
            <p className="text-xs">Client details not available</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ClientNameDisplay;
