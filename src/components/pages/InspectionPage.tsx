import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspectionStore } from '../../store/useInspectionStore';
import { CATEGORIES } from '../../lib/checklistData';
import LoadingSpinner from '../common/LoadingSpinner';
import ChecklistItemRow from '../inspection/ChecklistItemRow';
import OverviewPhotosPanel from '../inspection/OverviewPhotosPanel';
import { 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft,
  CheckSquare, 
  RefreshCw, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import TyreDOTDecoder from '../common/TyreDOTDecoder';
import VINDecoder from '../common/VINDecoder';

export default function InspectionPage() {
  const navigate = useNavigate();
  const { 
    vehicle, 
    items, 
    overviewPhotos,
    isHydrated, 
    updateItemStatus, 
    updateItemNote, 
    updateItemPhoto, 
    passAllCategoryItems,
    resetCategoryItems,
    hydrateStore,
    setVehicle
  } = useInspectionStore();
  const [selectedCategory, setSelectedCategory] = useState('overview');
  const tabsListRef = useRef<HTMLDivElement>(null);

  const [showLeftScrollBtn, setShowLeftScrollBtn] = useState(false);
  const [showRightScrollBtn, setShowRightScrollBtn] = useState(false);

  const checkScroll = () => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
      setShowLeftScrollBtn(scrollLeft > 0);
      setShowRightScrollBtn(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsListRef.current) {
      const scrollAmount = 200;
      tabsListRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

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
    return <LoadingSpinner message="Loading application state..." />;
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

  // Filter categories and prepend "At a Glance"
  const filteredCategories = [
    { id: 'overview', label: 'At a Glance' },
    ...CATEGORIES.filter((cat) => {
      if (cat.id === 'ev') return vehicle.isEV;
      if (cat.id === 'engine') return !vehicle.isEV;
      return true;
    })
  ];
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
    <div className="page-container page-container-wide" style={{ paddingBottom: '160px' }}>
      
      {/* Header Panel */}
      <div className="inspection-header">
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
        {showLeftScrollBtn && (
          <button 
            type="button"
            className="tabs-scroll-btn left-btn"
            onClick={() => scrollTabs('left')}
            aria-label="Scroll Left"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        <div 
          ref={tabsListRef}
          className="no-scrollbar"
          onScroll={checkScroll}
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
            const isOverview = cat.id === 'overview';
            const capturedCount = isOverview ? Object.keys(overviewPhotos || {}).length : 0;
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
                {isOverview ? (
                  capturedCount === 9 ? (
                    <CheckCircle2 size={14} style={{ color: 'var(--color-semantic-success)' }} />
                  ) : (
                    <span 
                      style={{ 
                        fontSize: '10px', 
                        backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-hairline-soft)', 
                        color: isActive ? '#ffffff' : 'var(--color-muted)',
                        borderRadius: 'var(--rounded-pill)',
                        padding: '1px 6px',
                        fontWeight: 'bold'
                      }}
                    >
                      {capturedCount}/9
                    </span>
                  )
                ) : (
                  <>
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
                  </>
                )}
              </button>
            );
          })}
        </div>

        {showRightScrollBtn && (
          <button 
            type="button"
            className="tabs-scroll-btn right-btn"
            onClick={() => scrollTabs('right')}
            aria-label="Scroll Right"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Category Actions Bar (NO redundant label, aligned cleanly) */}
      {selectedCategory !== 'overview' && (
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
      )}

      {/* Checklist Items Container */}
      {selectedCategory === 'overview' ? (
        <OverviewPhotosPanel />
      ) : (
        <div className="checklist-container">
          {/* Documents Section VIN Tool Card */}
          {selectedCategory === 'documents' && (
            <VINDecoder 
              vehicle={vehicle}
              setVehicle={setVehicle}
              onApply={(vinNote, vinStatus, ageNote, ageStatus) => {
                updateItemStatus('doc-vin-paper', vinStatus);
                updateItemNote('doc-vin-paper', vinNote);
                
                updateItemStatus('doc-stock-age', ageStatus);
                updateItemNote('doc-stock-age', ageNote);
                
                alert('Applied decoded details to paper match & stock age checklist items!');
              }}
            />
          )}

          {/* Tyres Section DOT Tool Card */}
          {selectedCategory === 'tyres' && (
            <TyreDOTDecoder 
              initialNote={items['tyre-mfg-date']?.note || undefined}
              onApply={(noteText, status) => {
                updateItemNote('tyre-mfg-date', noteText);
                updateItemStatus('tyre-mfg-date', status);
                alert('Applied tyre details and statuses to the tyre age checklist item!');
              }}
            />
          )}

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
      )}

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

        <span className="caption-uppercase bottom-sticky-nav-label">
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
