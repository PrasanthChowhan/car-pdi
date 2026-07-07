import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspectionStore } from '../../store/useInspectionStore';
import { generatePDIReport } from '../../lib/pdfGenerator';
import { CATEGORIES, OVERVIEW_VIEWS } from '../../lib/checklistData';
import { loadImageBlob } from '../../lib/storage';
import LoadingSpinner from '../common/LoadingSpinner';
import SummaryPhoto from '../summary/SummaryPhoto';
import SignaturePad from '../summary/SignaturePad';

function SummaryOverviewPhoto({ photoId }: { photoId: string }) {
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

  if (!url) return <span style={{ fontSize: '9px', color: 'var(--color-muted)' }}>Loading...</span>;

  return <img src={url} alt="Overview photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
}
import { 
  ArrowLeft, 
  Download, 
  RotateCcw, 
  AlertTriangle, 
  ShieldAlert, 
  FileDown, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';

export default function SummaryPage() {
  const navigate = useNavigate();
  const { 
    vehicle, 
    items, 
    overviewPhotos, 
    metadata, 
    isHydrated, 
    resetInspection, 
    updateMetadata, 
    hydrateStore 
  } = useInspectionStore();
  const [generating, setGenerating] = useState(false);
  const [debugLog, setDebugLog] = useState<string | null>(null);

  useEffect(() => {
    hydrateStore();
  }, [hydrateStore]);

  if (!isHydrated) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (!vehicle) {
    return (
      <div style={{ maxWidth: '600px', margin: '100px auto', padding: '0 var(--spacing-base)', textAlign: 'center' }}>
        <AlertCircle size={48} style={{ color: 'var(--color-muted)', marginBottom: 'var(--spacing-md)' }} />
        <h2 className="display-md" style={{ marginBottom: 'var(--spacing-sm)' }}>No active inspection</h2>
        <button className="button-primary" onClick={() => navigate('/setup')}>
          Go to Setup
        </button>
      </div>
    );
  }

  const allItems = Object.values(items);
  const passed = allItems.filter(i => i.status === 'pass').length;
  const flagged = allItems.filter(i => i.status === 'flagged').length;
  const pending = allItems.filter(i => i.status === 'pending').length;
  const total = allItems.length;

  const handleGeneratePDF = async () => {
    setGenerating(true);
    setDebugLog(null);
    try {
      const pdfBlob = await generatePDIReport(vehicle, items, overviewPhotos || {}, metadata || {});
      
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PDI_Report_${vehicle.make}_${vehicle.model}_${vehicle.vin || 'no-vin'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('PDF generation failed:', error);
      setDebugLog(error?.stack || error?.message || 'Unknown error occurred during PDF assembly');
    } finally {
      setGenerating(false);
    }
  };

  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify({ vehicle, items }, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PDI_Data_${vehicle.make}_${vehicle.model}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export raw JSON data:', error);
      alert('Failed to export raw JSON data.');
    }
  };

  const handleReset = async () => {
    const confirm = window.confirm(
      'Are you sure you want to delete all inspection progress and stored photos? This cannot be undone.'
    );
    if (confirm) {
      await resetInspection();
      navigate('/setup');
    }
  };

  // Group flagged items by category
  const flaggedItems = allItems.filter(i => i.status === 'flagged');
  const flaggedByCategory = CATEGORIES.reduce((acc, cat) => {
    const catFlags = flaggedItems.filter(item => item.categoryId === cat.id);
    if (catFlags.length > 0) {
      acc.push({ category: cat, items: catFlags });
    }
    return acc;
  }, [] as Array<{ category: typeof CATEGORIES[0], items: typeof flaggedItems }>);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto 120px auto', padding: '0 var(--spacing-base)' }}>
      
      {/* Header Panel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
        <button 
          className="button-secondary" 
          onClick={() => navigate('/inspection')}
          style={{ width: '44px', height: '44px', minHeight: '44px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Back to checklist"
        >
          <ArrowLeft size={20} />
        </button>
        <div style={{ textAlign: 'left' }}>
          <span className="caption-uppercase" style={{ color: 'var(--color-primary)' }}>PDI Report Summary</span>
          <h1 className="display-sm" style={{ color: 'var(--color-ink)', marginTop: '2px', fontWeight: 600 }}>
            Inspection Summary
          </h1>
        </div>
      </div>

      {/* Vehicle Identity Card */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-base)', textAlign: 'left', marginBottom: 'var(--spacing-lg)' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <span className="caption-uppercase" style={{ color: 'var(--color-muted)', fontSize: '10px' }}>Vehicle Details</span>
          <h4 className="title-md" style={{ color: 'var(--color-ink)', marginTop: '4px', marginBottom: '2px', fontWeight: 600 }}>
            {vehicle.make} {vehicle.model}
          </h4>
          <p className="body-sm" style={{ color: 'var(--color-muted)', margin: 0 }}>
            VIN: <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.5px' }}>{vehicle.vin || 'N/A'}</span> • {vehicle.isEV ? '⚡ Electric' : '⛽ Gas/Hybrid'}
          </p>
        </div>
        
        {/* Simple counts overview */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', minWidth: '60px' }}>
            <span className="caption-uppercase" style={{ color: 'var(--color-muted)', fontSize: '9px' }}>Checked</span>
            <h3 className="title-md" style={{ color: 'var(--color-ink)', margin: '4px 0 0 0' }}>{passed + flagged} / {total}</h3>
          </div>
          <div style={{ textAlign: 'center', minWidth: '60px' }}>
            <span className="caption-uppercase" style={{ color: 'var(--color-muted)', fontSize: '9px' }}>Passed</span>
            <h3 className="title-md" style={{ color: 'var(--color-semantic-success)', margin: '4px 0 0 0' }}>{passed}</h3>
          </div>
          <div style={{ textAlign: 'center', minWidth: '60px' }}>
            <span className="caption-uppercase" style={{ color: 'var(--color-muted)', fontSize: '9px' }}>Flagged</span>
            <h3 className="title-md" style={{ color: 'var(--color-semantic-error)', margin: '4px 0 0 0' }}>{flagged}</h3>
          </div>
        </div>
      </div>

      {/* At a Glance Photos Grid */}
      <div className="card" style={{ textAlign: 'left', marginBottom: 'var(--spacing-lg)' }}>
        <h4 className="title-sm" style={{ color: 'var(--color-ink)', marginBottom: 'var(--spacing-sm)', fontWeight: 600 }}>
          At a Glance Photo Overview
        </h4>
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
            gap: '12px' 
          }}
        >
          {OVERVIEW_VIEWS.map((view) => {
            const photoId = overviewPhotos?.[view.id];
            return (
              <div 
                key={view.id} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '6px',
                  backgroundColor: 'var(--color-canvas-soft)',
                  padding: '8px',
                  borderRadius: 'var(--rounded-md)',
                  border: '1px solid var(--color-hairline)'
                }}
              >
                <span 
                  style={{ 
                    fontSize: '10px', 
                    color: 'var(--color-muted)', 
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis' 
                  }}
                  title={view.label}
                >
                  {view.label}
                </span>
                <div 
                  style={{ 
                    width: '100%', 
                    aspectRatio: '4 / 3', 
                    borderRadius: 'var(--rounded-xs)', 
                    backgroundColor: 'rgba(38, 37, 30, 0.03)', 
                    overflow: 'hidden', 
                    border: '1px solid var(--color-hairline-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {photoId ? (
                    <SummaryOverviewPhoto photoId={photoId} />
                  ) : (
                    <span style={{ fontSize: '10px', color: 'var(--color-muted)' }}>Missing</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Verdict Panel */}
      {flagged > 0 ? (
        <div 
          className="card" 
          style={{ 
            display: 'flex', 
            gap: 'var(--spacing-base)', 
            borderColor: 'var(--color-semantic-error)',
            backgroundColor: 'rgba(207, 45, 86, 0.03)',
            textAlign: 'left',
            marginBottom: 'var(--spacing-xl)',
            padding: '24px'
          }}
        >
          <ShieldAlert size={28} style={{ color: 'var(--color-semantic-error)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 className="title-md" style={{ color: 'var(--color-semantic-error)', marginBottom: '6px', fontWeight: 600 }}>
              {flagged} Issue{flagged > 1 ? 's' : ''} Flagged during inspection
            </h4>
            <p className="body-sm" style={{ color: 'var(--color-body)', lineHeight: 1.5, margin: 0 }}>
              We recommend presenting these findings to the dealership before signing final delivery paperwork or making final payments. Insist on a written agreement to resolve these issues.
            </p>
          </div>
        </div>
      ) : pending > 0 ? (
        <div 
          className="card" 
          style={{ 
            display: 'flex', 
            gap: 'var(--spacing-base)', 
            borderColor: 'var(--color-timeline-thinking)',
            backgroundColor: 'rgba(223, 168, 143, 0.05)',
            textAlign: 'left',
            marginBottom: 'var(--spacing-xl)',
            padding: '24px'
          }}
        >
          <AlertTriangle size={28} style={{ color: 'var(--color-timeline-thinking)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 className="title-md" style={{ color: 'var(--color-ink)', marginBottom: '6px', fontWeight: 600 }}>
              Inspection Incomplete
            </h4>
            <p className="body-sm" style={{ color: 'var(--color-body)', lineHeight: 1.5, margin: 0 }}>
              You still have {pending} unchecked checklist items. We recommend completing the full check to ensure no issues are missed before taking delivery.
            </p>
          </div>
        </div>
      ) : (
        <div 
          className="card" 
          style={{ 
            display: 'flex', 
            gap: 'var(--spacing-base)', 
            borderColor: 'var(--color-semantic-success)',
            backgroundColor: 'rgba(31, 138, 101, 0.03)',
            textAlign: 'left',
            marginBottom: 'var(--spacing-xl)',
            padding: '24px'
          }}
        >
          <ShieldCheck size={28} style={{ color: 'var(--color-semantic-success)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 className="title-md" style={{ color: 'var(--color-semantic-success)', marginBottom: '6px', fontWeight: 600 }}>
              Verification Successful
            </h4>
            <p className="body-sm" style={{ color: 'var(--color-body)', lineHeight: 1.5, margin: 0 }}>
              All checklist items have passed inspection successfully! The vehicle matches booking requirements and is ready for delivery.
            </p>
          </div>
        </div>
      )}

      {/* Delivery / Rejection Guide */}
      <div className="card" style={{ marginBottom: 'var(--spacing-xl)', border: '1px solid var(--color-hairline-strong)', padding: '20px', textAlign: 'left', backgroundColor: 'var(--color-canvas-soft)' }}>
        <h4 className="title-sm" style={{ color: 'var(--color-ink)', margin: '0 0 var(--spacing-sm) 0', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <span>🛡️</span> Delivery & Rejection Guidelines
        </h4>
        <div style={{ fontSize: '13.5px', color: 'var(--color-body)', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: 1.5 }}>
          <div>
            <strong>When to reject delivery entirely:</strong>
            <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
              <li>Obvious transit damage cover-ups (structural repairs, heavy repaints, variant misalignment).</li>
              <li>Engine warning lights active, knocks, or abnormal steering pull/vibration during drive.</li>
              <li>Odometer reading exceeds 100 km combined with seat/pedal wear (display/test car suspect).</li>
            </ul>
          </div>
          <div style={{ borderTop: '1px solid var(--color-hairline)', paddingTop: '10px' }}>
            <strong>How to accept minor defects:</strong>
            <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
              <li>Write down the exact defect with photos. Get a signed commitment from the dealer on their letterhead containing a clear timeline for repair.</li>
              <li>Never accept verbal promises. If it's not documented, it does not exist.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Handover Sign-off & Details */}
      <div className="card" style={{ textAlign: 'left', marginBottom: 'var(--spacing-lg)' }}>
        <h4 className="title-sm" style={{ color: 'var(--color-ink)', marginBottom: 'var(--spacing-md)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📝</span> Handover Sign-off & Details
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-base)' }}>
          {/* Metadata Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-sm)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="dealerName" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted)' }} className="caption-uppercase">
                Dealership Name
              </label>
              <input
                id="dealerName"
                type="text"
                value={metadata?.dealerName || ''}
                onChange={(e) => updateMetadata('dealerName', e.target.value)}
                placeholder="Enter dealership name"
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="salesRep" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted)' }} className="caption-uppercase">
                Sales Representative
              </label>
              <input
                id="salesRep"
                type="text"
                value={metadata?.salesRep || ''}
                onChange={(e) => updateMetadata('salesRep', e.target.value)}
                placeholder="Enter sales representative name"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="odometer" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted)' }} className="caption-uppercase">
                Delivery Odometer (km)
              </label>
              <input
                id="odometer"
                type="text"
                value={metadata?.odometer || ''}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '');
                  updateMetadata('odometer', cleaned);
                }}
                placeholder="Enter current odometer reading"
              />
              {parseInt(metadata?.odometer || '0', 10) > 100 && (
                <div style={{ display: 'flex', gap: '6px', color: 'var(--color-semantic-error)', fontSize: '12px', alignItems: 'center', marginTop: '4px', fontWeight: 500 }}>
                  <AlertTriangle size={14} />
                  <span>Odometer &gt; 100 km is a major Pre-Delivery red flag!</span>
                </div>
              )}
            </div>
          </div>

          {/* Remediation Details */}
          {flagged > 0 && (
            <div style={{ borderTop: '1px solid var(--color-hairline)', paddingTop: 'var(--spacing-base)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={metadata?.hasRemediation === 'true'}
                  onChange={(e) => {
                    updateMetadata('hasRemediation', e.target.checked ? 'true' : 'false');
                    if (!e.target.checked) {
                      updateMetadata('remediationCommitment', '');
                    }
                  }}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--color-ink)' }}>
                  Log Official Dealership Remediation Commitment
                </span>
              </label>

              {metadata?.hasRemediation === 'true' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', animation: 'slideDown 0.2s ease' }}>
                  <textarea
                    rows={3}
                    value={metadata?.remediationCommitment || ''}
                    onChange={(e) => updateMetadata('remediationCommitment', e.target.value)}
                    placeholder="Describe specific dealer commitments, required parts replacement, timelines, and signatory representatives..."
                    style={{ fontSize: '14px', width: '100%' }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Signature Pads */}
          <div style={{ borderTop: '1px solid var(--color-hairline)', paddingTop: 'var(--spacing-base)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--spacing-md)' }}>
              <SignaturePad
                label="Buyer / Inspector Signature"
                value={metadata?.sigCustomer}
                onChange={(val) => updateMetadata('sigCustomer', val)}
                onClear={() => updateMetadata('sigCustomer', '')}
              />
              <SignaturePad
                label="Dealership Representative Signature"
                value={metadata?.sigRepresentative}
                onChange={(val) => updateMetadata('sigRepresentative', val)}
                onClear={() => updateMetadata('sigRepresentative', '')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Dashboard Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 'var(--spacing-xxl)' }}>
        <button 
          className="button-primary" 
          onClick={handleGeneratePDF}
          disabled={generating}
          style={{ height: '52px', minHeight: '52px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '15px' }}
        >
          <FileDown size={20} />
          <span>{generating ? 'Assembling PDF...' : 'Download Official PDF Report'}</span>
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="button-secondary" 
            onClick={handleExportJSON}
            style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', height: '48px' }}
          >
            <Download size={16} />
            <span>Export JSON Data</span>
          </button>

          <button 
            className="button-secondary" 
            onClick={handleReset}
            style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'var(--color-semantic-error)', borderColor: 'var(--color-semantic-error)', height: '48px' }}
          >
            <RotateCcw size={16} />
            <span>Reset Inspection</span>
          </button>
        </div>
      </div>

      {/* PDF Generation Debug Panel */}
      {debugLog && (
        <div className="card" style={{ border: '1px solid var(--color-semantic-error)', textAlign: 'left', marginBottom: 'var(--spacing-xl)', padding: '16px' }}>
          <h4 className="title-sm" style={{ color: 'var(--color-semantic-error)', marginBottom: '8px' }}>PDF Generator Debug Console</h4>
          <pre style={{ overflowX: 'auto', padding: '12px', backgroundColor: 'var(--color-canvas-soft)', borderRadius: 'var(--rounded-xs)', color: 'var(--color-ink)', margin: 0 }}>
            <code>{debugLog}</code>
          </pre>
        </div>
      )}

      {/* Flagged Items Detail List */}
      {flagged > 0 && (
        <div style={{ textAlign: 'left', marginTop: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-hairline)', paddingBottom: '8px' }}>
            <ShieldAlert size={20} style={{ color: 'var(--color-semantic-error)' }} />
            <h3 className="title-md" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>
              Flagged Issues & Defects Log
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {flaggedByCategory.map(({ category, items: catItems }) => (
              <div key={category.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span className="caption-uppercase" style={{ color: 'var(--color-muted)', fontSize: '11px', fontWeight: 700 }}>
                  {category.label}
                </span>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {catItems.map(item => (
                    <div key={item.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--color-hairline-soft)' }}>
                      <h5 className="title-sm" style={{ color: 'var(--color-ink)', marginBottom: '6px', fontWeight: 500 }}>
                        {item.label}
                      </h5>
                      
                      {item.note && (
                        <p className="body-sm" style={{ fontStyle: 'italic', color: 'var(--color-body)', backgroundColor: 'var(--color-canvas-soft)', padding: '10px 14px', borderRadius: 'var(--rounded-sm)', borderLeft: '3px solid var(--color-muted)', margin: '8px 0 0 0' }}>
                          "{item.note}"
                        </p>
                      )}
                      
                      {item.photoId && <SummaryPhoto photoId={item.photoId} />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
