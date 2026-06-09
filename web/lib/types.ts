export type FixtureStatus = 'live' | 'upcoming' | 'result';

/**
 * The shape of one item in API-Sports' `/fixtures` response, passed through
 * to the client untouched. Every field below `fixture.id`/`.date`/
 * `.status.short` and `teams`/`goals` is OPTIONAL from the UI's perspective —
 * the live feed may return nulls for not-yet-known data (referee/venue before
 * kickoff, score breakdowns before half-time, etc). The fixture-ledger walks
 * this object generically and renders whatever is actually present.
 */
export type RawTeam = {
  id: number;
  name: string;
  logo?: string | null;
  winner?: boolean | null;
};

export type RawScoreLine = { home: number | null; away: number | null } | null;

export type RawFixture = {
  fixture: {
    id: number;
    referee?: string | null;
    timezone?: string;
    date: string;
    status: { long?: string; short: string; elapsed: number | null };
    venue?: { name?: string | null; city?: string | null } | null;
  };
  league: {
    id?: number;
    name?: string;
    country?: string;
    logo?: string | null;
    flag?: string | null;
    season?: number;
    round: string;
  };
  teams: { home: RawTeam; away: RawTeam };
  goals: { home: number | null; away: number | null };
  score?: {
    halftime?: RawScoreLine;
    fulltime?: RawScoreLine;
    extratime?: RawScoreLine;
    penalty?: RawScoreLine;
  };
};

export type FixturesByStatus = Record<FixtureStatus, RawFixture[]>;

/** One entry from API-Sports' `/fixtures/events` — a chronological match log line. */
export type RawEvent = {
  time: { elapsed: number; extra?: number | null };
  team: { id: number; name: string; logo?: string | null };
  player: { id: number | null; name: string | null };
  assist?: { id: number | null; name: string | null } | null;
  type: string;
  detail?: string | null;
  comments?: string | null;
};

export type RawLineupPlayer = {
  player: {
    id: number | null;
    name: string | null;
    number?: number | null;
    pos?: string | null;
    grid?: string | null;
  };
};

/** One team's entry from API-Sports' `/fixtures/lineups`. */
export type RawLineup = {
  team: { id: number; name: string; logo?: string | null };
  coach?: { id: number | null; name: string | null; photo?: string | null } | null;
  formation?: string | null;
  startXI?: RawLineupPlayer[];
  substitutes?: RawLineupPlayer[];
};

export type RawStatisticEntry = { type: string; value: number | string | null };

/** One team's entry from API-Sports' `/fixtures/statistics`. */
export type RawTeamStatistics = {
  team: { id: number; name: string; logo?: string | null };
  statistics: RawStatisticEntry[];
};
