import type { DiscoveryAsset } from '../types/assets';
import type { DiscoveryAssetsState } from '../types/assets';
import { IndexedDBAdapter } from '../storage/IndexedDBAdapter';

// TODO: Replace with SupabaseStorageAdapter when production-ready
const storage = new IndexedDBAdapter();

export async function saveLogo(asset: DiscoveryAsset): Promise<void> {
  asset.type = 'logo';
  await storage.saveAsset(asset);
}

export async function savePhoto(asset: DiscoveryAsset): Promise<void> {
  asset.type = 'photo';
  await storage.saveAsset(asset);
}

export async function loadAssets(sessionId: string): Promise<DiscoveryAssetsState> {
  const assets = await storage.getAssets(sessionId);
  const logo = assets.find((a) => a.type === 'logo');
  const photos = assets.filter((a) => a.type === 'photo');
  return { logo, photos };
}

export async function deleteAsset(assetId: string): Promise<void> {
  await storage.deleteAsset(assetId);
}
