import React from 'react';

const Header: React.FC = () => {
  return (
    <header style={{
      height: '64px',
      padding: '0 var(--spacing-lg)',
      borderBottom: '1px solid var(--color-hairline)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'var(--color-canvas)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <a href="/" style={{ textDecoration: 'none', color: 'var(--color-ink)', fontWeight: 600, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Car PDI Checklist
        </a>
        <nav style={{ display: 'flex', gap: '16px' }}>
          <a href="/setup" style={{ textDecoration: 'none', color: 'var(--color-body)', fontSize: '14px', fontWeight: 500 }}>Inspection</a>
          <a href="/tyre-decoder" style={{ textDecoration: 'none', color: 'var(--color-body)', fontSize: '14px', fontWeight: 500 }}>Tyre Decoder</a>
        </nav>
      </div>
      <div>
        <a href="/about-us" style={{ textDecoration: 'none', color: 'var(--color-body)', fontSize: '14px' }}>About</a>
      </div>
    </header>
  );
};

export default Header;
