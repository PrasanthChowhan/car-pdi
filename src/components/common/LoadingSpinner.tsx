import { RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 'var(--spacing-md)' }}>
      <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
      <p className="body-md" style={{ color: 'var(--color-muted)' }}>{message}</p>
    </div>
  );
}
