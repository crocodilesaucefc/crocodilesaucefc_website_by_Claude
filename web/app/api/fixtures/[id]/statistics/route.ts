import { NextResponse } from 'next/server';

import { getFixtureStatistics } from '@/lib/api-football';

/**
 * Proxies the Stats pane's data feed — keeps `API_FOOTBALL_KEY` server-side.
 *
 * GET /api/fixtures/:id/statistics
 */
export async function GET(request: Request, ctx: RouteContext<'/api/fixtures/[id]/statistics'>) {
  const { id } = await ctx.params;
  const isLive = new URL(request.url).searchParams.get('live') === '1';

  try {
    const statistics = await getFixtureStatistics(id, isLive);
    const res = NextResponse.json({ statistics });
    res.headers.set(
      'Cache-Control',
      isLive
        ? 'public, s-maxage=15, stale-while-revalidate=45'
        : 'public, s-maxage=86400, stale-while-revalidate=604800',
    );
    return res;
  } catch (error) {
    console.error('[api/fixtures/[id]/statistics] fetch failed', error);
    return NextResponse.json({ error: 'Failed to load statistics' }, { status: 502 });
  }
}
