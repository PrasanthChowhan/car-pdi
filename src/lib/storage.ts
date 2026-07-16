import { createStore, get, set, del, keys, clear } from 'idb-keyval';

// Create custom stores to keep AppState and heavy Blobs isolated
const stateStore = createStore('pdi-db-v2', 'app-state');
const blobStore = createStore('pdi-blob-db', 'image-blobs');

export interface VehicleInfo {
  make: string;
  model: string;
  vin: string;
  isEV: boolean;
}

export interface ChecklistItem {
  id: string;
  categoryId: string;
  label: string;
  status: 'pending' | 'pass' | 'flagged';
  note?: string;
  photoId?: string; // UUID referencing the Blob in blobStore
}

export interface AppState {
  version: number;
  vehicle: VehicleInfo | null;
  items: Record<string, ChecklistItem>;
  overviewPhotos?: Record<string, string>; // Maps view ID to photoId (UUID in blobStore)
  metadata?: Record<string, string>;       // Maps metadata ID to string value (e.g. dealerName, signatures)
  hasSeenTutorial?: boolean;
  hasDismissedChecklistHint?: boolean;
  hasDismissedTyreHint?: boolean;
  isDemoMode?: boolean;
}

const STATE_KEY = 'pdi_app_state';

// AppState IndexedDB Wrappers
export async function saveAppState(state: AppState): Promise<void> {
  try {
    await set(STATE_KEY, state, stateStore);
  } catch (error: any) {
    console.error('Failed to save app state to IndexedDB', error);
    if (error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded! Inspection progress cannot be saved. Please free up browser storage.');
    }
    throw error;
  }
}

export async function loadAppState(): Promise<AppState | null> {
  try {
    return await get<AppState>(STATE_KEY, stateStore) || null;
  } catch (error) {
    console.error('Failed to load app state from IndexedDB', error);
    return null;
  }
}

export async function clearAppState(): Promise<void> {
  try {
    await del(STATE_KEY, stateStore);
  } catch (error) {
    console.error('Failed to clear app state from IndexedDB', error);
  }
}

// Blob Storage Wrappers (Eager and decoupled)
export async function saveImageBlob(id: string, blob: Blob): Promise<void> {
  try {
    await set(id, blob, blobStore);
  } catch (error: any) {
    console.error('Failed to save image blob to IndexedDB', error);
    if (error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded! Please complete inspection or export data.');
    }
    throw error;
  }
}

export async function loadImageBlob(id: string): Promise<Blob | null> {
  try {
    return await get<Blob>(id, blobStore) || null;
  } catch (error) {
    console.error('Failed to load image blob from IndexedDB', error);
    return null;
  }
}

export async function deleteImageBlob(id: string): Promise<void> {
  try {
    await del(id, blobStore);
  } catch (error) {
    console.error('Failed to delete image blob from IndexedDB', error);
  }
}

export async function getAllBlobKeys(): Promise<string[]> {
  try {
    return await keys(blobStore) as string[];
  } catch (error) {
    console.error('Failed to get all image blob keys', error);
    return [];
  }
}

export async function clearAllBlobs(): Promise<void> {
  try {
    await clear(blobStore);
  } catch (error) {
    console.error('Failed to clear all image blobs', error);
  }
}
