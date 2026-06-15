'use client';

import { useFixtureEvents } from '@/lib/queries';
import type { RawFixture } from '@/lib/types';
import { buildEventsLedger } from './events-ledger';
import { RawDataLedger } from './RawDataLedger';
import { HudSkeleton } from './Skeleton';

type Props = { fixture: RawFixture | null; isLive?: boolean };

/** Chronological event log — tab content for Pane 3 "Live Reporting". */
export function MatchEvents({ fixture, isLive = false }: Props) {
  const fixtureId = fixture ? String(fixture.fixture.id) : null;
  const events = useFixtureEvents(fixtureId, isLive);

  if (!fixture) return <p className="csfc-body">Select a match above to see the live event log.</p>;
  if (events.isLoading) return <HudSkeleton />;
  if (events.isError) return <p className="csfc-body">Couldn&apos;t load events ({(events.error as Error)?.message ?? 'unknown error'}).</p>;
  return <RawDataLedger sections={buildEventsLedger(events.data ?? [])} emptyMessage="No events logged yet for this fixture." />;
}
