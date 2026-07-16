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
      <div className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: 'var(--spacing-xl)' }}>
        <style>{`@media (min-width: 768px) { .desktop-nav { display: flex !important; } }`}</style>
        <a href="/deal-sheet-analyzer" className="nav-link" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>Deal Sheet</a>
        <a href="/tyre-decoder" className="nav-link" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>Tyre Decoder</a>
        <a href="/stories" className="nav-link" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>Stories</a>
        <a href="/about-us" className="nav-link" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>About Us</a>
        <a href="/contact-us" className="nav-link" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>Contact Us</a>
        <a href="/terms-conditions" className="nav-link" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>Terms</a>
        <a href="/privacy-policy" className="nav-link" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>Privacy</a>
      </div>

    </nav>
  );
};

export default Header;
