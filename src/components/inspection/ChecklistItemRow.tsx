import { useState, useEffect, useRef } from 'react';
import type { ChecklistItem } from '../../lib/storage';
import { loadImageBlob, saveImageBlob, deleteImageBlob } from '../../lib/storage';
import { compressAndResizeImage, generateUUID } from '../../lib/imageUtils';
import { CHECKLIST_TEMPLATES, CATEGORY_DEFECT_SUGGESTIONS, ITEM_DEFECT_SUGGESTIONS } from '../../lib/checklistData';
import { 
  Check, 
  Camera, 
  Trash2, 
  AlertTriangle, 
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { useInspectionStore } from '../../store/useInspectionStore';
import { decodeIndianVIN } from '../../lib/decoderUtils';
import TyreDOTDecoder from '../common/TyreDOTDecoder';

interface ChecklistItemRowProps {
  item: ChecklistItem;
  updateStatus: (id: string, status: ChecklistItem['status']) => void;
  updateNote: (id: string, note: string) => void;
  updatePhoto: (id: string, photoId: string | undefined) => void;
}

export default function ChecklistItemRow({ item, updateStatus, updateNote, updatePhoto }: ChecklistItemRowProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [showPassNote, setShowPassNote] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { vehicle } = useInspectionStore();

  // Load preview URL if photoId exists
  useEffect(() => {
    let active = true;
    let url: string | null = null;

    const loadPhoto = async () => {
      if (item.photoId) {
        setLoadingImage(true);
        const blob = await loadImageBlob(item.photoId);
        if (blob && active) {
          url = URL.createObjectURL(blob);
          setPhotoUrl(url);
        }
        setLoadingImage(false);
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
  }, [item.photoId]);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingImage(true);
    try {
      const compressedBlob = await compressAndResizeImage(file);
      const newPhotoId = generateUUID();
      await saveImageBlob(newPhotoId, compressedBlob);

      if (item.photoId) {
        await deleteImageBlob(item.photoId);
      }

      updatePhoto(item.id, newPhotoId);
    } catch (error) {
      console.error('Photo capture failed:', error);
      alert('Photo capture failed. Please try again.');
    } finally {
      setLoadingImage(false);
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeletePhoto = async () => {
    if (item.photoId) {
      setLoadingImage(true);
      await deleteImageBlob(item.photoId);
      updatePhoto(item.id, undefined);
      setLoadingImage(false);
    }
  };

  const isFlagged = item.status === 'flagged';
  const isPassed = item.status === 'pass';

  const template = CHECKLIST_TEMPLATES.find(t => t.id === item.id);
  const description = template?.description;

  // Resolve smart suggestions
  const itemSuggestions = ITEM_DEFECT_SUGGESTIONS[item.id] || [];
  const categorySuggestions = CATEGORY_DEFECT_SUGGESTIONS[item.categoryId] || [];
  const suggestions = itemSuggestions.length > 0 ? itemSuggestions : categorySuggestions;

  // Dynamic placeholder text depending on category
  let dynamicPlaceholder = 'Please detail the defect...';
  switch (item.categoryId) {
    case 'documents':
      dynamicPlaceholder = 'e.g. spelling error on invoice, MSRP mismatch, missing warranty booklet...';
      break;
    case 'identity':
      dynamicPlaceholder = 'e.g. odometer shows 120 km, wrong variant alloy wheels installed...';
      break;
    case 'exterior':
      dynamicPlaceholder = 'e.g. paint chip on bumper edge, uneven gaps on trunk, loose rubber seal...';
      break;
    case 'tyres':
      dynamicPlaceholder = 'e.g. curb rash on right-rear rim, tyres manufacture date is too old...';
      break;
    case 'glass_lights':
      dynamicPlaceholder = 'e.g. chip in windshield glass, condensation inside left headlight casing...';
      break;
    case 'engine':
      dynamicPlaceholder = 'e.g. coolant level low, abnormal engine knock on idle, wire cut under hood...';
      break;
    case 'ev':
      dynamicPlaceholder = 'e.g. charging port lid sticking, BMS diagnostic report missing...';
      break;
    case 'interior':
      dynamicPlaceholder = 'e.g. scratch on dashboard leather, seat slide lever feels sticky...';
      break;
    case 'electronics':
      dynamicPlaceholder = 'e.g. AC fan makes ticking noise, infotainment touchscreen freezes...';
      break;
    case 'road_test':
      dynamicPlaceholder = 'e.g. steering pulls left, brake pedal shudders, squeaks over speed bumps...';
      break;
    case 'accessories':
      dynamicPlaceholder = 'e.g. missing duplicate key fob, car carpets not installed...';
      break;
  }

  return (
    <div className="checklist-row">
      <div className="checklist-row-header">
        {/* Circular Checkbox (Pass Toggler) */}
        <button
          type="button"
          onClick={() => updateStatus(item.id, isPassed ? 'pending' : 'pass')}
          className={`circular-checkbox ${isPassed ? 'passed' : ''}`}
          aria-label={isPassed ? "Mark as pending" : "Mark as passed"}
        >
          <Check size={14} strokeWidth={3} />
        </button>

        {/* Item label & Description container */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '4px', textAlign: 'left' }}>
          <span 
            style={{ 
              color: isPassed ? 'var(--color-muted)' : 'var(--color-ink)', 
              fontSize: '15px',
              lineHeight: 1.5,
              fontWeight: 500,
              textDecoration: isPassed ? 'line-through' : 'none',
              opacity: isPassed ? 0.75 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            {item.label}
          </span>
          {description && !isPassed && (
            <span style={{ fontSize: '12.5px', color: 'var(--color-body)', opacity: 0.85, fontWeight: 400, lineHeight: 1.4 }}>
              {description}
            </span>
          )}
          {template?.extendedDescription && !isPassed && (
            <details style={{ marginTop: '4px' }}>
              <summary style={{ fontSize: '12px', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 500 }}>Read More & Examples</summary>
              <div style={{ marginTop: '6px', fontSize: '12.5px', color: 'var(--color-body)', backgroundColor: 'var(--color-surface)', padding: '10px', borderRadius: 'var(--rounded-md)', border: '1px solid var(--color-hairline)', lineHeight: 1.5 }}>
                {template.extendedDescription}
              </div>
            </details>
          )}
        </div>

        {/* Comment Icon (Passed notes toggler) */}
        {isPassed && (
          <button
            type="button"
            onClick={() => setShowPassNote(!showPassNote)}
            className={`row-flag-btn ${item.note ? 'flagged' : ''}`}
            style={{
              color: item.note ? 'var(--color-primary)' : 'var(--color-muted)',
              backgroundColor: item.note ? 'rgba(245, 78, 0, 0.05)' : 'transparent',
            }}
            aria-label={item.note ? "Edit comment" : "Add comment"}
            title="Add verification note"
          >
            <MessageSquare size={16} />
          </button>
        )}

        {/* Warning Icon (Flag Toggler) */}
        <button
          type="button"
          onClick={() => updateStatus(item.id, isFlagged ? 'pending' : 'flagged')}
          className={`row-flag-btn ${isFlagged ? 'flagged' : ''}`}
          aria-label={isFlagged ? "Remove flag" : "Flag item"}
          title="Flag as defect"
        >
          <AlertTriangle size={18} />
        </button>
      </div>

      {(isFlagged || (isPassed && (showPassNote || item.note))) && (
        <div className="note-container checklist-note-container">
          <label htmlFor={`note-${item.id}`} className="caption-uppercase" style={{ color: 'var(--color-muted)', fontSize: '10px' }}>
            {isPassed ? 'Verification Notes / Comments' : 'Flagged Defect Note'}
          </label>
          <textarea
            id={`note-${item.id}`}
            rows={2}
            value={item.note || ''}
            onChange={(e) => updateNote(item.id, e.target.value)}
            placeholder={isPassed ? 'Add verification details (e.g. tyre puncture kit present instead of spare tyre)...' : dynamicPlaceholder}
            style={{ width: '100%', resize: 'vertical' }}
          />

          {item.id === 'doc-stock-age' && vehicle?.vin && (
            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                const decoded = decodeIndianVIN(vehicle.vin);
                if (decoded.isValid && decoded.year) {
                  const noteText = `Decoded VIN: ${decoded.manufacturer} (${decoded.country}), MFG Date: ${decoded.month ? `${decoded.month} ` : ''}${decoded.year} (Age: ${decoded.ageMonths}m old). Status: ${decoded.status.toUpperCase()}.`;
                  updateNote(item.id, noteText);
                  if (decoded.status === 'fresh') {
                    updateStatus(item.id, 'pass');
                  } else if (decoded.status === 'flagged') {
                    updateStatus(item.id, 'flagged');
                  }
                }
              }}
              style={{ alignSelf: 'flex-start', height: '36px', minHeight: '36px', padding: '0 12px', fontSize: '12.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>🔍 Autofill from decoded VIN</span>
            </button>
          )}

          {item.id === 'tyre-mfg-date' && (
            <TyreDOTDecoder 
              initialNote={item.note || undefined}
              onApply={(noteText, status) => {
                updateNote(item.id, noteText);
                updateStatus(item.id, status);
              }}
            />
          )}

          {suggestions.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="caption-uppercase" style={{ color: 'var(--color-muted)', fontSize: '10px' }}>
                Quick Suggestions
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const currentVal = item.note || '';
                      let newVal = '';
                      if (!currentVal.trim()) {
                        newVal = suggestion;
                      } else {
                        if (!currentVal.includes(suggestion)) {
                          const cleaned = currentVal.trim().replace(/;+$/, '');
                          newVal = `${cleaned}; ${suggestion}`;
                        } else {
                          newVal = currentVal;
                        }
                      }
                      updateNote(item.id, newVal);
                    }}
                    style={{
                      fontSize: '11.5px',
                      padding: '4px 10px',
                      borderRadius: 'var(--rounded-pill)',
                      backgroundColor: 'var(--color-canvas)',
                      border: '1px solid var(--color-hairline-strong)',
                      color: 'var(--color-body)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      outline: 'none',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.color = 'var(--color-on-primary)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-canvas)';
                      e.currentTarget.style.borderColor = 'var(--color-hairline-strong)';
                      e.currentTarget.style.color = 'var(--color-body)';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'scale(0.95)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <span className="caption-uppercase" style={{ color: 'var(--color-muted)', fontSize: '10px' }}>
              {isPassed ? 'Verification Photo' : 'Evidence Photo'}
            </span>
            
            {loadingImage ? (
              <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-muted)' }}>
                <RefreshCw size={14} className="animate-spin" />
                <span className="body-sm">Syncing photo...</span>
              </div>
            ) : photoUrl ? (
              <div style={{ position: 'relative', width: 'fit-content', borderRadius: 'var(--rounded-md)', overflow: 'hidden', border: '1px solid var(--color-hairline-strong)', marginTop: '4px' }}>
                <img 
                  src={photoUrl} 
                  alt="Inspection Evidence" 
                  style={{ maxWidth: '100%', maxHeight: '200px', display: 'block', objectFit: 'contain' }} 
                />
                <button
                  type="button"
                  onClick={handleDeletePhoto}
                  className="button-secondary"
                  style={{ 
                    position: 'absolute', 
                    top: '8px', 
                    right: '8px', 
                    height: '36px', 
                    minHeight: '36px',
                    width: '36px', 
                    borderRadius: 'var(--rounded-md)',
                    padding: 0,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: 'var(--color-semantic-error)',
                    borderColor: 'var(--color-hairline)'
                  }}
                  title="Remove photo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <div className="button-group-responsive" style={{ marginTop: '4px', gap: '8px' }}>
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
                
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="button-secondary"
                  style={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px', 
                    height: '40px',
                    borderColor: 'var(--color-hairline-strong)',
                    boxShadow: 'none'
                  }}
                >
                  <Camera size={15} />
                  <span style={{ fontSize: '13px' }}>Take Photo</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="button-secondary"
                  style={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px', 
                    height: '40px',
                    borderColor: 'var(--color-hairline-strong)',
                    boxShadow: 'none'
                  }}
                >
                  <span style={{ fontSize: '13px' }}>Upload Photo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
