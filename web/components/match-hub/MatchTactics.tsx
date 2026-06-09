'use client';

import type { CSSProperties } from 'react';

import { useFixtureLineups } from '@/lib/queries';
import type { RawFixture, RawLineup, RawLineupPlayer } from '@/lib/types';

type Props = { fixture: RawFixture | null; isLive?: boolean };

// ── Player row ─────────────────────────────────────────────────────────────────

function PlayerRow({ player }: { player: RawLineupPlayer }) {
  const { number, name } = player.player;
  const displayName = name
    ? name.split(' ').length > 1
      ? `${name.split(' ').slice(0, -1).map((p) => `${p[0]}.`).join(' ')} ${name.split(' ').at(-1)}`
      : name
    : '—';
  return (
    <div style={playerRowStyle}>
      <span style={numberCircleStyle}>{number ?? '?'}</span>
      <span className="csfc-data" style={{ fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {displayName}
      </span>
    </div>
  );
}

// ── Team column ────────────────────────────────────────────────────────────────

function TeamColumn({ lineup }: { lineup: RawLineup }) {
  const starters = lineup.startXI ?? [];
  const subs = lineup.substitutes ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, minWidth: 0 }}>
      {/* Team header */}
      <div style={{ marginBottom: '0.6rem' }}>
        <span className="csfc-data" style={{ fontSize: '0.78rem', color: 'var(--csfc-text-primary)', display: 'block' }}>
          {lineup.team.name}
        </span>
        {lineup.formation && (
          <span className="csfc-eyebrow" style={{ fontSize: '0.6rem', color: 'var(--csfc-text-muted)' }}>
            Formation: {lineup.formation}
          </span>
        )}
      </div>

      {/* Starting XI */}
      {starters.map((p, i) => (
        <PlayerRow key={p.player.id ?? `xi-${i}`} player={p} />
      ))}

      {/* Substitutes */}
      {subs.length > 0 && (
        <>
          <div style={subsSectionStyle}>
            <span className="csfc-eyebrow" style={{ fontSize: '0.62rem', color: 'var(--csfc-text-muted)' }}>
              Substitutes
            </span>
          </div>
          {subs.map((p, i) => (
            <PlayerRow key={p.player.id ?? `sub-${i}`} player={p} />
          ))}
        </>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function MatchTactics({ fixture, isLive = false }: Props) {
  const fixtureId = fixture ? String(fixture.fixture.id) : null;
  const lineups = useFixtureLineups(fixtureId, isLive);

  if (!fixture) return <p className="csfc-body">Select a match above to see the line-ups.</p>;
  if (lineups.isLoading) return <p className="csfc-body">Loading lineups…</p>;
  if (lineups.isError) return (
    <p className="csfc-body">
      Couldn&apos;t load lineups ({(lineups.error as Error)?.message ?? 'unknown error'}).
    </p>
  );
  if (!lineups.data?.length) return (
    <p className="csfc-body">Lineups not yet published for this fixture.</p>
  );

  const [home, away] = lineups.data;

  return (
    /* BBC-style 2-column mirror layout — home left, away right, shared divider */
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0 1.2rem', alignItems: 'start' }}>
      {home && <TeamColumn lineup={home} />}
      {/* Centre divider */}
      <div style={{ width: 1, background: 'var(--csfc-copper-30)', alignSelf: 'stretch' }} />
      {away && <TeamColumn lineup={away} />}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const playerRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.3rem 0',
  borderBottom: '1px solid var(--csfc-copper-30)',
  minWidth: 0,
};

const numberCircleStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.6rem',
  height: '1.6rem',
  flexShrink: 0,
  border: '1px solid var(--csfc-copper)',
  fontSize: '0.62rem',
  fontFamily: 'var(--font-mono)',
  fontWeight: 700,
  color: 'var(--csfc-copper-bright)',
  background: 'var(--csfc-glass)',
};

const subsSectionStyle: CSSProperties = {
  padding: '0.5rem 0 0.3rem',
  borderBottom: '1px solid var(--csfc-copper-30)',
  marginTop: '0.2rem',
};
