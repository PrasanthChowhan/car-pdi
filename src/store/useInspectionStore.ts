import { create } from 'zustand';
import type { AppState, VehicleInfo, ChecklistItem } from '../lib/storage';
import { saveAppState, loadAppState, clearAppState, clearAllBlobs, deleteImageBlob } from '../lib/storage';
import { CHECKLIST_TEMPLATES } from '../lib/checklistData';

interface InspectionStore extends AppState {
  isHydrated: boolean;
  setVehicle: (vehicle: VehicleInfo | null) => void;
  setItems: (items: Record<string, ChecklistItem>) => void;
  updateItemStatus: (id: string, status: ChecklistItem['status']) => void;
  updateItemNote: (id: string, note: string) => void;
  updateItemPhoto: (id: string, photoId: string | undefined) => void;
  updateOverviewPhoto: (key: string, photoId: string | undefined) => void;
  updateMetadata: (key: string, value: string) => void;
  passAllCategoryItems: (categoryId: string) => void;
  resetCategoryItems: (categoryId: string) => Promise<void>;
  resetInspection: () => Promise<void>;
  hydrateStore: () => Promise<void>;
  setHasSeenTutorial: (seen: boolean) => void;
  setHasDismissedChecklistHint: (dismissed: boolean) => void;
  setHasDismissedTyreHint: (dismissed: boolean) => void;
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  startDemoInspection: () => void;
  tutorialStep: number;
  setTutorialStep: (step: number) => void;
}

// Debounce helper to prevent excessive I/O writes during rapid user actions (like typing)
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };
  return debounced;
}

const debouncedSaveAppState = debounce((state: AppState) => {
  saveAppState(state).catch((error) => {
    console.error('Failed to auto-save app state:', error);
  });
}, 1000);

const getAppStateForSaving = (state: any): AppState => ({
  version: 1,
  vehicle: state.vehicle,
  items: state.items,
  overviewPhotos: state.overviewPhotos,
  metadata: state.metadata,
  hasSeenTutorial: state.hasSeenTutorial,
  hasDismissedChecklistHint: state.hasDismissedChecklistHint,
  hasDismissedTyreHint: state.hasDismissedTyreHint,
  isDemoMode: state.isDemoMode,
});

