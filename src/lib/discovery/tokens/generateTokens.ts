import type { Ds7UiTokens } from './types';
import type { DiscoveryCanonicalModel } from '../types';
import { PALETTES } from './palettes';

/**
 * Deterministic token generator.
 * Same paletteId + variantId + spacing + contrast → always same tokens.
 */
export function generateTokens(params: {
  paletteId: string;
  variantId: 'A' | 'B' | 'C';
  spacing: 'compact' | 'balanced' | 'spacious';
  contrast: 'low' | 'medium' | 'high';
}): Ds7UiTokens {
  const colors = PALETTES[params.paletteId] ?? PALETTES.blue_professional;

  const radius =
    params.variantId === 'A'
      ? { sm: '10px', md: '14px', lg: '18px', xl: '24px' }
      : params.variantId === 'B'
        ? { sm: '10px', md: '16px', lg: '20px', xl: '26px' }
        : { sm: '12px', md: '18px', lg: '22px', xl: '28px' };

  const shadow =
    params.contrast === 'low'
      ? {
          sm: '0 6px 16px rgba(0,0,0,0.06)',
          md: '0 12px 30px rgba(0,0,0,0.08)',
          lg: '0 18px 48px rgba(0,0,0,0.10)',
        }
      : params.contrast === 'medium'
        ? {
            sm: '0 8px 18px rgba(0,0,0,0.08)',
            md: '0 14px 34px rgba(0,0,0,0.10)',
            lg: '0 22px 56px rgba(0,0,0,0.12)',
          }
        : {
            sm: '0 10px 20px rgba(0,0,0,0.10)',
            md: '0 18px 42px rgba(0,0,0,0.12)',
            lg: '0 28px 70px rgba(0,0,0,0.14)',
          };

  const spacing =
    params.spacing === 'compact'
      ? { cardPadding: '14px', sectionGap: '20px', containerMaxWidth: '960px' }
      : params.spacing === 'balanced'
        ? { cardPadding: '18px', sectionGap: '28px', containerMaxWidth: '1040px' }
        : { cardPadding: '22px', sectionGap: '36px', containerMaxWidth: '1120px' };

  const typography = {
    fontSans: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Inter, Arial',
    headingWeight: params.variantId === 'A' ? 650 : params.variantId === 'B' ? 700 : 750,
    bodyWeight: 450,
    letterSpacing: params.variantId === 'A' ? '-0.01em' : '-0.02em',
  };

  const glass = {
    bg: 'rgba(255,255,255,0.70)',
    border: 'rgba(255,255,255,0.35)',
    blur: '18px',
  };

  return {
    paletteId: params.paletteId,
    variantId: params.variantId,
    colors,
    radius,
    shadow,
    spacing,
    typography,
    glass,
  };
}

/**
 * Ensures tokens are correctly derived from the Canonical Model.
 * Spacing and Contrast are derived based on the selected Design Variant.
 */
export function ensureCanonicalTokens(model: DiscoveryCanonicalModel): Ds7UiTokens {
  const variant = model.answers.designDirection.selectedVariant;

  // Derive presets based on variant
  const spacing: 'compact' | 'balanced' | 'spacious' =
    variant === 'A' ? 'compact' : variant === 'B' ? 'balanced' : 'spacious';

  const contrast: 'low' | 'medium' | 'high' =
    variant === 'A' ? 'low' : variant === 'B' ? 'medium' : 'high';

  return generateTokens({
    paletteId: model.answers.visualIdentity.palette,
    variantId: variant,
    spacing,
    contrast,
  });
}
