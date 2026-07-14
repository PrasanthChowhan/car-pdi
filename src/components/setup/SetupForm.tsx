import { useState } from 'react';
import { Shield, Sparkles, AlertTriangle, ArrowRight, Cpu, FileText, BookOpen, X } from 'lucide-react';

interface SetupFormProps {
  onSubmit: (data: { make: string; model: string; vin: string; isEV: boolean }) => void;
  isSubmitting: boolean;
  onTryDemo: () => void;
}

export default function SetupForm({ onSubmit, isSubmitting, onTryDemo }: SetupFormProps) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [isEV, setIsEV] = useState(false);
  const [showPrep, setShowPrep] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

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
      <form id="setup-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', textAlign: 'left' }}>
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

        <div style={{ display: 'flex', gap: '12px', marginTop: 'var(--spacing-base)', flexWrap: 'wrap' }}>
          <button
            type="submit"
            className="button-primary"
            disabled={isSubmitting}
            style={{ flex: 2, display: 'flex', gap: '10px', justifyContent: 'center', height: '52px', minWidth: '200px' }}
          >
            <span>Start Inspection</span>
            <ArrowRight size={18} />
          </button>
          
          <button
            type="button"
            onClick={onTryDemo}
            className="button-secondary"
            style={{ flex: 1, display: 'flex', gap: '10px', justifyContent: 'center', height: '52px', minWidth: '150px', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
          >
            <span>Try a Demo</span>
            <Sparkles size={16} />
          </button>
        </div>
      </form>

      <div style={{ marginTop: 'var(--spacing-xl)', display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => setIsGuideOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-primary)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: 'var(--rounded-pill)',
            backgroundColor: 'rgba(245, 78, 0, 0.05)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(245, 78, 0, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(245, 78, 0, 0.05)';
          }}
        >
          <BookOpen size={16} />
          <span>Read PDI Handbook & FAQs</span>
        </button>
      </div>

      {/* Slide-over Drawer for PDI Handbook (SEO friendly & crawlable in DOM) */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'var(--color-canvas)',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
        zIndex: 2000,
        transform: isGuideOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--color-hairline)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--color-canvas-soft)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-ink)' }} className="caption-uppercase">
              PDI Handbook & FAQs
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsGuideOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              color: 'var(--color-muted)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{
          padding: 'var(--spacing-lg)',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-lg)'
        }}>
          <p className="body-sm" style={{ color: 'var(--color-body)', lineHeight: 1.6, margin: 0 }}>
            So, <strong>what is pdi in car</strong> purchase? The <strong>car pdi full form</strong> stands for Pre-Delivery Inspection. It represents the final, comprehensive inspection of a vehicle's cosmetics, electronics, and mechanics before the buyer accepts formal delivery. While every <strong>pre delivery inspection car dealership</strong> claims to perform this, transit scuffs, paint touch-ups, and assembly faults regularly slip through. Bringing your own <strong>pre delivery inspection car checklist</strong> is crucial. Our digital <strong>car pdi app india</strong> acts as your personal <strong>car pdi service</strong>, ensuring you inspect the vehicle under natural sunlight and protect your hard-earned capital.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div>
              <h3 className="title-sm" style={{ color: 'var(--color-ink)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <FileText size={15} style={{ color: 'var(--color-primary)' }} />
                <span>Checklist & Reports for Gas & EVs</span>
              </h3>
              <p className="body-sm" style={{ color: 'var(--color-muted)', lineHeight: 1.5, margin: 0 }}>
                Our interactive checklist operates as a detailed <strong>new car delivery checklist</strong> tailored for both ICE and electric cars. For electric vehicle buyers, the app activates an <strong>electric vehicle pre delivery inspection</strong> module. The specialized <strong>EV pdi checklist india</strong> helps you verify battery charge levels, charging accessories, port alignment, and software firmware, ensuring a complete <strong>new electric car delivery checklist</strong>. You can run this <strong>pwa car inspection tool</strong> as an offline <strong>car inspection app without internet</strong> right in the dealer's stockyard. Once finished, generate a detailed <strong>pre delivery inspection car pdf</strong> report, offering a <strong>new car delivery checklist pdf free download</strong> option directly on your device.
              </p>
            </div>

            <div>
              <h3 className="title-sm" style={{ color: 'var(--color-ink)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Cpu size={15} style={{ color: 'var(--color-primary)' }} />
                <span>Verify Authenticity with VIN Decoder India</span>
              </h3>
              <p className="body-sm" style={{ color: 'var(--color-muted)', lineHeight: 1.5, margin: 0 }}>
                A vital step in your <strong>new car pdi</strong> is verifying the physical Vehicle Identification Number (VIN) to check the vehicle's manufacturing month/year. Using a reliable <strong>vin decoder online</strong> prevents dealers from passing off older stock. Our app supports <strong>maruti vin decoder</strong>, <strong>mahindra vin decoder</strong>, <strong>hyundai vin decoder india</strong>, <strong>kia vin decoder</strong>, and <strong>toyota vin decoder</strong> engines. It makes learning <strong>how to decode vin number india</strong> fast and effortless, explaining exactly <strong>what is vin number in car</strong> formats for all major Indian manufacturers, and offering it as a <strong>vin decoder free</strong> utility.
              </p>
            </div>

            <div>
              <h3 className="title-sm" style={{ color: 'var(--color-ink)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Shield size={15} style={{ color: 'var(--color-primary)' }} />
                <span>Buyer Protection & Deal-Breakers</span>
              </h3>
              <p className="body-sm" style={{ color: 'var(--color-muted)', lineHeight: 1.5, margin: 0 }}>
                Dealerships often push buyers to complete registration prior to physically examining the vehicle, but knowing <strong>how to avoid buying defective new car india</strong> is key to buyer safety. According to our <strong>car delivery inspection tips india</strong>, never pay the full amount or <strong>car pdi charges</strong> before you inspect. If you identify a <strong>new car defect before delivery</strong>, you can request immediate rectification or reject the vehicle. We also support <strong>used car pdi</strong> protocols for pre-owned vehicles. Utilizing a dedicated tool is the <strong>best car pdi service</strong> approach to avoid post-purchase nightmares.
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-hairline-soft)', paddingTop: 'var(--spacing-md)' }}>
            <h3 className="title-sm" style={{ color: 'var(--color-ink)', marginBottom: 'var(--spacing-sm)' }}>
              Pre-Delivery Inspection (PDI) FAQs
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <div>
                <h4 className="title-sm" style={{ fontSize: '13px', color: 'var(--color-body-strong)', marginBottom: '2px' }}>
                  What is pdi in car and what is the full form?
                </h4>
                <p className="body-sm" style={{ color: 'var(--color-muted)', lineHeight: 1.5, margin: 0 }}>
                  PDI stands for <strong>Pre-Delivery Inspection</strong>. It is a comprehensive physical and technical check of a new car before final registration and delivery. To understand <strong>what is car pdi check</strong> relevance, it ensures the vehicle is free of paint damage, mechanical defects, electrical glitches, and other manufacturing issues.
                </p>
              </div>

              <div>
                <h4 className="title-sm" style={{ fontSize: '13px', color: 'var(--color-body-strong)', marginBottom: '2px' }}>
                  How to do car pdi and what to check in pdi of car?
                </h4>
                <p className="body-sm" style={{ color: 'var(--color-muted)', lineHeight: 1.5, margin: 0 }}>
                  To learn <strong>how to do car pdi</strong>, always inspect the vehicle under natural daylight, check panel gaps, and test interior components. Wondering <strong>what to check in pdi of car</strong>? Ensure to review the electrical controls, sunroof, AC, engine bay fluids, odometer reading (should be &lt; 100km), and verify the chassis VIN number.
                </p>
              </div>

              <div>
                <h4 className="title-sm" style={{ fontSize: '13px', color: 'var(--color-body-strong)', marginBottom: '2px' }}>
                  When to do pdi of car and who does pdi of car?
                </h4>
                <p className="body-sm" style={{ color: 'var(--color-muted)', lineHeight: 1.5, margin: 0 }}>
                  The question of <strong>when to do pdi of car</strong> is vital: perform it at the stockyard or showroom <em>before</em> signing final papers or registering the car at the RTO. <strong>Who does pdi of car</strong>? While the dealership workshop completes a standard check, the buyer should always perform a secondary independent PDI to protect their interest.
                </p>
              </div>

              <div>
                <h4 className="title-sm" style={{ fontSize: '13px', color: 'var(--color-body-strong)', marginBottom: '2px' }}>
                  What is pdi in car purchase & what to check before signing car delivery?
                </h4>
                <p className="body-sm" style={{ color: 'var(--color-muted)', lineHeight: 1.5, margin: 0 }}>
                  In a standard <strong>what is pdi in car purchase</strong> breakdown, you must verify the vehicle is in perfect order. Knowing <strong>what to check before signing car delivery</strong> includes verifying all original tools, spare key presence, tire pressure, infotainment operation, and that the VIN year matches current specifications.
                </p>
              </div>

              <div>
                <h4 className="title-sm" style={{ fontSize: '13px', color: 'var(--color-body-strong)', marginBottom: '2px' }}>
                  How to check pdi of new car and what to check for EV delivery inspection?
                </h4>
                <p className="body-sm" style={{ color: 'var(--color-muted)', lineHeight: 1.5, margin: 0 }}>
                  To learn <strong>how to check pdi of new car</strong>, download our web app to follow a digital, item-by-item checklist. For an <strong>EV delivery inspection what to check</strong> parameters, make sure to inspect battery state of charge (SoC), charging ports, charging cables, electrical accessories, regenerative braking logs, and software system firmware for the ultimate <strong>electric car pdi india</strong> experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Backdrop overlay */}
      {isGuideOpen && (
        <div 
          onClick={() => setIsGuideOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(1.5px)',
            zIndex: 1999,
            animation: 'fadeIn 0.2s ease'
          }}
        />
      )}
    </div>
  );
}
