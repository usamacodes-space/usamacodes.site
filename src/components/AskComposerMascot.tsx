'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

export type AskComposerMascotProps = {
  isDark: boolean;
  /** True while the portfolio assistant is streaming a reply. */
  isAiBusy: boolean;
  /** Respect a11y: skip multi-step motion. */
  reducedMotion: boolean;
  onRequestFocusInput?: () => void;
};

type Phase = 'idle' | 'opening' | 'working';

const OPEN_MS = 700;

/**
 * Small corner assistant for the “Ask anything” bar — inspired by terminal coding UI
 * (peeking figure + laptop + typing). Not official brand artwork.
 */
export function AskComposerMascot({ isDark, isAiBusy, reducedMotion, onRequestFocusInput }: AskComposerMascotProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const fromAiRef = useRef(false);
  const openingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearOpeningTimer = useCallback(() => {
    if (openingTimer.current) {
      clearTimeout(openingTimer.current);
      openingTimer.current = null;
    }
  }, []);

  useEffect(() => {
    if (isAiBusy) {
      fromAiRef.current = true;
      clearOpeningTimer();
      setPhase('working');
    } else if (fromAiRef.current) {
      fromAiRef.current = false;
      setPhase('idle');
    }
  }, [isAiBusy, clearOpeningTimer]);

  const handleClick = useCallback(() => {
    onRequestFocusInput?.();

    if (reducedMotion) {
      setPhase((p) => (p === 'working' ? 'idle' : 'working'));
      return;
    }

    if (phase === 'working') {
      clearOpeningTimer();
      setPhase('idle');
      return;
    }

    if (phase === 'opening') {
      return;
    }

    setPhase('opening');
    clearOpeningTimer();
    openingTimer.current = setTimeout(() => {
      setPhase('working');
      openingTimer.current = null;
    }, OPEN_MS);
  }, [phase, reducedMotion, onRequestFocusInput, clearOpeningTimer]);

  useEffect(() => () => { clearOpeningTimer(); }, [clearOpeningTimer]);

  const showLaptop = phase === 'opening' || phase === 'working';
  const isTypingLoop = phase === 'working' && !reducedMotion;
  const outline = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15, 23, 42, 0.12)';

  return (
    <button
      type="button"
      className="composer-mascot-anchor"
      onClick={handleClick}
      aria-label={
        phase === 'working'
          ? 'Stop assistant animation'
          : phase === 'opening'
            ? 'Assistant opening laptop'
            : 'Start assistant: open laptop and type'
      }
    >
      <span className="sr-only">
        {phase === 'working' ? 'Assistant is at the keyboard. Click to reset.' : 'Click to open a laptop and start typing.'}
      </span>
      <svg
        className="composer-mascot-svg"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        style={{ color: '#f97316' }}
      >
        <title hidden>Assistant</title>
        {/* ground */}
        <ellipse
          cx="32"
          cy="56"
          rx="20"
          ry="4.5"
          className="composer-mascot-shadow"
          style={{ fill: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(15, 23, 42, 0.08)' }}
        />

        {/* body */}
        <path
          d="M22 30c-4 0-6 3.5-4.5 7.5L21 50c1.2 2.2 3.2 3.2 5.2 2.8L38 50c2.8-0.6 4-3.2 2.3-5.4L32 32c-1-1.2-2.2-1.2-2.2-1.2h-1.1z"
          fill="currentColor"
          stroke={outline}
          strokeWidth="0.5"
        />

        {/* head */}
        <circle cx="32" cy="22" r="11" fill="currentColor" stroke={outline} strokeWidth="0.5" />
        <circle cx="28" cy="21" r="1.6" fill={isDark ? 'rgba(15,17,23,0.85)' : '#0f1117'} />
        <circle cx="36" cy="21" r="1.6" fill={isDark ? 'rgba(15,17,23,0.85)' : '#0f1117'} />
        <path
          d="M28.5 24.2c1.1 0.6 2.1 0.9 3.5 0.9s2.4-0.3 3.5-0.9"
          stroke={isDark ? 'rgba(15,17,23,0.75)' : 'rgba(26,29,36,0.85)'}
          strokeLinecap="round"
          strokeWidth="1.1"
        />

        {/* laptop — behind hands; unfolds on “opening” */}
        <g
          className={clsx(
            'composer-mascot-laptop',
            showLaptop && 'composer-mascot-laptop--on',
            phase === 'opening' && 'composer-mascot-laptop--unfold',
            phase === 'working' && 'composer-mascot-laptop--work',
            isTypingLoop && 'composer-mascot-laptop--type',
          )}
        >
          <rect
            x="20"
            y="35.5"
            width="24"
            height="2.5"
            rx="0.4"
            fill={isDark ? 'rgba(93, 112, 127, 0.55)' : 'rgba(71, 85, 105, 0.4)'}
          />
          <path
            d="M24 30h16c1.1 0 2 0.9 2 2v5.5H22V32c0-1.1 0.9-2 2-2z"
            style={{
              fill: isDark ? 'rgba(26, 29, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              stroke: outline,
            }}
            strokeWidth="0.5"
          />
          <rect
            x="25.2"
            y="31.3"
            width="13.6"
            height="6.2"
            rx="0.6"
            className="composer-mascot-screen"
          />
        </g>

        {/* arms — on top of machine for typing pose */}
        <g
          className={clsx(
            'composer-mascot-arm composer-mascot-arm--left',
            showLaptop && 'composer-mascot-arm--reach',
            isTypingLoop && 'composer-mascot-arm--type',
          )}
        >
          <path
            d="M20.5 32.5C18 35 18.2 40.5 24.5 41.2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
          />
        </g>
        <g
          className={clsx(
            'composer-mascot-arm composer-mascot-arm--right',
            showLaptop && 'composer-mascot-arm--reach',
            isTypingLoop && 'composer-mascot-arm--type',
          )}
        >
          <path
            d="M43.5 32.5C46 35 45.8 40.5 39.5 41.2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
          />
        </g>
      </svg>
    </button>
  );
}
