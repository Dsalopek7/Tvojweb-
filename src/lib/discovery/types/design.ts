// ─── DS7 Discovery Engine — Design System Type Definitions ──────────────

export type VisualStyle =
  | 'modern'
  | 'minimal'
  | 'playful'
  | 'elegant'
  | 'professional'
  | 'bold';

export type VisualMood =
  | 'calm'
  | 'energetic'
  | 'friendly'
  | 'premium'
  | 'neutral';

export type ColorPalette =
  | 'blue_professional'
  | 'purple_modern'
  | 'green_natural'
  | 'neutral_elegant'
  | 'warm_friendly';

export type DesignVariantId = 'A' | 'B' | 'C';

export interface DesignVariant {
  id: DesignVariantId;
  name: string;
  styles: VisualStyle[];
  moods: VisualMood[];
  palette: ColorPalette;
  contrast: 'low' | 'medium' | 'high';
  spacing: 'compact' | 'balanced' | 'spacious';
}

export interface DesignVisualIdentity {
  styles: VisualStyle[];
  moods: VisualMood[];
  palette: ColorPalette;
}

export interface DesignDirectionState {
  variants: DesignVariant[];
  selectedVariant?: DesignVariantId;
}
