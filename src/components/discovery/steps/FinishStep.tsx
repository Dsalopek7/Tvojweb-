'use client';

import React, { useState } from 'react';
import type { DiscoverySession } from '@/lib/discovery/types';
import {
  GOAL_OPTIONS,
  STYLE_OPTIONS,
  MOOD_OPTIONS,
  FEATURE_OPTIONS,
  PALETTE_OPTIONS,
  EMOTIONAL_TONE_OPTIONS,
} from '@/lib/discovery/types';
import { downloadSessionJSON, copySessionToClipboard, sendSessionEmail } from '@/lib/discovery/serializer';

interface FinishStepProps {
  session: DiscoverySession;
  onUpload?: () => void;
}

function labelFor(options: readonly { id: string; label: string }[], id: string): string {
  return options.find((o) => o.id === id)?.label ?? id;
}

export default function FinishStep({ session, onUpload }: FinishStepProps) {
  const [copied, setCopied] = useState(false);
  const [emailState, setEmailState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const { answers, inference } = session;

  const handleCopy = async () => {
    const ok = await copySessionToClipboard(session);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEmail = async () => {
    const to = session.email;
    if (!to) {
      alert('Nema unesene email adrese.');
      return;
    }
    setEmailState('sending');
    const result = await sendSessionEmail(session, to);
    if (result.success) {
      setEmailState('sent');
      setTimeout(() => setEmailState('idle'), 3000);
    } else {
      setEmailState('error');
      alert(result.message || 'Greška pri slanju emaila');
      setTimeout(() => setEmailState('idle'), 2000);
    }
  };

  const emailLabel = {
    idle: '✉️ Pošalji na email',
    sending: '⏳ Šaljem...',
    sent: '✓ Poslano!',
    error: '✗ Greška',
  }[emailState];

  const complexityLabel: Record<string, string> = {
    low: '🟢 Jednostavan',
    medium: '🟡 Srednji',
    high: '🔴 Složen',
  };

  return (
    <div className="step-container finish-step">
      <div className="finish-icon">🎉</div>
      <h2 className="step-title">Gotovo! Hvala ti.</h2>
      <p className="step-desc">Evo kratkog pregleda tvojeg budućeg weba</p>

      <div className="summary-card">
        <div className="summary-row">
          <span className="summary-label">Djelatnost</span>
          <span className="summary-value">{answers.industry}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Ciljevi</span>
          <span className="summary-value">
            {answers.goals.map((g) => labelFor(GOAL_OPTIONS, g)).join(', ')}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Stil</span>
          <span className="summary-value">{labelFor(STYLE_OPTIONS, answers.style)}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Paleta boja</span>
          <span className="summary-value">{labelFor(PALETTE_OPTIONS, answers.visual_identity?.color_palette ?? '')}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Emocionalni ton</span>
          <span className="summary-value">{labelFor(EMOTIONAL_TONE_OPTIONS, answers.visual_identity?.emotional_tone ?? '')}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Atmosfera</span>
          <span className="summary-value">{labelFor(MOOD_OPTIONS, answers.mood)}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Funkcionalnosti</span>
          <span className="summary-value">
            {answers.features.map((f) => labelFor(FEATURE_OPTIONS, f)).join(', ')}
          </span>
        </div>

        {answers.notes && (
          <div className="summary-row">
            <span className="summary-label">Napomene</span>
            <span className="summary-value">{answers.notes}</span>
          </div>
        )}

        {inference && (
          <>
            <hr className="summary-divider" />
            <div className="summary-row">
              <span className="summary-label">Složenost</span>
              <span className="summary-value">
                {complexityLabel[inference.site_complexity] ?? inference.site_complexity}
              </span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Preporučeni pristup</span>
              <span className="summary-value">{inference.recommended_stack}</span>
            </div>
          </>
        )}
      </div>

      <div className="finish-actions">
        <button className="btn-primary" onClick={() => downloadSessionJSON(session)}>
          📥 Preuzmi JSON
        </button>
        <button className="btn-secondary" onClick={handleCopy}>
          {copied ? '✓ Kopirano!' : '📋 Kopiraj u clipboard'}
        </button>
        <button
          className="btn-ghost"
          onClick={handleEmail}
          disabled={emailState === 'sending'}
        >
          {emailLabel}
        </button>
        {onUpload && (
          <button className="btn-secondary" onClick={onUpload}>
            📎 Učitaj materijale
          </button>
        )}
      </div>
    </div>
  );
}
