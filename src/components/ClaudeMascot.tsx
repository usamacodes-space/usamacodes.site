'use client';

import React from 'react';

interface ClaudeMascotProps {
  isTyping?: boolean;
  size?: number;
  reducedMotion?: boolean;
}

export const ClaudeMascot: React.FC<ClaudeMascotProps> = ({
  isTyping = false,
  size = 28,
  reducedMotion = false,
}) => {
  const animationClass = reducedMotion
    ? ''
    : isTyping
      ? 'animate-claude-think'
      : 'animate-claude-bob';

  return (
    <span
      className={`claude-mascot inline-flex items-center justify-center shrink-0 ${animationClass}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <defs>
          <radialGradient id="claude-body" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#ffb37a" />
            <stop offset="55%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#d35b0f" />
          </radialGradient>
        </defs>

        {/* Sparkle body (Anthropic-style 4-point star) */}
        <path
          d="M24 3
             C25.4 12.6 29.6 18.2 38.4 20.6
             C29.6 23 25.4 28.6 24 38.2
             C22.6 28.6 18.4 23 9.6 20.6
             C18.4 18.2 22.6 12.6 24 3 Z"
          fill="url(#claude-body)"
          stroke="#b8480a"
          strokeWidth="0.6"
          strokeLinejoin="round"
          transform="translate(0 3)"
        />

        {/* Cheeks */}
        <ellipse cx="17" cy="25" rx="2" ry="1.2" fill="#ffd0a8" opacity="0.85" />
        <ellipse cx="31" cy="25" rx="2" ry="1.2" fill="#ffd0a8" opacity="0.85" />

        {/* Eyes */}
        <g className="claude-mascot-eyes">
          <ellipse cx="20" cy="22" rx="1.6" ry="2" fill="#1a1a1a" />
          <ellipse cx="28" cy="22" rx="1.6" ry="2" fill="#1a1a1a" />
          {/* Eye shines */}
          <circle cx="20.5" cy="21.3" r="0.5" fill="#fff" />
          <circle cx="28.5" cy="21.3" r="0.5" fill="#fff" />
        </g>

        {/* Mouth */}
        {isTyping ? (
          <ellipse cx="24" cy="28.5" rx="1.6" ry="1.2" fill="#1a1a1a" />
        ) : (
          <path
            d="M21 27.5 Q24 30 27 27.5"
            stroke="#1a1a1a"
            strokeWidth="1.1"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </svg>
    </span>
  );
};
