'use client';

import { useEffect } from 'react';
import { keepPreviousData, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

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

/** Statuses that indicate a match has finished — its details are cacheable ~immutably. */
export const FINISHED_STATUSES = new Set(['FT', 'AET', 'PEN']);

/**
 * Per-fixture detail endpoints cache aggressively once a match is finished
 * (events/lineups/stats never change again) but stay near-real-time while
 * live. `isLive` selects which cache tier the route serves.
 */
function detailUrl(base: string, isLive: boolean): string {
  return `${base}?live=${isLive ? 1 : 0}`;
}

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
      fetchJson<{ events: RawEvent[] }>(detailUrl(`/api/fixtures/${fixtureId}/events`, isLive)).then(
        (r) => r.events,
      ),
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
      fetchJson<{ lineups: RawLineup[] }>(detailUrl(`/api/fixtures/${fixtureId}/lineups`, isLive)).then(
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
        detailUrl(`/api/fixtures/${fixtureId}/statistics`, isLive),
      ).then((r) => r.statistics),
    enabled: fixtureId !== null,
    placeholderData: keepPreviousData,
    staleTime: STALE_MS,
    refetchInterval: isLive ? LIVE_DETAIL_REFETCH_MS : false,
  });
}

/**
 * Bulk-loads events for several finished fixtures (e.g. the scorer rows in
 * the fixtures list). Shares the `['fixture-events', id]` cache key with
 * `useFixtureEvents`, so a fixture's events are fetched once (cached ~1 day)
 * and reused whether it's the selected match or just listed.
 */
export function useFixturesEvents(fixtureIds: string[]): Map<string, RawEvent[]> {
  return useQueries({
    queries: fixtureIds.map((id) => ({
      queryKey: ['fixture-events', id],
      queryFn: () =>
        fetchJson<{ events: RawEvent[] }>(detailUrl(`/api/fixtures/${id}/events`, false)).then((r) => r.events),
      staleTime: STALE_MS,
    })),
    combine: (results) => {
      const map = new Map<string, RawEvent[]>();
      results.forEach((r, i) => map.set(fixtureIds[i], r.data ?? []));
      return map;
    },
  });
}
