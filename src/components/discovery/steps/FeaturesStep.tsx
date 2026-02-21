'use client';

import React, { useState } from 'react';
import { FEATURE_OPTIONS } from '@/lib/discovery/types';

interface FeaturesStepProps {
  value: string[];
  onNext: (features: string[]) => void;
  onBack: () => void;
}

export default function FeaturesStep({ value, onNext, onBack }: FeaturesStepProps) {
  const [selected, setSelected] = useState<string[]>(value);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="step-container">
      <h2 className="step-title">Koje funkcionalnosti trebaš?</h2>
      <p className="step-desc">Odaberi sve što ti treba — možeš dodati kasnije</p>

      <div className="cards-grid">
        {FEATURE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            className={`card-option card-with-desc ${selected.includes(opt.id) ? 'card-selected' : ''}`}
            onClick={() => toggle(opt.id)}
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
          onClick={() => onNext(selected)}
          disabled={selected.length === 0}
        >
          Dalje
        </button>
      </div>
    </div>
  );
}
