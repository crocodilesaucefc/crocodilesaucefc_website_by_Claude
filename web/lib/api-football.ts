import 'server-only';

import type {
  FixtureStatus,
  RawEvent,
  RawFixture,
  RawLineup,
  RawTeamStatistics,
} from './types';

const BASE_URL = process.env.API_FOOTBALL_BASE_URL ?? 'https://v3.football.api-sports.io';
const API_KEY = process.env.API_FOOTBALL_KEY;

// ── Status derivation (date → FixtureStatus) ──────────────────────────────────

/** Returns the ISO YYYY-MM-DD for "today" in the given IANA timezone — used for horizon and cache keying. */
export function serverTodayIso(timeZone: string = 'America/Vancouver'): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** Derive feed type from a calendar date vs "today" in the given timezone. */
export function deriveStatus(date: string, timeZone?: string): FixtureStatus {
  const today = serverTodayIso(timeZone);
  if (date < today) return 'result';
  if (date > today) return 'upcoming';
  return 'live';
}

/** Tiered `next.revalidate` window for the fixtures fetch, based on date vs "today" in the given timezone. */
function revalidateForDate(dateIso: string, timeZone: string): number {
  const today = serverTodayIso(timeZone);
  if (dateIso < today) return 86400; // past — finished results never change
  if (dateIso > today) return 3600;  // upcoming — fixtures/kickoffs rarely change before match day
  return 25;                          // today — live scores need freshness
}

/**
 * Per-fixture detail fetches (events/lineups/statistics): a live match polls
 * frequently, but a finished match's events/lineups/stats never change again —
 * cache those ~immutably to protect the API quota.
 */
const LIVE_DETAIL_REVALIDATE = 15;
const FINISHED_DETAIL_REVALIDATE = 86400;

// ── 7-Day API horizon ─────────────────────────────────────────────────────────

const HORIZON_DAYS = 7;
const HORIZON_MS = HORIZON_DAYS * 24 * 60 * 60 * 1000;

function isWithinHorizon(date: string): boolean {
  const now = Date.now();
  // Use noon UTC to avoid DST edge cases
  const d = new Date(`${date}T12:00:00Z`).getTime();
  return Math.abs(d - now) <= HORIZON_MS;
}

// ── Immutable cache for historical dates ──────────────────────────────────────

// Keyed by `${date}__${timezone}`; set once, never invalidated — past results don't change.
const historicalCache = new Map<string, RawFixture[]>();

// ── Content filter ─────────────────────────────────────────────────────────────

function isInternational(f: RawFixture): boolean {
  const country = (f.league.country ?? '').toLowerCase();
  const name = (f.league.name ?? '').toLowerCase();
  return country === 'world' || name.includes('international') || name.includes('friendly');
}

// Strictly exclude women's competitions — checked before the international pass.
function isWomenFixture(f: RawFixture): boolean {
  const name = (f.league.name ?? '').toLowerCase();
  return (
    name.includes('women') ||
    name.includes("women's") ||
    name.includes('féminin') ||
    name.includes('femenin') ||
    name.includes('ladies') ||
    name.includes('female') ||
    name.includes('girls')
  );
}

// Exclude all age-restricted / youth competitions (U17, U18, U19, U20, U21, U23, etc.).
// Checked against league name AND both team names — youth friendlies often appear
// as "International Friendly" in the league but carry "U19" / "Under 19" in team names.
const YOUTH_RE = /\b(u\.?[-\s]?\d{2}|under[-\s]?\d{2}|youth|junior|age\s+group)\b/i;
function isYouthFixture(f: RawFixture): boolean {
  return (
    YOUTH_RE.test(f.league.name ?? '') ||
    YOUTH_RE.test(f.teams.home.name ?? '') ||
    YOUTH_RE.test(f.teams.away.name ?? '')
  );
}

const EPL_LEAGUE_ID = 39; // API-Football: Premier League (England)

function isEplFixture(f: RawFixture): boolean {
  return f.league.id === EPL_LEAGUE_ID && (f.league.country ?? '').toLowerCase() === 'england';
}

/** Keep only senior men's internationals and EPL-involved fixtures. */
function filterFixtures(fixtures: RawFixture[]): RawFixture[] {
  return fixtures.filter(
    (f) => !isWomenFixture(f) && !isYouthFixture(f) && (isInternational(f) || isEplFixture(f)),
  );
}

// ── API transport ─────────────────────────────────────────────────────────────

function authHeaders(): HeadersInit {
  return { 'x-apisports-key': API_KEY ?? '' };
}

function isConfigured(): boolean {
  return Boolean(API_KEY);
}

