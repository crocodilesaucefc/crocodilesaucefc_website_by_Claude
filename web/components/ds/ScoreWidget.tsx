import type { CSSProperties } from 'react';

export type ScoreTeam = { abbr: string; flag?: string; score: number | string };

type ScoreWidgetProps = {
  home: ScoreTeam;
  away: ScoreTeam;
  live?: boolean;
  /** e.g. "67'" */
  minute?: string | null;
  style?: CSSProperties;
};

function Crest({ team }: { team: ScoreTeam }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
      {team.flag ? (
        <span
          style={{
            width: 30,
            height: 22,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            border: '1px solid var(--csfc-copper-30)',
            overflow: 'hidden',
            flex: '0 0 auto',
          }}
        >
          {team.flag}
        </span>
      ) : null}
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '0.8rem',
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
          color: 'var(--csfc-text-primary)',
          whiteSpace: 'nowrap',
        }}
      >
        {team.abbr}
      </span>
    </div>
  );
}

/**
 * CrocodileSauceFC — ScoreWidget
 * Horizontal live match score row: home crest, mono score totals, away crest.
 * Ported 1:1 from the design system bundle (components/data/ScoreWidget.jsx).
 */
export function ScoreWidget({ home, away, live = false, minute = null, style }: ScoreWidgetProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.9rem 1.1rem',
        background: 'rgb(2 6 23 / 0.5)',
        border: '1px solid var(--csfc-copper-30)',
        clipPath: 'var(--clip-card)',
        ...style,
      }}
    >
      <Crest team={home} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            fontSize: '1.7rem',
            lineHeight: 1,
            letterSpacing: 'var(--tracking-data)',
            color: 'var(--csfc-bronze)',
            filter: 'drop-shadow(0 0 6px rgb(245 158 11 / 0.6))',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
          }}
        >
          <span>{home.score}</span>
          <span style={{ color: 'var(--csfc-text-muted)', filter: 'none', fontSize: '0.8em' }}>:</span>
          <span>{away.score}</span>
        </div>
        {live ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontFamily: 'var(--font-display)',
              fontSize: '0.55rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--csfc-emerald-bright)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                background: 'var(--csfc-emerald-bright)',
                borderRadius: '50%',
                boxShadow: '0 0 6px var(--csfc-emerald-bright)',
                animation: 'csfcPulse 1.4s ease-in-out infinite',
              }}
            />
            Live {minute || ''}
          </span>
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.55rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--csfc-text-muted)',
            }}
          >
            {minute || 'FT'}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Crest team={away} />
      </div>
    </div>
  );
}
