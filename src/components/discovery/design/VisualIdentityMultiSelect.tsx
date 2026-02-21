'use client';

import React, { useState } from 'react';
import type {
  VisualStyle,
  VisualMood,
  ColorPalette,
  DesignVisualIdentity,
} from '@/lib/discovery/types/design';

// ── Option data ────────────────────────────────────────────────────

const STYLE_ITEMS: { id: VisualStyle; label: string; emoji: string }[] = [
  { id: 'modern', label: 'Moderan', emoji: '🔷' },
  { id: 'minimal', label: 'Minimalan', emoji: '◻️' },
  { id: 'playful', label: 'Igriv', emoji: '🎨' },
  { id: 'elegant', label: 'Elegantan', emoji: '✨' },
  { id: 'professional', label: 'Profesionalan', emoji: '💼' },
  { id: 'bold', label: 'Hrabar', emoji: '🔥' },
];

const MOOD_ITEMS: { id: VisualMood; label: string; emoji: string }[] = [
  { id: 'calm', label: 'Smiren', emoji: '🕊️' },
  { id: 'energetic', label: 'Energičan', emoji: '⚡' },
  { id: 'friendly', label: 'Prijateljski', emoji: '🤝' },
  { id: 'premium', label: 'Premium', emoji: '💎' },
  { id: 'neutral', label: 'Neutralan', emoji: '⚖️' },
];

const PALETTE_ITEMS: {
  id: ColorPalette;
  label: string;
  colors: string[];
}[] = [
  { id: 'blue_professional', label: 'Plava profesionalna', colors: ['#1e40af', '#3b82f6', '#dbeafe'] },
  { id: 'purple_modern', label: 'Ljubičasta moderna', colors: ['#5b21b6', '#8b5cf6', '#ede9fe'] },
  { id: 'green_natural', label: 'Zelena prirodna', colors: ['#166534', '#22c55e', '#dcfce7'] },
  { id: 'neutral_elegant', label: 'Neutralna elegantna', colors: ['#1f2937', '#6b7280', '#f3f4f6'] },
  { id: 'warm_friendly', label: 'Topla prijateljska', colors: ['#9a3412', '#f97316', '#fff7ed'] },
];

const MAX_MULTI = 3;

// ── Props ──────────────────────────────────────────────────────────

interface VisualIdentityMultiSelectProps {
  value?: DesignVisualIdentity;
  onNext: (identity: DesignVisualIdentity) => void;
  onBack: () => void;
}

// ── Component ──────────────────────────────────────────────────────

export default function VisualIdentityMultiSelect({
  value,
  onNext,
  onBack,
}: VisualIdentityMultiSelectProps) {
  const [styles, setStyles] = useState<VisualStyle[]>(value?.styles ?? []);
  const [moods, setMoods] = useState<VisualMood[]>(value?.moods ?? []);
  const [palette, setPalette] = useState<string>(value?.palette ?? '');

  const toggleStyle = (id: VisualStyle) => {
    setStyles((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : prev.length < MAX_MULTI
          ? [...prev, id]
          : prev
    );
  };

  const toggleMood = (id: VisualMood) => {
    setMoods((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : prev.length < MAX_MULTI
          ? [...prev, id]
          : prev
    );
  };

  const canProceed = styles.length > 0 && moods.length > 0 && palette !== '';

  const handleNext = () => {
    if (!canProceed || palette === '') return;
    onNext({ styles, moods, palette: palette as ColorPalette });
  };

  return (
    <div className="step-container">
      <h2 className="step-title">Dizajnerski identitet</h2>
      <p className="step-desc">Odaberi do 3 stila, do 3 dojma i jednu paletu boja</p>

      {/* Styles — multi-select */}
      <div className="section-label">
        Vizualni stil <span className="selection-counter">{styles.length}/{MAX_MULTI}</span>
      </div>
      <div className="cards-grid cards-grid-lg">
        {STYLE_ITEMS.map((opt) => (
          <button
            key={opt.id}
            className={`card-option ${styles.includes(opt.id) ? 'card-selected' : ''}`}
            onClick={() => toggleStyle(opt.id)}
          >
            <span className="card-emoji">{opt.emoji}</span>
            <span className="card-label">{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Moods — multi-select */}
      <div className="section-label">
        Dojam <span className="selection-counter">{moods.length}/{MAX_MULTI}</span>
      </div>
      <div className="cards-grid cards-grid-lg">
        {MOOD_ITEMS.map((opt) => (
          <button
            key={opt.id}
            className={`card-option ${moods.includes(opt.id) ? 'card-selected' : ''}`}
            onClick={() => toggleMood(opt.id)}
          >
            <span className="card-emoji">{opt.emoji}</span>
            <span className="card-label">{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Palette — single select */}
      <div className="section-label">Paleta boja</div>
      <div className="cards-grid">
        {PALETTE_ITEMS.map((opt) => (
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
          </button>
        ))}
      </div>

      <div className="step-nav">
        <button className="btn-secondary" onClick={onBack}>Natrag</button>
        <button className="btn-primary" onClick={handleNext} disabled={!canProceed}>
          Dalje
        </button>
      </div>
    </div>
  );
}
