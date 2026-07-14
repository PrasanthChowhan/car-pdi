import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useInspectionStore } from '../../store/useInspectionStore';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { setHasSeenTutorial, setTutorialStep } = useInspectionStore();

  const handleRestartTutorial = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setHasSeenTutorial(false);
    setTutorialStep(0);
  };

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
        <Link to="/setup" style={{ textDecoration: 'none', color: 'var(--color-ink)', fontWeight: 600, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Car PDI Checklist
        </Link>
        <nav style={{ display: 'flex', gap: '16px' }}>
          <Link to="/setup" style={{ textDecoration: 'none', color: 'var(--color-body)', fontSize: '14px', fontWeight: 500 }}>Inspection</Link>
          <a href="/tyre-decoder" style={{ textDecoration: 'none', color: 'var(--color-body)', fontSize: '14px', fontWeight: 500 }}>Tyre Decoder</a>
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          type="button"
          onClick={handleRestartTutorial}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: 500,
            padding: '6px 10px',
            borderRadius: 'var(--rounded-pill)',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-hairline-soft)';
            e.currentTarget.style.color = 'var(--color-ink)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--color-muted)';
          }}
          title="Restart Onboarding Tutorial"
        >
          <HelpCircle size={18} />
          <span>Help</span>
        </button>
        <a href="/about-us" style={{ textDecoration: 'none', color: 'var(--color-body)', fontSize: '14px' }}>About</a>
      </div>
    </header>
  );
};

export default Header;
