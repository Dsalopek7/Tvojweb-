'use client';

import React from 'react';
import type { DesignVariant, ColorPalette } from '@/lib/discovery/types/design';

// ── Palette color maps ─────────────────────────────────────────────

const PALETTE_COLORS: Record<ColorPalette, { primary: string; primaryHover: string; bg: string; surface: string; surface2: string; text: string; muted: string; border: string }> = {
  blue_professional: { primary: '#3b82f6', primaryHover: '#2563eb', bg: '#0f172a', surface: '#1e293b', surface2: '#273548', text: '#e2e8f0', muted: '#94a3b8', border: '#334155' },
  purple_modern:     { primary: '#8b5cf6', primaryHover: '#7c3aed', bg: '#0f0a1e', surface: '#1a1333', surface2: '#251d42', text: '#e2e8f0', muted: '#a78bfa', border: '#2e2554' },
  green_natural:     { primary: '#22c55e', primaryHover: '#16a34a', bg: '#0a1a0f', surface: '#132a1b', surface2: '#1a3824', text: '#dcfce7', muted: '#86efac', border: '#1e4d2b' },
  neutral_elegant:   { primary: '#9ca3af', primaryHover: '#6b7280', bg: '#111827', surface: '#1f2937', surface2: '#283343', text: '#f3f4f6', muted: '#9ca3af', border: '#374151' },
  warm_friendly:     { primary: '#f97316', primaryHover: '#ea580c', bg: '#1a0f05', surface: '#2a1a0d', surface2: '#3a2515', text: '#fff7ed', muted: '#fdba74', border: '#42301a' },
};

const SPACING_MAP = { compact: '6px', balanced: '10px', spacious: '14px' } as const;
const RADIUS_MAP  = { compact: '6px', balanced: '10px', spacious: '14px' } as const;

// ── Props ──────────────────────────────────────────────────────────

interface MockupPreviewProps {
  variant: DesignVariant;
  selected: boolean;
  recommended?: boolean;
  description?: string;
  onSelect: () => void;
}

// ── Component ──────────────────────────────────────────────────────

export default function MockupPreview({ variant, selected, recommended, description, onSelect }: MockupPreviewProps) {
  const c = PALETTE_COLORS[variant.palette];
  const gap = SPACING_MAP[variant.spacing];
  const radius = RADIUS_MAP[variant.spacing];
  const headlineW = variant.contrast === 'high' ? '80%' : variant.contrast === 'medium' ? '65%' : '50%';
  const sublineW  = variant.contrast === 'high' ? '60%' : variant.contrast === 'medium' ? '50%' : '40%';
  const ctaScale  = variant.contrast === 'high' ? 1.1 : variant.contrast === 'medium' ? 1 : 0.9;

  return (
    <button
      className={`mockup-card${selected ? ' mockup-selected' : ''}`}
      onClick={onSelect}
      style={{
        '--mp-bg': c.bg,
        '--mp-surface': c.surface,
        '--mp-surface2': c.surface2,
        '--mp-primary': c.primary,
        '--mp-primary-hover': c.primaryHover,
        '--mp-text': c.text,
        '--mp-muted': c.muted,
        '--mp-border': c.border,
        '--mp-gap': gap,
        '--mp-radius': radius,
      } as React.CSSProperties}
    >
      {/* Badges */}
      {selected && <span className="mockup-badge-selected">✓ Odabrano</span>}
      {recommended && !selected && <span className="mockup-badge-recommended">Preporučeno</span>}

      {/* Header */}
      <div className="mockup-header">
        <span className="mockup-variant-id">{variant.id}</span>
        <div className="mockup-header-text">
          <span className="mockup-variant-name">{variant.name}</span>
          {description && <span className="mockup-variant-desc">{description}</span>}
        </div>
      </div>

      {/* Realistic mini mockup */}
      <div className="mockup-preview">
        {/* Hero section */}
        <div className="mockup-hero">
          <div className="mockup-headline" style={{ width: headlineW }} />
          <div className="mockup-headline mockup-headline-2" style={{ width: `calc(${headlineW} - 15%)` }} />
          <div className="mockup-subline" style={{ width: sublineW }} />
          <div
            className="mockup-cta"
            style={{
              transform: `scale(${ctaScale})`,
              transformOrigin: 'left center',
            }}
          />
        </div>

        {/* Card grid */}
        <div className="mockup-grid">
          {[0, 1, 2].map((i) => (
            <div className="mockup-grid-card" key={i}>
              <div className="mockup-card-icon" />
              <div className="mockup-card-line" />
              <div className="mockup-card-line short" />
            </div>
          ))}
        </div>
      </div>

      {/* Meta */}
      <div className="mockup-meta">
        <span>Kontrast: {variant.contrast}</span>
        <span>Razmak: {variant.spacing}</span>
      </div>
    </button>
  );
}
