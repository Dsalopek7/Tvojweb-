import type { DiscoveryCanonicalModel } from '../types';
import type { StorageAdapter } from './StorageAdapter';
import { supabase } from '@/lib/supabase';
import { normalizeDiscoveryModel } from '../canonical/normalizeDiscoveryModel';
import { ensureCanonicalTokens } from '../tokens/generateTokens';

/**
 * Supabase-backed storage adapter.
 * Stores the full DiscoveryCanonicalModel as a JSONB document in `discovery_sessions`.
 * Implements AIP-007 Normalization Pipeline.
 */
export class SupabaseAdapter implements StorageAdapter {
  async save(session: DiscoveryCanonicalModel): Promise<void> {
    // 1. Normalize before save (defense in depth)
    const canonical = normalizeDiscoveryModel(session);

    const { error } = await supabase
      .from('discovery_sessions')
      .upsert(
        {
          id: canonical.id,
          data: canonical,
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.error('[SupabaseAdapter] save error:', error.message);
      throw new Error(`Failed to save session: ${error.message}`);
    }
  }

  async load(id: string): Promise<DiscoveryCanonicalModel | null> {
    const { data, error } = await supabase
      .from('discovery_sessions')
      .select('data')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[SupabaseAdapter] load error:', error.message);
      return null;
    }

    if (!data || !data.data) return null;

    // 2. Normalize on read & Regenerate tokens
    // This ensures legacy records are upgraded on the fly.
    const raw = data.data;
    const normalized = normalizeDiscoveryModel(raw);
    
    // Ensure tokens are always derivatively correct
    normalized.tokens = ensureCanonicalTokens(normalized);

    return normalized;
  }

  async clear(id: string): Promise<void> {
    const { error } = await supabase
      .from('discovery_sessions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[SupabaseAdapter] clear error:', error.message);
    }
  }
}
