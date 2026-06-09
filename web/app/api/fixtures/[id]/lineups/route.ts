import { NextResponse } from 'next/server';

import { getFixtureLineups } from '@/lib/api-football';

/**
 * Proxies the Tactics pane's data feed — keeps `API_FOOTBALL_KEY` server-side.
 *
 * GET /api/fixtures/:id/lineups
 */
export async function GET(_request: Request, ctx: RouteContext<'/api/fixtures/[id]/lineups'>) {
  const { id } = await ctx.params;

  try {
    const lineups = await getFixtureLineups(id);
    return NextResponse.json({ lineups });
  } catch (error) {
    console.error('[api/fixtures/[id]/lineups] fetch failed', error);
    return NextResponse.json({ error: 'Failed to load lineups' }, { status: 502 });
  }
}
