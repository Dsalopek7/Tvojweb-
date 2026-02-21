import type { DiscoverySession } from './types';

/**
 * Export session as downloadable JSON file.
 */
export function downloadSessionJSON(session: DiscoverySession): void {
  const json = JSON.stringify(session, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ds7-discovery-${session.id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copy session JSON to clipboard.
 */
export async function copySessionToClipboard(session: DiscoverySession): Promise<boolean> {
  const json = JSON.stringify(session, null, 2);
  try {
    await navigator.clipboard.writeText(json);
    return true;
  } catch {
    return false;
  }
}

/**
 * Send session summary to email via Supabase Edge Function.
 */
export async function sendSessionEmail(session: DiscoverySession, to: string): Promise<{ success: boolean; message?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return { success: false, message: 'Supabase URL nije konfiguriran' };
  }

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/send-discovery-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, session }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.error || 'Greška pri slanju' };
    }

    return { success: true, message: 'Email poslan!' };
  } catch {
    return { success: false, message: 'Mrežna greška' };
  }
}