async function callApiFootball<T>(path: string, params: Record<string, string>, revalidate: number): Promise<T[]> {
  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  const res = await fetch(url, {
    headers: authHeaders(),
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`API-Football request failed (${res.status}): ${path}`);
  }

  const body = (await res.json()) as { response: T[]; errors?: Record<string, string> | string[] };

  const errs = body.errors;
  if (errs && !Array.isArray(errs) && Object.keys(errs).length > 0) {
    throw new Error(`API-Football: ${Object.values(errs).join('; ')}`);
  }

  return body.response ?? [];
}

// ── Fixtures fetch (always date-keyed) ────────────────────────────────────────

async function fetchFixtures(date: string, timezone: string): Promise<RawFixture[]> {
  return callApiFootball<RawFixture>('/fixtures', { date, timezone }, revalidateForDate(date, timezone));
}

// ── Public API ─────────────────────────────────────────────────────────────────

export type FixturesQuery = {
  /** ISO YYYY-MM-DD. Navigation is 100% date-driven; status is derived here. */
  date: string;
  /** IANA timezone — drives both "today" and the API's date bucketing. */
  timezone?: string;
};

/**
 * Fetches, filters, and caches fixtures for one calendar date.
 *
 * Mock data is served ONLY when no API key is configured (pure UI dev).
 * When a key is present but the quota is exhausted or the response is empty,
 * we return [] — blank is always better than wrong data.
 */
export async function getFixtures(query: FixturesQuery): Promise<RawFixture[]> {
  const { date, timezone = 'America/Vancouver' } = query;

  // No API key at all → serve mock fixtures for UI development only.
  if (!isConfigured()) return getMockFixtures(deriveStatus(date, timezone));

  // Outside 7-day horizon → nothing to show.
  if (!isWithinHorizon(date)) return [];

  const today = serverTodayIso(timezone);
  const isPast = date < today;
  const cacheKey = `${date}__${timezone}`;

  // Historical dates: serve from immutable cache without hitting the API again.
  if (isPast && historicalCache.has(cacheKey)) {
    return historicalCache.get(cacheKey)!;
  }

  try {
    const raw = await fetchFixtures(date, timezone);
    const filtered = filterFixtures(raw);

    if (isPast && filtered.length > 0) {
      historicalCache.set(cacheKey, filtered);
    }

    return filtered; // may be [] — UI shows "No fixtures for this date"
  } catch (err) {
    // Re-throw so the route handler returns 502 and the client shows an error
    // with a Retry button — "No fixtures" must only mean genuinely no matches,
    // not a quota/network failure.
    throw err;
  }
}

// ── Per-fixture detail fetchers ────────────────────────────────────────────────

export async function getFixtureEvents(fixtureId: string, live = false): Promise<RawEvent[]> {
  // Only serve mock data for mock fixture IDs (dev / quota-exhausted fixture list fallback)
  if (!isConfigured() || fixtureId.startsWith('mock-') || fixtureId.startsWith('900')) {
    return getMockEvents(fixtureId);
  }
  try {
    const revalidate = live ? LIVE_DETAIL_REVALIDATE : FINISHED_DETAIL_REVALIDATE;
    return await callApiFootball<RawEvent>('/fixtures/events', { fixture: fixtureId }, revalidate);
  } catch (err) {
    console.warn(`[api-football] events unavailable for ${fixtureId} — ${(err as Error).message}`);
    return [];
  }
}

export async function getFixtureLineups(fixtureId: string, live = false): Promise<RawLineup[]> {
  if (!isConfigured() || fixtureId.startsWith('mock-') || fixtureId.startsWith('900')) {
    return getMockLineups(fixtureId);
  }
  try {
    const revalidate = live ? LIVE_DETAIL_REVALIDATE : FINISHED_DETAIL_REVALIDATE;
    return await callApiFootball<RawLineup>('/fixtures/lineups', { fixture: fixtureId }, revalidate);
  } catch (err) {
    console.warn(`[api-football] lineups unavailable for ${fixtureId} — ${(err as Error).message}`);
    return [];
  }
}

