'use client';

import Card from '@mui/material/Card';
import type { SxProps, Theme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import React from 'react';

interface BentoCardProps {
  children: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  sx?: SxProps<Theme>;
  className?: string;
  onClick?: () => void;
  component?: React.ElementType;
  hover?: boolean;
  /** Forwarded when `component` is `button` (avoids implicit submit in forms). */
  type?: 'button' | 'submit' | 'reset';
  /** Accessible name when the card is a button or interactive surface. */
  ariaLabel?: string;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  colSpan,
  rowSpan,
  sx,
  className,
  onClick,
  component,
  hover = true,
  type,
  ariaLabel,
}) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const glassBlur = isLight
    ? 'none'
    : 'blur(16px) saturate(1.4)';

  const baseSx: SxProps<Theme> = {
    gridColumn: colSpan ? `span ${colSpan}` : undefined,
    gridRow: rowSpan ? `span ${rowSpan}` : undefined,
    p: { xs: 2, sm: 2.5, md: 3 },
    border: '1px solid',
    borderColor: 'var(--bento-border)',
    backgroundColor: 'var(--bento-surface)',
    backdropFilter: glassBlur,
    WebkitBackdropFilter: glassBlur,
    borderRadius: '16px',
    boxShadow: 'var(--bento-shadow)',
    cursor: onClick ? 'pointer' : undefined,
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.25s ease',
    backgroundImage: 'none',
    outline: 'none',
    ...(hover && {
      '&:hover': {
        borderColor: 'primary.main',
        boxShadow: 'var(--bento-shadow-hover)',
        transform: 'translateY(-2px)',
      },
    }),
    '&:focus-visible': {
      borderColor: 'primary.main',
      boxShadow: '0 0 0 2px rgba(249, 115, 22, 0.45), var(--bento-shadow-hover)',
      transform: 'translateY(-1px)',
    },
  };

  const extra = sx === undefined ? [] : Array.isArray(sx) ? sx : [sx];

  return (
    <Card
      elevation={0}
      {...(component ? { component } : {})}
      {...(type !== undefined ? { type } : {})}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
      className={className}
      onClick={onClick}
      sx={[baseSx, ...extra]}
    >
      {children}
    </Card>
  );
};
