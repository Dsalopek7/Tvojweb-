'use client';

import React from 'react';
import Image from 'next/image';
import type { DiscoveryAsset } from '@/lib/discovery/types/assets';

interface UploadPreviewGridProps {
  assets: DiscoveryAsset[];
  onRemove: (assetId: string) => void;
}

export default function UploadPreviewGrid({ assets, onRemove }: UploadPreviewGridProps) {
  if (assets.length === 0) return null;

  return (
    <div className="preview-grid">
      {assets.map((asset) => (
        <div key={asset.id} className="preview-item">
          <Image
            src={asset.dataUrl}
            alt={asset.name}
            className="preview-thumbnail"
            width={120}
            height={120}
            unoptimized
          />
          <button
            className="preview-remove"
            onClick={() => onRemove(asset.id)}
            aria-label={`Ukloni ${asset.name}`}
          >
            ✕
          </button>
          <span className="preview-name">{asset.name}</span>
        </div>
      ))}
    </div>
  );
}
