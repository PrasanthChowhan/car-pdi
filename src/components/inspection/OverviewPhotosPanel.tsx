import { useState, useEffect, useRef } from 'react';
import { useInspectionStore } from '../../store/useInspectionStore';
import { OVERVIEW_VIEWS } from '../../lib/checklistData';
import type { OverviewView } from '../../lib/checklistData';
import { loadImageBlob, saveImageBlob, deleteImageBlob } from '../../lib/storage';
import { compressAndResizeImage, generateUUID } from '../../lib/imageUtils';
import { Camera, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react';

interface PhotoCardProps {
  view: OverviewView;
  photoId: string | undefined;
  updatePhoto: (key: string, photoId: string | undefined) => void;
}

function OverviewPhotoCard({ view, photoId, updatePhoto }: PhotoCardProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    let url: string | null = null;

    const loadPhoto = async () => {
      if (photoId) {
        setLoading(true);
        const blob = await loadImageBlob(photoId);
        if (blob && active) {
          url = URL.createObjectURL(blob);
          setPhotoUrl(url);
        }
        setLoading(false);
      } else {
        setPhotoUrl(null);
      }
    };

    loadPhoto();

    return () => {
      active = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [photoId]);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const compressedBlob = await compressAndResizeImage(file);
      const newPhotoId = generateUUID();
      await saveImageBlob(newPhotoId, compressedBlob);

      if (photoId) {
        await deleteImageBlob(photoId);
      }

      updatePhoto(view.id, newPhotoId);
    } catch (error) {
      console.error('Overview photo capture failed:', error);
      alert('Photo capture failed. Please try again.');
    } finally {
      setLoading(false);
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!photoId) return;

    const confirm = window.confirm(`Delete the overview photo for "${view.label}"?`);
    if (!confirm) return;

    setLoading(true);
    await deleteImageBlob(photoId);
    updatePhoto(view.id, undefined);
    setLoading(false);
  };

  return (
    <div 
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xs)',
        padding: 'var(--spacing-sm)',
        textAlign: 'center',
        position: 'relative',
        cursor: photoUrl ? 'default' : 'pointer',
        border: photoUrl ? '1px solid var(--color-hairline-strong)' : '1px dashed var(--color-hairline-strong)',
        backgroundColor: photoUrl ? 'var(--color-surface-card)' : 'var(--color-canvas-soft)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}
      onClick={(e) => {
        // Do not trigger fileInput directly on card click to let user click the specific buttons
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        if (!photoUrl) {
          e.currentTarget.style.borderColor = 'var(--color-primary)';
          e.currentTarget.style.backgroundColor = 'var(--color-surface-card)';
        } else {
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(38, 37, 30, 0.05)';
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        if (!photoUrl) {
          e.currentTarget.style.borderColor = 'var(--color-hairline-strong)';
          e.currentTarget.style.backgroundColor = 'var(--color-canvas-soft)';
        } else {
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <input 
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleCapture}
        style={{ display: 'none' }}
      />
      <input 
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleCapture}
        style={{ display: 'none' }}
      />

      {/* Header View Name */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span 
          className="caption-uppercase" 
          style={{ 
            fontSize: '10.5px', 
            color: photoUrl ? 'var(--color-ink)' : 'var(--color-muted)',
            fontWeight: 600
          }}
        >
          {view.label}
        </span>
        {photoUrl && <CheckCircle2 size={14} style={{ color: 'var(--color-semantic-success)' }} />}
      </div>

      {/* Image Area */}
      <div 
        style={{
          width: '100%',
          aspectRatio: '4 / 3',
          borderRadius: 'var(--rounded-md)',
          backgroundColor: 'rgba(38, 37, 30, 0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '1px solid var(--color-hairline-soft)',
          position: 'relative'
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--color-muted)' }}>
            <RefreshCw size={20} className="animate-spin" />
            <span style={{ fontSize: '11px' }}>Syncing...</span>
          </div>
        ) : photoUrl ? (
          <>
            <img 
              src={photoUrl} 
              alt={view.label} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Delete Overlay Button */}
            <button
              type="button"
              onClick={handleDelete}
              className="button-secondary"
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                height: '32px',
                minHeight: '32px',
                width: '32px',
                borderRadius: 'var(--rounded-md)',
                padding: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'var(--color-semantic-error)',
                borderColor: 'var(--color-hairline-strong)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
              title={`Remove ${view.label} Photo`}
            >
              <Trash2 size={14} />
            </button>
          </>
        ) : (
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px', 
              width: '100%', 
              height: '100%',
              padding: '12px',
              boxSizing: 'border-box'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Camera size={22} strokeWidth={1.5} style={{ color: 'var(--color-muted)' }} />
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="button-secondary"
                style={{ 
                  flex: 1, 
                  height: '32px', 
                  minHeight: '32px', 
                  padding: '0 6px', 
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  borderColor: 'var(--color-hairline-strong)',
                  boxShadow: 'none'
                }}
              >
                <Camera size={11} />
                <span>Camera</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="button-secondary"
                style={{ 
                  flex: 1, 
                  height: '32px', 
                  minHeight: '32px', 
                  padding: '0 6px', 
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  borderColor: 'var(--color-hairline-strong)',
                  boxShadow: 'none'
                }}
              >
                <span>Upload</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OverviewPhotosPanel() {
  const { overviewPhotos, updateOverviewPhoto } = useInspectionStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      <div style={{ textAlign: 'left', marginBottom: 'var(--spacing-xs)' }}>
        <p className="body-sm" style={{ color: 'var(--color-muted)', margin: 0, lineHeight: 1.5 }}>
          Reference photographs establish a clear record of the vehicle's physical condition on delivery day. Capture all 9 required reference views.
        </p>
      </div>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-base)'
        }}
      >
        {OVERVIEW_VIEWS.map((view) => (
          <OverviewPhotoCard 
            key={view.id}
            view={view}
            photoId={overviewPhotos?.[view.id]}
            updatePhoto={updateOverviewPhoto}
          />
        ))}
      </div>
    </div>
  );
}
