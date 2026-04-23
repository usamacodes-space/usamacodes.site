'use client';

import React, { useCallback } from 'react';
import { clsx } from 'clsx';

export type AskComposerMascotProps = {
  /** True while the portfolio assistant is streaming a reply. */
  isAiBusy: boolean;
  reducedMotion: boolean;
  onRequestFocusInput?: () => void;
};

/**
 * Ask-bar top-right control: Lottie-derived pixel mascot (static frame), tap focuses the composer.
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
      {/* eslint-disable-next-line @next/next/no-img-element -- local SVG asset; Next/Image is awkward for arbitrary SVGs */}
      <img src="/ask-mascot.svg" alt="" className="composer-mascot-img" width={102} height={69} />
    </button>
  );
}
