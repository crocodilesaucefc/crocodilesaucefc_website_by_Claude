import type { RawLineup, RawLineupPlayer } from '@/lib/types';
import { scalar, type LedgerRow, type LedgerSection } from '@/lib/data-ledger';

/**
 * One row per named player — label pairs the squad role (Starting XI /
 * Substitute, supplied by us as the layout grouping the user asked for) with
 * the player's own shirt number; value is their name and, where the API
 * supplied one, their position. A player the API listed without a name is
 * skipped entirely — graceful degradation, not a blank row.
 */
function playerRow(entry: RawLineupPlayer, group: string, index: number): LedgerRow | null {
  const name = scalar(entry.player?.name);
  if (!name) return null;

  const number = entry.player?.number;
  const tag = number != null ? `#${number}` : null;
  const pos = scalar(entry.player?.pos);

  return {
    key: `${group}-${index}`,
    label: tag ? `${group} ${tag}` : group,
    value: pos ? `${name} — ${pos}` : name,
  };
}

/**
 * The data-mapping function behind `MatchTactics`: turns the raw
 * `/fixtures/lineups` array into one section per side — titled with the
 * team's own name — covering formation, coach, starting XI and substitutes,
 * each row sourced from that player's own payload entry. A side the API
 * returned with no formation, no coach, and no named players contributes
 * nothing at all.
 */
export function buildLineupsLedger(lineups: RawLineup[]): LedgerSection[] {
  return lineups.flatMap((lineup): LedgerSection[] => {
    const teamName = scalar(lineup.team?.name);
    if (!teamName) return [];

    const rows: LedgerRow[] = [];

    const formation = scalar(lineup.formation);
    if (formation) rows.push({ key: 'formation', label: 'Formation', value: formation });

    const coach = scalar(lineup.coach?.name);
    if (coach) rows.push({ key: 'coach', label: 'Coach', value: coach });

    (lineup.startXI ?? []).forEach((entry, index) => {
      const row = playerRow(entry, 'Starting XI', index);
      if (row) rows.push(row);
    });

    (lineup.substitutes ?? []).forEach((entry, index) => {
      const row = playerRow(entry, 'Substitute', index);
      if (row) rows.push(row);
    });

    return rows.length > 0 ? [{ title: teamName, rows }] : [];
  });
}
