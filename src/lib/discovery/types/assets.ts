// ─── DS7 Discovery Engine — Asset Type Definitions ──────────────────────

export type AssetType = 'logo' | 'photo';

export interface DiscoveryAsset {
  id: string;
  sessionId: string;
  type: AssetType;
  name: string;
  mimeType: string;
  size: number;
  dataUrl: string;
  createdAt: number;
}

export interface DiscoveryAssetsState {
  logo?: DiscoveryAsset;
  photos: DiscoveryAsset[];
}
