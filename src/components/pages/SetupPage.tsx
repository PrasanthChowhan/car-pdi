import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspectionStore } from '../../store/useInspectionStore';
import { CHECKLIST_TEMPLATES } from '../../lib/checklistData';
import type { ChecklistItem } from '../../lib/storage';
import LoadingSpinner from '../common/LoadingSpinner';
import ActiveSessionPanel from '../setup/ActiveSessionPanel';
import SetupForm from '../setup/SetupForm';
import { AlertTriangle } from 'lucide-react';

export default function SetupPage() {
  const navigate = useNavigate();
  const { vehicle, items, isHydrated, setVehicle, setItems, resetInspection, hydrateStore, startDemoInspection } = useInspectionStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  useEffect(() => {
    hydrateStore();
    document.title = "Start Inspection — Car PDI Checklist";
  }, [hydrateStore]);

  useEffect(() => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((estimate) => {
        const usage = estimate.usage || 0;
        const quota = estimate.quota || 1;
        const percentUsed = (usage / quota) * 100;
        const freeSpace = quota - usage;
        const fiftyMB = 50 * 1024 * 1024; // 50MB limit

        if (freeSpace < fiftyMB || percentUsed > 90) {
          const freeMB = Math.round(freeSpace / (1024 * 1024));
          setStorageWarning(`Warning: Low storage space detected! Only ${freeMB}MB of allocated browser storage is remaining. Please clean up files or complete previous inspections to prevent photo capture failures.`);
        }
      }).catch((err) => {
        console.error('Failed to estimate storage quota:', err);
      });
    }
  }, []);

  const handleStartFresh = async () => {
    const confirm = window.confirm('Are you sure you want to start a fresh inspection? All unsaved current progress will be lost.');
    if (confirm) {
      try {
        await resetInspection();
      } catch (error) {
        console.error('Failed to reset inspection:', error);
        alert('Failed to clear old inspection data from browser. Database might be locked or blocked. Please reload and try again.');
      }
    }
  };

  const handleSetupSubmit = useCallback((data: { make: string; model: string; vin: string; isEV: boolean }) => {
    setIsSubmitting(true);

    // Filter templates based on type
    const initialItems: Record<string, ChecklistItem> = {};
    CHECKLIST_TEMPLATES.forEach((template) => {
      // Skip EV specific items if vehicle is not EV
      if (template.categoryId === 'ev' && !data.isEV) {
        return;
      }
      // Skip ICE specific items if vehicle is EV
      if (template.categoryId === 'engine' && data.isEV) {
        return;
      }
      initialItems[template.id] = {
        id: template.id,
        categoryId: template.categoryId,
        label: template.label,
        status: 'pending',
      };
    });

    setVehicle({
      make: data.make,
      model: data.model,
      vin: data.vin,
      isEV: data.isEV,
    });
    setItems(initialItems);
    setIsSubmitting(false);
    navigate('/inspection');
  }, [navigate, setVehicle, setItems]);

  if (!isHydrated) {
    return <LoadingSpinner message="Loading application state..." />;
  }

  // Active session exists
  if (vehicle && Object.keys(items).length > 0) {
    return (
      <ActiveSessionPanel
        vehicle={vehicle}
        items={items}
        onResume={() => navigate('/inspection')}
        onStartFresh={handleStartFresh}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', width: '100%' }}>
      {storageWarning && (
        <div style={{
          backgroundColor: 'rgba(207, 45, 86, 0.05)',
          border: '1px solid var(--color-semantic-error)',
          padding: '12px 16px',
          borderRadius: 'var(--rounded-md)',
          textAlign: 'left',
          maxWidth: '600px',
          margin: '20px auto 0 auto',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          color: 'var(--color-semantic-error)'
        }}>
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '13.5px', fontWeight: 500 }}>{storageWarning}</span>
        </div>
      )}
      <SetupForm
        onSubmit={handleSetupSubmit}
        isSubmitting={isSubmitting}
        onTryDemo={() => {
          startDemoInspection();
          navigate('/inspection');
        }}
      />
    </div>
  );
}
