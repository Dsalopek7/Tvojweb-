'use client';

import React, { useState } from 'react';
import { STYLE_OPTIONS, PALETTE_OPTIONS, EMOTIONAL_TONE_OPTIONS } from '@/lib/discovery/types';
import type { VisualIdentity } from '@/lib/discovery/types';

interface StyleStepProps {
  value: string;
  visualIdentity: VisualIdentity;
  onNext: (data: { style: string; visual_identity: VisualIdentity }) => void;
  onBack: () => void;
}

export default function StyleStep({ value, visualIdentity, onNext, onBack }: StyleStepProps) {
  const [style, setStyle] = useState(value);
  const [palette, setPalette] = useState(visualIdentity.color_palette);
  const [tone, setTone] = useState(visualIdentity.emotional_tone);

  const canProceed = style && palette && tone;

  const handleNext = () => {
    if (!canProceed) return;
    onNext({
      style,
      visual_identity: { color_palette: palette, emotional_tone: tone },
    });
  };

  return (
    <div className="step-container">
      {/* Section 1: Visual Style */}
      <h2 className="step-title">Kakav vizualni identitet želiš?</h2>
      <p className="step-desc">Odaberi stil, boje i ton — sve na jednom mjestu</p>

      <div className="section-label">Vizualni stil</div>
      <div className="cards-grid cards-grid-lg">
        {STYLE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            className={`card-option card-with-desc ${style === opt.id ? 'card-selected' : ''}`}
            onClick={() => setStyle(opt.id)}
          >
            <span className="card-emoji">{opt.emoji}</span>
            <span className="card-label">{opt.label}</span>
            <span className="card-desc">{opt.desc}</span>
          </button>
        ))}
      </div>

      {/* Section 2: Color Palette */}
      <div className="section-label">Paleta boja</div>
      <div className="cards-grid">
        {PALETTE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            className={`card-option card-palette ${palette === opt.id ? 'card-selected' : ''}`}
            onClick={() => setPalette(opt.id)}
          >
            <div className="palette-swatches">
              {opt.colors.map((c, i) => (
                <span key={i} className="palette-swatch" style={{ background: c }} />
              ))}
            </div>
            <span className="card-label">{opt.label}</span>
            <span className="card-desc">{opt.desc}</span>
          </button>
        ))}
      </div>

      {/* Section 3: Emotional Tone */}
      <div className="section-label">Emocionalni ton</div>
      <div className="cards-grid cards-grid-lg">
        {EMOTIONAL_TONE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            className={`card-option card-with-desc ${tone === opt.id ? 'card-selected' : ''}`}
            onClick={() => setTone(opt.id)}
          >
            <span className="card-emoji">{opt.emoji}</span>
            <span className="card-label">{opt.label}</span>
            <span className="card-desc">{opt.desc}</span>
          </button>
        ))}
      </div>

      <div className="step-nav">
        <button className="btn-secondary" onClick={onBack}>Natrag</button>
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={!canProceed}
        >
          Dalje
        </button>
      </div>
    </div>
  );
}
