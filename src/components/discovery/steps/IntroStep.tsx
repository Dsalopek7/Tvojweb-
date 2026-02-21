'use client';

import React from 'react';

interface IntroStepProps {
  onNext: () => void;
}

export default function IntroStep({ onNext }: IntroStepProps) {
  return (
    <div className="step-container intro-step">
      <div className="intro-content">
        <div className="intro-icon">🚀</div>
        <h1 className="intro-title">
          Krenimo zajedno prema webu koji stvarno odgovara tvojoj djelatnosti
        </h1>
        <p className="intro-subtitle">Trebat će manje od 5 minuta</p>
        <p className="intro-desc">
          Odgovaraš na kratka pitanja, a mi ćemo osmisliti web koji savršeno odgovara tvojim potrebama.
        </p>
        <button className="btn-primary btn-large" onClick={onNext}>
          Započni ✨
        </button>
      </div>
    </div>
  );
}
