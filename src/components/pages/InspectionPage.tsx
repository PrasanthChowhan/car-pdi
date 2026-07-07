import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspectionStore } from '../../store/useInspectionStore';
import { CATEGORIES, CHECKLIST_TEMPLATES } from '../../lib/checklistData';
import type { ChecklistItem } from '../../lib/storage';
import { loadImageBlob, saveImageBlob, deleteImageBlob } from '../../lib/storage';
import { compressAndResizeImage, generateUUID } from '../../lib/imageUtils';
import { 
  AlertTriangle, 
  Check, 
  Camera, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  CheckSquare, 
  RefreshCw, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface ChecklistItemRowProps {
  item: ChecklistItem;
  updateStatus: (id: string, status: ChecklistItem['status']) => void;
  updateNote: (id: string, note: string) => void;
  updatePhoto: (id: string, photoId: string | undefined) => void;
}

function ChecklistItemRow({ item, updateStatus, updateNote, updatePhoto }: ChecklistItemRowProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

      {isFlagged && (
        <div className="note-container" style={{ paddingLeft: '40px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginTop: '12px' }}>
          <label htmlFor={`note-${item.id}`} className="caption-uppercase" style={{ color: 'var(--color-muted)', fontSize: '10px' }}>
            Flagged Defect Note
          </label>
          <textarea
            id={`note-${item.id}`}
            rows={2}
            value={item.note || ''}
            onChange={(e) => updateNote(item.id, e.target.value)}
            placeholder="Please detail the paint scratch, dent, loose wire, or document error..."
            style={{ width: '100%', resize: 'vertical' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <span className="caption-uppercase" style={{ color: 'var(--color-muted)', fontSize: '10px' }}>
              Evidence Photo
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
              <div>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={fileInputRef}
                  onChange={handleCapture}
                  style={{ display: 'none' }}
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="upload-btn"
                  style={{ marginTop: '4px' }}
                >
                  <Camera size={18} />
                  <div>
                    <span className="body-sm" style={{ fontWeight: 500, display: 'block' }}>Add Photo Evidence</span>
                    <span className="caption-uppercase" style={{ fontSize: '9px', color: 'var(--color-muted)', marginTop: '2px', display: 'block' }}>Mobile Camera</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function InspectionPage() {
  const navigate = useNavigate();
  const { 
    vehicle, 
    items, 
    isHydrated, 
    updateItemStatus, 
    updateItemNote, 
    updateItemPhoto, 
    passAllCategoryItems,
    resetCategoryItems,
    hydrateStore 
  } = useInspectionStore();
  const [selectedCategory, setSelectedCategory] = useState('documentation');
  const tabsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hydrateStore();
  }, [hydrateStore]);

  // Scroll active tab into view horizontally
  useEffect(() => {
    const activeTab = tabsListRef.current?.querySelector('.active-tab');
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedCategory]);

  if (!isHydrated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 'var(--spacing-md)' }}>
        <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        <p className="body-md" style={{ color: 'var(--color-muted)' }}>Loading application state...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div style={{ maxWidth: '600px', margin: '100px auto', padding: '0 var(--spacing-base)', textAlign: 'center' }}>
        <HelpCircle size={48} style={{ color: 'var(--color-muted)', marginBottom: 'var(--spacing-md)' }} />
        <h2 className="display-md" style={{ marginBottom: 'var(--spacing-sm)' }}>No active inspection</h2>
        <p className="body-md" style={{ color: 'var(--color-muted)', marginBottom: 'var(--spacing-lg)' }}>Please configure vehicle information to start a checklist.</p>
        <button className="button-primary" onClick={() => navigate('/setup')}>
          Go to Setup
        </button>
      </div>
    );
  }

  // Filter categories
  const filteredCategories = CATEGORIES.filter((cat) => {
    if (cat.id === 'ev') return vehicle.isEV;
    if (cat.id === 'engine') return !vehicle.isEV;
    return true;
  });
  const categoryItems = Object.values(items).filter((item) => item.categoryId === selectedCategory);

  // Statistics
  const totalItems = Object.values(items).length;
  const completedItems = Object.values(items).filter((item) => item.status !== 'pending').length;
  const passedItems = Object.values(items).filter((item) => item.status === 'pass').length;
  const flaggedItems = Object.values(items).filter((item) => item.status === 'flagged').length;
  const pendingItems = Object.values(items).filter((item) => item.status === 'pending').length;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const currentCategoryIndex = filteredCategories.findIndex(c => c.id === selectedCategory);
  
  const handlePrevCategory = () => {
    if (currentCategoryIndex > 0) {
      setSelectedCategory(filteredCategories[currentCategoryIndex - 1].id);
    }
  };

  const handleNextCategory = () => {
    if (currentCategoryIndex < filteredCategories.length - 1) {
      setSelectedCategory(filteredCategories[currentCategoryIndex + 1].id);
    }
  };

  const handlePassAllCategory = () => {
    passAllCategoryItems(selectedCategory);
  };

  const handleResetCategory = async () => {
    const confirm = window.confirm(
      `Are you sure you want to reset all items in the "${filteredCategories[currentCategoryIndex]?.label}" category back to pending? This will delete notes and photos for this category.`
    );
    if (confirm) {
      await resetCategoryItems(selectedCategory);
    }
  };

  const activeCategoryPending = categoryItems.filter((i) => i.status === 'pending').length;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 var(--spacing-base) 140px var(--spacing-base)' }}>
      
      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-base)', marginBottom: 'var(--spacing-lg)', borderBottom: '1px solid var(--color-hairline)', paddingBottom: 'var(--spacing-md)' }}>
        <div style={{ textAlign: 'left' }}>
          <span className="caption-uppercase" style={{ color: 'var(--color-primary)' }}>Vehicle Under Inspection</span>
          <h1 className="display-sm" style={{ color: 'var(--color-ink)', marginTop: '2px', marginBottom: '4px', fontWeight: 600 }}>
            {vehicle.make} {vehicle.model}
          </h1>
          <p className="body-sm" style={{ color: 'var(--color-muted)', margin: 0 }}>
            {vehicle.isEV ? '⚡ Electric Vehicle' : '⛽ Gasoline/Hybrid'}
            {vehicle.vin ? ` • VIN: ${vehicle.vin}` : ''}
          </p>
        </div>
        <button 
          className="button-primary" 
          onClick={() => navigate('/summary')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '44px', minHeight: '44px' }}
        >
          <span>Summary & Report</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Anchored Solid Metrics Dashboard */}
      <div className="metrics-dashboard-solid">
        <div className="metrics-row">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span className="caption-uppercase" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px' }}>Total Progress</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff', lineHeight: 1 }}>{progressPercent}%</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>({completedItems} / {totalItems} items)</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div className="metrics-badge metrics-badge-passed">
              <CheckCircle2 size={14} />
              <span>{passedItems} Passed</span>
            </div>
            <div className="metrics-badge metrics-badge-flagged">
              <AlertTriangle size={14} />
              <span>{flaggedItems} Flagged</span>
            </div>
            <div className="metrics-badge metrics-badge-pending">
              <HelpCircle size={14} />
              <span>{pendingItems} Pending</span>
            </div>
          </div>
        </div>

        {/* Progress Line */}
        <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 'var(--rounded-pill)', overflow: 'hidden', marginTop: '16px' }}>
          <div style={{ height: '100%', width: `${progressPercent}%`, backgroundColor: 'var(--color-primary)', transition: 'width 0.3s ease' }}></div>
        </div>
      </div>

      {/* Horizontal Tabs with Fades */}
      <div className="category-tabs-container">
        <div 
          ref={tabsListRef}
          className="no-scrollbar"
          style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            gap: '8px', 
            paddingBottom: '12px',
            borderBottom: '1px solid var(--color-hairline)',
            scrollBehavior: 'smooth'
          }}
        >
          {filteredCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const catItems = Object.values(items).filter((i) => i.categoryId === cat.id);
            const catPending = catItems.filter((i) => i.status === 'pending').length;
            const catFlagged = catItems.filter((i) => i.status === 'flagged').length;
            
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`button-secondary ${isActive ? 'active-tab' : ''}`}
                style={{
                  borderRadius: 'var(--rounded-pill)',
                  whiteSpace: 'nowrap',
                  height: '36px',
                  minHeight: '36px',
                  padding: '0 16px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: isActive ? 'var(--color-ink)' : 'var(--color-surface-card)',
                  color: isActive ? 'var(--color-canvas)' : 'var(--color-body)',
                  borderColor: isActive ? 'var(--color-ink)' : 'var(--color-hairline-strong)',
                  boxShadow: isActive ? 'none' : undefined,
                }}
              >
                <span>{cat.label}</span>
                {catFlagged > 0 && (
                  <span style={{ 
                    fontSize: '10px', 
                    backgroundColor: 'var(--color-semantic-error)', 
                    color: '#ffffff',
                    borderRadius: 'var(--rounded-pill)',
                    padding: '1px 5px',
                    fontWeight: 'bold'
                  }}>
                    {catFlagged}🚨
                  </span>
                )}
                {catPending > 0 ? (
                  <span 
                    style={{ 
                      fontSize: '10px', 
                      backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-hairline-soft)', 
                      color: isActive ? '#ffffff' : 'var(--color-muted)',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    {catPending}
                  </span>
                ) : (
                  <CheckCircle2 size={14} style={{ color: 'var(--color-semantic-success)' }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Actions Bar (NO redundant label, aligned cleanly) */}
      <div className="quick-action-bar">
        <div style={{ display: 'flex', gap: '8px' }}>
          {activeCategoryPending > 0 && (
            <button 
              onClick={handlePassAllCategory}
              className="button-secondary"
              style={{ 
                height: '36px', 
                minHeight: '36px', 
                padding: '0 12px', 
                fontSize: '12px', 
                color: 'var(--color-semantic-success)',
                borderColor: 'var(--color-semantic-success)',
                backgroundColor: 'rgba(31, 138, 101, 0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <CheckSquare size={14} />
              <span>Pass All Remaining</span>
            </button>
          )}
          
          <button 
            onClick={handleResetCategory}
            className="button-secondary"
            style={{ 
              height: '36px', 
              minHeight: '36px', 
              padding: '0 12px', 
              fontSize: '12px', 
              color: 'var(--color-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RefreshCw size={12} />
            <span>Reset Section</span>
          </button>
        </div>
      </div>

      {/* Checklist Items Container */}
      <div className="checklist-container">
        {categoryItems.map((item) => (
          <ChecklistItemRow
            key={item.id}
            item={item}
            updateStatus={updateItemStatus}
            updateNote={updateItemNote}
            updatePhoto={updateItemPhoto}
          />
        ))}
      </div>

      {/* Sticky Bottom Navigation */}
      <div className="bottom-sticky-nav">
        <button
          onClick={handlePrevCategory}
          disabled={currentCategoryIndex === 0}
          className="button-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '44px', minHeight: '44px', padding: '0 16px' }}
        >
          <ArrowLeft size={16} />
          <span style={{ fontSize: '13px' }}>Previous</span>
        </button>

        <span className="caption-uppercase" style={{ color: 'var(--color-ink)', fontWeight: 600, fontSize: '10px', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
          {filteredCategories[currentCategoryIndex]?.label}
        </span>

        {currentCategoryIndex === filteredCategories.length - 1 ? (
          <button
            onClick={() => navigate('/summary')}
            className="button-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '44px', minHeight: '44px', padding: '0 20px' }}
          >
            <span style={{ fontSize: '13px' }}>Finish Inspection</span>
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleNextCategory}
            className="button-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '44px', minHeight: '44px', padding: '0 16px' }}
          >
            <span style={{ fontSize: '13px' }}>Next Section</span>
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
