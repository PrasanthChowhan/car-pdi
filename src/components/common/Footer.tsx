import React from 'react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer-content">
        {/* Brand Column */}
        <div style={{ flex: '1 1 200px' }}>
          <div style={{ color: 'var(--color-ink)', fontWeight: 600, fontSize: '16px', marginBottom: '16px' }}>
            Car PDI Checklist
          </div>
          <p className="body-sm" style={{ color: 'var(--color-body)', margin: 0, maxWidth: '250px' }}>
            India's smartest Pre-Delivery Inspection tool for new car and EV buyers. Protect your purchase with an expert-grade checklist.
          </p>
        </div>

        {/* Links Column */}
        <div style={{ flex: '1 1 200px' }}>
          <div style={{ color: 'var(--color-ink)', fontWeight: 600, fontSize: '14px', marginBottom: '16px' }}>
            Resources
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="/about-us" className="body-sm" style={{ color: 'var(--color-body)', textDecoration: 'none' }}>About Us</a>
            <a href="/privacy-policy" className="body-sm" style={{ color: 'var(--color-body)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="/terms-conditions" className="body-sm" style={{ color: 'var(--color-body)', textDecoration: 'none' }}>Terms & Conditions</a>
            <a href="/contact-us" className="body-sm" style={{ color: 'var(--color-body)', textDecoration: 'none' }}>Contact Us</a>
          </div>
        </div>
      </div>
      
      <div className="app-footer-bottom">
        <div className="body-sm" style={{ color: 'var(--color-muted)' }}>
          © {new Date().getFullYear()} Car PDI Checklist. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
