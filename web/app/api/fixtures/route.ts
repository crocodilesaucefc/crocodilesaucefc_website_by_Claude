import { NextResponse } from 'next/server';

import { getFixtures, serverTodayIso } from '@/lib/api-football';

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const DEFAULT_TIMEZONE = 'America/Vancouver';

/**
 * Date-driven fixture proxy — keeps API_FOOTBALL_KEY server-side.
 * Navigation is 100% date-keyed; status (live/result/upcoming) is derived
 * server-side from the date vs "today" in the requested timezone.
 *
 * GET /api/fixtures?date=YYYY-MM-DD&tz=America/Vancouver
 *
 * `tz` is an IANA timezone — it drives both the API's date bucketing and
 * the "today" comparison used for cache tiering. Falls back to
 * America/Vancouver if missing.
 *
 * Dates outside the T±7 horizon return { fixtures: [] } — the client should
 * surface a "no fixtures outside the 7-day window" message in that case.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const date = params.get('date');
  const tzParam = params.get('tz');
  const timezone = tzParam && tzParam.trim() ? tzParam : DEFAULT_TIMEZONE;

  if (!date || !ISO_DATE_RE.test(date)) {
    return NextResponse.json(
      { error: 'date query param must be ISO YYYY-MM-DD' },
      { status: 400 },
    );
  }

  try {
    const fixtures = await getFixtures({ date, timezone });
    const res = NextResponse.json({ fixtures });

    const today = serverTodayIso(timezone);
    if (date < today) {
      res.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    } else if (date > today) {
      res.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    } else {
      res.headers.set('Cache-Control', 'public, s-maxage=20, stale-while-revalidate=60');
    }

    return res;
  } catch (error) {
    console.error('[api/fixtures] fetch failed', error);
    return NextResponse.json({ error: 'Failed to load fixtures' }, { status: 502 });
  }
}
