/**
 * LoadingSpinner Component
 * 
 * Componente reutilizável de loading com indicador visual acessível.
 * Segue padrões WCAG 2.1 para acessibilidade.
 * 
 * @component
 * @example
 * ```tsx
 * <LoadingSpinner size="lg" label="Carregando dados..." />
 * ```
 */

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  label = 'Carregando...', 
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div 
      className="flex items-center justify-center gap-3"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={cn(
          'animate-spin rounded-full border-primary border-t-transparent',
          sizeClasses[size],
          className
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
      {size === 'lg' && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
