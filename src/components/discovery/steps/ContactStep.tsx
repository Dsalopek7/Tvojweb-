'use client';

import React, { useState } from 'react';

interface ContactStepProps {
  email: string;
  name: string;
  onNext: (data: { email: string; name: string }) => void;
  onBack: () => void;
}

export default function ContactStep({ email: initEmail, name: initName, onNext, onBack }: ContactStepProps) {
  const [email, setEmail] = useState(initEmail);
  const [name, setName] = useState(initName);

  const handleNext = () => {
    onNext({ email: email.trim(), name: name.trim() });
  };

  return (
    <div className="step-container">
      <h2 className="step-title">Kako te možemo kontaktirati?</h2>
      <p className="step-desc">Ostavi email da ti pošaljemo rezultate</p>

      <div className="contact-form">
        <div className="input-group">
          <label className="input-label" htmlFor="disc-email">Email adresa</label>
          <input
            id="disc-email"
            type="email"
            className="text-input"
            placeholder="tvoj@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="disc-name">Ime (opcionalno)</label>
          <input
            id="disc-name"
            type="text"
            className="text-input"
            placeholder="Tvoje ime"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      <div className="step-nav">
        <button className="btn-secondary" onClick={onBack}>Natrag</button>
        <button className="btn-primary" onClick={handleNext}>
          Završi ✓
        </button>
      </div>
    </div>
  );
}
