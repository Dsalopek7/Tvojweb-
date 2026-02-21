import type { DesignVariant, DesignVisualIdentity } from '../types/design';

/**
 * Deterministic design variant generator.
 * Produces exactly 3 variants from the user's visual identity selections.
 * No randomness — same input always yields same output.
 */
export function generateVariants(identity: DesignVisualIdentity): DesignVariant[] {
  return [
    {
      id: 'A',
      name: 'Minimal',
      styles: identity.styles,
      moods: identity.moods,
      palette: identity.palette,
      contrast: 'low',
      spacing: 'spacious',
    },
    {
      id: 'B',
      name: 'Balanced',
      styles: identity.styles,
      moods: identity.moods,
      palette: identity.palette,
      contrast: 'medium',
      spacing: 'balanced',
    },
    {
      id: 'C',
      name: 'Bold',
      styles: identity.styles,
      moods: identity.moods,
      palette: identity.palette,
      contrast: 'high',
      spacing: 'compact',
    },
  ];
}
