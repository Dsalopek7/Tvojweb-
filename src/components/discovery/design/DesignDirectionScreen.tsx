'use client';

import React, { useState, useMemo } from 'react';
import type {
  DesignVisualIdentity,
  DesignDirectionState,
  DesignVariantId,
} from '@/lib/discovery/types/design';
import { generateVariants } from '@/lib/discovery/design/generateVariants';
import { generateTokens } from '@/lib/discovery/tokens/generateTokens';
import { applyTokensToDOM } from '@/lib/discovery/tokens/applyTokensToDOM';
import MockupPreview from './MockupPreview';

const VARIANT_DESCRIPTIONS: Record<DesignVariantId, string> = {
  A: 'Smiren, čist i profesionalan izgled',
  B: 'Moderan izgled s jasnim naglascima',
  C: 'Naglašen izgled s jakim vizualnim identitetom',
};

interface DesignDirectionScreenProps {
  visualIdentity: DesignVisualIdentity;
  value?: DesignDirectionState;
  onNext: (state: DesignDirectionState) => void;
  onBack: () => void;
}

export default function DesignDirectionScreen({
  visualIdentity,
  value,
  onNext,
  onBack,
}: DesignDirectionScreenProps) {
  const variants = useMemo(
    () => value?.variants ?? generateVariants(visualIdentity),
    [visualIdentity, value?.variants]
  );

  const [selected, setSelected] = useState<DesignVariantId | undefined>(
    value?.selectedVariant
  );

  const handleSelect = (id: DesignVariantId) => {
    setSelected(id);
    const v = variants.find((x) => x.id === id);
    if (!v) return;
    // Auto-apply tokens on click — immediate visual feedback
    const tokens = generateTokens({
      paletteId: visualIdentity.palette,
      variantId: id,
      spacing: v.spacing,
      contrast: v.contrast,
    });
    applyTokensToDOM(tokens);
  };

  const handleNext = () => {
    if (!selected) return;
    onNext({ variants, selectedVariant: selected });
  };

  return (
    <div className="step-container">
      <h2 className="step-title">
        Odaberi izgled koji najbolje predstavlja tvoju djelatnost
      </h2>
      <p className="step-desc">
        Na temelju tvog odabira pripremili smo 3 dizajn smjera. Možeš ga kasnije doraditi.
      </p>

      <div className="design-variants-grid">
        {variants.map((v) => (
          <MockupPreview
            key={v.id}
            variant={v}
            selected={selected === v.id}
            recommended={v.id === 'B'}
            description={VARIANT_DESCRIPTIONS[v.id]}
            onSelect={() => handleSelect(v.id)}
          />
        ))}
      </div>

      <div className="step-nav">
        <button className="btn-secondary" onClick={onBack}>
          Natrag
        </button>
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={!selected}
        >
          Dalje
        </button>
      </div>
    </div>
  );
}
