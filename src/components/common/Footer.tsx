import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--color-canvas)',
      padding: '64px 48px',
      borderTop: '1px solid var(--color-hairline)',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '48px'
      }}>
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
      
      <div style={{
        maxWidth: '1200px',
        margin: '48px auto 0',
        paddingTop: '24px',
        borderTop: '1px solid var(--color-hairline-soft)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div className="body-sm" style={{ color: 'var(--color-muted)' }}>
          © {new Date().getFullYear()} Car PDI Checklist. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
