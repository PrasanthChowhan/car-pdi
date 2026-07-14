import { create } from 'zustand';
import type { AppState, VehicleInfo, ChecklistItem } from '../lib/storage';
import { saveAppState, loadAppState, clearAppState, clearAllBlobs, deleteImageBlob } from '../lib/storage';

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

export const useInspectionStore = create<InspectionStore>((set, get) => ({
  version: 1,
  vehicle: null,
  items: {},
  overviewPhotos: {},
  metadata: {},
  isHydrated: false,

  setVehicle: (vehicle) => {
    set({ vehicle });
    debouncedSaveAppState({
      version: 1,
      vehicle,
      items: get().items,
      overviewPhotos: get().overviewPhotos,
      metadata: get().metadata,
    });
  },

  setItems: (items) => {
    set({ items });
    debouncedSaveAppState({
      version: 1,
      vehicle: get().vehicle,
      items,
      overviewPhotos: get().overviewPhotos,
      metadata: get().metadata,
    });
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

      const updatedState = {
        version: 1,
        vehicle: state.vehicle,
        items: updatedItems,
        overviewPhotos: state.overviewPhotos,
        metadata: state.metadata,
      };
      debouncedSaveAppState(updatedState);
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

      const updatedState = {
        version: 1,
        vehicle: state.vehicle,
        items: updatedItems,
        overviewPhotos: state.overviewPhotos,
        metadata: state.metadata,
      };
      debouncedSaveAppState(updatedState);
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

      const updatedState = {
        version: 1,
        vehicle: state.vehicle,
        items: updatedItems,
        overviewPhotos: state.overviewPhotos,
        metadata: state.metadata,
      };
      debouncedSaveAppState(updatedState);
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

      const updatedState = {
        version: 1,
        vehicle: state.vehicle,
        items: state.items,
        overviewPhotos: updatedPhotos,
        metadata: state.metadata,
      };
      debouncedSaveAppState(updatedState);
      return { overviewPhotos: updatedPhotos };
    });
  },

  updateMetadata: (key, value) => {
    set((state) => {
      const updatedMetadata = {
        ...state.metadata,
        [key]: value,
      };

      const updatedState = {
        version: 1,
        vehicle: state.vehicle,
        items: state.items,
        overviewPhotos: state.overviewPhotos,
        metadata: updatedMetadata,
      };
      debouncedSaveAppState(updatedState);
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

      const updatedState = {
        version: 1,
        vehicle: state.vehicle,
        items: updatedItems,
        overviewPhotos: state.overviewPhotos,
        metadata: state.metadata,
      };
      debouncedSaveAppState(updatedState);
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
      await saveAppState({
        version: 1,
        vehicle: state.vehicle,
        items: updatedItems,
        overviewPhotos: state.overviewPhotos,
        metadata: state.metadata,
      });
    }
  },

  resetInspection: async () => {
    debouncedSaveAppState.cancel(); // Cancel any pending auto-saves to prevent race condition write-back
    set({ vehicle: null, items: {}, overviewPhotos: {}, metadata: {} });
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
        set({
          version: 1,
          vehicle: cachedState.vehicle,
          items: cachedState.items,
          overviewPhotos: cachedState.overviewPhotos || {},
          metadata: cachedState.metadata || {},
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
}));
