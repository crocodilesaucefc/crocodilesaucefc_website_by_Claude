import { NextResponse } from 'next/server';

import { getFixtureEvents } from '@/lib/api-football';

/**
 * Proxies the Events pane's data feed — keeps `API_FOOTBALL_KEY` server-side.
 *
 * GET /api/fixtures/:id/events
 */
export async function GET(request: Request, ctx: RouteContext<'/api/fixtures/[id]/events'>) {
  const { id } = await ctx.params;
  const isLive = new URL(request.url).searchParams.get('live') === '1';

  try {
    const events = await getFixtureEvents(id, isLive);
    const res = NextResponse.json({ events });
    res.headers.set(
      'Cache-Control',
      isLive
        ? 'public, s-maxage=15, stale-while-revalidate=45'
        : 'public, s-maxage=86400, stale-while-revalidate=604800',
    );
    return res;
  } catch (error) {
    console.error('[api/fixtures/[id]/events] fetch failed', error);
    return NextResponse.json({ error: 'Failed to load events' }, { status: 502 });
  }
}