export async function getFixtureStatistics(fixtureId: string, live = false): Promise<RawTeamStatistics[]> {
  if (!isConfigured() || fixtureId.startsWith('mock-') || fixtureId.startsWith('900')) {
    return getMockStatistics(fixtureId);
  }
  try {
    const revalidate = live ? LIVE_DETAIL_REVALIDATE : FINISHED_DETAIL_REVALIDATE;
    return await callApiFootball<RawTeamStatistics>('/fixtures/statistics', { fixture: fixtureId }, revalidate);
  } catch (err) {
    console.warn(`[api-football] statistics unavailable for ${fixtureId} — ${(err as Error).message}`);
    return [];
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// Mock data — representative fixtures matching each FixtureStatus
// ══════════════════════════════════════════════════════════════════════════════

const HOUR = 60 * 60 * 1000;

function getMockFixtures(status: FixtureStatus): RawFixture[] {
  const now = Date.now();
  const iso = (offsetMs: number) => new Date(now + offsetMs).toISOString();
  const wc = (round: string) => ({
    id: 1, name: 'FIFA World Cup', country: 'World', logo: null, flag: null, season: 2026, round,
  });

  if (status === 'live') {
    return [
      {
        fixture: {
          id: 900001, referee: 'S. Marciniak', timezone: 'UTC',
          date: iso(-72 * 60 * 1000),
          status: { long: 'Second Half', short: '2H', elapsed: 72 },
          venue: { name: 'Allianz Arena', city: 'Munich' },
        },
        league: { id: 10, name: 'International Friendly', country: 'World', logo: null, flag: null, season: 2026, round: 'Friendly' },
        teams: {
          home: { id: 2, name: 'France', logo: null, winner: null },
          away: { id: 120, name: 'Northern Ireland', logo: null, winner: null },
        },
        goals: { home: 2, away: 0 },
        score: { halftime: { home: 1, away: 0 }, fulltime: null, extratime: null, penalty: null },
      },
      {
        fixture: {
          id: 900002, referee: 'C. Ramos', timezone: 'UTC',
          date: iso(-54 * 60 * 1000),
          status: { long: 'First Half', short: '1H', elapsed: 54 },
          venue: { name: 'Estadio Azteca', city: 'Mexico City' },
        },
        league: wc('Group Stage - Matchday 3'),
        teams: {
          home: { id: 1, name: 'Argentina', logo: null, winner: null },
          away: { id: 3, name: 'Canada', logo: null, winner: null },
        },
        goals: { home: 1, away: 0 },
        score: { halftime: null, fulltime: null, extratime: null, penalty: null },
      },
      {
        fixture: {
          id: 900003, referee: null, timezone: 'UTC',
          date: iso(-28 * 60 * 1000),
          status: { long: 'First Half', short: '1H', elapsed: 28 },
          venue: { name: 'SoFi Stadium', city: 'Los Angeles' },
        },
        league: wc('Group Stage - Matchday 3'),
        teams: {
          home: { id: 4, name: 'Brazil', logo: null, winner: null },
          away: { id: 5, name: 'Portugal', logo: null, winner: null },
        },
        goals: { home: 0, away: 0 },
        score: { halftime: null, fulltime: null, extratime: null, penalty: null },
      },
    ];
  }

  if (status === 'upcoming') {
    return [
      {
        fixture: {
          id: 900101, referee: 'TBC', timezone: 'UTC',
          date: iso(2 * 24 * HOUR),
          status: { long: 'Not Started', short: 'NS', elapsed: null },
          venue: { name: 'Mercedes-Benz Stadium', city: 'Atlanta' },
        },
        league: wc('Round of 16'),
        teams: {
          home: { id: 5, name: 'Portugal', logo: null, winner: null },
          away: { id: 6, name: 'Spain', logo: null, winner: null },
        },
        goals: { home: null, away: null },
        score: { halftime: null, fulltime: null, extratime: null, penalty: null },
      },
      {
        fixture: {
          id: 900102, referee: null, timezone: 'UTC',
          date: iso(3 * 24 * HOUR + 5 * HOUR),
          status: { long: 'Not Started', short: 'NS', elapsed: null },
          venue: null,
        },
        league: wc('Round of 16'),
        teams: {
          home: { id: 7, name: 'England', logo: null, winner: null },
          away: { id: 8, name: 'Germany', logo: null, winner: null },
        },
        goals: { home: null, away: null },
        score: { halftime: null, fulltime: null, extratime: null, penalty: null },
      },
    ];
  }

  // result
  return [
    {
      fixture: {
        id: 900201, referee: 'S. Okafor', timezone: 'UTC',
        date: iso(-2 * 24 * HOUR),
        status: { long: 'Match Finished', short: 'FT', elapsed: 90 },
        venue: { name: 'Lincoln Financial Field', city: 'Philadelphia' },
      },
      league: wc('Group Stage - Matchday 2'),
      teams: {
        home: { id: 5, name: 'Portugal', logo: null, winner: true },
        away: { id: 6, name: 'Spain', logo: null, winner: false },
      },
      goals: { home: 3, away: 2 },
      score: { halftime: { home: 2, away: 1 }, fulltime: { home: 3, away: 2 }, extratime: null, penalty: null },
    },
    {
      fixture: {
        id: 900202, referee: null, timezone: 'UTC',
        date: iso(-3 * 24 * HOUR),
        status: { long: 'Match Finished after Penalties', short: 'PEN', elapsed: 120 },
        venue: { name: 'Arrowhead Stadium', city: 'Kansas City' },
      },
      league: wc('Round of 32'),
      teams: {
        home: { id: 9, name: 'Netherlands', logo: null, winner: true },
        away: { id: 10, name: 'Italy', logo: null, winner: false },
      },
      goals: { home: 1, away: 1 },
      score: {
        halftime: { home: 0, away: 0 },
        fulltime: { home: 1, away: 1 },
        extratime: { home: 1, away: 1 },
        penalty: { home: 4, away: 3 },
      },
    },
  ];
}

function getMockEvents(fixtureId: string): RawEvent[] {
  void fixtureId;
  return [
    {
      time: { elapsed: 23, extra: null },
      team: { id: 1, name: 'Argentina', logo: null },
      player: { id: 101, name: 'L. Martínez' },
      assist: { id: 102, name: 'A. Di María' },
      type: 'Goal',
      detail: 'Normal Goal',
      comments: null,
    },
    {
      time: { elapsed: 41, extra: null },
      team: { id: 2, name: 'Canada', logo: null },
      player: { id: 201, name: 'A. Davies' },
      assist: null,
      type: 'Card',
      detail: 'Yellow Card',
      comments: null,
    },
    {
      time: { elapsed: 67, extra: null },
      team: { id: 1, name: 'Argentina', logo: null },
      player: { id: 103, name: 'G. Álvarez' },
      assist: { id: 101, name: 'L. Martínez' },
      type: 'Goal',
      detail: 'Normal Goal',
      comments: null,
    },
    {
      time: { elapsed: 90, extra: 3 },
      team: { id: 2, name: 'Canada', logo: null },
      player: { id: 202, name: 'J. David' },
      assist: null,
      type: 'subst',
      detail: 'Substitution 1',
      comments: 'Tactical change',
    },
  ];
}

function getMockLineups(fixtureId: string): RawLineup[] {
  void fixtureId;
  return [
    {
      team: { id: 1, name: 'Argentina', logo: null },
      coach: { id: 1, name: 'L. Scaloni', photo: null },
      formation: '4-3-3',
      startXI: [
        { player: { id: 110, name: 'E. Martínez', number: 23, pos: 'G', grid: '1:1' } },
        { player: { id: 111, name: 'N. Molina', number: 26, pos: 'D', grid: '2:4' } },
        { player: { id: 112, name: 'C. Romero', number: 13, pos: 'D', grid: '2:3' } },
        { player: { id: 101, name: 'L. Martínez', number: 22, pos: 'F', grid: '4:2' } },
        { player: { id: 102, name: 'A. Di María', number: 11, pos: 'F', grid: '4:1' } },
      ],
      substitutes: [
        { player: { id: 120, name: 'G. Montiel', number: 4, pos: 'D', grid: null } },
        { player: { id: 103, name: 'G. Álvarez', number: 9, pos: 'F', grid: null } },
      ],
    },
    {
      team: { id: 2, name: 'Canada', logo: null },
      coach: { id: 2, name: 'J. Herdman', photo: null },
      formation: null,
      startXI: [
        { player: { id: 210, name: 'M. Borjan', number: 18, pos: 'G', grid: '1:1' } },
        { player: { id: 201, name: 'A. Davies', number: 19, pos: 'D', grid: '2:1' } },
        { player: { id: 202, name: 'J. David', number: 20, pos: 'F', grid: '4:2' } },
      ],
      substitutes: [
        { player: { id: 220, name: 'T. Hutchinson', number: 7, pos: 'M', grid: null } },
      ],
    },
  ];
}

function getMockStatistics(fixtureId: string): RawTeamStatistics[] {
  void fixtureId;
  return [
    {
      team: { id: 1, name: 'Argentina', logo: null },
      statistics: [
        { type: 'Shots on Goal', value: 7 },
        { type: 'Total Shots', value: 14 },
        { type: 'Ball Possession', value: '58%' },
        { type: 'Corner Kicks', value: 6 },
        { type: 'Offsides', value: null },
      ],
    },
    {
      team: { id: 2, name: 'Canada', logo: null },
      statistics: [
        { type: 'Shots on Goal', value: 3 },
        { type: 'Total Shots', value: 9 },
        { type: 'Ball Possession', value: '42%' },
        { type: 'Corner Kicks', value: 2 },
        { type: 'Offsides', value: 1 },
      ],
    },
  ];
}
