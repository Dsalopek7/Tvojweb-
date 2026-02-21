import type { DiscoveryAsset } from '../types/assets';
import type { AssetStorageAdapter } from './AssetStorageAdapter';

const DB_NAME = 'ds7-discovery';
const STORE_NAME = 'assets';
const DB_VERSION = 1;

/**
 * IndexedDB-based asset storage for probe mode.
 * Implements AssetStorageAdapter for future Supabase swap.
 * Uses native IndexedDB API — no external dependencies.
 */
export class IndexedDBAdapter implements AssetStorageAdapter {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('sessionId', 'sessionId', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        this.dbPromise = null;
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  async saveAsset(asset: DiscoveryAsset): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(asset);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAssets(sessionId: string): Promise<DiscoveryAsset[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('sessionId');
      const request = index.getAll(sessionId);
      request.onsuccess = () => resolve(request.result as DiscoveryAsset[]);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteAsset(assetId: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(assetId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
