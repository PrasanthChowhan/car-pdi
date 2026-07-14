import React from 'react';
import { Lightbulb, X } from 'lucide-react';

interface HintBannerProps {
  message: string;
  onDismiss: () => void;
}

export default function HintBanner({ message, onDismiss }: HintBannerProps) {
  return (
    <div 
      className="animate-fadeIn"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: 'rgba(245, 78, 0, 0.04)',
        border: '1px dashed var(--color-primary)',
        borderRadius: 'var(--rounded-md)',
        marginBottom: 'var(--spacing-md)',
        textAlign: 'left'
      }}
    >
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <Lightbulb size={16} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--color-ink)', fontWeight: 500, margin: 0 }}>
          {message}
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          padding: '2px',
          cursor: 'pointer',
          color: 'var(--color-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          flexShrink: 0
        }}
        onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ink)'}
        onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-muted)'}
        aria-label="Dismiss Hint"
      >
        <X size={14} />
      </button>
    </div>
  );
}
