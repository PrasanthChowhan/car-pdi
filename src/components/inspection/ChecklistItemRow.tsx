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
import { decodeIndianVIN, decodeTyreDOT } from '../../lib/decoderUtils';

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
  const [tyreDOTs, setTyreDOTs] = useState({ FL: '', FR: '', RL: '', RR: '', SP: '' });

  // Pre-populate tyre DOT codes if they are in the note
  useEffect(() => {
    if (item.id === 'tyre-mfg-date' && item.note) {
      const flMatch = item.note.match(/FL:\s*Week\s*(\d{2})\/(\d{4})/i) || item.note.match(/FL:\s*(\d{4})/i);
      const frMatch = item.note.match(/FR:\s*Week\s*(\d{2})\/(\d{4})/i) || item.note.match(/FR:\s*(\d{4})/i);
      const rlMatch = item.note.match(/RL:\s*Week\s*(\d{2})\/(\d{4})/i) || item.note.match(/RL:\s*(\d{4})/i);
      const rrMatch = item.note.match(/RR:\s*Week\s*(\d{2})\/(\d{4})/i) || item.note.match(/RR:\s*(\d{4})/i);
      const spMatch = item.note.match(/SP:\s*Week\s*(\d{2})\/(\d{4})/i) || item.note.match(/SP:\s*(\d{4})/i);

      setTyreDOTs({
        FL: flMatch ? (flMatch[1] + (flMatch[2] ? flMatch[2].substring(2) : '')) : '',
        FR: frMatch ? (frMatch[1] + (frMatch[2] ? frMatch[2].substring(2) : '')) : '',
        RL: rlMatch ? (rlMatch[1] + (rlMatch[2] ? rlMatch[2].substring(2) : '')) : '',
        RR: rrMatch ? (rrMatch[1] + (rrMatch[2] ? rrMatch[2].substring(2) : '')) : '',
        SP: spMatch ? (spMatch[1] + (spMatch[2] ? spMatch[2].substring(2) : '')) : '',
      });
    }
  }, [item.id, item.note]);

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
            <div 
              className="card"
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px', 
                backgroundColor: 'var(--color-canvas)', 
                padding: '12px', 
                borderRadius: 'var(--rounded-md)', 
                border: '1px solid var(--color-hairline-strong)', 
                marginTop: '4px',
                marginBottom: '8px',
                textAlign: 'left'
              }}
            >
              <span className="caption-uppercase" style={{ fontSize: '10px', color: 'var(--color-muted)', fontWeight: 600 }}>Tyre DOT Date Decoder (WWYY)</span>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(75px, 1fr))', gap: '8px' }}>
                {(['FL', 'FR', 'RL', 'RR', 'SP'] as const).map((key) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-ink)' }}>
                      {key} {key === 'SP' ? '(Spare)' : ''}
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="e.g. 2425"
                      value={tyreDOTs[key]}
                      onChange={(e) => setTyreDOTs({ ...tyreDOTs, [key]: e.target.value.replace(/[^0-9]/g, '') })}
                      style={{ 
                        minHeight: '36px', 
                        height: '36px', 
                        padding: '4px 6px', 
                        fontSize: '12.5px', 
                        textAlign: 'center',
                        borderColor: 'var(--color-hairline-strong)'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Decoded results listing */}
              {Object.values(tyreDOTs).some(v => v.length === 4) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--color-hairline)', paddingTop: '8px', marginTop: '4px' }}>
                  {Object.entries(tyreDOTs).map(([key, code]) => {
                    if (code.length !== 4) return null;
                    const decoded = decodeTyreDOT(code);
                    if (!decoded.isValid) return null;

                    let color = 'var(--color-semantic-success)';
                    if (decoded.status === 'caution') color = '#d08000';
                    if (decoded.status === 'flagged') color = 'var(--color-semantic-error)';

                    return (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', flexWrap: 'wrap', gap: '4px' }}>
                        <span><strong>{key}:</strong> Week {decoded.week}, {decoded.year}</span>
                        <span style={{ color, fontWeight: 600 }}>{decoded.ageMonths}m old ({decoded.status.toUpperCase()})</span>
                      </div>
                    );
                  })}
                  
                  <button
                    type="button"
                    className="button-primary"
                    onClick={() => {
                      const summaryList = Object.entries(tyreDOTs)
                        .map(([key, code]) => {
                          if (code.length !== 4) return null;
                          const decoded = decodeTyreDOT(code);
                          if (!decoded.isValid) return null;
                          return `${key}: Week ${decoded.week}/${decoded.year} (${decoded.ageMonths}m old)`;
                        })
                        .filter(Boolean);

                      if (summaryList.length === 0) return;

                      const noteText = `Tyres DOT Dates decoded - ${summaryList.join(', ')}.`;
                      updateNote(item.id, noteText);

                      // Collective status
                      const activeDecodes = Object.values(tyreDOTs)
                        .filter(v => v.length === 4)
                        .map(code => decodeTyreDOT(code))
                        .filter(d => d.isValid);

                      const hasFlagged = activeDecodes.some(d => d.status === 'flagged');
                      const hasCaution = activeDecodes.some(d => d.status === 'caution');

                      if (hasFlagged) {
                        updateStatus(item.id, 'flagged');
                      } else if (hasCaution) {
                        updateStatus(item.id, 'pending');
                      } else {
                        updateStatus(item.id, 'pass');
                      }
                    }}
                    style={{ height: '36px', minHeight: '36px', padding: '0 12px', fontSize: '12px', alignSelf: 'flex-start', marginTop: '6px' }}
                  >
                    Apply Decoded Data
                  </button>
                </div>
              )}
            </div>
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
