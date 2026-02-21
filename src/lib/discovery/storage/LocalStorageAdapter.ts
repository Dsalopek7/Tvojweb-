import type { DiscoverySession } from '../types';
import type { StorageAdapter } from './StorageAdapter';

const KEY_PREFIX = 'ds7_discovery_';

/**
 * Probe-mode storage using browser localStorage.
 * Same interface as future SupabaseAdapter.
 */
export class LocalStorageAdapter implements StorageAdapter {
  private key(id: string): string {
    return `${KEY_PREFIX}${id}`;
  }

  async save(session: DiscoverySession): Promise<void> {
    if (typeof window === 'undefined') return;
    const data = JSON.stringify(session);
    window.localStorage.setItem(this.key(session.id), data);
  }

  async load(id: string): Promise<DiscoverySession | null> {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(this.key(id));
    if (!raw) return null;
    try {
      return JSON.parse(raw) as DiscoverySession;
    } catch {
      return null;
    }
  }

  async clear(id: string): Promise<void> {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(this.key(id));
  }
}
