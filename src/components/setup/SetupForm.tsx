import { useState } from 'react';
import { Shield, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

interface SetupFormProps {
  onSubmit: (data: { make: string; model: string; vin: string; isEV: boolean }) => void;
  isSubmitting: boolean;
}

export default function SetupForm({ onSubmit, isSubmitting }: SetupFormProps) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [isEV, setIsEV] = useState(false);
  const [showPrep, setShowPrep] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim()) return;
    onSubmit({
      make: make.trim(),
      model: model.trim(),
      vin: '',
      isEV,
    });
  };

  return (
    <div className="page-container page-container-narrow">
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: 'var(--rounded-pill)', backgroundColor: 'var(--color-hairline-soft)', border: '1px solid var(--color-hairline)', marginBottom: 'var(--spacing-sm)' }}>
          <Sparkles size={14} style={{ color: 'var(--color-primary)' }} />
          <span className="caption-uppercase" style={{ color: 'var(--color-ink)' }}>Pre-Delivery Inspection Assistant</span>
        </div>
        <h1 className="display-lg" style={{ color: 'var(--color-ink)', marginTop: '0', marginBottom: 'var(--spacing-xs)' }}>
          New Car Inspection
        </h1>
        <p className="body-md" style={{ color: 'var(--color-muted)', maxWidth: '480px', margin: '0 auto' }}>
          Set up your checklist to perform a thorough and structured pre-delivery inspection.
        </p>
      </div>

      {/* Accordion PDI Guidelines */}
      <div className="card" style={{ marginBottom: 'var(--spacing-xl)', border: '1px solid var(--color-hairline-strong)', padding: '0', overflow: 'hidden' }}>
        <div 
          onClick={() => setShowPrep(!showPrep)} 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '16px 20px', backgroundColor: 'var(--color-canvas-soft)' }}
        >
          <h3 className="title-sm" style={{ color: 'var(--color-ink)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={18} style={{ color: 'var(--color-primary)' }} />
            <span>PDI Checklist & Preparation Guide</span>
          </h3>
          <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600 }}>
            {showPrep ? 'Hide Guidelines' : 'Show Guidelines'}
          </span>
        </div>
        
        {showPrep && (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', borderTop: '1px solid var(--color-hairline-soft)', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '12px', backgroundColor: 'rgba(245, 78, 0, 0.05)', borderLeft: '3px solid var(--color-primary)', padding: '12px 16px', borderRadius: '0 var(--rounded-md) var(--rounded-md) 0' }}>
              <AlertTriangle size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
              <p className="body-sm" style={{ color: 'var(--color-ink)', margin: 0, lineHeight: 1.5 }}>
                <strong>Critical Rule:</strong> Inspect the vehicle and verify details before signing final paperwork, making final payments, or registering the car in your name.
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', fontSize: '13px', color: 'var(--color-body)', lineHeight: 1.5 }}>
              <div>🚫 <strong>No PDI, No Purchase:</strong> Walk away if the dealer refuses a PDI, denies access to the stockyard, or prohibits third-party mechanic inspections. You are fully entitled to inspect before registration.</div>
              <div>💰 <strong>No Full Payment Before PDI:</strong> Never pay the full amount or register the vehicle until you satisfy this checklist. Only pay the booking amount beforehand. Do not fall for artificial urgency.</div>
              <div>☀️ <strong>Natural Daylight:</strong> Always inspect outdoors. Showroom spotlights are angled to hide paint defects, scratches, and panel repaints. Reject basement or night inspections.</div>
              <div>🔒 <strong>No Locked Features:</strong> Ensure all features (sunroof, electronics, screens) are functional. Evasiveness, "locked" screens, or blocking OBD scans usually hide underlying faults.</div>
              <div>🆔 <strong>VIN & Odometer Match:</strong> Match the physical chassis VIN (usually on a tag under the windshield or driver door pillar) with your invoice to ensure no car-switching. Verify odometer is under 50–100 km.</div>
              <div>🛠️ <strong>Bring Essentials:</strong> Pack a bright flashlight, a tyre pressure gauge, a phone camera to log defects, and a friend/family member for a second set of eyes.</div>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', textAlign: 'left' }}>
        <div className="form-grid">
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
          <span>Start Inspection</span>
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
