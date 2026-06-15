'use client';

import { useFixtureEvents } from '@/lib/queries';
import type { RawEvent, RawFixture } from '@/lib/types';
import { EventIcon, type EventIconType } from './EventIcon';
import { HudSkeleton } from './Skeleton';

type Props = { fixture: RawFixture | null; isLive?: boolean };

/** API-Sports' own minute fields, translated literally — `67` → `67'`, `{elapsed:90, extra:3}` → `90+3'`. */
function minuteLabel(event: RawEvent): string {
  const { elapsed, extra } = event.time;
  return extra ? `${elapsed}+${extra}'` : `${elapsed}'`;
}

/** Map an API-Football event to one of the icon chip types. */
function eventIconType(event: RawEvent): EventIconType {
  if (event.type === 'Goal') return 'goal';
  if (event.type === 'Card') {
    if (event.detail === 'Yellow Card') return 'yellow';
    if (event.detail === 'Red Card' || event.detail === 'Second Yellow card') return 'red';
    return 'other';
  }
  if (event.type === 'subst') return 'sub';
  return 'other';
}

/** Player name + uppercase sub-label for an event row. */
function eventLabel(event: RawEvent): { name: string; sub: string } {
  if (event.type === 'subst') {
    const out = event.assist?.name;
    return { name: event.player.name ?? '—', sub: out ? `For ${out}` : 'Substitution' };
  }
  return { name: event.player.name ?? '—', sub: event.detail ?? event.type };
}

function EventCell({ event, side }: { event: RawEvent; side: 'home' | 'away' }) {
  const { name, sub } = eventLabel(event);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.55rem',
        flexDirection: side === 'home' ? 'row-reverse' : 'row',
        textAlign: side === 'home' ? 'right' : 'left',
        minWidth: 0,
      }}
    >
      <EventIcon type={eventIconType(event)} />
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3, minWidth: 0 }}>
        <span className="csfc-data" style={{ fontSize: '0.8rem', color: 'var(--csfc-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name}
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.56rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--csfc-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {sub}
        </span>
      </span>
    </div>
  );
}

/** Live Reporting pane — icon-led, mirror-axis event feed (home left, away right, minute centered). */
export function MatchEvents({ fixture, isLive = false }: Props) {
  const fixtureId = fixture ? String(fixture.fixture.id) : null;
  const events = useFixtureEvents(fixtureId, isLive);

  if (!fixture) return <p className="csfc-body">Select a match above to see the live event log.</p>;
  if (events.isLoading) return <HudSkeleton />;
  if (events.isError) return <p className="csfc-body">Couldn&apos;t load events ({(events.error as Error)?.message ?? 'unknown error'}).</p>;

  const ordered = [...(events.data ?? [])].sort((a, b) => {
    const aRank = (a.time?.elapsed ?? 0) * 1000 + (a.time?.extra ?? 0);
    const bRank = (b.time?.elapsed ?? 0) * 1000 + (b.time?.extra ?? 0);
    return aRank - bRank;
  });

  if (ordered.length === 0) return <p className="csfc-body">No events logged yet for this fixture.</p>;

  const homeTeamId = fixture.teams.home.id;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {ordered.map((event, i) => {
        const side: 'home' | 'away' = event.team.id === homeTeamId ? 'home' : 'away';
        return (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) 3.4rem minmax(0,1fr)',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 0',
              borderBottom: '1px solid var(--csfc-copper-30)',
            }}
          >
            <div>{side === 'home' && <EventCell event={event} side={side} />}</div>
            <div style={{ textAlign: 'center' }}>
              <span className="csfc-data" style={{ fontSize: '0.72rem', color: eventIconType(event) === 'goal' ? 'var(--csfc-copper-bright)' : 'var(--csfc-text-muted)' }}>
                {minuteLabel(event)}
              </span>
            </div>
            <div>{side === 'away' && <EventCell event={event} side={side} />}</div>
          </div>
        );
      })}
    </div>
  );
}
