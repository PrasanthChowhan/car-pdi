import { useState, useEffect } from 'react';
import { loadImageBlob } from '../../lib/storage';

interface SummaryPhotoProps {
  photoId: string;
}

export default function SummaryPhoto({ photoId }: SummaryPhotoProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    const load = async () => {
      const blob = await loadImageBlob(photoId);
      if (blob && active) {
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      }
    };
    load();

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [photoId]);

  if (!url) return <span style={{ color: 'var(--color-muted)', fontSize: '13px' }}>Loading evidence photo...</span>;

  return (
    <img 
      src={url} 
      alt="Issue evidence" 
      style={{ 
        maxWidth: '100%', 
        maxHeight: '220px', 
        borderRadius: 'var(--rounded-md)', 
        marginTop: 'var(--spacing-sm)', 
        display: 'block', 
        border: '1px solid var(--color-hairline-strong)',
        objectFit: 'contain'
      }} 
    />
  );
}
