import React, { useState, useRef, useEffect } from 'react';
import { useInspectionStore } from '../../store/useInspectionStore';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  
  const syncStatus = useInspectionStore((state) => state.syncStatus);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="header-nav" style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0 var(--spacing-lg)', 
      borderBottom: '1px solid var(--color-hairline)', 
      backgroundColor: 'var(--color-canvas)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      height: '64px',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
          <img alt="Logo" style={{ height: '32px', width: '32px' }} src="/car.svg" />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span className="display-sm" style={{ fontWeight: 700, color: 'var(--color-ink)', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>PDI Assistant</span>
            <span className="caption-uppercase brand-subhead" style={{ color: 'var(--color-muted)', letterSpacing: '0.8px' }}>Car PDI Online</span>
          </div>
        </a>

        {/* Sync Status Badge */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          marginLeft: '12px', 
          padding: '4px 8px', 
          borderRadius: '4px', 
          backgroundColor: 'var(--color-canvas-soft)', 
          border: '1px solid var(--color-hairline)',
          fontSize: '11px',
          fontWeight: 500,
          color: 'var(--color-body)'
        }}>
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: syncStatus === 'saved' ? 'var(--color-semantic-success)' : syncStatus === 'saving' ? 'var(--color-primary)' : 'var(--color-semantic-error)',
            animation: syncStatus === 'saving' ? 'pulse 1s infinite' : 'none'
          }} />
          <style>{`
            @keyframes pulse {
              0% { opacity: 0.4; }
              50% { opacity: 1; }
              100% { opacity: 0.4; }
            }
          `}</style>
          <span className="sync-status-text" style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600, color: 'var(--color-muted)' }}>
            {syncStatus === 'saved' ? 'Saved' : syncStatus === 'saving' ? 'Saving...' : 'Error'}
          </span>
        </div>
      </div>
      
      {/* Desktop Nav */}
      <div className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
        <style>{`
          @media (min-width: 768px) { 
            .desktop-nav { display: flex !important; } 
            .mobile-nav-toggle { display: none !important; }
          }
          @media (max-width: 480px) {
            .header-nav {
              padding: 0 var(--spacing-sm) !important;
            }
            .sync-status-text {
              display: none !important;
            }
            .brand-subhead {
              display: none !important;
            }
          }
          .nav-link {
            font-size: 14px;
            text-decoration: none;
            transition: color 0.2s ease;
          }
          .nav-link:hover, .nav-dropdown-toggle:hover {
            color: var(--color-primary) !important;
          }
          .dropdown-item:hover {
            background-color: var(--color-canvas-soft) !important;
            color: var(--color-primary) !important;
          }
        `}</style>
        
        {/* Core Utilities */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <a href="/deal-sheet-analyzer" className="nav-link" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>Deal Sheet</a>
          
          {/* Tools Dropdown */}
          <div ref={toolsRef} style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className="nav-dropdown-toggle" 
              style={{ 
                color: 'var(--color-ink)', 
                fontWeight: 600, 
                background: 'none', 
                border: 'none', 
                padding: '8px 12px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'inherit',
                fontSize: '14px',
                transition: 'color 0.2s ease',
                borderRadius: 'var(--rounded-sm)'
              }}
            >
              <span>Tools & Guides</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ 
                  transform: isToolsOpen ? 'rotate(180deg)' : 'none', 
                  transition: 'transform 0.2s ease' 
                }}
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
            
            {isToolsOpen && (
              <div 
                style={{ 
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: 'var(--color-surface-card)',
                  border: '1px solid var(--color-hairline-strong)',
                  borderRadius: 'var(--rounded-md)',
                  padding: '6px 0',
                  minWidth: '160px',
                  zIndex: 1001,
                  marginTop: '8px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <a 
                  href="/tyre-decoder" 
                  className="dropdown-item" 
                  onClick={() => setIsToolsOpen(false)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13.5px',
                    color: 'var(--color-ink)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'background-color 0.15s, color 0.15s'
                  }}
                >
                  Tyre DOT Decoder
                </a>
                <a 
                  href="/deal-breakers" 
                  className="dropdown-item" 
                  onClick={() => setIsToolsOpen(false)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13.5px',
                    color: 'var(--color-ink)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'background-color 0.15s, color 0.15s',
                    borderTop: '1px solid var(--color-hairline-soft)'
                  }}
                >
                  Deal-Breakers
                </a>
                <a 
                  href="/what-to-bring" 
                  className="dropdown-item" 
                  onClick={() => setIsToolsOpen(false)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13.5px',
                    color: 'var(--color-ink)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'background-color 0.15s, color 0.15s',
                    borderTop: '1px solid var(--color-hairline-soft)'
                  }}
                >
                  What to Bring
                </a>
              </div>
            )}
          </div>

          <a href="/stories" className="nav-link" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>Buyer Stories</a>
        </div>
      </div>

      {/* Mobile Nav Toggle */}
      <button 
        className="mobile-nav-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          color: 'var(--color-ink)',
          borderRadius: 'var(--rounded-sm)'
        }}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '64px', 
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--color-canvas)',
          borderTop: '1px solid var(--color-hairline)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--spacing-lg)',
          gap: 'var(--spacing-md)',
          animation: 'fadeIn 0.2s ease'
        }}>
          <a 
            href="/deal-sheet-analyzer" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--color-ink)',
              textDecoration: 'none',
              padding: '16px 0',
              borderBottom: '1px solid var(--color-hairline-soft)'
            }}
          >
            Deal Sheet Analyzer
          </a>
          <a 
            href="/tyre-decoder" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--color-ink)',
              textDecoration: 'none',
              padding: '16px 0',
              borderBottom: '1px solid var(--color-hairline-soft)'
            }}
          >
            Tyre DOT Decoder
          </a>
          <a 
            href="/deal-breakers" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--color-ink)',
              textDecoration: 'none',
              padding: '16px 0',
              borderBottom: '1px solid var(--color-hairline-soft)'
            }}
          >
            Deal-Breakers
          </a>
          <a 
            href="/what-to-bring" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--color-ink)',
              textDecoration: 'none',
              padding: '16px 0',
              borderBottom: '1px solid var(--color-hairline-soft)'
            }}
          >
            What to Bring
          </a>
          <a 
            href="/stories" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--color-ink)',
              textDecoration: 'none',
              padding: '16px 0',
              borderBottom: '1px solid var(--color-hairline-soft)'
            }}
          >
            Buyer Stories
          </a>
        </div>
      )}
    </nav>
  );
};

export default Header;
