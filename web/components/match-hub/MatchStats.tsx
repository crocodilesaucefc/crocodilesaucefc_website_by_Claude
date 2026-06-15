'use client';

import type { CSSProperties } from 'react';

import { useFixtureStatistics } from '@/lib/queries';
import type { RawFixture, RawStatisticEntry, RawTeamStatistics } from '@/lib/types';
import { HudSkeleton } from './Skeleton';

type Props = { fixture: RawFixture | null; isLive?: boolean };

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Parse a stat value to a number for bar proportion calculation. */
function toNum(v: number | string | null): number {
  if (v == null) return 0;
  if (typeof v === 'number') return v;
  // Strip trailing '%' and convert
  return parseFloat(String(v).replace('%', '')) || 0;
}

/** Build a map of stat type → value for one team. */
function statMap(team: RawTeamStatistics): Map<string, RawStatisticEntry['value']> {
  const m = new Map<string, RawStatisticEntry['value']>();
  for (const s of team.statistics ?? []) {
    if (s.type) m.set(s.type, s.value);
  }
  return m;
}

// ── Stat row — 3-column mirror axis ───────────────────────────────────────────

function StatRow({
  label,
  homeVal,
  awayVal,
}: {
  label: string;
  homeVal: RawStatisticEntry['value'];
  awayVal: RawStatisticEntry['value'];
}) {
  const homeNum = toNum(homeVal);
  const awayNum = toNum(awayVal);
  const total = homeNum + awayNum;
  // When both sides are zero, show 50/50 bars so the layout still renders
  const homePct = total > 0 ? (homeNum / total) * 100 : 50;
  const awayPct = total > 0 ? (awayNum / total) * 100 : 50;

  const displayHome = homeVal != null ? String(homeVal) : '–';
  const displayAway = awayVal != null ? String(awayVal) : '–';

  return (
    <div style={statRowStyle}>
      {/* Left: home value + bar growing rightward */}
      <div style={{ textAlign: 'right', minWidth: 0 }}>
        <span className="csfc-data" style={{ fontSize: '0.78rem' }}>{displayHome}</span>
        <div style={{
          height: '3px',
          marginTop: '0.18rem',
          marginLeft: 'auto',
          width: `${homePct}%`,
          background: 'var(--csfc-copper)',
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Centre: stat label */}
      <div style={{ textAlign: 'center', padding: '0 0.5rem', flexShrink: 0 }}>
        <span className="csfc-eyebrow" style={{ fontSize: '0.62rem', color: 'var(--csfc-text-muted)', whiteSpace: 'nowrap' }}>
          {label}
        </span>
      </div>

      {/* Right: away value + bar growing leftward */}
      <div style={{ textAlign: 'left', minWidth: 0 }}>
        <span className="csfc-data" style={{ fontSize: '0.78rem' }}>{displayAway}</span>
        <div style={{
          height: '3px',
          marginTop: '0.18rem',
          width: `${awayPct}%`,
          background: 'var(--csfc-text-muted)',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function MatchStats({ fixture, isLive = false }: Props) {
  const fixtureId = fixture ? String(fixture.fixture.id) : null;
  const statistics = useFixtureStatistics(fixtureId, isLive);

  if (!fixture) return <p className="csfc-body">Select a match above to see the statistics.</p>;
  if (statistics.isLoading) return <HudSkeleton />;
  if (statistics.isError) return (
    <p className="csfc-body">
      Couldn&apos;t load statistics ({(statistics.error as Error)?.message ?? 'unknown error'}).
    </p>
  );

  const data = statistics.data ?? [];
  if (!data.length) return <p className="csfc-body">Statistics not yet published for this fixture.</p>;

  const [homeTeam, awayTeam] = data;
  if (!homeTeam) return <p className="csfc-body">Statistics not yet published for this fixture.</p>;

  const homeMap = statMap(homeTeam);
  const awayMap = awayTeam ? statMap(awayTeam) : new Map();

  // Stat key order from home team; pick up any away-only keys appended after
  const allKeys = [...new Set([...homeMap.keys(), ...awayMap.keys()])];

  return (
    <div>
      {/* Team key row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', marginBottom: '0.8rem', borderBottom: '1px solid var(--csfc-copper-30)', paddingBottom: '0.5rem' }}>
        <span className="csfc-data" style={{ fontSize: '0.7rem', textAlign: 'right' }}>{homeTeam.team.name}</span>
        <span className="csfc-eyebrow" style={{ fontSize: '0.6rem', color: 'var(--csfc-text-muted)', textAlign: 'center', padding: '0 0.5rem' }}>Key</span>
        <span className="csfc-data" style={{ fontSize: '0.7rem', textAlign: 'left' }}>{awayTeam?.team.name ?? ''}</span>
      </div>

      {/* Stat rows */}
      {allKeys.map((key) => (
        <StatRow
          key={key}
          label={key}
          homeVal={homeMap.get(key) ?? null}
          awayVal={awayMap.get(key) ?? null}
        />
      ))}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const statRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)',
  alignItems: 'center',
  marginBottom: '0.7rem',
};
