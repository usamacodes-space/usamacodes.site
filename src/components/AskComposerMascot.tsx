'use client';

import React, { useCallback } from 'react';
import { clsx } from 'clsx';
import { MASCOT_PIXEL_D, MASCOT_PIXEL_VIEWBOX } from './mascotPixelPath';

export type AskComposerMascotProps = {
  /** True while the portfolio assistant is streaming a reply. */
  isAiBusy: boolean;
  reducedMotion: boolean;
  onRequestFocusInput?: () => void;
};

/**
 * Ask-bar corner control: custom pixel-mascot glyph, tap focuses the composer.
 */
export function AskComposerMascot({ isAiBusy, reducedMotion, onRequestFocusInput }: AskComposerMascotProps) {
  const handleClick = useCallback(() => {
    onRequestFocusInput?.();
  }, [onRequestFocusInput]);

  return (
    <button
      type="button"
      className={clsx('composer-mascot-anchor', isAiBusy && !reducedMotion && 'composer-mascot-anchor--busy')}
      onClick={handleClick}
      aria-label="Focus ask field"
    >
      <span className="sr-only">Assistant mascot. Click to focus the ask field.</span>
      <svg
        className="composer-mascot-svg"
        viewBox={MASCOT_PIXEL_VIEWBOX}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        style={{ color: '#f97316' }}
      >
        <path d={MASCOT_PIXEL_D} fill="currentColor" />
      </svg>
    </button>
  );
}
