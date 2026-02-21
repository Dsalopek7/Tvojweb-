import type { DiscoveryCanonicalModel } from '../types';
import { normalizeDiscoveryModel } from './normalizeDiscoveryModel';

/**
 * Utility to migrate legacy discovery records to the Canonical Model format.
 * This can be used for batch migrations or one-off upgrades.
 */
export function migrateLegacyDiscoveryModel(legacyData: unknown): DiscoveryCanonicalModel {
  // We leverage the existing normalization pipeline which is designed
  // to be defensive against various legacy formats.
  return normalizeDiscoveryModel(legacyData as Record<string, unknown>);
}

/**
 * Example usage for batch migration:
 * 
 * async function migrateAll(supabase: any) {
 *   const { data } = await supabase.from('discovery_sessions').select('*');
 *   for (const row of data) {
 *     const migrated = migrateLegacyDiscoveryModel(row.data);
 *     await supabase.from('discovery_sessions').update({ data: migrated }).eq('id', row.id);
 *   }
 * }
 */
