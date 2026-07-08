import { useState } from 'react';
import { Shield, Sparkles, AlertTriangle, ArrowRight, Cpu, FileText, BookOpen } from 'lucide-react';

interface SetupFormProps {
  onSubmit: (data: { make: string; model: string; vin: string; isEV: boolean }) => void;
  isSubmitting: boolean;
}

export default function SetupForm({ onSubmit, isSubmitting }: SetupFormProps) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [isEV, setIsEV] = useState(false);
  const [showPrep, setShowPrep] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

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

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-hairline-strong)', margin: 'var(--spacing-xxl) 0' }} />

      <section style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-base)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={20} style={{ color: 'var(--color-primary)' }} />
          <h2 className="title-md" style={{ color: 'var(--color-body-strong)', margin: 0 }}>
            PDI Checklist & Pre-Delivery Inspection Guide
          </h2>
        </div>
        
        <div style={{ 
          position: 'relative', 
          maxHeight: isExpanded ? 'none' : '180px', 
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
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

          {/* Fade-out Gradient Overlay */}
          {!isExpanded && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '100px',
              background: 'linear-gradient(to bottom, transparent, var(--color-canvas))',
              pointerEvents: 'none'
            }} />
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--spacing-sm)' }}>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: 'var(--rounded-pill)',
              backgroundColor: 'var(--color-hairline-soft)',
              transition: 'background-color 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-hairline)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-hairline-soft)'}
          >
            {isExpanded ? 'Show Less' : 'Read Full Guide & FAQs'}
          </button>
        </div>
      </section>
      
      <footer style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
          <a href="/about-us" style={{ color: 'var(--color-muted)', fontSize: '14px', textDecoration: 'none' }}>About Us</a>
          <a href="/privacy-policy" style={{ color: 'var(--color-muted)', fontSize: '14px', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/terms-conditions" style={{ color: 'var(--color-muted)', fontSize: '14px', textDecoration: 'none' }}>Terms & Conditions</a>
          <a href="/contact-us" style={{ color: 'var(--color-muted)', fontSize: '14px', textDecoration: 'none' }}>Contact Us</a>
        </div>
        <p style={{ color: 'var(--color-muted)', fontSize: '12px', margin: 0 }}>© {new Date().getFullYear()} Car PDI Checklist. All rights reserved.</p>
      </footer>
    </div>
  );
}
