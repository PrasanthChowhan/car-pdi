import React from 'react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--color-hairline)', backgroundColor: 'var(--color-canvas)', marginTop: 'var(--spacing-section)' }}>
      <div className="page-container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--spacing-xs)' }}>
          <span className="title-sm" style={{ color: 'var(--color-ink)' }}>PDI Assistant</span>
          <span className="body-sm" style={{ color: 'var(--color-muted)' }}>© {new Date().getFullYear()} PDI Assistant. Forensic-grade inspections for a perfect delivery.</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--spacing-lg)' }}>
          <a href="/about-us" className="body-sm" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>About</a>
          <a href="/contact-us" className="body-sm" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>Contact</a>
          <a href="/privacy-policy" className="body-sm" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/terms-conditions" className="body-sm" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
}
