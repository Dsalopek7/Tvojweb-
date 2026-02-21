import type { DiscoveryAsset } from '../types/assets';

/**
 * Abstract asset storage adapter interface.
 * MVP: IndexedDBAdapter
 * Production: SupabaseStorageAdapter (TODO)
 */
export interface AssetStorageAdapter {
  saveAsset(asset: DiscoveryAsset): Promise<void>;
  getAssets(sessionId: string): Promise<DiscoveryAsset[]>;
  deleteAsset(assetId: string): Promise<void>;
}
