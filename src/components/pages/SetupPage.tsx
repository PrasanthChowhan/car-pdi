import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspectionStore } from '../../store/useInspectionStore';
import { CHECKLIST_TEMPLATES } from '../../lib/checklistData';
import type { ChecklistItem } from '../../lib/storage';
import LoadingSpinner from '../common/LoadingSpinner';
import ActiveSessionPanel from '../setup/ActiveSessionPanel';
import SetupForm from '../setup/SetupForm';

export default function SetupPage() {
  const navigate = useNavigate();
  const { vehicle, items, isHydrated, setVehicle, setItems, resetInspection, hydrateStore } = useInspectionStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    hydrateStore();
  }, [hydrateStore]);

  const handleStartFresh = async () => {
    const confirm = window.confirm('Are you sure you want to start a fresh inspection? All unsaved current progress will be lost.');
    if (confirm) {
      await resetInspection();
    }
  };

  const handleSetupSubmit = (data: { make: string; model: string; vin: string; isEV: boolean }) => {
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
  };

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
    <SetupForm
      onSubmit={handleSetupSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
