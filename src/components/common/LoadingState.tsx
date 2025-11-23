import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  fullScreen?: boolean;
  className?: string;
  text?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  fullScreen = false, 
  className,
  text = "Loading..." 
}) => {
  if (fullScreen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-sm animate-pulse">{text}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
      <p className="text-muted-foreground text-sm">{text}</p>
    </div>
  );
};

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <Loader2 className={cn("h-4 w-4 animate-spin", className)} />
);

export default LoadingState;
