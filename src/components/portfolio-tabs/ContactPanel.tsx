'use client';

import { Send, ShieldCheck } from 'lucide-react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React from 'react';
import { CONTACT_EMAIL } from '@/constants';
import { useTheme } from '@/contexts/ThemeContext';
import { BentoCard } from '@/components/BentoCard';

export type ContactPanelProps = {
  contactSuccess: boolean;
  setContactSuccess: (v: boolean) => void;
  contactName: string;
  setContactName: (v: string) => void;
  contactEmail: string;
  setContactEmail: (v: string) => void;
  contactMessage: string;
  setContactMessage: (v: string) => void;
  contactStep: number;
  contactSending: boolean;
  contactError: string | null;
  canProceedName: boolean;
  canProceedEmail: boolean;
  canSubmit: boolean;
  handleContactSubmit: (e: React.FormEvent) => void;
  handleContactNext: () => void;
  handleContactBack: () => void;
};

const STEPS = [
  { id: 'name' as const, label: "What's your name?", placeholder: 'Your name...' },
  { id: 'email' as const, label: "What's your email?", placeholder: 'you@email.com' },
  { id: 'message' as const, label: 'Tell me about your project', placeholder: "I'd like to discuss..." },
];

export default function ContactPanel({
  contactSuccess,
  setContactSuccess,
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactMessage,
  setContactMessage,
  contactStep,
  contactSending,
  contactError,
  canProceedName,
  canProceedEmail,
  canSubmit,
  handleContactSubmit,
  handleContactNext,
  handleContactBack,
}: ContactPanelProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex-1 flex flex-col items-center justify-start">
      <div className="w-full max-w-lg">
        <div className="mb-4 text-center">
          <h2 className="text-lg sm:text-xl font-semibold mb-0.5" style={{ color: 'var(--brand-light)' }}>
            Get in touch
          </h2>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--brand-slate-light)' }}>
            Let&apos;s discuss your next project
          </p>
        </div>

        {contactSuccess ? (
          <BentoCard hover={false} className="bento-animate" sx={{ p: { xs: 2, sm: 3 } }}>
            <div className="text-center py-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}
              >
                <ShieldCheck size={24} style={{ color: '#22c55e' }} />
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--brand-light)' }}>
                Message sent!
              </h3>
              <p className="text-xs mb-4" style={{ color: 'var(--brand-slate-light)' }}>
                Thanks for reaching out. I&apos;ll get back to you soon at your email.
              </p>
              <Button variant="outlined" size="small" onClick={() => setContactSuccess(false)} sx={{ fontSize: '0.75rem' }}>
                Send another message
              </Button>
            </div>
          </BentoCard>
        ) : (
          <BentoCard hover={false} className="bento-animate" sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
            <form onSubmit={handleContactSubmit}>
              {STEPS.map((step, i) => {
                if (contactStep !== i + 1) return null;
                const isTextarea = step.id === 'message';
                const value = step.id === 'name' ? contactName : step.id === 'email' ? contactEmail : contactMessage;
                const setValue = step.id === 'name' ? setContactName : step.id === 'email' ? setContactEmail : setContactMessage;
                return (
                  <div key={step.id} className="space-y-4 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
                    <label htmlFor={`contact-${step.id}`} className="block text-sm font-medium" style={{ color: 'var(--brand-light)' }}>
                      {step.label} <span style={{ color: '#f97316' }}>*</span>
                    </label>
                    {isTextarea ? (
                      <TextField
                        id={`contact-${step.id}`}
                        placeholder={step.placeholder}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (contactStep < 3) handleContactNext();
                            else (e.target as HTMLElement).closest('form')?.requestSubmit();
                          }
                        }}
                        multiline
                        minRows={3}
                        fullWidth
                        variant="outlined"
                        size="small"
                        required
                        disabled={contactSending}
                        helperText="Min 10 characters"
                      />
                    ) : (
                      <TextField
                        id={`contact-${step.id}`}
                        type={step.id === 'email' ? 'email' : 'text'}
                        placeholder={step.placeholder}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleContactNext()}
                        fullWidth
                        variant="outlined"
                        size="small"
                        required
                        disabled={contactSending}
                        helperText={step.id === 'name' ? 'Min 2 characters' : "We'll reply to this email"}
                      />
                    )}
                  </div>
                );
              })}

              {contactError && (
                <div
                  className="mt-3 px-3 py-2 rounded-lg text-xs"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                  }}
                >
                  {contactError}
                </div>
              )}

              <div
                className="flex items-center justify-between gap-3 mt-5 pt-3"
                style={{ borderTop: `1px solid ${isDark ? 'rgba(93,112,127,0.2)' : 'rgba(93,112,127,0.12)'}` }}
              >
                <Button
                  variant="text"
                  size="small"
                  onClick={handleContactBack}
                  disabled={contactSending}
                  sx={{ visibility: contactStep === 1 ? 'hidden' : 'visible', minHeight: 36 }}
                >
                  Back
                </Button>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((n) => (
                    <span
                      key={n}
                      className="w-1.5 h-1.5 rounded-full transition-colors"
                      style={{
                        backgroundColor:
                          contactStep >= n ? '#f97316' : isDark ? 'rgba(93,112,127,0.4)' : 'rgba(93,112,127,0.25)',
                      }}
                    />
                  ))}
                </div>
                {contactStep < 3 ? (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleContactNext}
                    disabled={
                      contactSending || (contactStep === 1 && !canProceedName) || (contactStep === 2 && !canProceedEmail)
                    }
                    sx={{ minHeight: 36 }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" variant="contained" size="small" disabled={!canSubmit || contactSending} sx={{ minHeight: 36 }}>
                    {contactSending ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin mr-1.5" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send <Send size={14} style={{ marginLeft: 6 }} />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </BentoCard>
        )}

        <p className="mt-3 text-center text-[10px] sm:text-xs" style={{ color: 'var(--brand-slate-light)' }}>
          Your message will be sent directly to Usama
          <span className="mx-2 opacity-40">·</span>
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#f97316' }}>
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
}
