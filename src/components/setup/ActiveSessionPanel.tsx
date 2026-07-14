import type { VehicleInfo, ChecklistItem } from '../../lib/storage';
import { ArrowRight } from 'lucide-react';

interface ActiveSessionPanelProps {
  vehicle: VehicleInfo;
  items: Record<string, ChecklistItem>;
  onResume: () => void;
  onStartFresh: () => void;
}

export default function ActiveSessionPanel({ vehicle, items, onResume, onStartFresh }: ActiveSessionPanelProps) {
  const completedCount = Object.values(items).filter(i => i.status !== 'pending').length;
  const totalCount = Object.values(items).length;
  const percent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="page-container page-container-narrow">
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <span className="caption-uppercase" style={{ color: 'var(--color-primary)' }}>PDI Assistant</span>
        <h1 className="display-lg" style={{ color: 'var(--color-ink)', marginTop: 'var(--spacing-xxs)', marginBottom: 'var(--spacing-xs)' }}>
          Active Session Found
        </h1>
        <p className="body-md" style={{ color: 'var(--color-muted)' }}>
          You have an inspection in progress. Would you like to resume or start a new one?
        </p>
      </div>

      <div id="active-session-card" className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--color-hairline)', paddingBottom: 'var(--spacing-base)' }}>
          <div style={{ textAlign: 'left' }}>
            <h3 className="title-md" style={{ color: 'var(--color-ink)', marginBottom: '4px' }}>
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="body-sm" style={{ color: 'var(--color-muted)' }}>
              {vehicle.isEV ? '⚡ Electric Vehicle' : '⛽ Gasoline / Hybrid'}
              {vehicle.vin ? ` • VIN: ${vehicle.vin}` : ''}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="caption-uppercase" style={{ color: 'var(--color-ink)' }}>Progress</span>
            <div className="title-md" style={{ color: 'var(--color-primary)', marginTop: '4px' }}>{percent}%</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
          <div style={{ height: '6px', backgroundColor: 'var(--color-hairline-soft)', borderRadius: 'var(--rounded-pill)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${percent}%`, backgroundColor: 'var(--color-primary)' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="body-sm" style={{ color: 'var(--color-muted)' }}>{completedCount} of {totalCount} items completed</span>
          </div>
        </div>

        <div className="button-group-responsive" style={{ marginTop: 'var(--spacing-xs)' }}>
          <button className="button-primary" style={{ flex: 1.5, gap: '8px' }} onClick={onResume}>
            <span>Resume Inspection</span>
            <ArrowRight size={16} />
          </button>
          <button className="button-secondary" style={{ flex: 1 }} onClick={onStartFresh}>
            Start Fresh
          </button>
        </div>
      </div>
    </div>
  );
}
