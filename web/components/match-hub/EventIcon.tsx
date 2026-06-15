'use client';

import type { CSSProperties } from 'react';

export type EventIconType = 'goal' | 'yellow' | 'red' | 'sub' | 'other';

const chipStyle: CSSProperties = {
  width: 22,
  height: 22,
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/** 22px event chip — goal (bronze ball), card colours, or a green swap-arrow for substitutions. */
export function EventIcon({ type }: { type: EventIconType }) {
  if (type === 'goal') {
    return (
      <span style={chipStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/ball_cutout.png"
          alt="Goal"
          style={{ width: 18, height: 18, objectFit: 'contain', filter: 'drop-shadow(0 0 4px rgb(180 83 9 / 0.55))' }}
        />
      </span>
    );
  }

  if (type === 'yellow') {
    return (
      <span style={{ ...chipStyle, background: 'transparent', border: '1px solid transparent' }}>
        <span style={{ width: 13, height: 17, background: '#fbbf24', boxShadow: '0 0 6px rgb(251 191 36 / 0.5)' }} />
      </span>
    );
  }

  if (type === 'red') {
    return (
      <span style={{ ...chipStyle, background: 'transparent', border: '1px solid transparent' }}>
        <span style={{ width: 13, height: 17, background: '#ef4444', boxShadow: '0 0 6px rgb(239 68 68 / 0.5)' }} />
      </span>
    );
  }

  if (type === 'sub') {
    return (
      <span style={{ ...chipStyle, background: 'rgb(21 128 61 / 0.16)', border: '1px solid var(--csfc-emerald-bright)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 8h13M17 8l-3.5-3.5M17 8l-3.5 3.5" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 16H7M7 16l3.5-3.5M7 16l3.5 3.5" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  return (
    <span style={{ ...chipStyle, background: 'rgb(148 163 184 / 0.12)', border: '1px solid var(--csfc-text-muted)' }}>
      <span style={{ width: 5, height: 5, background: 'var(--csfc-text-muted)' }} />
    </span>
  );
}
