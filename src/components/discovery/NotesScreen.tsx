'use client';

import React, { useState, useEffect, useRef } from 'react';

interface NotesScreenProps {
  value?: string;
  onNext: (notes: string) => void;
  onBack: () => void;
}

const MAX_CHARS = 2000;

const EXAMPLES = [
  'npr. želim minimalistički stil',
  'npr. ciljana publika su roditelji',
  'npr. već imam logo u tamnoplavoj',
  'npr. web mora izgledati profesionalno',
];

export default function NotesScreen({ value, onNext, onBack }: NotesScreenProps) {
  const [notes, setNotes] = useState(value ?? '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const charCount = notes.length;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <div className="step-container glass-container">
      <h2 className="step-title">Imaš li dodatne napomene?</h2>
      <p className="step-subtitle">
        Ovo pomaže da web bude još bolje prilagođen tvojim potrebama.
      </p>

      <div className="notes-textarea-wrapper">
        <textarea
          ref={textareaRef}
          className="notes-textarea"
          placeholder="Upiši slobodne napomene o dizajnu, stilu, publici ili bilo čemu što smatraš važnim…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          maxLength={MAX_CHARS}
        />
        <div className={`notes-char-counter ${isOverLimit ? 'notes-over-limit' : ''}`}>
          {charCount} / {MAX_CHARS}
        </div>
      </div>

      <div className="notes-examples">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            className="notes-example-chip"
            onClick={() => {
              if (notes.length === 0) {
                setNotes(ex.replace('npr. ', ''));
              } else {
                setNotes((prev) => prev + '\n' + ex.replace('npr. ', ''));
              }
            }}
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={onBack}>Natrag</button>
        <button
          className="btn-primary"
          onClick={() => onNext(notes)}
        >
          {notes.trim().length > 0 ? 'Dalje' : 'Preskoči'}
        </button>
      </div>
    </div>
  );
}
