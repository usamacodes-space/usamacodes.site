'use client';

import { ChevronRight, HelpCircle } from 'lucide-react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import React from 'react';
import { FAQ_ITEMS } from '@/constants';
import { useTheme } from '@/contexts/ThemeContext';

export default function FaqPanel() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex-1 flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-0.5" style={{ color: 'var(--brand-light)' }}>
          FAQ
        </h2>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--brand-slate-light)' }}>
          Common questions answered
        </p>
      </div>
      <div className="flex-1 max-w-3xl space-y-2.5">
        {FAQ_ITEMS.map((faq, i) => (
          <Accordion
            key={i}
            className="bento-animate"
            elevation={0}
            slotProps={{ root: { elevation: 0 } }}
            sx={{
              borderRadius: '12px !important',
              border: '1px solid',
              borderColor: 'var(--bento-border)',
              backgroundColor: 'var(--bento-surface)',
              backdropFilter: isDark ? 'blur(16px) saturate(1.4)' : 'none',
              WebkitBackdropFilter: isDark ? 'blur(16px) saturate(1.4)' : 'none',
              boxShadow: 'var(--bento-shadow)',
              overflow: 'hidden',
              backgroundImage: 'none',
              '&:before': { display: 'none' },
              '&.Mui-expanded': { m: 0 },
            }}
            disableGutters
          >
            <AccordionSummary
              className="faq-accordion-summary"
              expandIcon={<ChevronRight size={14} style={{ color: 'var(--brand-accent)', transition: 'transform 0.2s' }} />}
              sx={{
                /* pl/pr duplicated in globals .faq-accordion-summary so padding wins over ButtonBase resets */
                py: { xs: '10px', sm: '11px' },
                minHeight: '44px !important',
                alignItems: 'center',
                gap: 1.25,
                '& .MuiAccordionSummary-content': {
                  margin: '0 !important',
                  alignItems: 'center',
                  overflow: 'hidden',
                },
                '& .MuiAccordionSummary-expandIconWrapper': {
                  margin: 0,
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                },
                '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': { transform: 'rotate(90deg)' },
              }}
            >
              <span className="flex min-w-0 items-center gap-3 pl-0.5">
                <HelpCircle size={14} className="shrink-0" style={{ color: 'var(--brand-accent)' }} />
                <span className="text-xs sm:text-[13px] font-medium leading-snug">{faq.question}</span>
              </span>
            </AccordionSummary>
            <AccordionDetails className="faq-accordion-details" sx={{ pt: 0, pb: 2 }}>
              <p
                className="text-[11px] sm:text-xs leading-relaxed faq-accordion-answer"
                style={{ color: 'var(--brand-slate-light)' }}
              >
                {faq.answer}
              </p>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
