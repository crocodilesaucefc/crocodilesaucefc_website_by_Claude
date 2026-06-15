import { NextResponse } from 'next/server';

import { getFixtureLineups } from '@/lib/api-football';

/**
 * Proxies the Tactics pane's data feed — keeps `API_FOOTBALL_KEY` server-side.
 *
 * GET /api/fixtures/:id/lineups
 */
export async function GET(request: Request, ctx: RouteContext<'/api/fixtures/[id]/lineups'>) {
  const { id } = await ctx.params;
  const isLive = new URL(request.url).searchParams.get('live') === '1';

  try {
    const lineups = await getFixtureLineups(id, isLive);
    const res = NextResponse.json({ lineups });
    res.headers.set(
      'Cache-Control',
      isLive
        ? 'public, s-maxage=15, stale-while-revalidate=45'
        : 'public, s-maxage=86400, stale-while-revalidate=604800',
    );
    return res;
  } catch (error) {
    console.error('[api/fixtures/[id]/lineups] fetch failed', error);
    return NextResponse.json({ error: 'Failed to load lineups' }, { status: 502 });
  }
}
