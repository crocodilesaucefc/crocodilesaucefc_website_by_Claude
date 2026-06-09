import { NextResponse } from 'next/server';

import { getFixtureStatistics } from '@/lib/api-football';

/**
 * Proxies the Stats pane's data feed — keeps `API_FOOTBALL_KEY` server-side.
 *
 * GET /api/fixtures/:id/statistics
 */
export async function GET(_request: Request, ctx: RouteContext<'/api/fixtures/[id]/statistics'>) {
  const { id } = await ctx.params;

  try {
    const statistics = await getFixtureStatistics(id);
    return NextResponse.json({ statistics });
  } catch (error) {
    console.error('[api/fixtures/[id]/statistics] fetch failed', error);
    return NextResponse.json({ error: 'Failed to load statistics' }, { status: 502 });
  }
}
