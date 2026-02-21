import type { DiscoveryCanonicalModel } from '../types';

/**
 * Abstract storage adapter interface.
 * Unified to DiscoveryCanonicalModel as per AIP-007.
 */
export interface StorageAdapter {
  save(session: DiscoveryCanonicalModel): Promise<void>;
  load(id: string): Promise<DiscoveryCanonicalModel | null>;
  clear(id: string): Promise<void>;
}
