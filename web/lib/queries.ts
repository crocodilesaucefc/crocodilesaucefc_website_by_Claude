'use client';

import { useQuery } from '@tanstack/react-query';

import type { RawEvent, RawFixture, RawLineup, RawTeamStatistics } from './types';

/** Live/today fixtures auto-refresh — 60s balances freshness against API quota. */
const LIVE_REFETCH_MS = 60_000;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

/**
 * Fetch fixtures for one calendar date.
 * - `autoRefresh` should be true only when `date` is today — keeps the live
 *   feed updating without polling dates that can't change.
 */
export function useFixtures(date: string, autoRefresh: boolean, initialData?: RawFixture[]) {
  return useQuery({
    queryKey: ['fixtures', date],
    queryFn: () =>
      fetchJson<{ fixtures: RawFixture[] }>(`/api/fixtures?date=${encodeURIComponent(date)}`).then(
        (r) => r.fixtures,
      ),
    initialData,
    refetchInterval: autoRefresh ? LIVE_REFETCH_MS : false,
  });
}

/** Statuses that indicate a match is currently in progress. */
export const LIVE_STATUSES = new Set(['1H', '2H', 'ET', 'BT', 'P', 'INT']);

/**
 * The remaining hooks back the quad-pane HUD. Each is keyed on the currently-
 * selected fixture id and stays disabled until one is chosen.
 *
 * Pass `isLive = true` to enable 25s polling — only do so when the selected
 * fixture is actively in progress; stops automatically when you stop passing it.
 */
export function useFixtureEvents(fixtureId: string | null, isLive = false) {
  return useQuery({
    queryKey: ['fixture-events', fixtureId],
    queryFn: () =>
      fetchJson<{ events: RawEvent[] }>(`/api/fixtures/${fixtureId}/events`).then((r) => r.events),
    enabled: fixtureId !== null,
    refetchInterval: isLive ? LIVE_REFETCH_MS : false,
  });
}

export function useFixtureLineups(fixtureId: string | null, isLive = false) {
  return useQuery({
    queryKey: ['fixture-lineups', fixtureId],
    queryFn: () =>
      fetchJson<{ lineups: RawLineup[] }>(`/api/fixtures/${fixtureId}/lineups`).then(
        (r) => r.lineups,
      ),
    enabled: fixtureId !== null,
    refetchInterval: isLive ? LIVE_REFETCH_MS : false,
  });
}

export function useFixtureStatistics(fixtureId: string | null, isLive = false) {
  return useQuery({
    queryKey: ['fixture-statistics', fixtureId],
    queryFn: () =>
      fetchJson<{ statistics: RawTeamStatistics[] }>(
        `/api/fixtures/${fixtureId}/statistics`,
      ).then((r) => r.statistics),
    enabled: fixtureId !== null,
    refetchInterval: isLive ? LIVE_REFETCH_MS : false,
  });
}
