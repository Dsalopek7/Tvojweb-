'use client';

import React, { useState } from 'react';

interface ReferencesStepProps {
  value: string[];
  onNext: (refs: string[]) => void;
  onBack: () => void;
}

export default function ReferencesStep({ value, onNext, onBack }: ReferencesStepProps) {
  const [refs, setRefs] = useState<string[]>(value.length > 0 ? value : ['']);

  const update = (index: number, val: string) => {
    const next = [...refs];
    next[index] = val;
    setRefs(next);
  };

  const addRow = () => {
    if (refs.length < 5) setRefs([...refs, '']);
  };

  const removeRow = (index: number) => {
    setRefs(refs.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    const validRefs = refs.map((r) => r.trim()).filter(Boolean);
    onNext(validRefs);
  };

  return (
    <div className="step-container">
      <h2 className="step-title">Imaš li web stranice koje ti se sviđaju?</h2>
      <p className="step-desc">Potpuno opcionalno — pomogni nam da razumijemo tvoj ukus</p>

      <div className="references-list">
        {refs.map((ref, i) => (
          <div key={i} className="reference-row">
            <input
              type="url"
              className="text-input"
              placeholder="https://primjer.com"
              value={ref}
              onChange={(e) => update(i, e.target.value)}
            />
            {refs.length > 1 && (
              <button
                className="btn-icon"
                onClick={() => removeRow(i)}
                aria-label="Ukloni"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {refs.length < 5 && (
          <button className="btn-ghost" onClick={addRow}>
            + Dodaj još jednu
          </button>
        )}
      </div>

      <div className="step-nav">
        <button className="btn-secondary" onClick={onBack}>Natrag</button>
        <button className="btn-primary" onClick={handleNext}>
          Dalje
        </button>
      </div>
    </div>
  );
}
