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

const VEHICLE_OUTLINES: Record<string, React.ReactNode> = {
  front: (
    <svg viewBox="0 0 100 100" width="68" height="68" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, color: 'var(--color-muted)' }}>
      <path d="M25 40 L75 40 L68 25 L32 25 Z" />
      <path d="M32 25 L68 25" />
      <path d="M15 52 C15 48 20 45 30 45 L70 45 C80 45 85 48 85 52 L85 70 L15 70 Z" />
      <rect x="20" y="50" width="12" height="6" rx="2" />
      <rect x="68" y="50" width="12" height="6" rx="2" />
      <rect x="38" y="52" width="24" height="8" rx="1" />
      <rect x="18" y="70" width="10" height="8" rx="1" />
      <rect x="72" y="70" width="10" height="8" rx="1" />
      <path d="M18 45 L12 43 A2 2 0 0 0 10 45 L10 47" />
      <path d="M82 45 L88 43 A2 2 0 0 1 90 45 L90 47" />
    </svg>
  ),
  rear: (
    <svg viewBox="0 0 100 100" width="68" height="68" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, color: 'var(--color-muted)' }}>
      <path d="M27 38 L73 38 L67 25 L33 25 Z" />
      <rect x="40" y="54" width="20" height="8" rx="1" />
      <path d="M15 50 C15 46 20 43 30 43 L70 43 C80 43 85 46 85 50 L85 70 L15 70 Z" />
      <rect x="18" y="48" width="14" height="5" rx="1" />
      <rect x="68" y="48" width="14" height="5" rx="1" />
      <rect x="18" y="70" width="10" height="8" rx="1" />
      <rect x="72" y="70" width="10" height="8" rx="1" />
    </svg>
  ),
  left: (
    <svg viewBox="0 0 100 100" width="76" height="76" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, color: 'var(--color-muted)' }}>
      <path d="M10 55 L20 52 L35 32 L68 32 L85 50 L92 53 L92 62 L85 62 L83 60 C80 54 70 54 67 60 L33 60 C30 54 20 54 17 60 L10 60 Z" />
      <circle cx="25" cy="60" r="8" />
      <circle cx="75" cy="60" r="8" />
      <path d="M37 36 L52 36 L52 48 L37 48 Z" />
      <path d="M55 36 L66 36 L76 48 L55 48 Z" />
    </svg>
  ),
  right: (
    <svg viewBox="0 0 100 100" width="76" height="76" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, color: 'var(--color-muted)' }}>
      <path d="M90 55 L80 52 L65 32 L32 32 L15 50 L8 53 L8 62 L15 62 L17 60 C20 54 30 54 33 60 L67 60 C70 54 80 54 83 60 L90 60 Z" />
      <circle cx="75" cy="60" r="8" />
      <circle cx="25" cy="60" r="8" />
      <path d="M63 36 L48 36 L48 48 L63 48 Z" />
      <path d="M45 36 L34 36 L24 48 L45 48 Z" />
    </svg>
  ),
  underhood: (
    <svg viewBox="0 0 100 100" width="68" height="68" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, color: 'var(--color-muted)' }}>
      <path d="M15 70 L85 70 L80 55 L20 55 Z" />
      <path d="M20 55 L10 25 L90 25 L80 55" />
      <rect x="35" y="58" width="30" height="10" rx="1" />
      <circle cx="50" cy="63" r="3" />
      <line x1="18" y1="52" x2="12" y2="28" />
    </svg>
  ),
  interior: (
    <svg viewBox="0 0 100 100" width="68" height="68" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, color: 'var(--color-muted)' }}>
      <path d="M15 25 L85 25 L75 55 L25 55 Z" style={{ opacity: 0.2 }} />
      <circle cx="35" cy="50" r="14" />
      <circle cx="35" cy="50" r="3" />
      <line x1="35" y1="50" x2="35" y2="64" />
      <line x1="35" y1="50" x2="21" y2="50" />
      <line x1="35" y1="50" x2="49" y2="50" />
      <path d="M10 65 L90 65 L85 80 L15 80 Z" />
      <rect x="52" y="60" width="16" height="10" rx="1" />
    </svg>
  ),
  odometer: (
    <svg viewBox="0 0 100 100" width="68" height="68" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, color: 'var(--color-muted)' }}>
      <rect x="15" y="30" width="70" height="40" rx="4" />
      <path d="M22 55 A12 12 0 1 1 42 55" />
      <line x1="32" y1="55" x2="26" y2="46" />
      <path d="M58 55 A12 12 0 1 1 78 55" />
      <line x1="68" y1="55" x2="74" y2="46" />
      <rect x="46" y="50" width="8" height="12" rx="1" />
    </svg>
  ),
  keys: (
    <svg viewBox="0 0 100 100" width="68" height="68" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, color: 'var(--color-muted)' }}>
      <rect x="35" y="25" width="30" height="50" rx="10" />
      <circle cx="50" cy="33" r="3" />
      <rect x="42" y="42" width="16" height="8" rx="2" />
      <rect x="42" y="54" width="16" height="8" rx="2" />
      <circle cx="50" cy="67" r="2.5" />
    </svg>
  ),
  vin: (
    <svg viewBox="0 0 100 100" width="68" height="68" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, color: 'var(--color-muted)' }}>
      <rect x="15" y="30" width="70" height="40" rx="2" />
      <circle cx="20" cy="35" r="1.5" fill="currentColor" />
      <circle cx="80" cy="35" r="1.5" fill="currentColor" />
      <circle cx="20" cy="65" r="1.5" fill="currentColor" />
      <circle cx="80" cy="65" r="1.5" fill="currentColor" />
      <line x1="30" y1="42" x2="30" y2="58" strokeWidth="2.5" />
      <line x1="36" y1="42" x2="36" y2="58" strokeWidth="1" />
      <line x1="40" y1="42" x2="40" y2="58" strokeWidth="1.5" />
      <line x1="46" y1="42" x2="46" y2="58" strokeWidth="3" />
      <line x1="54" y1="42" x2="54" y2="58" strokeWidth="1.5" />
      <line x1="60" y1="42" x2="60" y2="58" strokeWidth="1" />
      <line x1="66" y1="42" x2="66" y2="58" strokeWidth="2" />
      <line x1="70" y1="42" x2="70" y2="58" strokeWidth="1" />
    </svg>
  )
};

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
              gap: '8px', 
              width: '100%', 
              height: '100%',
              padding: '12px 8px 8px 8px',
              boxSizing: 'border-box'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px' }}>
              {VEHICLE_OUTLINES[view.id] || <Camera size={32} strokeWidth={1.5} style={{ color: 'var(--color-muted)' }} />}
            </div>
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
