'use client';

import { useEffect } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';

import type { RawEvent, RawFixture, RawLineup, RawTeamStatistics } from './types';

/** Live/today fixtures auto-refresh — 60s balances freshness against API quota. */
const LIVE_REFETCH_MS = 60_000;

/** Per-fixture detail panes poll faster while the match is actually live. */
const LIVE_DETAIL_REFETCH_MS = 25_000;

/** Recently loaded dates/fixtures stay fresh without refetching for this long. */
const STALE_MS = 30_000;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

function fetchFixturesByDate(date: string, timezone: string): Promise<RawFixture[]> {
  return fetchJson<{ fixtures: RawFixture[] }>(
    `/api/fixtures?date=${encodeURIComponent(date)}&tz=${encodeURIComponent(timezone)}`,
  ).then((r) => r.fixtures);
}

/** Shift an ISO YYYY-MM-DD date by `days` (UTC, DST-safe). */
function shiftIso(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Fetch fixtures for one calendar date, bucketed by the given IANA timezone.
 * - `autoRefresh` should be true only when `date` is "today" in that
 *   timezone — keeps the live feed updating without polling dates that
 *   can't change.
 */
export function useFixtures(date: string, timezone: string, autoRefresh: boolean, initialData?: RawFixture[]) {
  return useQuery({
    queryKey: ['fixtures', date, timezone],
    queryFn: () => fetchFixturesByDate(date, timezone),
    initialData,
    placeholderData: keepPreviousData,
    staleTime: STALE_MS,
    refetchInterval: autoRefresh ? LIVE_REFETCH_MS : false,
  });
}

/**
 * Prefetches yesterday's and tomorrow's fixtures so the first click on the
 * date strip is instant.
 */
export function usePrefetchNeighbourDates(activeDate: string, timezone: string) {
  const qc = useQueryClient();
  useEffect(() => {
    for (const d of [shiftIso(activeDate, -1), shiftIso(activeDate, 1)]) {
      qc.prefetchQuery({
        queryKey: ['fixtures', d, timezone],
        queryFn: () => fetchFixturesByDate(d, timezone),
        staleTime: STALE_MS,
      });
    }
  }, [activeDate, timezone, qc]);
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
    placeholderData: keepPreviousData,
    staleTime: STALE_MS,
    refetchInterval: isLive ? LIVE_DETAIL_REFETCH_MS : false,
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
    placeholderData: keepPreviousData,
    staleTime: STALE_MS,
    refetchInterval: isLive ? LIVE_DETAIL_REFETCH_MS : false,
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
    placeholderData: keepPreviousData,
    staleTime: STALE_MS,
    refetchInterval: isLive ? LIVE_DETAIL_REFETCH_MS : false,
  });
}
