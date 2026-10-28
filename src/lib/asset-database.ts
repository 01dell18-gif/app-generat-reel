/**
 * Persistent Browser Database for Visual Assets & Saved Templates
 * Implements IndexedDB with localStorage fallback for seamless client-side persistence.
 */

import { AssetInputs, OutputFormat } from '@/types/design';

export type AssetCategory = 'background' | 'photo' | 'logo' | 'watermark' | 'template';

export interface SavedAsset {
  id: string;
  name: string;
  type: AssetCategory;
  dataUrl: string;
  thumbnail?: string;
  createdAt: number;
  sizeBytes?: number;
  tags?: string[];
}

export interface SavedProject {
  id: string;
  title: string;
  format: OutputFormat;
  assets: AssetInputs;
  thumbnail?: string;
  createdAt: number;
}

const DB_NAME = 'VibeGenesisDB';
const DB_VERSION = 1;
const STORE_ASSETS = 'assets_vault';
const STORE_PROJECTS = 'projects_vault';

let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_ASSETS)) {
        const assetStore = db.createObjectStore(STORE_ASSETS, { keyPath: 'id' });
        assetStore.createIndex('type', 'type', { unique: false });
        assetStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
        const projectStore = db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
        projectStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = (event: any) => {
      dbInstance = event.target.result;
      resolve(dbInstance!);
    };

    request.onerror = (event: any) => {
      reject(event.target.error || new Error('Failed to open IndexedDB'));
    };
  });
}

// ================= LOCAL STORAGE FALLBACK HELPERS =================
const LS_ASSETS_KEY = 'vg_assets_fallback_v1';
const LS_PROJECTS_KEY = 'vg_projects_fallback_v1';

function getLsAssets(): SavedAsset[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_ASSETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLsAssets(assets: SavedAsset[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_ASSETS_KEY, JSON.stringify(assets.slice(0, 30)));
  } catch (e) {
    console.warn('LocalStorage limit reached for assets fallback', e);
  }
}

// ================= PUBLIC DATABASE APIS =================

/**
 * Save an uploaded or generated asset to persistent database
 */
export async function dbSaveAsset(
  name: string,
  type: AssetCategory,
  dataUrl: string,
  tags: string[] = []
): Promise<SavedAsset> {
  const asset: SavedAsset = {
    id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    name,
    type,
    dataUrl,
    createdAt: Date.now(),
    sizeBytes: Math.round((dataUrl.length * 3) / 4),
    tags,
  };

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_ASSETS, 'readwrite');
      const store = tx.objectStore(STORE_ASSETS);
      const req = store.put(asset);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    // Fallback to localStorage
    const current = getLsAssets();
    setLsAssets([asset, ...current]);
  }

  return asset;
}

/**
 * Retrieve all saved assets from persistent database (optionally filtered by type)
 */
export async function dbGetAssets(filterType?: AssetCategory): Promise<SavedAsset[]> {
  try {
    const db = await openDB();
    const assets: SavedAsset[] = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ASSETS, 'readonly');
      const store = tx.objectStore(STORE_ASSETS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    const sorted = assets.sort((a, b) => b.createdAt - a.createdAt);
    if (filterType) {
      return sorted.filter((a) => a.type === filterType);
    }
    return sorted;
  } catch (err) {
    const assets = getLsAssets();
    const sorted = assets.sort((a, b) => b.createdAt - a.createdAt);
    if (filterType) {
      return sorted.filter((a) => a.type === filterType);
    }
    return sorted;
  }
}

/**
 * Delete an asset by its ID
 */
export async function dbDeleteAsset(id: string): Promise<boolean> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_ASSETS, 'readwrite');
      const store = tx.objectStore(STORE_ASSETS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const assets = getLsAssets().filter((a) => a.id !== id);
    setLsAssets(assets);
  }
  return true;
}

/**
 * Save an entire project/design composition state
 */
export async function dbSaveProject(
  title: string,
  format: OutputFormat,
  assets: AssetInputs,
  thumbnail?: string
): Promise<SavedProject> {
  const project: SavedProject = {
    id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    title,
    format,
    assets: JSON.parse(JSON.stringify(assets)),
    thumbnail,
    createdAt: Date.now(),
  };

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readwrite');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.put(project);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(LS_PROJECTS_KEY);
        const list = raw ? JSON.parse(raw) : [];
        localStorage.setItem(LS_PROJECTS_KEY, JSON.stringify([project, ...list]));
      } catch (e) {
        console.warn('LocalStorage limit reached for projects fallback', e);
      }
    }
  }

  return project;
}

/**
 * Retrieve all saved projects
 */
export async function dbGetProjects(): Promise<SavedProject[]> {
  try {
    const db = await openDB();
    const projects: SavedProject[] = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readonly');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
    return projects.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(LS_PROJECTS_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
    return [];
  }
}

/**
 * Delete a project by ID
 */
export async function dbDeleteProject(id: string): Promise<boolean> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readwrite');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(LS_PROJECTS_KEY);
        const list: SavedProject[] = raw ? JSON.parse(raw) : [];
        localStorage.setItem(LS_PROJECTS_KEY, JSON.stringify(list.filter((p) => p.id !== id)));
      } catch (e) {
        console.warn('LocalStorage error on deleteProject', e);
      }
    }
  }
  return true;
}
