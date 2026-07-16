import React from 'react';

const Header: React.FC = () => {

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
          .nav-link:hover {
            color: var(--color-primary) !important;
          }
        `}</style>
        
        {/* Core Utilities */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <a href="/deal-sheet-analyzer" className="nav-link" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>Deal Sheet</a>
          <a href="/tyre-decoder" className="nav-link" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>Tyre Decoder</a>
          <a href="/stories" className="nav-link" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>Buyer Stories</a>
        </div>
        
        {/* Visual Separator */}
        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--color-hairline)' }}></div>
        
        {/* Info Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <a href="/about-us" className="nav-link" style={{ color: 'var(--color-muted)', fontWeight: 500 }}>About Us</a>
          <a href="/contact-us" className="nav-link" style={{ color: 'var(--color-muted)', fontWeight: 500 }}>Contact Us</a>
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
