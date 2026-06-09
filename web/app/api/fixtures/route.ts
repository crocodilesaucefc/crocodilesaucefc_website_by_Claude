import { NextResponse } from 'next/server';

import { getFixtures } from '@/lib/api-football';

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Date-driven fixture proxy — keeps API_FOOTBALL_KEY server-side.
 * Navigation is 100% date-keyed; status (live/result/upcoming) is derived
 * server-side from the date vs today.
 *
 * GET /api/fixtures?date=YYYY-MM-DD
 *
 * Dates outside the T±7 horizon return { fixtures: [] } — the client should
 * surface a "no fixtures outside the 7-day window" message in that case.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const date = params.get('date');

  if (!date || !ISO_DATE_RE.test(date)) {
    return NextResponse.json(
      { error: 'date query param must be ISO YYYY-MM-DD' },
      { status: 400 },
    );
  }

  try {
    const fixtures = await getFixtures({ date });
    return NextResponse.json({ fixtures });
  } catch (error) {
    console.error('[api/fixtures] fetch failed', error);
    return NextResponse.json({ error: 'Failed to load fixtures' }, { status: 502 });
  }
}
