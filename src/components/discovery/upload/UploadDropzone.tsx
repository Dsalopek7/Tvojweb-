'use client';

import React, { useRef, useState, useCallback } from 'react';
import type { AssetType } from '@/lib/discovery/types/assets';

const LOGO_ACCEPT = ['image/png', 'image/jpeg', 'image/svg+xml'];
const PHOTO_ACCEPT = ['image/png', 'image/jpeg', 'image/webp'];

interface UploadDropzoneProps {
  type: AssetType;
  maxFiles: number;
  currentCount: number;
  onFiles: (files: File[]) => void;
}

export default function UploadDropzone({ type, maxFiles, currentCount, onFiles }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptTypes = type === 'logo' ? LOGO_ACCEPT : PHOTO_ACCEPT;
  const remaining = maxFiles - currentCount;
  const isDisabled = remaining <= 0;

  const validateAndEmit = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || isDisabled) return;
      const valid: File[] = [];
      for (let i = 0; i < Math.min(fileList.length, remaining); i++) {
        const file = fileList[i];
        if (acceptTypes.includes(file.type)) {
          valid.push(file);
        }
      }
      if (valid.length > 0) onFiles(valid);
    },
    [acceptTypes, remaining, isDisabled, onFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDisabled) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndEmit(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (!isDisabled) inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndEmit(e.target.files);
    if (inputRef.current) inputRef.current.value = '';
  };

  const label = type === 'logo' ? 'logo' : 'fotografije';
  const icon = type === 'logo' ? '🏷️' : '📸';

  return (
    <div
      className={`upload-dropzone ${isDragging ? 'dropzone-active' : ''} ${isDisabled ? 'dropzone-disabled' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptTypes.join(',')}
        multiple={type === 'photo'}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <span className="dropzone-icon">{icon}</span>
      <span className="dropzone-label">
        {isDisabled
          ? `Maksimalan broj za ${label} je dostignut`
          : `Povuci ili klikni za ${label}`}
      </span>
      <span className="dropzone-hint">
        {type === 'logo'
          ? 'PNG, JPG ili SVG · 1 datoteka'
          : `PNG, JPG ili WebP · još ${remaining} od ${maxFiles}`}
      </span>
    </div>
  );
}
