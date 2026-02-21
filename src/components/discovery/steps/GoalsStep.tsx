'use client';

import React, { useState } from 'react';
import { GOAL_OPTIONS } from '@/lib/discovery/types';

interface GoalsStepProps {
  value: string[];
  onNext: (goals: string[]) => void;
  onBack: () => void;
}

export default function GoalsStep({ value, onNext, onBack }: GoalsStepProps) {
  const [selected, setSelected] = useState<string[]>(value);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  return (
    <div className="step-container">
      <h2 className="step-title">Što želiš postići s webom?</h2>
      <p className="step-desc">Možeš odabrati više opcija</p>

      <div className="cards-grid">
        {GOAL_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            className={`card-option ${selected.includes(opt.id) ? 'card-selected' : ''}`}
            onClick={() => toggle(opt.id)}
          >
            <span className="card-emoji">{opt.emoji}</span>
            <span className="card-label">{opt.label}</span>
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
