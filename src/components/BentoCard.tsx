import Card from '@mui/material/Card';
import type { SxProps, Theme } from '@mui/material/styles';
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
}) => (
  <Card
    component={component}
    className={className}
    onClick={onClick}
    sx={{
      gridColumn: colSpan ? `span ${colSpan}` : undefined,
      gridRow: rowSpan ? `span ${rowSpan}` : undefined,
      p: { xs: 2, sm: 2.5, md: 3 },
      border: '1px solid',
      borderColor: 'rgba(93, 112, 127, 0.2)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      cursor: onClick ? 'pointer' : undefined,
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.25s ease',
      ...(hover && {
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 0 24px rgba(249, 115, 22, 0.08)',
          transform: 'translateY(-2px)',
        },
      }),
      ...sx,
    }}
  >
    {children}
  </Card>
);
