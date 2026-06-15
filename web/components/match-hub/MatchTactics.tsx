'use client';

import type { CSSProperties } from 'react';

import { useFixtureEvents, useFixtureLineups } from '@/lib/queries';
import type { RawEvent, RawFixture, RawLineup, RawLineupPlayer } from '@/lib/types';
import { EventIcon } from './EventIcon';
import { HudSkeleton } from './Skeleton';

type Props = { fixture: RawFixture | null; isLive?: boolean };

type SubInfo = { who: string; min: string };
type CardInfo = { type: 'yellow' | 'red'; min: string };

// ── Substitution helpers ──────────────────────────────────────────────────────

/** API-Sports' own minute fields, translated literally — `67` → `67'`, `{elapsed:90, extra:3}` → `90+3'`. */
function minuteLabel(event: RawEvent): string {
  const { elapsed, extra } = event.time;
  return extra ? `${elapsed}+${extra}'` : `${elapsed}'`;
}

/**
 * Map "starter who went off" (by id) → who replaced them + when, for one team.
 * In API-Football `subst` events, `player` is the substitute coming ON and
 * `assist` is the starter going OFF.
 */
function buildSubMap(events: RawEvent[], teamId: number): Map<number, SubInfo> {
  const map = new Map<number, SubInfo>();
  for (const e of events) {
    if (e.type !== 'subst' || e.team.id !== teamId) continue;
    const playerOutId = e.assist?.id;
    const playerInName = e.player.name;
    if (playerOutId == null || !playerInName) continue;
    map.set(playerOutId, { who: playerInName, min: minuteLabel(e) });
  }
  return map;
}

/** Map "player who came on" (by id) → who they replaced + when, for one team. */
function buildCameOnMap(events: RawEvent[], teamId: number): Map<number, SubInfo> {
  const map = new Map<number, SubInfo>();
  for (const e of events) {
    if (e.type !== 'subst' || e.team.id !== teamId) continue;
    const playerInId = e.player.id;
    const playerOut = e.assist?.name;
    if (playerInId == null || !playerOut) continue;
    map.set(playerInId, { who: playerOut, min: minuteLabel(e) });
  }
  return map;
}

/** Map player id → cards received (a player can have two — yellow then red). */
function buildCardMap(events: RawEvent[], teamId: number): Map<number, CardInfo[]> {
  const map = new Map<number, CardInfo[]>();
  for (const e of events) {
    if (e.type !== 'Card' || e.team.id !== teamId) continue;
    const id = e.player.id;
    if (id == null) continue;
    const type: CardInfo['type'] = (e.detail ?? '').toLowerCase().includes('red') ? 'red' : 'yellow';
    const list = map.get(id) ?? [];
    list.push({ type, min: minuteLabel(e) });
    map.set(id, list);
  }
  return map;
}

// ── Player row ─────────────────────────────────────────────────────────────────

/** Green swap-arrow + "{who} {minute}" — used for both subbed-off starters and subs who came on. */
function SwapMarker({ info }: { info: SubInfo }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 8h13M17 8l-3.5-3.5M17 8l-3.5 3.5" fill="none" stroke="#34d399" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 16H7M7 16l3.5-3.5M7 16l3.5 3.5" fill="none" stroke="#34d399" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--csfc-text-muted)', whiteSpace: 'nowrap' }}>
        {info.who} {info.min}
      </span>
    </span>
  );
}

function PlayerRow({
  player,
  sub,
  comeOn,
  cards,
  isCaptain,
}: {
  player: RawLineupPlayer;
  sub?: SubInfo;
  comeOn?: SubInfo;
  cards?: CardInfo[];
  isCaptain?: boolean;
}) {
  const { number, name } = player.player;
  const displayName = name
    ? name.split(' ').length > 1
      ? `${name.split(' ').slice(0, -1).map((p) => `${p[0]}.`).join(' ')} ${name.split(' ').at(-1)}`
      : name
    : '—';
  const swap = sub ?? comeOn;
  const hasMarkers = (cards && cards.length > 0) || swap;
  return (
    <div style={playerRowStyle}>
      <span style={numberCircleStyle}>{number ?? '?'}</span>
      <span className="csfc-data" style={{ fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {displayName}{isCaptain ? ' (c)' : ''}
      </span>
      {hasMarkers && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginLeft: 'auto', flexShrink: 0 }}>
          {cards?.map((c, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.1rem' }}>
              <EventIcon type={c.type} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--csfc-text-muted)', whiteSpace: 'nowrap' }}>
                {c.min}
              </span>
            </span>
          ))}
          {swap && <SwapMarker info={swap} />}
        </span>
      )}
    </div>
  );
}

// ── Team column ────────────────────────────────────────────────────────────────

function TeamColumn({
  lineup,
  subMap,
  cameOnMap,
  cardMap,
}: {
  lineup: RawLineup;
  subMap: Map<number, SubInfo>;
  cameOnMap: Map<number, SubInfo>;
  cardMap: Map<number, CardInfo[]>;
}) {
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
            Formation {lineup.formation}
          </span>
        )}
      </div>

      {/* Starting XI */}
      {starters.map((p, i) => (
        <PlayerRow
          key={p.player.id ?? `xi-${i}`}
          player={p}
          sub={p.player.id != null ? subMap.get(p.player.id) : undefined}
          cards={p.player.id != null ? cardMap.get(p.player.id) : undefined}
          isCaptain={p.player.captain === true}
        />
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
            <PlayerRow
              key={p.player.id ?? `sub-${i}`}
              player={p}
              comeOn={p.player.id != null ? cameOnMap.get(p.player.id) : undefined}
              cards={p.player.id != null ? cardMap.get(p.player.id) : undefined}
              isCaptain={p.player.captain === true}
            />
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
  const events = useFixtureEvents(fixtureId, isLive);

  if (!fixture) return <p className="csfc-body">Select a match above to see the line-ups.</p>;
  if (lineups.isLoading) return <HudSkeleton />;
  if (lineups.isError) return (
    <p className="csfc-body">
      Couldn&apos;t load lineups ({(lineups.error as Error)?.message ?? 'unknown error'}).
    </p>
  );
  if (!lineups.data?.length) return (
    <p className="csfc-body">Lineups not yet published for this fixture.</p>
  );

  const [home, away] = lineups.data;
  const eventList = events.data ?? [];

  return (
    /* BBC-style 2-column mirror layout — home left, away right, shared divider */
    <div className="hud-lineups" style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0 1.2rem', alignItems: 'start' }}>
      {home && (
        <TeamColumn
          lineup={home}
          subMap={buildSubMap(eventList, home.team.id)}
          cameOnMap={buildCameOnMap(eventList, home.team.id)}
          cardMap={buildCardMap(eventList, home.team.id)}
        />
      )}
      {/* Centre divider */}
      <div style={{ width: 1, background: 'var(--csfc-copper-30)', alignSelf: 'stretch' }} />
      {away && (
        <TeamColumn
          lineup={away}
          subMap={buildSubMap(eventList, away.team.id)}
          cameOnMap={buildCameOnMap(eventList, away.team.id)}
          cardMap={buildCardMap(eventList, away.team.id)}
        />
      )}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const playerRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '0.2rem 0.5rem',
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
