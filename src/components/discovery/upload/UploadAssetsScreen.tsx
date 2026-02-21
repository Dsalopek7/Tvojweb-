'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { DiscoveryAsset, DiscoveryAssetsState } from '@/lib/discovery/types/assets';
import { saveLogo, savePhoto, loadAssets, deleteAsset } from '@/lib/discovery/assets/assetService';
import UploadDropzone from './UploadDropzone';
import UploadPreviewGrid from './UploadPreviewGrid';

interface UploadAssetsScreenProps {
  sessionId: string;
  onSkip: () => void;
  onContinue: () => void;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function createAsset(
  sessionId: string,
  file: File,
  dataUrl: string
): DiscoveryAsset {
  return {
    id: crypto.randomUUID(),
    sessionId,
    type: 'photo', // overridden by service
    name: file.name,
    mimeType: file.type,
    size: file.size,
    dataUrl,
    createdAt: Date.now(),
  };
}

export default function UploadAssetsScreen({
  sessionId,
  onSkip,
  onContinue,
}: UploadAssetsScreenProps) {
  const [state, setState] = useState<DiscoveryAssetsState>({ photos: [] });
  const [isLoading, setIsLoading] = useState(true);

  // ── Load existing assets on mount ────────────────────────────────
  useEffect(() => {
    loadAssets(sessionId).then((s) => {
      setState(s);
      setIsLoading(false);
    });
  }, [sessionId]);

  // ── Logo upload ──────────────────────────────────────────────────
  const handleLogoFiles = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      const dataUrl = await fileToDataUrl(file);

      // Remove existing logo first
      if (state.logo) {
        await deleteAsset(state.logo.id);
      }

      const asset = createAsset(sessionId, file, dataUrl);
      await saveLogo(asset);
      setState((prev) => ({ ...prev, logo: { ...asset, type: 'logo' } }));
    },
    [sessionId, state.logo]
  );

  // ── Photo upload ─────────────────────────────────────────────────
  const handlePhotoFiles = useCallback(
    async (files: File[]) => {
      const newPhotos: DiscoveryAsset[] = [];
      for (const file of files) {
        const dataUrl = await fileToDataUrl(file);
        const asset = createAsset(sessionId, file, dataUrl);
        await savePhoto(asset);
        newPhotos.push({ ...asset, type: 'photo' });
      }
      setState((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
      }));
    },
    [sessionId]
  );

  // ── Remove asset ─────────────────────────────────────────────────
  const handleRemove = useCallback(
    async (assetId: string) => {
      await deleteAsset(assetId);
      setState((prev) => ({
        logo: prev.logo?.id === assetId ? undefined : prev.logo,
        photos: prev.photos.filter((p) => p.id !== assetId),
      }));
    },
    []
  );

  if (isLoading) {
    return (
      <div className="step-container upload-screen">
        <div className="upload-loading">Učitavanje...</div>
      </div>
    );
  }

  const allAssets = [...(state.logo ? [state.logo] : []), ...state.photos];

  return (
    <div className="step-container upload-screen">
      <h2 className="step-title">Učitaj logo i fotografije</h2>
      <p className="step-desc">
        Ovo pomaže da web izgleda još bolje usklađen
      </p>

      {/* Logo dropzone */}
      <div className="section-label">Logo</div>
      <UploadDropzone
        type="logo"
        maxFiles={1}
        currentCount={state.logo ? 1 : 0}
        onFiles={handleLogoFiles}
      />

      {/* Photo dropzone */}
      <div className="section-label">Fotografije</div>
      <UploadDropzone
        type="photo"
        maxFiles={5}
        currentCount={state.photos.length}
        onFiles={handlePhotoFiles}
      />

      {/* Preview grid */}
      {allAssets.length > 0 && (
        <>
          <div className="section-label">Učitane datoteke</div>
          <UploadPreviewGrid assets={allAssets} onRemove={handleRemove} />
        </>
      )}

      {/* Navigation */}
      <div className="step-nav">
        <button className="btn-secondary" onClick={onSkip}>
          Preskoči
        </button>
        <button className="btn-primary" onClick={onContinue}>
          Nastavi
        </button>
      </div>
    </div>
  );
}
