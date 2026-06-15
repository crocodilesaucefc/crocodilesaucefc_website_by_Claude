'use client';

import type { CSSProperties } from 'react';

import { useFixtureLineups } from '@/lib/queries';
import type { RawFixture, RawLineup, RawLineupPlayer } from '@/lib/types';
import { HudSkeleton } from './Skeleton';

type Props = { fixture: RawFixture | null; isLive?: boolean };

// ── Grouping helpers ──────────────────────────────────────────────────────────

type PosGroup = { label: string; players: RawLineupPlayer[] };

const POS_LABELS: Record<string, string> = { G: 'GK', D: 'DEF', M: 'MID', F: 'FWD' };

/**
 * Group startXI into rows for top-down rendering. `player.grid` is `"row:col"`
 * with row 1 = goalkeeper and row number increasing toward attack — both
 * teams render rows in this same ascending order (GK at top, no flip).
 */
function buildRows(lineup: RawLineup): PosGroup[] {
  const xi = lineup.startXI ?? [];

  // If the API provides grid coords, group by row and sort within each row by column.
  if (xi.some((p) => p.player.grid)) {
    const byRow = new Map<number, RawLineupPlayer[]>();
    for (const p of xi) {
      const row = p.player.grid ? parseInt(p.player.grid.split(':')[0], 10) : 1;
      if (!byRow.has(row)) byRow.set(row, []);
      byRow.get(row)!.push(p);
    }
    const colOf = (p: RawLineupPlayer) => (p.player.grid ? parseInt(p.player.grid.split(':')[1], 10) : 0);
    const sorted = [...byRow.entries()].sort((a, b) => a[0] - b[0]);
    for (const [, players] of sorted) players.sort((a, b) => colOf(a) - colOf(b));
    return sorted.map(([, players], i) => ({ label: `Line ${i + 1}`, players }));
  }

  // Fallback: group by pos string (G / D / M / F).
  if (xi.some((p) => p.player.pos)) {
    const groups: Record<string, RawLineupPlayer[]> = {};
    for (const p of xi) {
      const pos = p.player.pos ?? 'F';
      (groups[pos] ??= []).push(p);
    }
    const order: string[] = ['G', 'D', 'M', 'F'];
    return order
      .filter((pos) => groups[pos]?.length)
      .map((pos) => ({ label: POS_LABELS[pos] ?? pos, players: groups[pos] }));
  }

  // Last resort: force a 4-3-3 split by index.
  const slices = [
    ['GK', xi.slice(0, 1)],
    ['DEF', xi.slice(1, 5)],
    ['MID', xi.slice(5, 8)],
    ['FWD', xi.slice(8, 11)],
  ] as const;
  return slices.map(([label, players]) => ({ label: label as string, players: [...players] }));
}

// ── Player chip ───────────────────────────────────────────────────────────────

function PlayerChip({ p }: { p: RawLineupPlayer }) {
  const num = p.player.number;
  const name = (p.player.name ?? '').split(' ').at(-1) ?? '?';
  return (
    <div style={chipStyle}>
      <span className="csfc-data" style={{ fontSize: '0.7rem' }}>{num ?? '·'}</span>
      <span style={{ fontSize: '0.55rem', color: 'var(--csfc-text-primary)', fontFamily: 'var(--font-mono)', textAlign: 'center', lineHeight: 1.2 }}>
        {name}
      </span>
    </div>
  );
}

// ── Team half ─────────────────────────────────────────────────────────────────

function TeamHalf({ lineup, teamName }: { lineup: RawLineup; teamName: string }) {
  const rows = buildRows(lineup);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="csfc-eyebrow" style={{ fontSize: '0.68rem', color: 'var(--csfc-emerald-bright)' }}>
          {teamName}
        </span>
        <span className="csfc-data" style={{ fontSize: '0.68rem' }}>
          {lineup.formation ?? '–'}
        </span>
      </div>
      {lineup.coach?.name && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--csfc-text-muted)', letterSpacing: '0.04em' }}>
          Manager: {lineup.coach.name}
        </span>
      )}
      {rows.map((row) => (
        row.players.length === 0 ? null : (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {row.players.map((p, i) => <PlayerChip key={p.player.id ?? `${row.label}-${i}`} p={p} />)}
          </div>
        )
      ))}
      {lineup.substitutes && lineup.substitutes.length > 0 && (
        <div style={{ marginTop: '0.4rem', borderTop: '1px solid var(--csfc-copper-30)', paddingTop: '0.4rem' }}>
          <span className="csfc-eyebrow" style={{ fontSize: '0.6rem', color: 'var(--csfc-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
            Subs
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {lineup.substitutes.map((p, i) => <PlayerChip key={p.player.id ?? `sub-${i}`} p={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function MatchFormation({ fixture, isLive = false }: Props) {
  const fixtureId = fixture ? String(fixture.fixture.id) : null;
  const lineups = useFixtureLineups(fixtureId, isLive);

  if (!fixture) return <p className="csfc-body">Select a match above to view the formation.</p>;
  if (lineups.isLoading) return <HudSkeleton />;
  if (lineups.isError || !lineups.data?.length) {
    return <p className="csfc-body">Formation data not yet available — lineups are typically published closer to kick-off.</p>;
  }

  const [home, away] = lineups.data;

  return (
    /*
     * Side-by-side pitch layout — both teams render rows top-to-bottom
     * identically (GK -> DEF -> MID -> FWD), like the BBC. A vertical 1px
     * divider represents the centre line.
     */
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 1px minmax(0,1fr)', gap: '0 1.2rem', alignItems: 'start' }}>
      {home && <TeamHalf lineup={home} teamName={fixture.teams.home.name} />}

      {/* Vertical centre line */}
      <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--csfc-copper-30)', position: 'relative' }}>
        <span style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%) rotate(90deg)',
          background: 'var(--csfc-bg-panel)', padding: '0 0.4rem',
          fontSize: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--csfc-copper)',
          letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>
          Centre
        </span>
      </div>

      {away && <TeamHalf lineup={away} teamName={fixture.teams.away.name} />}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const chipStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.1rem',
  padding: '0.3rem 0.45rem',
  border: '1px solid var(--csfc-copper-30)',
  background: 'var(--csfc-glass)',
  minWidth: '2.8rem',
  cursor: 'default',
};
