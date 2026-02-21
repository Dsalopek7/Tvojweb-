'use client';

import React, { useState } from 'react';
import { MOOD_OPTIONS } from '@/lib/discovery/types';

interface MoodStepProps {
  value: string;
  onNext: (mood: string) => void;
  onBack: () => void;
}

export default function MoodStep({ value, onNext, onBack }: MoodStepProps) {
  const [selected, setSelected] = useState(value);

  return (
    <div className="step-container">
      <h2 className="step-title">Kakvu atmosferu želiš?</h2>
      <p className="step-desc">Kako bi se posjetitelji trebali osjećati</p>

      <div className="cards-grid cards-grid-lg">
        {MOOD_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            className={`card-option card-with-desc ${selected === opt.id ? 'card-selected' : ''}`}
            onClick={() => setSelected(opt.id)}
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
          disabled={!selected}
        >
          Dalje
        </button>
      </div>
    </div>
  );
}
