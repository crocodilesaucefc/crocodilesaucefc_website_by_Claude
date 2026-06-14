'use client';

import { GlassPanel } from '@/components/ds';
import type { RawFixture } from '@/lib/types';
import { buildFixtureLedger } from './fixture-ledger';
import { RawDataLedger } from './RawDataLedger';

type MatchHeaderProps = { fixture: RawFixture | null };

/**
 * Header pane — reuses the exact fixture-ledger mapping the Hub already
 * walks (Match ID, score, status, officials, venue, competition), grouped
 * the same way. The "controller" simply changes which fixture this pane
 * (and the other three) is pointed at.
 */
export function MatchHeader({ fixture }: MatchHeaderProps) {
  return (
    <GlassPanel clip="panel" bracket padding="1.4rem" style={{ height: '100%' }}>
      <span className="csfc-display" style={{ display: 'block', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
        Header
      </span>
      {fixture ? (
        <RawDataLedger sections={buildFixtureLedger(fixture)} />
      ) : (
        <p className="csfc-body">Select a fixture from the list to populate this pane.</p>
      )}
    </GlassPanel>
  );
}
