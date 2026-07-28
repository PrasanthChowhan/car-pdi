import { decodeIndianVIN } from '../../lib/decoderUtils';
import { Binary, Info } from 'lucide-react';
import type { VehicleInfo } from '../../lib/storage';

interface VINDecoderProps {
  vehicle: VehicleInfo;
  setVehicle: (vehicle: VehicleInfo) => void;
  onApply: (
    vinNote: string, 
    vinStatus: 'pass' | 'pending' | 'flagged',
    ageNote: string,
    ageStatus: 'pass' | 'pending' | 'flagged'
  ) => void;
}

export default function VINDecoder({ vehicle, setVehicle, onApply }: VINDecoderProps) {
  const decoded = vehicle.vin && vehicle.vin.trim().length >= 3 ? decodeIndianVIN(vehicle.vin) : null;

  return (
    <div className="card animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', marginBottom: 'var(--spacing-md)', textAlign: 'left', backgroundColor: 'var(--color-canvas-soft)', border: '1px solid var(--color-hairline-strong)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--color-hairline)', paddingBottom: '8px' }}>
        <Binary size={18} style={{ color: 'var(--color-primary)' }} />
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-ink)' }} className="caption-uppercase">Forensic VIN / Chassis Decoder</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label htmlFor="pdi-vin" style={{ color: 'var(--color-muted)' }} className="caption-uppercase">VIN / Chassis Number</label>
        <input
          type="text"
          id="pdi-vin"
          maxLength={19}
          value={vehicle.vin || ''}
          onChange={(e) => setVehicle({ ...vehicle, vin: e.target.value.toUpperCase() })}
          placeholder="Enter 17 or 19-digit Chassis Number..."
          style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '1px', minHeight: '36px', height: '36px', fontSize: '13px', borderColor: 'var(--color-hairline-strong)' }}
        />
      </div>

      {decoded?.isValid && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', backgroundColor: 'var(--color-canvas)', padding: '8px', borderRadius: 'var(--rounded-md)', border: '1px solid var(--color-hairline)' }}>
            <div><strong>Brand:</strong> {decoded.manufacturer} ({decoded.country})</div>
            {decoded.year && <div><strong>Model Year:</strong> {decoded.year}</div>}
          </div>
          
          <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', padding: '8px', backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid var(--color-hairline)', borderRadius: 'var(--rounded-md)' }}>
            <Info size={14} style={{ color: 'var(--color-muted)', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '11.5px', margin: 0, color: 'var(--color-body)', lineHeight: 1.3 }}>{decoded.message}</p>
          </div>

          <button
            type="button"
            className="button-primary"
            onClick={() => {
              const vinNote = `Chassis number verified: ${decoded.vin}`;
              const ageNote = `Decoded VIN: ${decoded.manufacturer} (${decoded.country}), Model Year: ${decoded.year}. Message: ${decoded.message}`;
              
              onApply(vinNote, 'pass', ageNote, 'pending');
            }}
            style={{ height: '32px', minHeight: '32px', padding: '0 10px', fontSize: '11.5px', alignSelf: 'flex-start', marginTop: '2px' }}
          >
            Apply to VIN Checklists
          </button>
        </div>
      )}
    </div>
  );
}
