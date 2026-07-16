import React, { useState, useRef, useEffect } from 'react';

const Header: React.FC = () => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

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
    <nav style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: 'var(--spacing-base) var(--spacing-lg)', 
      borderBottom: '1px solid var(--color-hairline)', 
      backgroundColor: 'var(--color-canvas)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
          <img alt="Logo" style={{ height: '32px', width: '32px' }} src="/car.svg" />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span className="display-sm" style={{ fontWeight: 700, color: 'var(--color-ink)', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>PDI Assistant</span>
            <span style={{ fontSize: '10px', color: 'var(--color-muted)', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Car PDI Online</span>
          </div>
        </a>
      </div>
      
      {/* Desktop Nav */}
      <div className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
        <style>{`
          @media (min-width: 768px) { 
            .desktop-nav { display: flex !important; } 
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
                padding: 0, 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'inherit',
                fontSize: '14px',
                transition: 'color 0.2s ease'
              }}
            >
              <span>Tools</span>
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
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 'var(--rounded-md)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  padding: '6px 0',
                  minWidth: '150px',
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
                  Tyre Decoder
                </a>
              </div>
            )}
          </div>

          <a href="/stories" className="nav-link" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>Buyer Stories</a>
        </div>
        
        {/* Visual Separator */}
        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--color-hairline)' }}></div>
        
        {/* Info Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <a href="/about-us" className="nav-link" style={{ color: 'var(--color-muted)', fontWeight: 500 }}>About</a>
          <a href="/contact-us" className="nav-link" style={{ color: 'var(--color-muted)', fontWeight: 500 }}>Contact</a>
        </div>

        {/* CTA Button */}
        <a href="/" style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-on-primary)',
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: 'var(--rounded-pill)',
          fontSize: '13px',
          fontWeight: 600,
          transition: 'background-color 0.2s ease',
          marginLeft: 'var(--spacing-xs)'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-active)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
        >
          Start Checklist
        </a>
      </div>

    </nav>
  );
};

export default Header;