export const useInspectionStore = create<InspectionStore>((set, get) => ({
  version: 1,
  vehicle: null,
  items: {},
  overviewPhotos: {},
  metadata: {},
  hasSeenTutorial: undefined,
  hasDismissedChecklistHint: undefined,
  hasDismissedTyreHint: undefined,
  isDemoMode: false,
  isHydrated: false,
  tutorialStep: 0,

  setVehicle: (vehicle) => {
    set({ vehicle });
    debouncedSaveAppState(getAppStateForSaving(get()));
  },

  setItems: (items) => {
    set({ items });
    debouncedSaveAppState(getAppStateForSaving(get()));
  },

  updateItemStatus: (id, status) => {
    set((state) => {
      const item = state.items[id];
      if (!item) return state;

      const updatedItems = {
        ...state.items,
        [id]: {
          ...item,
          status,
          // Reset notes/photos only if marked back to pending
          note: status === 'pending' ? undefined : item.note,
          photoId: status === 'pending' ? undefined : item.photoId,
        },
      };

      const updatedState = { ...state, items: updatedItems };
      debouncedSaveAppState(getAppStateForSaving(updatedState));
      return { items: updatedItems };
    });
  },

  updateItemNote: (id, note) => {
    set((state) => {
      const item = state.items[id];
      if (!item) return state;

      const updatedItems = {
        ...state.items,
        [id]: { ...item, note },
      };

      const updatedState = { ...state, items: updatedItems };
      debouncedSaveAppState(getAppStateForSaving(updatedState));
      return { items: updatedItems };
    });
  },

  updateItemPhoto: (id, photoId) => {
    set((state) => {
      const item = state.items[id];
      if (!item) return state;

      const updatedItems = {
        ...state.items,
        [id]: { ...item, photoId },
      };

      const updatedState = { ...state, items: updatedItems };
      debouncedSaveAppState(getAppStateForSaving(updatedState));
      return { items: updatedItems };
    });
  },

  updateOverviewPhoto: (key, photoId) => {
    set((state) => {
      const updatedPhotos = {
        ...state.overviewPhotos,
        [key]: photoId || '',
      };
      if (!photoId) {
        delete updatedPhotos[key];
      }

      const updatedState = { ...state, overviewPhotos: updatedPhotos };
      debouncedSaveAppState(getAppStateForSaving(updatedState));
      return { overviewPhotos: updatedPhotos };
    });
  },

  updateMetadata: (key, value) => {
    set((state) => {
      const updatedMetadata = {
        ...state.metadata,
        [key]: value,
      };

      const updatedState = { ...state, metadata: updatedMetadata };
      debouncedSaveAppState(getAppStateForSaving(updatedState));
      return { metadata: updatedMetadata };
    });
  },

  passAllCategoryItems: (categoryId) => {
    set((state) => {
      const updatedItems = { ...state.items };
      let changed = false;
      Object.values(updatedItems).forEach((item) => {
        if (item.categoryId === categoryId && item.status === 'pending') {
          updatedItems[item.id] = {
            ...item,
            status: 'pass',
            note: undefined,
            photoId: undefined,
          };
          changed = true;
        }
      });
      if (!changed) return state;

      const updatedState = { ...state, items: updatedItems };
      debouncedSaveAppState(getAppStateForSaving(updatedState));
      return { items: updatedItems };
    });
  },

  resetCategoryItems: async (categoryId) => {
    const state = get();
    const updatedItems = { ...state.items };
    let changed = false;

    // Delete photo blobs for flagged items in this category
    for (const item of Object.values(updatedItems)) {
      if (item.categoryId === categoryId) {
        if (item.photoId) {
          await deleteImageBlob(item.photoId);
        }
        updatedItems[item.id] = {
          ...item,
          status: 'pending',
          note: undefined,
          photoId: undefined,
        };
        changed = true;
      }
    }

    if (changed) {
      set({ items: updatedItems });
      debouncedSaveAppState.cancel(); // Cancel any pending auto-saves
      await saveAppState(getAppStateForSaving(get()));
    }
  },

  resetInspection: async () => {
    debouncedSaveAppState.cancel(); // Cancel any pending auto-saves to prevent race condition write-back
    set({ vehicle: null, items: {}, overviewPhotos: {}, metadata: {}, hasSeenTutorial: undefined, isDemoMode: false });
    await clearAppState();
    await clearAllBlobs();
  },

  hydrateStore: async () => {
    try {
      const cachedState = await loadAppState();
      if (cachedState) {
        // Drop state if stored version is different from the code expectation
        if (cachedState.version !== 1) {
          console.warn('Hydration state version mismatch. Resetting local app state.');
          await clearAppState();
          set({ isHydrated: true });
          return;
        }
        const cleanedItems = cachedState.items ? { ...cachedState.items } : {};
        if (cleanedItems['tutorial-practice']) {
          delete cleanedItems['tutorial-practice'];
        }
        set({
          version: 1,
          vehicle: cachedState.vehicle,
          items: cleanedItems,
          overviewPhotos: cachedState.overviewPhotos || {},
          metadata: cachedState.metadata || {},
          hasSeenTutorial: cachedState.hasSeenTutorial,
          hasDismissedChecklistHint: cachedState.hasDismissedChecklistHint,
          hasDismissedTyreHint: cachedState.hasDismissedTyreHint,
          isDemoMode: cachedState.isDemoMode || false,
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
      }
    } catch (error) {
      console.error('Failed to hydrate inspection store:', error);
      set({ isHydrated: true });
    }
  },

  setHasSeenTutorial: (seen) => {
    set({ hasSeenTutorial: seen });
    saveAppState(getAppStateForSaving(get())).catch((error) => {
      console.error('Failed to save tutorial status:', error);
    });
  },

  setHasDismissedChecklistHint: (dismissed) => {
    set({ hasDismissedChecklistHint: dismissed });
    saveAppState(getAppStateForSaving(get())).catch((error) => {
      console.error('Failed to save checklist hint status:', error);
    });
  },

  setHasDismissedTyreHint: (dismissed) => {
    set({ hasDismissedTyreHint: dismissed });
    saveAppState(getAppStateForSaving(get())).catch((error) => {
      console.error('Failed to save tyre hint status:', error);
    });
  },

  setDemoMode: (enabled) => {
    set({ isDemoMode: enabled });
    saveAppState(getAppStateForSaving(get())).catch((error) => {
      console.error('Failed to save demo mode status:', error);
    });
  },

  startDemoInspection: () => {
    // Clear any existing inspection state
    debouncedSaveAppState.cancel();
    
    // Set Demo Vehicle details (Tesla Model Y)
    const demoVehicle: VehicleInfo = {
      make: 'Tesla',
      model: 'Model Y (Demo)',
      vin: 'DE1234567890MO',
      isEV: true
    };
    
    // Build initial checklist items
    const demoItems: Record<string, ChecklistItem> = {};
    
    // 1. Add all EV checklist templates
    CHECKLIST_TEMPLATES.forEach((template) => {
      // Skip ICE-specific checks
      if (template.categoryId === 'engine') {
        return;
      }
      
      demoItems[template.id] = {
        id: template.id,
        categoryId: template.categoryId,
        label: template.label,
        status: 'pending'
      };
    });
    
    // 2. Pre-pass a few items to simulate progress!
    const prePassedIds = [
      'doc-invoice-price',
      'doc-rto-fees',
      'ident-odometer',
      'ident-keys'
    ];
    
    prePassedIds.forEach((id) => {
      if (demoItems[id]) {
        demoItems[id].status = 'pass';
        demoItems[id].note = 'Verified and correct (Pre-filled Demo)';
      }
    });
    
    set({
      vehicle: demoVehicle,
      items: demoItems,
      overviewPhotos: {},
      metadata: {},
      isDemoMode: true,
      hasSeenTutorial: true // Skip welcome sheet in demo mode
    });
    
    saveAppState(getAppStateForSaving(get())).catch((error) => {
      console.error('Failed to save demo state:', error);
    });
  },

  setTutorialStep: (step) => {
    set({ tutorialStep: step });
  },
}));
