import { useState } from 'react';
import { Shield, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

interface SetupFormProps {
  onSubmit: (data: { make: string; model: string; vin: string; isEV: boolean }) => void;
  isSubmitting: boolean;
}

export default function SetupForm({ onSubmit, isSubmitting }: SetupFormProps) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [vin, setVin] = useState('');
  const [isEV, setIsEV] = useState(false);
  const [showPrep, setShowPrep] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim()) return;
    onSubmit({
      make: make.trim(),
      model: model.trim(),
      vin: vin.trim().toUpperCase(),
      isEV,
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '60px auto 120px auto', padding: '0 var(--spacing-base)' }}>
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
            <div style={{ display: 'flex', gap: '12px', backgroundColor: 'rgba(207, 45, 86, 0.05)', borderLeft: '3px solid var(--color-semantic-error)', padding: '12px 16px', borderRadius: '0 var(--rounded-md) var(--rounded-md) 0' }}>
              <AlertTriangle size={18} style={{ color: 'var(--color-semantic-error)', flexShrink: 0, marginTop: '2px' }} />
              <p className="body-sm" style={{ color: 'var(--color-ink)', margin: 0, lineHeight: 1.5 }}>
                <strong>Critical Rule:</strong> Verify every single detail before signing final paperwork or making final payments to ensure the vehicle has no defects.
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', fontSize: '13.5px', color: 'var(--color-body)', lineHeight: 1.5 }}>
              <div>• <strong>Inspect at Stockyard:</strong> Perform PDI before registration. Once the car is registered in your name, resolving issues becomes much harder.</div>
              <div>• <strong>Natural Daylight:</strong> Always inspect outdoors. Showroom spotlights can hide minor paint issues or scratches.</div>
              <div>• <strong>Tools to Bring:</strong> Flashlight, tyre pressure gauge, OBD-II scanner, phone camera, and a second pair of eyes (friend/family).</div>
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
          <span>Start Inspection</span>
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
