import type { Ds7UiTokens } from './types';

/**
 * Applies design tokens as CSS custom properties on :root.
 * This makes them consumable by Tailwind arbitrary values:
 *   bg-[var(--ds7-bg)], text-[var(--ds7-text)], etc.
 */
export function applyTokensToDOM(tokens: Ds7UiTokens): void {
  const root = document.documentElement;

  // Colors
  root.style.setProperty('--ds7-bg', tokens.colors.bg);
  root.style.setProperty('--ds7-surface', tokens.colors.surface);
  root.style.setProperty('--ds7-surface2', tokens.colors.surface2);
  root.style.setProperty('--ds7-text', tokens.colors.text);
  root.style.setProperty('--ds7-text-muted', tokens.colors.textMuted);
  root.style.setProperty('--ds7-border', tokens.colors.border);
  root.style.setProperty('--ds7-primary', tokens.colors.primary);
  root.style.setProperty('--ds7-primary-hover', tokens.colors.primaryHover);
  root.style.setProperty('--ds7-accent', tokens.colors.accent);

  // Radius
  root.style.setProperty('--ds7-r-sm', tokens.radius.sm);
  root.style.setProperty('--ds7-r-md', tokens.radius.md);
  root.style.setProperty('--ds7-r-lg', tokens.radius.lg);
  root.style.setProperty('--ds7-r-xl', tokens.radius.xl);

  // Shadow
  root.style.setProperty('--ds7-sh-sm', tokens.shadow.sm);
  root.style.setProperty('--ds7-sh-md', tokens.shadow.md);
  root.style.setProperty('--ds7-sh-lg', tokens.shadow.lg);

  // Spacing
  root.style.setProperty('--ds7-card-pad', tokens.spacing.cardPadding);
  root.style.setProperty('--ds7-section-gap', tokens.spacing.sectionGap);
  root.style.setProperty('--ds7-container-max', tokens.spacing.containerMaxWidth);

  // Typography
  root.style.setProperty('--ds7-font-sans', tokens.typography.fontSans);
  root.style.setProperty('--ds7-heading-w', String(tokens.typography.headingWeight));
  root.style.setProperty('--ds7-body-w', String(tokens.typography.bodyWeight));
  root.style.setProperty('--ds7-letterspace', tokens.typography.letterSpacing);

  // Glass
  root.style.setProperty('--ds7-glass-bg', tokens.glass.bg);
  root.style.setProperty('--ds7-glass-border', tokens.glass.border);
  root.style.setProperty('--ds7-glass-blur', tokens.glass.blur);
}
