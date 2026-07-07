import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspectionStore } from '../../store/useInspectionStore';
import { CHECKLIST_TEMPLATES } from '../../lib/checklistData';
import type { ChecklistItem } from '../../lib/storage';
import { Shield, Sparkles, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

export default function SetupPage() {
  const navigate = useNavigate();
  const { vehicle, items, isHydrated, setVehicle, setItems, resetInspection, hydrateStore } = useInspectionStore();

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [vin, setVin] = useState('');
  const [isEV, setIsEV] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrep, setShowPrep] = useState(true); // Default open for better user visibility

  useEffect(() => {
    hydrateStore();
  }, [hydrateStore]);

  const handleStartFresh = async () => {
    const confirm = window.confirm('Are you sure you want to start a fresh inspection? All unsaved current progress will be lost.');
    if (confirm) {
      await resetInspection();
      setMake('');
      setModel('');
      setVin('');
      setIsEV(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim()) return;

    setIsSubmitting(true);

    // Filter templates based on type
    const initialItems: Record<string, ChecklistItem> = {};
    CHECKLIST_TEMPLATES.forEach((template) => {
      // Skip EV specific items if vehicle is not EV
      if (template.categoryId === 'ev' && !isEV) {
        return;
      }
      // Skip ICE specific items if vehicle is EV
      if (template.categoryId === 'engine' && isEV) {
        return;
      }
      initialItems[template.id] = {
        id: template.id,
        categoryId: template.categoryId,
        label: template.label,
        status: 'pending',
      };
    });

    setVehicle({
      make: make.trim(),
      model: model.trim(),
      vin: vin.trim().toUpperCase(),
      isEV,
    });
    setItems(initialItems);
    setIsSubmitting(false);
    navigate('/inspection');
  };

  if (!isHydrated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 'var(--spacing-md)' }}>
        <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        <p className="body-md" style={{ color: 'var(--color-muted)' }}>Loading application state...</p>
      </div>
    );
  }

  // Active session exists
  if (vehicle && Object.keys(items).length > 0) {
    const completedCount = Object.values(items).filter(i => i.status !== 'pending').length;
    const totalCount = Object.values(items).length;
    const percent = Math.round((completedCount / totalCount) * 100);

    return (
      <div style={{ maxWidth: '560px', margin: '100px auto', padding: '0 var(--spacing-base)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <span className="caption-uppercase" style={{ color: 'var(--color-primary)' }}>PDI Assistant</span>
          <h1 className="display-lg" style={{ color: 'var(--color-ink)', marginTop: 'var(--spacing-xxs)', marginBottom: 'var(--spacing-xs)' }}>
            Active Session Found
          </h1>
          <p className="body-md" style={{ color: 'var(--color-muted)' }}>
            You have an inspection in progress. Would you like to resume or start a new one?
          </p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-hairline)', paddingBottom: 'var(--spacing-base)' }}>
            <div style={{ textAlign: 'left' }}>
              <h3 className="title-md" style={{ color: 'var(--color-ink)', marginBottom: '4px' }}>
                {vehicle.make} {vehicle.model}
              </h3>
              <p className="body-sm" style={{ color: 'var(--color-muted)' }}>
                {vehicle.isEV ? '⚡ Electric Vehicle' : '⛽ Gasoline / Hybrid'}
                {vehicle.vin ? ` • VIN: ${vehicle.vin}` : ''}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="caption-uppercase" style={{ color: 'var(--color-ink)' }}>Progress</span>
              <div className="title-md" style={{ color: 'var(--color-primary)', marginTop: '4px' }}>{percent}%</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <div style={{ height: '6px', backgroundColor: 'var(--color-hairline-soft)', borderRadius: 'var(--rounded-pill)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${percent}%`, backgroundColor: 'var(--color-primary)' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="body-sm" style={{ color: 'var(--color-muted)' }}>{completedCount} of {totalCount} items completed</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-base)', marginTop: 'var(--spacing-xs)' }}>
            <button className="button-primary" style={{ flex: 1.5, gap: '8px' }} onClick={() => navigate('/inspection')}>
              <span>Resume Inspection</span>
              <ArrowRight size={16} />
            </button>
            <button className="button-secondary" style={{ flex: 1 }} onClick={handleStartFresh}>
              Start Fresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '60px auto 120px auto', padding: '0 var(--spacing-base)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: 'var(--rounded-pill)', backgroundColor: 'var(--color-hairline-soft)', border: '1px solid var(--color-hairline)', marginBottom: 'var(--spacing-sm)' }}>
          <Sparkles size={14} style={{ color: 'var(--color-primary)' }} />
          <span className="caption-uppercase" style={{ color: 'var(--color-ink)' }}>Anti-Scam Forensic Assistant</span>
        </div>
        <h1 className="display-lg" style={{ color: 'var(--color-ink)', marginTop: '0', marginBottom: 'var(--spacing-xs)' }}>
          New Car Inspection
        </h1>
        <p className="body-md" style={{ color: 'var(--color-muted)', maxWidth: '480px', margin: '0 auto' }}>
          Prepare your check list and parameters to perform a forensic, uncompromising pre-delivery evaluation.
        </p>
      </div>

      {/* Accordion Forensic Guidelines */}
      <div className="card" style={{ marginBottom: 'var(--spacing-xl)', border: '1px solid var(--color-hairline-strong)', padding: '0', overflow: 'hidden' }}>
        <div 
          onClick={() => setShowPrep(!showPrep)} 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '16px 20px', backgroundColor: 'var(--color-canvas-soft)' }}
        >
          <h3 className="title-sm" style={{ color: 'var(--color-ink)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Forensic Mindset & Preparation Guide</span>
          </h3>
          <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600 }}>
            {showPrep ? 'Hide Guidelines' : 'Show Guidelines'}
          </span>
        </div>
        
        {showPrep && (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', borderTop: '1px solid var(--color-hairline-soft)', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '12px', backgroundColor: 'rgba(207, 45, 86, 0.05)', borderLeft: '3px solid var(--color-semantic-error)', padding: '12px 16px', borderRadius: '0 var(--rounded-md) var(--rounded-md) 0' }}>
              <AlertTriangle size={18} style={{ color: 'var(--color-semantic-error)', flexShrink: 0, marginTop: '2px' }} />
              <p className="body-sm" style={{ color: 'var(--color-ink)', margin: 0, lineHeight: 1.5 }}>
                <strong>Critical Rule:</strong> Assume the dealership will cut corners unless you verify every single detail. Do not sign final paperwork or make final payments until the vehicle passes your inspection.
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', fontSize: '13.5px', color: 'var(--color-body)', lineHeight: 1.5 }}>
              <div>• <strong>Inspect at Stockyard:</strong> Perform PDI before registration. Once the car is registered in your name, you lose almost all bargaining power.</div>
              <div>• <strong>Natural Daylight:</strong> Always inspect outdoors. Showroom spotlights are configured specifically to hide dents, scratches, and repaint variations.</div>
              <div>• <strong>Tools to Bring:</strong> Flashlight/Torch, Tyre pressure gauge, OBD-II scanner, phone camera, and a second pair of eyes (friend/family).</div>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', textAlign: 'left' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <label htmlFor="make" className="title-sm" style={{ color: 'var(--color-ink)' }}>Brand / Make</label>
            <input
              type="text"
              id="make"
              required
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="e.g. Tesla, Honda, Porsche"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <label htmlFor="model" className="title-sm" style={{ color: 'var(--color-ink)' }}>Model Name</label>
            <input
              type="text"
              id="model"
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Model Y, Accord, Macan"
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
          <label htmlFor="vin" className="title-sm" style={{ color: 'var(--color-ink)' }}>
            VIN / Chassis Number <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>(Optional)</span>
          </label>
          <input
            type="text"
            id="vin"
            maxLength={17}
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="17-digit Vehicle Identification Number"
            style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
          <span className="title-sm" style={{ color: 'var(--color-ink)' }}>Power Unit Architecture</span>
          <div className="segmented-control">
            <button
              type="button"
              onClick={() => setIsEV(false)}
              className={!isEV ? 'active' : ''}
            >
              Gasoline / Hybrid / ICE
            </button>
            <button
              type="button"
              onClick={() => setIsEV(true)}
              className={isEV ? 'active' : ''}
            >
              ⚡ Electric Vehicle (EV)
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="button-primary"
          disabled={isSubmitting}
          style={{ marginTop: 'var(--spacing-base)', display: 'flex', gap: '10px', justifyContent: 'center', height: '52px' }}
        >
          <span>Initialize Forensic Inspection</span>
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
