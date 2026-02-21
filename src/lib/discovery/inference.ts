import type { DiscoveryCanonicalModel, DiscoveryInference, SiteComplexity } from './types';

/**
 * Pure rule-based inference engine.
 * Deterministic, < 10 ms, no I/O.
 * Consumption: MUST use canonical model answers.
 */
export function runInference(modelAnswers: DiscoveryCanonicalModel['answers']): DiscoveryInference {
  const { features, visualIdentity, designDirection, notes } = modelAnswers;

  const hasBooking = features.includes('booking');
  const hasBlog = features.includes('blog');
  const hasShop = features.includes('shop');
  const hasGallery = features.includes('gallery');
  const hasContact = features.includes('contact');

  // ── Requirement flags ─────────────────────────────────────────────
  const requiresDatabase = hasBooking || hasBlog || hasShop;
  const requiresAdminPanel = hasBooking || hasBlog || hasShop;
  const requiresAuth = requiresAdminPanel;
  const requiresCms = hasBlog;
  const requiresBookingSystem = hasBooking;

  // ── Complexity ────────────────────────────────────────────────────
  let siteComplexity: SiteComplexity = 'low';
  if (requiresDatabase && !hasBooking) siteComplexity = 'medium';
  if (hasBooking && requiresAdminPanel) siteComplexity = 'high';
  if (hasShop) siteComplexity = 'high';

  // ── Stack recommendation ──────────────────────────────────────────
  const recommendedStack =
    siteComplexity === 'low' ? 'Next.js (static)' : 'Next.js + Supabase';

  const recommendedArchitecture =
    siteComplexity === 'low' ? 'static site' : 'web application';

  // ── Inferred components ───────────────────────────────────────────
  const inferredComponentsList: string[] = [];

  if (hasBooking) inferredComponentsList.push('calendar', 'database', 'admin_panel');
  if (hasBlog) inferredComponentsList.push('cms');
  if (hasGallery) inferredComponentsList.push('storage');
  if (hasContact) inferredComponentsList.push('email_service');
  if (hasShop) inferredComponentsList.push('payment', 'database', 'admin_panel');

  // deduplicate
  const inferredComponents = [...new Set(inferredComponentsList)];

  // ── Visual identity design tokens ──────────────────────────────────
  const recommendedDesignTokens = inferDesignTokens({
    color_palette: visualIdentity.palette,
    emotional_tone: '', // Legacy back-compat if needed, otherwise derived from palette/variant
  });

  return {
    requiresDatabase,
    requiresAuth,
    requiresAdminPanel,
    requiresBookingSystem,
    requiresCms: requiresCms,
    siteComplexity,
    recommendedStack,
    recommendedArchitecture,
    inferredComponents,
    recommendedDesignTokens,
    designVariant: designDirection.selectedVariant,
    uiContrast: designDirection.selectedVariant === 'A' ? 'low' : designDirection.selectedVariant === 'B' ? 'medium' : 'high',
    uiSpacing: designDirection.selectedVariant === 'A' ? 'compact' : designDirection.selectedVariant === 'B' ? 'balanced' : 'spacious',
    hasCustomNotes: !!notes?.trim(),
    customConstraints: notes?.trim() || undefined,
  };
}

// ── Design token inference from visual identity ──────────────────────
// This helps bridge the gap before full token generation

const PALETTE_TONE_MAP: Record<string, string> = {
  neutral: 'corporate / professional',
  warm: 'inviting / cozy',
  cool: 'trustworthy / calm',
  pastel: 'soft / gentle',
  vibrant: 'energetic / bold',
  earth: 'natural / organic',
  dark: 'luxurious / premium',
  mono: 'focused / clean',
};

function inferDesignTokens(vi: { color_palette: string; emotional_tone: string }): {
  paletteDirection: string;
  toneDirection: string;
  combinedRecommendation: string;
} {
  const paletteDirection = PALETTE_TONE_MAP[vi.color_palette] || 'custom';
  const toneDirection = 'derived from variant'; // In the canonical model, tone follows variant/palette
  const combinedRecommendation = vi.color_palette
    ? `${paletteDirection} visual base`
    : 'default';

  return { paletteDirection, toneDirection, combinedRecommendation };
}
