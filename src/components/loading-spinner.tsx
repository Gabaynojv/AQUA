import { Loader } from 'lucide-react';

export function LoadingSpinner({ size = 'default' }: { size?: 'sm' | 'default' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <Loader className={`${sizeClasses[size]} animate-spin text-primary`} />
        <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-primary/5 to-cyan-500/5">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="relative">
          <Loader className="h-16 w-16 animate-spin text-primary mx-auto" />
          <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-primary/30 to-cyan-500/30 animate-pulse" />
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
