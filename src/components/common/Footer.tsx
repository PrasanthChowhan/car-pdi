import React from 'react';

// Inline Custom SVGs to prevent Lucide-react bundler/CommonJS import failures in Vite
const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ size = 16 }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="page-container">
        {/* Main Footer Columns */}
        <div className="footer-columns-grid">
          
          {/* Column 1: Checklist Tools */}
          <div className="footer-column">
            <h3 className="footer-column-title">Checklist Tools</h3>
            <ul className="footer-links-list">
              <li><a href="/setup" className="footer-link">Start PDI Checklist</a></li>
              <li><a href="/tyre-decoder" className="footer-link">Tyre DOT Decoder</a></li>
              <li><a href="/deal-sheet-analyzer" className="footer-link">Deal Sheet Analyzer</a></li>
            </ul>
          </div>

          {/* Column 2: PDI Guides */}
          <div className="footer-column">
            <h3 className="footer-column-title">PDI Guides</h3>
            <ul className="footer-links-list">
              <li><a href="/faq" className="footer-link">PDI Handbook & FAQ</a></li>
              <li><a href="/deal-breakers" className="footer-link">The Deal-Breakers</a></li>
              <li><a href="/what-to-bring" className="footer-link">What to Bring</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="footer-column">
            <h3 className="footer-column-title">Company</h3>
            <ul className="footer-links-list">
              <li><a href="/about-us" className="footer-link">About PDI Assistant</a></li>
              <li><a href="/stories" className="footer-link">Real Life Stories</a></li>
              <li><a href="/contact-us" className="footer-link">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="footer-column">
            <h3 className="footer-column-title">Legal</h3>
            <ul className="footer-links-list">
              <li><a href="/privacy-policy" className="footer-link">Privacy Policy</a></li>
              <li><a href="/terms-conditions" className="footer-link">Terms & Conditions</a></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <hr className="footer-divider" />

        {/* Bottom Bar */}
        <div className="footer-bottom-row">
          {/* Logo */}
          <a href="/" className="footer-logo">
            PDI Assistant
          </a>

          {/* Bottom Links */}
          <div className="footer-bottom-links">
            <a href="/about-us" className="footer-bottom-link">About</a>
            <a href="/faq" className="footer-bottom-link">FAQs</a>
            <a href="/deal-breakers" className="footer-bottom-link">Deal-Breakers</a>
            <a href="/what-to-bring" className="footer-bottom-link">What to Bring</a>
            <a href="/contact-us" className="footer-bottom-link">Contact</a>
          </div>

          {/* Social Media */}
          <div className="footer-social-icons">
            <a href="#" className="footer-social-circle" aria-label="Facebook">
              <FacebookIcon size={16} />
            </a>
            <a href="#" className="footer-social-circle" aria-label="Twitter">
              <TwitterIcon size={16} />
            </a>
            <a href="#" className="footer-social-circle" aria-label="Google Plus">
              <span style={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'var(--font-sans)', transform: 'translateY(-0.5px)' }}>G+</span>
            </a>
            <a href="#" className="footer-social-circle" aria-label="YouTube">
              <YoutubeIcon size={16} />
            </a>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '12px', color: 'var(--color-muted)' }}>
          © {currentYear} PDI Assistant. All rights reserved. Forensic-grade pre-delivery inspection checklists.
        </div>
      </div>
    </footer>
  );
}
