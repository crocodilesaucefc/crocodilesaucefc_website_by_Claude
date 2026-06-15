'use client';

import type { CSSProperties } from 'react';

const shimmerStyle: CSSProperties = {
  display: 'inline-block',
  height: '0.7rem',
  background: 'var(--csfc-glass)',
  border: '1px solid var(--csfc-copper-30)',
  animation: 'csfcPulse 1.4s ease-in-out infinite',
};

/** One shimmering placeholder row mirroring the fixtures list's 3-column grid. */
function FixtureRowSkeleton() {
  return (
    <div style={{
      padding: '0.65rem 1rem',
      borderBottom: '1px solid var(--csfc-copper-30)',
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 5.5rem minmax(0,1fr)',
      alignItems: 'center',
      gap: '0.4rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{ ...shimmerStyle, width: '65%' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span style={{ ...shimmerStyle, width: '2.4rem' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <span style={{ ...shimmerStyle, width: '65%' }} />
      </div>
    </div>
  );
}

/** Shimmering placeholder list shown only on the fixtures query's very first load. */
export function FixtureListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }, (_, i) => <FixtureRowSkeleton key={i} />)}
    </div>
  );
}

/** "Loading match data…" placeholder for the HUD panes, shown only on first load. */
export function HudSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div>
      <p className="csfc-body" style={{ marginBottom: '0.8rem' }}>Loading match data…</p>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '1.2rem',
          padding: '0.5rem 0',
          borderBottom: '1px solid var(--csfc-copper-30)',
        }}>
          <span style={{ ...shimmerStyle, width: '35%' }} />
          <span style={{ ...shimmerStyle, width: '45%' }} />
        </div>
      ))}
    </div>
  );
}
