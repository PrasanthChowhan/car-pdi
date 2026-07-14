import React, { useState } from 'react';
import { useInspectionStore } from '../../store/useInspectionStore';
import { X, ClipboardCheck, Binary, FileText, ChevronRight, Play } from 'lucide-react';

const SLIDES = [
  {
    icon: <ClipboardCheck size={48} style={{ color: 'var(--color-primary)' }} />,
    title: "1. Structured Stockyard Inspection",
    description: "Empower yourself before final registration. Perform a systematic paint, cosmetic, and mechanical check in broad natural daylight right at the dealership stockyard."
  },
  {
    icon: <Binary size={48} style={{ color: 'var(--color-primary)' }} />,
    title: "2. Forensic Manufacturing Age Checks",
    description: "Verify manufacture dates automatically. Input chassis number (VIN Decoder) to check stock age, and input tyre DOT codes to inspect tyre freshness."
  },
  {
    icon: <FileText size={48} style={{ color: 'var(--color-primary)' }} />,
    title: "3. 100% Offline with PDF Handover",
    description: "Inspect on-site without any active network connection. Log defects, snap evidence photos, collect digital signatures, and download an official PDI PDF report instantly."
  }
];

export default function WelcomeSheet() {
  const { hasSeenTutorial, setHasSeenTutorial, isHydrated } = useInspectionStore();
  const [activeSlide, setActiveSlide] = useState(0);

  // Do not render if app state is not loaded, or user has already completed/dismissed the welcome walkthrough
  if (!isHydrated || hasSeenTutorial !== false) {
    return null;
  }

  const handleNext = () => {
    if (activeSlide < SLIDES.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      setHasSeenTutorial(true);
    }
  };

  const handleSkip = () => {
    setHasSeenTutorial(true);
  };

  const currentSlide = SLIDES[activeSlide];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      animation: 'fadeIn 0.25s ease'
    }}>
      {/* Container: centered card on desktop, slide-up bottom sheet on mobile */}
      <div 
        className="card"
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'var(--color-canvas)',
          border: '1px solid var(--color-hairline-strong)',
          borderRadius: 'var(--rounded-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          position: 'relative',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          margin: '0 var(--spacing-md)'
        }}
      >
        {/* Header: Skip button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleSkip}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: 'var(--rounded-sm)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ink)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-muted)'}
          >
            <span>Skip Info</span>
            <X size={14} />
          </button>
        </div>

        {/* Slide Visual Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px',
          minHeight: '220px',
          justifyContent: 'center',
          animation: 'fadeIn 0.2s ease-in-out'
        }} key={activeSlide}>
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            backgroundColor: 'rgba(245, 78, 0, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '4px'
          }}>
            {currentSlide.icon}
          </div>
          <h2 className="title-md" style={{ margin: 0, color: 'var(--color-ink)', fontWeight: 700 }}>
            {currentSlide.title}
          </h2>
          <p className="body-sm" style={{ margin: 0, color: 'var(--color-body)', lineHeight: 1.6, maxWidth: '380px' }}>
            {currentSlide.description}
          </p>
        </div>

        {/* Footer actions: Dots & Next button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--color-hairline-soft)',
          paddingTop: '16px',
          marginTop: '8px'
        }}>
          {/* Slide dots indicator */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {SLIDES.map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: activeSlide === idx ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: activeSlide === idx ? 'var(--color-primary)' : 'var(--color-hairline-strong)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            ))}
          </div>

          {/* Action button */}
          <button
            type="button"
            className="button-primary"
            onClick={handleNext}
            style={{
              height: '38px',
              minHeight: '38px',
              padding: '0 16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <span>{activeSlide === SLIDES.length - 1 ? "Let's Go" : "Continue"}</span>
            {activeSlide === SLIDES.length - 1 ? <Play size={12} fill="#ffffff" /> : <ChevronRight size={14} />}
          </button>
        </div>

      </div>
    </div>
  );
}
