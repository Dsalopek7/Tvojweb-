// ─── DS7 Design Token Type Definitions ──────────────────────────────────

export type Ds7PaletteToken = {
  bg: string;
  surface: string;
  surface2: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryHover: string;
  accent: string;
  danger: string;
  success: string;
};

export type Ds7UiTokens = {
  paletteId: string;
  variantId: 'A' | 'B' | 'C';

  colors: Ds7PaletteToken;

  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  shadow: {
    sm: string;
    md: string;
    lg: string;
  };

  spacing: {
    cardPadding: string;
    sectionGap: string;
    containerMaxWidth: string;
  };

  typography: {
    fontSans: string;
    headingWeight: number;
    bodyWeight: number;
    letterSpacing: string;
  };

  glass: {
    bg: string;
    border: string;
    blur: string;
  };

  meta?: {
    notes?: string;
  };
};
