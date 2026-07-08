import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspectionStore } from '../../store/useInspectionStore';
import { CATEGORIES } from '../../lib/checklistData';
import LoadingSpinner from '../common/LoadingSpinner';
import ChecklistItemRow from '../inspection/ChecklistItemRow';
import OverviewPhotosPanel from '../inspection/OverviewPhotosPanel';
import DealBreakersPanel from '../inspection/DealBreakersPanel';
import { 
  AlertTriangle, 
  ShieldAlert,
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft,
  CheckSquare, 
  RefreshCw, 
  CheckCircle2,
  HelpCircle,
  Info,
  AlertCircle,
  Disc,
  Binary
} from 'lucide-react';
import { decodeIndianVIN, decodeTyreDOT } from '../../lib/decoderUtils';

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
  const [selectedCategory, setSelectedCategory] = useState('deal-breakers');
  const tabsListRef = useRef<HTMLDivElement>(null);

  const [tyreDOTs, setTyreDOTs] = useState({ FL: '', FR: '', RL: '', RR: '', SP: '' });
  
  const [showLeftScrollBtn, setShowLeftScrollBtn] = useState(false);
  const [showRightScrollBtn, setShowRightScrollBtn] = useState(false);

  const checkScroll = () => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
      setShowLeftScrollBtn(scrollLeft > 2);
      setShowRightScrollBtn(scrollLeft < scrollWidth - clientWidth - 2);
    }
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsListRef.current) {
      const scrollAmount = 150;
      tabsListRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const el = tabsListRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [isHydrated, items]);

  // Pre-populate tyre DOT codes if they are in the note
  const tyreMfgItem = items['tyre-mfg-date'];
  useEffect(() => {
    if (tyreMfgItem?.note && Object.values(tyreDOTs).every(v => v === '')) {
      const flMatch = tyreMfgItem.note.match(/FL:\s*Week\s*(\d{2})\/(\d{4})/i) || tyreMfgItem.note.match(/FL:\s*(\d{4})/i);
      const frMatch = tyreMfgItem.note.match(/FR:\s*Week\s*(\d{2})\/(\d{4})/i) || tyreMfgItem.note.match(/FR:\s*(\d{4})/i);
      const rlMatch = tyreMfgItem.note.match(/RL:\s*Week\s*(\d{2})\/(\d{4})/i) || tyreMfgItem.note.match(/RL:\s*(\d{4})/i);
      const rrMatch = tyreMfgItem.note.match(/RR:\s*Week\s*(\d{2})\/(\d{4})/i) || tyreMfgItem.note.match(/RR:\s*(\d{4})/i);
      const spMatch = tyreMfgItem.note.match(/SP:\s*Week\s*(\d{2})\/(\d{4})/i) || tyreMfgItem.note.match(/SP:\s*(\d{4})/i);

      setTyreDOTs({
        FL: flMatch ? (flMatch[1] + (flMatch[2] ? flMatch[2].substring(2) : '')) : '',
        FR: frMatch ? (frMatch[1] + (frMatch[2] ? frMatch[2].substring(2) : '')) : '',
        RL: rlMatch ? (rlMatch[1] + (rlMatch[2] ? rlMatch[2].substring(2) : '')) : '',
        RR: rrMatch ? (rrMatch[1] + (rrMatch[2] ? rrMatch[2].substring(2) : '')) : '',
        SP: spMatch ? (spMatch[1] + (spMatch[2] ? spMatch[2].substring(2) : '')) : '',
      });
    }
  }, [tyreMfgItem?.note, tyreDOTs]);

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

  // Filter categories and prepend "Deal-Breakers" and "At a Glance"
  const filteredCategories = [
    { id: 'deal-breakers', label: 'Deal-Breakers' },
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
            const isDealBreakers = cat.id === 'deal-breakers';
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
                {isDealBreakers ? (
                  <ShieldAlert size={14} style={{ color: isActive ? 'inherit' : 'var(--color-semantic-error)' }} />
                ) : isOverview ? (
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
      {selectedCategory !== 'overview' && selectedCategory !== 'deal-breakers' && (
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
      {selectedCategory === 'deal-breakers' ? (
        <DealBreakersPanel />
      ) : selectedCategory === 'overview' ? (
        <OverviewPhotosPanel />
      ) : (
        <div className="checklist-container">
          {/* Documents Section VIN Tool Card */}
          {selectedCategory === 'documents' && (
            <div className="card animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', marginBottom: 'var(--spacing-md)', textAlign: 'left', backgroundColor: 'var(--color-canvas-soft)', border: '1px solid var(--color-hairline-strong)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--color-hairline)', paddingBottom: '8px' }}>
                <Binary size={18} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-ink)' }} className="caption-uppercase">Forensic VIN / Chassis Decoder</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label htmlFor="pdi-vin" style={{ fontSize: '10px', color: 'var(--color-muted)', fontWeight: 600 }} className="caption-uppercase">VIN / Chassis Number</label>
                <input
                  type="text"
                  id="pdi-vin"
                  maxLength={19}
                  value={vehicle.vin || ''}
                  onChange={(e) => setVehicle({ ...vehicle, vin: e.target.value.toUpperCase() })}
                  placeholder="Enter 17 or 19-digit Chassis Number..."
                  style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '1px', minHeight: '36px', height: '36px', fontSize: '13px' }}
                />
              </div>

              {vehicle.vin && vehicle.vin.trim().length >= 3 && (() => {
                const decoded = decodeIndianVIN(vehicle.vin);
                if (!decoded.isValid) return null;

                let statusColor = 'var(--color-muted)';
                let bgColor = 'rgba(128, 125, 114, 0.03)';
                let borderColor = 'var(--color-hairline-strong)';
                let Icon = Info;

                if (decoded.status === 'fresh') {
                  statusColor = 'var(--color-semantic-success)';
                  bgColor = 'rgba(31, 138, 101, 0.03)';
                  borderColor = 'var(--color-semantic-success)';
                  Icon = CheckCircle2;
                } else if (decoded.status === 'caution') {
                  statusColor = '#d08000';
                  bgColor = 'rgba(208, 128, 0, 0.03)';
                  borderColor = '#d08000';
                  Icon = AlertTriangle;
                } else if (decoded.status === 'flagged') {
                  statusColor = 'var(--color-semantic-error)';
                  bgColor = 'rgba(207, 45, 86, 0.03)';
                  borderColor = 'var(--color-semantic-error)';
                  Icon = AlertCircle;
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px', borderRadius: 'var(--rounded-md)' }}>
                      <div><strong>Brand:</strong> {decoded.manufacturer} ({decoded.country})</div>
                      {decoded.year && <div><strong>MFG:</strong> {decoded.month ? `${decoded.month} ` : ''}{decoded.year}</div>}
                      {decoded.ageMonths !== null && <div><strong>Age:</strong> {decoded.ageMonths} months old</div>}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', padding: '8px', backgroundColor: bgColor, border: `1px solid ${borderColor}`, borderRadius: 'var(--rounded-md)' }}>
                      <Icon size={14} style={{ color: statusColor, flexShrink: 0, marginTop: '2px' }} />
                      <p style={{ fontSize: '11.5px', margin: 0, color: 'var(--color-body)', lineHeight: 1.3 }}>{decoded.message}</p>
                    </div>

                    <button
                      type="button"
                      className="button-primary"
                      onClick={() => {
                        updateItemStatus('doc-vin-paper', 'pass');
                        updateItemNote('doc-vin-paper', `Chassis number verified: ${decoded.vin}`);
                        
                        const ageStatus = decoded.status === 'fresh' ? 'pass' : (decoded.status === 'flagged' ? 'flagged' : 'pending');
                        updateItemStatus('doc-stock-age', ageStatus);
                        updateItemNote('doc-stock-age', `Decoded VIN: ${decoded.manufacturer} (${decoded.country}), MFG Date: ${decoded.month ? `${decoded.month} ` : ''}${decoded.year} (Age: ${decoded.ageMonths}m old). Message: ${decoded.message}`);
                        
                        alert('Applied decoded details to paper match & stock age checklist items!');
                      }}
                      style={{ height: '32px', minHeight: '32px', padding: '0 10px', fontSize: '11.5px', alignSelf: 'flex-start', marginTop: '2px' }}
                    >
                      Apply to VIN Checklists
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Tyres Section DOT Tool Card */}
          {selectedCategory === 'tyres' && (
            <div className="card animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', marginBottom: 'var(--spacing-md)', textAlign: 'left', backgroundColor: 'var(--color-canvas-soft)', border: '1px solid var(--color-hairline-strong)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--color-hairline)', paddingBottom: '8px' }}>
                <Disc size={18} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-ink)' }} className="caption-uppercase">Tyre DOT Date Decoder (WWYY)</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '8px' }}>
                {(['FL', 'FR', 'RL', 'RR', 'SP'] as const).map((key) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor={`pdi-tyre-${key}`} style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-ink)' }}>
                      {key} {key === 'SP' ? '(Spare)' : ''}
                    </label>
                    <input
                      type="text"
                      id={`pdi-tyre-${key}`}
                      maxLength={4}
                      placeholder="WWYY"
                      value={tyreDOTs[key]}
                      onChange={(e) => setTyreDOTs({ ...tyreDOTs, [key]: e.target.value.replace(/[^0-9]/g, '') })}
                      style={{ minHeight: '36px', height: '36px', padding: '4px 6px', fontSize: '12.5px', textAlign: 'center', borderColor: 'var(--color-hairline-strong)' }}
                    />
                  </div>
                ))}
              </div>

              {Object.values(tyreDOTs).some(v => v.length === 4) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--color-hairline)', paddingTop: '8px', marginTop: '4px' }}>
                  {Object.entries(tyreDOTs).map(([key, code]) => {
                    if (code.length !== 4) return null;
                    const decoded = decodeTyreDOT(code);
                    if (!decoded.isValid) return null;

                    let color = 'var(--color-semantic-success)';
                    let badgeColor = 'rgba(31, 138, 101, 0.1)';
                    if (decoded.status === 'caution') {
                      color = '#d08000';
                      badgeColor = 'rgba(208, 128, 0, 0.1)';
                    }
                    if (decoded.status === 'flagged') {
                      color = 'var(--color-semantic-error)';
                      badgeColor = 'rgba(207, 45, 86, 0.1)';
                    }

                    return (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                        <span><strong>{key}:</strong> Week {decoded.week}, {decoded.year}</span>
                        <span style={{ color, fontWeight: 700, backgroundColor: badgeColor, padding: '1px 6px', borderRadius: 'var(--rounded-pill)' }}>{decoded.ageMonths}m old ({decoded.status.toUpperCase()})</span>
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
                      updateItemNote('tyre-mfg-date', noteText);

                      const activeDecodes = Object.values(tyreDOTs)
                        .filter(v => v.length === 4)
                        .map(code => decodeTyreDOT(code))
                        .filter(d => d.isValid);

                      const hasFlagged = activeDecodes.some(d => d.status === 'flagged');
                      const hasCaution = activeDecodes.some(d => d.status === 'caution');

                      if (hasFlagged) {
                        updateItemStatus('tyre-mfg-date', 'flagged');
                      } else if (hasCaution) {
                        updateItemStatus('tyre-mfg-date', 'pending');
                      } else {
                        updateItemStatus('tyre-mfg-date', 'pass');
                      }

                      alert('Applied tyre details and statuses to the tyre age checklist item!');
                    }}
                    style={{ height: '32px', minHeight: '32px', padding: '0 10px', fontSize: '11.5px', alignSelf: 'flex-start', marginTop: '4px' }}
                  >
                    Apply to Tyre Checklist
                  </button>
                </div>
              )}
            </div>
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
