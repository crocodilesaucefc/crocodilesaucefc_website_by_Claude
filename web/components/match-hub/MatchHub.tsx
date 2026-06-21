'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';

import { GlassPanel } from '@/components/ds';
import { useLocale } from '@/lib/locale-context';
import {
  FINISHED_STATUSES,
  LIVE_STATUSES,
  useFixtureEvents,
  useFixtures,
  useFixturesEvents,
  usePrefetchNeighbourDates,
} from '@/lib/queries';
import type { RawEvent, RawFixture, RawTeam } from '@/lib/types';
import { GlobalControls, type FixturesFilterState } from './GlobalControls';
import { MatchEvents } from './MatchEvents';
import { MatchFormation } from './MatchFormation';
import { MatchStats } from './MatchStats';
import { MatchTactics } from './MatchTactics';
import { FixtureListSkeleton } from './Skeleton';

type HudTab = 'events' | 'lineups' | 'formation' | 'stats';

const HUD_TABS: { id: HudTab; label: string }[] = [
  { id: 'events', label: 'Live Reporting' },
  { id: 'lineups', label: 'Line-ups' },
  { id: 'formation', label: 'Formation' },
  { id: 'stats', label: 'Match Stats' },
];

type MatchHubProps = {
  /** Today's fixtures pre-fetched server-side. */
  initialFixtures?: RawFixture[];
  /** Server's today ISO (Vancouver TZ) — seeds the default date. */
  initialDate?: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Compute today's ISO date in the given IANA timezone. */
function localTodayIso(timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** Derive a display label from the selected date vs today. */
function deriveStatusLabel(date: string, todayIso: string): string {
  if (date < todayIso) return 'Results';
  if (date > todayIso) return 'Upcoming';
  return 'Live · Today';
}

/** Returns true if the selected date is outside the ±7-day API horizon. */
function isOutsideHorizon(date: string, todayIso: string): boolean {
  const HORIZON_MS = 7 * 24 * 60 * 60 * 1000;
  const d = new Date(`${date}T12:00:00Z`).getTime();
  const t = new Date(`${todayIso}T12:00:00Z`).getTime();
  return Math.abs(d - t) > HORIZON_MS;
}

// ── Goal scorer helpers ────────────────────────────────────────────────────────

function scorerMinute(e: RawEvent): string {
  return e.time.extra ? `${e.time.elapsed}'+${e.time.extra}` : `${e.time.elapsed}'`;
}

/** One line per scorer on this side, e.g. "Havertz 45'+5, 88'" — multiple goals combined. */
function buildScorerLines(events: RawEvent[], teamId: number): string[] {
  const goals = events.filter(
    (e) => e.type === 'Goal' && e.detail !== 'Missed Penalty' && e.team.id === teamId,
  );
  const order: Array<number | string> = [];
  const byPlayer = new Map<number | string, { name: string; minutes: string[]; og: boolean }>();
  for (const e of goals) {
    const name = (e.player.name ?? '').split(' ').at(-1) ?? '';
    const key = e.player.id ?? name;
    if (!byPlayer.has(key)) {
      byPlayer.set(key, { name, minutes: [], og: e.detail === 'Own Goal' });
      order.push(key);
    }
    byPlayer.get(key)!.minutes.push(scorerMinute(e));
  }
  return order.map((key) => {
    const { name, minutes, og } = byPlayer.get(key)!;
    return `${name} ${minutes.join(', ')}${og ? ' (OG)' : ''}`;
  });
}

function buildSplitGoalScorers(
  events: RawEvent[],
  homeTeamId: number,
  awayTeamId: number,
): { home: string[]; away: string[] } {
  return {
    home: buildScorerLines(events, homeTeamId),
    away: buildScorerLines(events, awayTeamId),
  };
}

// ── Team Logo ─────────────────────────────────────────────────────────────────

function TeamLogo({ team }: { team: RawTeam }) {
  const words = team.name.replace(/[^A-Za-z ]/g, ' ').trim().split(/\s+/);
  const abbr = (words.length >= 2
    ? words.map((w) => w[0] ?? '').join('').slice(0, 3)
    : team.name.slice(0, 3)
  ).toUpperCase();

  if (!team.logo) return <span style={abbrStyle}>{abbr}</span>;

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={team.logo}
        alt={team.name}
        width={32}
        height={32}
        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
        onError={(e) => {
          const img = e.currentTarget;
          img.style.display = 'none';
          const fallback = img.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = 'inline-flex';
        }}
      />
      <span style={{ ...abbrStyle, display: 'none', position: 'absolute', inset: 0, width: '100%', height: '100%' }}>{abbr}</span>
    </span>
  );
}

// ── Fixture row — BBC 3-column mirror-axis grid ───────────────────────────────

function FixtureRow({
  raw,
  active,
  onClick,
  homeGoalScorers,
  awayGoalScorers,
  formatDateTime,
}: {
  raw: RawFixture;
  active: boolean;
  onClick: () => void;
  homeGoalScorers: string[];
  awayGoalScorers: string[];
  formatDateTime: (iso: string, opts?: Intl.DateTimeFormatOptions) => string;
}) {
  const { teams, goals, fixture, league, score } = raw;
  const statusShort = fixture.status.short;
  const elapsed = fixture.status.elapsed;
  const liveStatuses = ['1H', '2H', 'ET', 'BT', 'P', 'INT'];
  const statusLabel = elapsed != null && liveStatuses.includes(statusShort)
    ? `${elapsed}'`
    : statusShort;

  const homeScore = goals.home != null ? String(goals.home) : '–';
  const awayScore = goals.away != null ? String(goals.away) : '–';
  const htHome = score?.halftime?.home;
  const htAway = score?.halftime?.away;
  const htLabel = htHome != null && htAway != null ? `HT ${htHome}–${htAway}` : null;

  const kickoff = fixture.date
    ? formatDateTime(fixture.date, { hour: 'numeric', minute: '2-digit' })
    : null;

  const hasScorers = homeGoalScorers.length > 0 || awayGoalScorers.length > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '0.65rem 1rem',
        background: active ? 'linear-gradient(180deg,#0c1424,#070d1a)' : 'transparent',
        borderTop: 'none',
        borderRight: 'none',
        borderLeft: 'none',
        borderBottom: `1px solid ${active ? 'var(--csfc-copper)' : 'var(--csfc-copper-30)'}`,
        cursor: 'pointer',
        transition: 'var(--transition-all)',
        outline: active ? '1px solid var(--csfc-copper-30)' : 'none',
        outlineOffset: '-1px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 5.5rem minmax(0,1fr)',
        rowGap: '0.2rem',
        columnGap: '0.25rem',
        alignItems: 'center',
      }}
    >
      {/* Row 1: team names + score */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem', minWidth: 0, overflow: 'hidden' }}>
        <span className="csfc-data" style={{ fontSize: '0.75rem', color: 'var(--csfc-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {teams.home.name}
        </span>
        <TeamLogo team={teams.home} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span className="csfc-data" style={{
          fontSize: '1.25rem', lineHeight: 1, letterSpacing: '0.06em',
          color: active ? 'var(--csfc-copper-bright)' : 'var(--csfc-text-primary)',
        }}>
          {homeScore} – {awayScore}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '0.4rem', minWidth: 0, overflow: 'hidden' }}>
        <TeamLogo team={teams.away} />
        <span className="csfc-data" style={{ fontSize: '0.75rem', color: 'var(--csfc-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {teams.away.name}
        </span>
      </div>

      {/* Row 2: status — centered */}
      <div />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span className="csfc-eyebrow" style={{ fontSize: '0.58rem', color: active ? 'var(--csfc-copper)' : 'var(--csfc-text-muted)' }}>
          {kickoff ? `${kickoff} · ` : ''}{statusLabel}{htLabel ? ` · ${htLabel}` : ''}
        </span>
      </div>
      <div />

      {/* Row 3: goal scorers split to each side, with the ball between them */}
      {hasScorers && (
        <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr auto 1fr', columnGap: '0.4rem', alignItems: 'start', marginTop: '0.15rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.1rem' }}>
            {homeGoalScorers.map((s, i) => (
              <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--csfc-text-muted)' }}>{s}</span>
            ))}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/ball_cutout.png" alt="" aria-hidden="true" style={{ width: 11, height: 11, objectFit: 'contain', opacity: 0.85, marginTop: 1 }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.1rem' }}>
            {awayGoalScorers.map((s, i) => (
              <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--csfc-text-muted)' }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Row 4: league meta — full-width centered */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
        {league.flag && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={league.flag} alt="" width={14} height={10} style={{ objectFit: 'contain', flexShrink: 0 }} />
        )}
        <span className="csfc-eyebrow" style={{ fontSize: '0.58rem', color: 'var(--csfc-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {[league.name, league.round].filter(Boolean).join(' · ')}
        </span>
      </div>
    </button>
  );
}

// ── MatchHub — 3-pane date-driven layout ──────────────────────────────────────

export function MatchHub({ initialFixtures, initialDate }: MatchHubProps) {
  const { option, formatDateTime } = useLocale();

  // Today in the active locale timezone
  const todayIso = useMemo(() => localTodayIso(option.timeZone), [option.timeZone]);

  // Seed from server-provided date or fallback to client's today
  const [filter, setFilter] = useState<FixturesFilterState>(() => ({
    date: initialDate ?? localTodayIso('America/Vancouver'),
  }));

  const [hudTab, setHudTab] = useState<HudTab>('events');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const isToday = filter.date === todayIso;
  const outsideHorizon = isOutsideHorizon(filter.date, todayIso);
  const statusLabel = deriveStatusLabel(filter.date, todayIso);

  const fixtures = useFixtures(
    filter.date,
    option.timeZone,
    isToday, // auto-refresh only for today
    isToday ? initialFixtures : undefined,
  );

  const data = useMemo(() => fixtures.data ?? [], [fixtures.data]);

  // Warm the cache for yesterday/tomorrow so the date strip feels instant
  usePrefetchNeighbourDates(filter.date, option.timeZone);

  // Keep selection pointing at a real fixture
  useEffect(() => {
    if (data.length === 0) { setSelectedId(null); return; }
    if (!data.some((r) => r.fixture.id === selectedId)) {
      setSelectedId(data[0].fixture.id);
    }
  }, [data, selectedId]);

  const selected = data.find((r) => r.fixture.id === selectedId) ?? null;

  // True only while the match is actively in progress
  const isSelectedLive = selected != null && LIVE_STATUSES.has(selected.fixture.status.short);

  // Hoist events for split goal-scorer display in Pane 2; poll when live
  const selectedEvents = useFixtureEvents(selectedId != null ? String(selectedId) : null, isSelectedLive);
  const splitScorers = useMemo(
    () => buildSplitGoalScorers(
      selectedEvents.data ?? [],
      selected?.teams.home.id ?? -1,
      selected?.teams.away.id ?? -2,
    ),
    [selectedEvents.data, selected],
  );

  // Bulk-load events for every finished fixture so each row can show its own
  // scorers (cached ~1 day per fixture — see useFixturesEvents).
  const finishedFixtureIds = useMemo(
    () => data.filter((r) => FINISHED_STATUSES.has(r.fixture.status.short)).map((r) => String(r.fixture.id)),
    [data],
  );
  const finishedEvents = useFixturesEvents(finishedFixtureIds);
  const finishedScorers = useMemo(() => {
    const map = new Map<number, { home: string[]; away: string[] }>();
    for (const raw of data) {
      if (!FINISHED_STATUSES.has(raw.fixture.status.short)) continue;
      const events = finishedEvents.get(String(raw.fixture.id)) ?? [];
      map.set(raw.fixture.id, buildSplitGoalScorers(events, raw.teams.home.id, raw.teams.away.id));
    }
    return map;
  }, [data, finishedEvents]);

  return (
    <section id="match-hub" className="section anchor" data-screen-label="Match Hub" style={{ maxWidth: '64rem', margin: '0 auto' }}>

      {/* Section header — matches Trending Clips / The Armory heading pattern */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.8rem' }}>
        <div>
          <div className="eyebrow">Live Football · Every Fixture</div>
          <h2 className="csfc-display-gradient" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Match Hub</h2>
        </div>
        <span className="csfc-eyebrow" style={{
          fontSize: '0.65rem',
          color: isToday ? 'var(--csfc-copper-bright)' : 'var(--csfc-text-muted)',
          letterSpacing: 'var(--tracking-wide)',
          marginBottom: '0.3rem',
        }}>
          {statusLabel}
        </span>
      </div>

      {/* Pane 1 — Timezone + Date Slider */}
      <GlobalControls filter={filter} onFilterChange={setFilter} todayIso={todayIso} />

      {/* Pane 2 — Scrollable match list */}
      <GlassPanel clip="panel" bracket padding="0" style={{ marginBottom: '1.6rem' }}>
        <div style={{ padding: '0.7rem 1rem', borderBottom: '1px solid var(--csfc-copper-30)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="csfc-eyebrow" style={{ color: 'var(--csfc-emerald-bright)' }}>
            Fixtures
          </span>
          <span className="csfc-eyebrow" style={{ fontSize: '0.6rem', color: 'var(--csfc-text-muted)' }}>
            {new Intl.DateTimeFormat(option.locale, { timeZone: option.timeZone, weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(`${filter.date}T12:00:00Z`))}
          </span>
          {fixtures.isFetching && !fixtures.isLoading && (
            <span className="csfc-eyebrow" style={{ fontSize: '0.6rem', color: 'var(--csfc-text-muted)', marginLeft: 'auto' }}>Updating…</span>
          )}
        </div>

        <div style={{ height: '32rem', overflowY: 'auto' }}>
          {outsideHorizon && (
            <p className="csfc-body" style={{ padding: '1rem' }}>
              No fixtures available — date is outside the 7-day window (T±7).
            </p>
          )}
          {!outsideHorizon && fixtures.isLoading && <FixtureListSkeleton />}
          {!outsideHorizon && fixtures.isError && (
            <p className="csfc-body" style={{ padding: '1rem' }}>
              Fixtures unavailable — the data feed may be temporarily rate-limited.{' '}
              <button type="button" onClick={() => fixtures.refetch()} className="csfc-data" style={retryStyle}>
                Retry
              </button>
            </p>
          )}
          {!outsideHorizon && !fixtures.isLoading && !fixtures.isError && data.length === 0 && (
            <p className="csfc-body" style={{ padding: '1rem' }}>No fixtures found for this date.</p>
          )}
          {data.map((raw) => {
            const isSelected = raw.fixture.id === selectedId;
            const isFinished = FINISHED_STATUSES.has(raw.fixture.status.short);
            const scorers = isFinished
              ? finishedScorers.get(raw.fixture.id) ?? { home: [], away: [] }
              : isSelected
                ? splitScorers
                : { home: [], away: [] };
            return (
              <FixtureRow
                key={raw.fixture.id}
                raw={raw}
                active={isSelected}
                onClick={() => setSelectedId(raw.fixture.id)}
                homeGoalScorers={scorers.home}
                awayGoalScorers={scorers.away}
                formatDateTime={formatDateTime}
              />
            );
          })}
        </div>
      </GlassPanel>

      {/* Pane 3 — HUD details */}
      <GlassPanel clip="panel" bracket padding="0" style={{ minHeight: '500px' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--csfc-copper-30)', alignItems: 'stretch' }}>
          {HUD_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setHudTab(t.id)}
              className="csfc-eyebrow"
              style={{
                flex: 1,
                padding: '0.75rem 0.5rem',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${hudTab === t.id ? 'var(--csfc-copper)' : 'transparent'}`,
                color: hudTab === t.id ? 'var(--csfc-copper-bright)' : 'var(--csfc-text-muted)',
                cursor: 'pointer',
                fontSize: '0.7rem',
                letterSpacing: 'var(--tracking-wide)',
                textTransform: 'uppercase',
                transition: 'var(--transition-all)',
              }}
            >
              {t.label}
            </button>
          ))}

          {/* Live sync indicator — only shown when selected fixture is in-progress */}
          {isSelectedLive && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0 0.9rem',
              borderLeft: '1px solid var(--csfc-copper-30)',
              flexShrink: 0,
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                flexShrink: 0,
                background: selectedEvents.isFetching && !selectedEvents.isLoading
                  ? 'var(--csfc-emerald-bright)'
                  : 'var(--csfc-copper)',
                boxShadow: selectedEvents.isFetching && !selectedEvents.isLoading
                  ? 'var(--led-emerald)'
                  : '0 0 6px rgb(234 154 46 / 0.7)',
                animation: 'csfcLed 1.4s ease-in-out infinite',
                transition: 'background 0.3s ease, box-shadow 0.3s ease',
              }} />
              <span className="csfc-eyebrow" style={{
                fontSize: '0.6rem',
                color: selectedEvents.isFetching && !selectedEvents.isLoading
                  ? 'var(--csfc-emerald-bright)'
                  : 'var(--csfc-copper)',
                transition: 'color 0.3s ease',
              }}>
                {selectedEvents.isFetching && !selectedEvents.isLoading ? 'Syncing' : 'Live'}
              </span>
            </div>
          )}
        </div>

        {/* Tab content */}
        <div style={{ padding: '1.2rem' }}>
          {hudTab === 'events'    && <MatchEvents   fixture={selected} isLive={isSelectedLive} />}
          {hudTab === 'lineups'   && <MatchTactics  fixture={selected} isLive={isSelectedLive} />}
          {hudTab === 'formation' && <MatchFormation fixture={selected} isLive={isSelectedLive} />}
          {hudTab === 'stats'     && <MatchStats    fixture={selected} isLive={isSelectedLive} />}
        </div>
      </GlassPanel>
    </section>
  );
}

const retryStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  textDecoration: 'underline',
  cursor: 'pointer',
  padding: 0,
};

const abbrStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  fontSize: '0.55rem',
  fontFamily: 'var(--font-mono)',
  fontWeight: 700,
  color: 'var(--csfc-copper)',
  background: 'var(--csfc-glass)',
  border: '1px solid var(--csfc-copper-30)',
  letterSpacing: '0.08em',
  flexShrink: 0,
};
