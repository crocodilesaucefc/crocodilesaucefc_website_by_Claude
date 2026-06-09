import type { RawEvent } from '@/lib/types';
import { scalar, type LedgerRow, type LedgerSection } from '@/lib/data-ledger';

/** API-Sports' own minute fields, translated literally — `67` → `67'`, `{elapsed:90, extra:3}` → `90+3'`. */
function minuteLabel(event: RawEvent): string {
  const elapsed = event.time?.elapsed;
  if (elapsed == null) return '—';
  const extra = event.time?.extra;
  return extra ? `${elapsed}+${extra}'` : `${elapsed}'`;
}

/**
 * Composes one log line entirely from that event's own payload fields —
 * descriptor (detail, falling back to the broader type), who, who assisted,
 * which side, and any referee comments. Every word is a value the API
 * supplied; only the separators between them are ours.
 */
function eventLine(event: RawEvent): string | null {
  const segments: string[] = [];

  const descriptor = scalar(event.detail) ?? scalar(event.type);
  if (descriptor) segments.push(descriptor);

  const player = scalar(event.player?.name);
  if (player) segments.push(player);

  const assist = scalar(event.assist?.name);
  if (assist) segments.push(`(assist: ${assist})`);

  const team = scalar(event.team?.name);
  if (team) segments.push(`— ${team}`);

  const comments = scalar(event.comments);
  if (comments) segments.push(`[${comments}]`);

  return segments.length > 0 ? segments.join(' ') : null;
}

/**
 * The data-mapping function behind `MatchEvents`: turns the raw
 * `/fixtures/events` array into a single chronological log — one row per
 * moment, minute as the label, a line built purely from that event's fields
 * as the value. Order comes from the API's own `time.elapsed`/`time.extra`,
 * never an assumption about how events arrive over the wire.
 */
export function buildEventsLedger(events: RawEvent[]): LedgerSection[] {
  const ordered = [...events].sort((a, b) => {
    const aRank = (a.time?.elapsed ?? 0) * 1000 + (a.time?.extra ?? 0);
    const bRank = (b.time?.elapsed ?? 0) * 1000 + (b.time?.extra ?? 0);
    return aRank - bRank;
  });

  const rows: LedgerRow[] = [];
  ordered.forEach((event, index) => {
    const value = eventLine(event);
    if (value == null) return;
    rows.push({ key: `event-${index}`, label: minuteLabel(event), value });
  });

  return rows.length > 0 ? [{ title: 'Match Events', rows }] : [];
}
