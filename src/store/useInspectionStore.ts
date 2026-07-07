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
  passAllCategoryItems: (categoryId: string) => void;
  resetCategoryItems: (categoryId: string) => Promise<void>;
  resetInspection: () => Promise<void>;
  hydrateStore: () => Promise<void>;
}

export const useInspectionStore = create<InspectionStore>((set, get) => ({
  vehicle: null,
  items: {},
  isHydrated: false,

  setVehicle: (vehicle) => {
    set({ vehicle });
    // Eagerly sync to IDB
    saveAppState({ vehicle, items: get().items });
  },

  setItems: (items) => {
    set({ items });
    saveAppState({ vehicle: get().vehicle, items });
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
          // Reset notes/photos if marked pass or pending
          note: status !== 'flagged' ? undefined : item.note,
          photoId: status !== 'flagged' ? undefined : item.photoId,
        },
      };

      saveAppState({ vehicle: state.vehicle, items: updatedItems });
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

      saveAppState({ vehicle: state.vehicle, items: updatedItems });
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

      saveAppState({ vehicle: state.vehicle, items: updatedItems });
      return { items: updatedItems };
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
      saveAppState({ vehicle: state.vehicle, items: updatedItems });
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
      await saveAppState({ vehicle: state.vehicle, items: updatedItems });
    }
  },

  resetInspection: async () => {
    set({ vehicle: null, items: {} });
    await clearAppState();
    await clearAllBlobs();
  },

  hydrateStore: async () => {
    const cachedState = await loadAppState();
    if (cachedState) {
      set({
        vehicle: cachedState.vehicle,
        items: cachedState.items,
        isHydrated: true,
      });
    } else {
      set({ isHydrated: true });
    }
  },
}));
