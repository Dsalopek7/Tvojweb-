'use client';

import React, { useState } from 'react';
import { INDUSTRY_QUICK_OPTIONS } from '@/lib/discovery/types';

interface IndustryStepProps {
  value: string;
  onNext: (industry: string) => void;
  onBack: () => void;
}

export default function IndustryStep({ value, onNext, onBack }: IndustryStepProps) {
  const [industry, setIndustry] = useState(value);

  const handleSelect = (label: string) => {
    setIndustry(label);
  };

  const handleContinue = () => {
    if (industry.trim()) onNext(industry.trim());
  };

  return (
    <div className="step-container">
      <h2 className="step-title">Čime se baviš?</h2>
      <p className="step-desc">Odaberi ili upiši svoju djelatnost</p>

      <div className="cards-grid">
        {INDUSTRY_QUICK_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            className={`card-option ${industry === opt.label ? 'card-selected' : ''}`}
            onClick={() => handleSelect(opt.label)}
          >
            <span className="card-emoji">{opt.emoji}</span>
            <span className="card-label">{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="input-group">
        <input
          type="text"
          className="text-input"
          placeholder="Ili upiši svoju djelatnost..."
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        />
      </div>

      <div className="step-nav">
        <button className="btn-secondary" onClick={onBack}>Natrag</button>
        <button
          className="btn-primary"
          onClick={handleContinue}
          disabled={!industry.trim()}
        >
          Dalje
        </button>
      </div>
    </div>
  );
}
