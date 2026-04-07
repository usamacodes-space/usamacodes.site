'use client';

import React from 'react';

/**
 * Shared shell for every main tab (About, Projects, Experience, Education, FAQ, Contact, Start).
 * Inline flex styles ensure layout stays top-aligned even if Tailwind classes are missing or overridden.
 */
export function TabPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="tab-panel-layout flex w-full min-h-0 flex-1 flex-col justify-start items-stretch"
      style={{
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        alignContent: 'flex-start',
        flex: '1 1 0%',
        minHeight: 0,
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}
