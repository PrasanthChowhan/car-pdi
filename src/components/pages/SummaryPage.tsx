import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspectionStore } from '../../store/useInspectionStore';
import { generatePDIReport } from '../../lib/pdfGenerator';
import { loadImageBlob } from '../../lib/storage';
import { CATEGORIES } from '../../lib/checklistData';
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

interface SummaryPhotoProps {
  photoId: string;
}

function SummaryPhoto({ photoId }: SummaryPhotoProps) {
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

export default function SummaryPage() {
  const navigate = useNavigate();
  const { vehicle, items, isHydrated, resetInspection, hydrateStore } = useInspectionStore();
  const [generating, setGenerating] = useState(false);
  const [debugLog, setDebugLog] = useState<string | null>(null);

  useEffect(() => {
    hydrateStore();
  }, [hydrateStore]);

  if (!isHydrated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p className="body-md" style={{ color: 'var(--color-muted)' }}>Loading...</p>
      </div>
    );
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
      const pdfBlob = await generatePDIReport(vehicle, items);
      
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
          <span className="caption-uppercase" style={{ color: 'var(--color-primary)' }}>Inspection Certificate</span>
          <h1 className="display-sm" style={{ color: 'var(--color-ink)', marginTop: '2px', fontWeight: 600 }}>
            Evaluation Summary
          </h1>
        </div>
      </div>

      {/* Vehicle Identity Card */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-base)', textAlign: 'left', marginBottom: 'var(--spacing-lg)' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <span className="caption-uppercase" style={{ color: 'var(--color-muted)', fontSize: '10px' }}>Subject Vehicle</span>
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
              {flagged} Defect{flagged > 1 ? 's' : ''} Flagged during evaluation
            </h4>
            <p className="body-sm" style={{ color: 'var(--color-body)', lineHeight: 1.5, margin: 0 }}>
              We recommend presenting these findings to the dealership management before signing the final acceptance certificate or making remaining payments. Insist on a written remediation schedule on their official letterhead.
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
              All checklist items have passed forensic inspection! The vehicle matches booking requirements and is fit for official delivery.
            </p>
          </div>
        </div>
      )}

      {/* Forensic Delivery / Refusal Guide */}
      <div className="card" style={{ marginBottom: 'var(--spacing-xl)', border: '1px solid var(--color-hairline-strong)', padding: '20px', textAlign: 'left', backgroundColor: 'var(--color-canvas-soft)' }}>
        <h4 className="title-sm" style={{ color: 'var(--color-ink)', margin: '0 0 var(--spacing-sm) 0', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <span>🛡️</span> Official Refusal & Escalation Standard
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
              Structural & Document Defect Logs
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
