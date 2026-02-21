'use client';

import React, { useState } from 'react';
import type { Ds7UiTokens } from '@/lib/discovery/tokens/types';

interface TokenPreviewPanelProps {
  tokens: Ds7UiTokens;
}

export default function TokenPreviewPanel({ tokens }: TokenPreviewPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="token-preview-panel">
      <button
        className="token-preview-toggle"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? '▼' : '▶'} Design Tokens ({tokens.variantId} / {tokens.paletteId})
      </button>

      {open && (
        <div className="token-preview-body">
          {/* Color swatches */}
          <div className="token-section">
            <div className="token-section-title">Colors</div>
            <div className="token-swatches">
              {Object.entries(tokens.colors).map(([key, value]) => (
                <div key={key} className="token-swatch-item">
                  <span
                    className="token-swatch-dot"
                    style={{ background: value }}
                  />
                  <span className="token-swatch-label">{key}</span>
                  <span className="token-swatch-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Radius */}
          <div className="token-section">
            <div className="token-section-title">Radius</div>
            {Object.entries(tokens.radius).map(([k, v]) => (
              <div key={k} className="token-row">
                <span>{k}</span><span>{v}</span>
              </div>
            ))}
          </div>

          {/* Shadow */}
          <div className="token-section">
            <div className="token-section-title">Shadow</div>
            {Object.entries(tokens.shadow).map(([k, v]) => (
              <div key={k} className="token-row">
                <span>{k}</span><span className="token-shadow-val">{v}</span>
              </div>
            ))}
          </div>

          {/* Spacing */}
          <div className="token-section">
            <div className="token-section-title">Spacing</div>
            {Object.entries(tokens.spacing).map(([k, v]) => (
              <div key={k} className="token-row">
                <span>{k}</span><span>{v}</span>
              </div>
            ))}
          </div>

          {/* Typography */}
          <div className="token-section">
            <div className="token-section-title">Typography</div>
            <div className="token-row"><span>headingWeight</span><span>{tokens.typography.headingWeight}</span></div>
            <div className="token-row"><span>bodyWeight</span><span>{tokens.typography.bodyWeight}</span></div>
            <div className="token-row"><span>letterSpacing</span><span>{tokens.typography.letterSpacing}</span></div>
          </div>

          {/* Live sample */}
          <div className="token-section">
            <div className="token-section-title">Live Sample</div>
            <div
              className="token-live-sample"
              style={{
                background: tokens.colors.bg,
                borderRadius: tokens.radius.lg,
                boxShadow: tokens.shadow.md,
                padding: tokens.spacing.cardPadding,
                border: `1px solid ${tokens.colors.border}`,
              }}
            >
              <div
                style={{
                  color: tokens.colors.text,
                  fontWeight: tokens.typography.headingWeight,
                  letterSpacing: tokens.typography.letterSpacing,
                  marginBottom: '4px',
                }}
              >
                Heading Preview
              </div>
              <div style={{ color: tokens.colors.textMuted, fontWeight: tokens.typography.bodyWeight, fontSize: '0.85rem' }}>
                Body text preview with muted color.
              </div>
              <button
                style={{
                  marginTop: '8px',
                  background: tokens.colors.primary,
                  color: '#fff',
                  border: 'none',
                  padding: '6px 16px',
                  borderRadius: tokens.radius.sm,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'default',
                }}
              >
                CTA Button
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
