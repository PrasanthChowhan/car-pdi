import { useState, useEffect } from 'react';
import { decodeTyreDOT } from '../../lib/decoderUtils';
import { Disc, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useInspectionStore } from '../../store/useInspectionStore';
import HintBanner from './HintBanner';

interface TyreDOTDecoderProps {
  initialNote?: string;
  onApply: (noteText: string, status: 'pass' | 'pending' | 'flagged') => void;
}

export default function TyreDOTDecoder({ initialNote, onApply }: TyreDOTDecoderProps) {
  const { hasDismissedTyreHint, setHasDismissedTyreHint } = useInspectionStore();
  const [tyreDOTs, setTyreDOTs] = useState({ FL: '', FR: '', RL: '', RR: '', SP: '' });
  const [showVisual, setShowVisual] = useState(false);

  // Pre-populate tyre DOT codes if they are in the note
  useEffect(() => {
    if (initialNote && Object.values(tyreDOTs).every(v => v === '')) {
      const flMatch = initialNote.match(/FL:\s*Week\s*(\d{2})\/(\d{4})/i) || initialNote.match(/FL:\s*(\d{4})/i);
      const frMatch = initialNote.match(/FR:\s*Week\s*(\d{2})\/(\d{4})/i) || initialNote.match(/FR:\s*(\d{4})/i);
      const rlMatch = initialNote.match(/RL:\s*Week\s*(\d{2})\/(\d{4})/i) || initialNote.match(/RL:\s*(\d{4})/i);
      const rrMatch = initialNote.match(/RR:\s*Week\s*(\d{2})\/(\d{4})/i) || initialNote.match(/RR:\s*(\d{4})/i);
      const spMatch = initialNote.match(/SP:\s*Week\s*(\d{2})\/(\d{4})/i) || initialNote.match(/SP:\s*(\d{4})/i);

      setTyreDOTs({
        FL: flMatch ? (flMatch[1] + (flMatch[2] ? flMatch[2].substring(2) : '')) : '',
        FR: frMatch ? (frMatch[1] + (frMatch[2] ? frMatch[2].substring(2) : '')) : '',
        RL: rlMatch ? (rlMatch[1] + (rlMatch[2] ? rlMatch[2].substring(2) : '')) : '',
        RR: rrMatch ? (rrMatch[1] + (rrMatch[2] ? rrMatch[2].substring(2) : '')) : '',
        SP: spMatch ? (spMatch[1] + (spMatch[2] ? spMatch[2].substring(2) : '')) : '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNote]);

  const handleApply = () => {
    const summaryList = Object.entries(tyreDOTs)
      .map(([key, code]) => {
        if (code.length !== 4) return null;
        const decoded = decodeTyreDOT(code);
        if (!decoded.isValid) return null;
        return `${key}: Week ${decoded.week}/${decoded.year} (${decoded.ageMonths}m old)`;
      })
      .filter(Boolean);

    if (summaryList.length === 0) return;

    const noteText = `Tyres DOT Dates decoded - ${summaryList.join(', ')}.`;

    const activeDecodes = Object.values(tyreDOTs)
      .filter(v => v.length === 4)
      .map(code => decodeTyreDOT(code))
      .filter(d => d.isValid);

    const hasFlagged = activeDecodes.some(d => d.status === 'flagged');
    const hasCaution = activeDecodes.some(d => d.status === 'caution');

    let newStatus: 'pass' | 'pending' | 'flagged' = 'pass';
    if (hasFlagged) {
      newStatus = 'flagged';
    } else if (hasCaution) {
      newStatus = 'pending';
    }

    onApply(noteText, newStatus);
  };

  return (
    <div className="card animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', marginBottom: 'var(--spacing-md)', textAlign: 'left', backgroundColor: 'var(--color-canvas-soft)', border: '1px solid var(--color-hairline-strong)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-hairline)', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Disc size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-ink)' }} className="caption-uppercase">Tyre DOT Date Decoder (WWYY)</span>
        </div>
        <button
          type="button"
          onClick={() => setShowVisual(!showVisual)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--color-primary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 'var(--rounded-pill)',
            backgroundColor: showVisual ? 'rgba(245, 78, 0, 0.1)' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          <Info size={14} />
          Where to look
          {showVisual ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
      
      {showVisual && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '8px',
          backgroundColor: 'var(--color-canvas)',
          borderRadius: 'var(--rounded-md)',
          border: '1px solid var(--color-hairline)',
          marginBottom: '8px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: 'var(--rounded-sm)' }}>
            <picture>
              <source srcSet="/tyre%20dot.avif" type="image/avif" />
              <source srcSet="/tyre%20dot.webp" type="image/webp" />
              <img 
                src="/tyre%20dot.png" 
                alt="Where to look for DOT code on tyre sidewall" 
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} 
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      )}



      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '8px' }}>
        {(['FL', 'FR', 'RL', 'RR', 'SP'] as const).map((key) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label htmlFor={`pdi-tyre-${key}`} style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-ink)' }}>
              {key} {key === 'SP' ? '(Spare)' : ''}
            </label>
            <input
              type="text"
              id={`pdi-tyre-${key}`}
              maxLength={4}
              placeholder="WWYY"
              value={tyreDOTs[key as keyof typeof tyreDOTs]}
              onChange={(e) => setTyreDOTs({ ...tyreDOTs, [key]: e.target.value.replace(/[^0-9]/g, '') })}
              style={{ minHeight: '36px', height: '36px', padding: '4px 6px', fontSize: '12.5px', textAlign: 'center', borderColor: 'var(--color-hairline-strong)' }}
            />
          </div>
        ))}
      </div>

      {Object.values(tyreDOTs).some(v => v.length === 4) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--color-hairline)', paddingTop: '8px', marginTop: '4px' }}>
          {Object.entries(tyreDOTs).map(([key, code]) => {
            if (code.length !== 4) return null;
            const decoded = decodeTyreDOT(code);
            if (!decoded.isValid) return null;

            let color = 'var(--color-semantic-success)';
            let badgeColor = 'rgba(31, 138, 101, 0.1)';
            if (decoded.status === 'caution') {
              color = '#d08000';
              badgeColor = 'rgba(208, 128, 0, 0.1)';
            }
            if (decoded.status === 'flagged') {
              color = 'var(--color-semantic-error)';
              badgeColor = 'rgba(207, 45, 86, 0.1)';
            }

            return (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span><strong>{key}:</strong> Week {decoded.week}, {decoded.year}</span>
                <span style={{ color, fontWeight: 700, backgroundColor: badgeColor, padding: '1px 6px', borderRadius: 'var(--rounded-pill)' }}>{decoded.ageMonths}m old ({decoded.status.toUpperCase()})</span>
              </div>
            );
          })}

          <button
            type="button"
            className="button-primary"
            onClick={handleApply}
            style={{ height: '32px', minHeight: '32px', padding: '0 10px', fontSize: '11.5px', alignSelf: 'flex-start', marginTop: '4px' }}
          >
            Apply to Tyre Checklist
          </button>
        </div>
      )}
    </div>
  );
}
