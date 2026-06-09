import type { RawTeamStatistics } from '@/lib/types';
import { scalar, type LedgerRow, type LedgerSection } from '@/lib/data-ledger';

/**
 * The data-mapping function behind `MatchStats`: turns the raw
 * `/fixtures/statistics` array into one section per side — titled with the
 * team's own name — where every row's label IS the API's own `type` string
 * (e.g. "Ball Possession", "Shots on Goal") and every value is that metric's
 * own `value` (numbers and percentage strings alike). A metric the API
 * tracked but left null for this match is skipped — not shown as "—".
 */
export function buildStatisticsLedger(statistics: RawTeamStatistics[]): LedgerSection[] {
  return statistics.flatMap((entry): LedgerSection[] => {
    const teamName = scalar(entry.team?.name);
    if (!teamName) return [];

    const rows: LedgerRow[] = [];
    (entry.statistics ?? []).forEach((stat, index) => {
      const label = scalar(stat.type);
      const value = scalar(stat.value);
      if (!label || value == null) return;
      rows.push({ key: `${teamName}-${index}`, label, value });
    });

    return rows.length > 0 ? [{ title: teamName, rows }] : [];
  });
}
