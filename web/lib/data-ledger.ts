/**
 * Generic, payload-driven label/value mapping primitives shared by every
 * Match Hub pane (header, events, tactics, stats). The rule everywhere it's
 * used: a row exists ONLY if the API returned a non-null, non-empty value for
 * it — there is no "static" label sitting in the UI waiting for data to fill
 * in. Labels are either a literal field the API gave us (e.g. a stat's
 * `type`) or a direct, spin-free translation of the payload's own key names.
 */

export type LedgerRow = { key: string; label: string; value: string };
export type LedgerSection = { title: string; rows: LedgerRow[] };

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** API-Sports represents every score as `{ home, away }` — render that pair as one "H – A" row. */
export function isScorePair(value: unknown): value is { home: unknown; away: unknown } {
  return (
    isPlainObject(value) &&
    'home' in value &&
    'away' in value &&
    !isPlainObject(value.home) &&
    !isPlainObject(value.away)
  );
}

export function scalar(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }
  return null;
}

export function humanizeSegment(segment: string): string {
  const words = segment
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return segment;
  return words.map((w) => (w === 'id' ? 'ID' : w.charAt(0).toUpperCase() + w.slice(1))).join(' ');
}

export function labelFor(path: string[], overrides: Record<string, string>): string {
  const dotted = path.join('.');
  if (overrides[dotted]) return overrides[dotted];
  return path.map(humanizeSegment).join(' — ');
}

/**
 * Walks ANY value from a raw payload — scalar, score-pair, nested object, or
 * array — and emits one row per leaf, skipping anything null, undefined, or
 * blank. This is the engine behind "iterate over the entire object": no field
 * is special-cased into existence or non-existence, the structure decides.
 */
export function flatten(value: unknown, path: string[], overrides: Record<string, string> = {}): LedgerRow[] {
  if (value == null) return [];

  if (isScorePair(value)) {
    const home = scalar(value.home);
    const away = scalar(value.away);
    if (home == null && away == null) return [];
    return [{ key: path.join('.'), label: labelFor(path, overrides), value: `${home ?? '–'} – ${away ?? '–'}` }];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => flatten(item, [...path, `#${index + 1}`], overrides));
  }

  if (isPlainObject(value)) {
    return Object.entries(value).flatMap(([key, v]) => flatten(v, [...path, key], overrides));
  }

  const text = scalar(value);
  return text == null ? [] : [{ key: path.join('.'), label: labelFor(path, overrides), value: text }];
}

export function getAtPath(obj: unknown, segments: string[]): unknown {
  return segments.reduce<unknown>((acc, seg) => (isPlainObject(acc) ? acc[seg] : undefined), obj);
}

export function deleteAtPath(obj: Record<string, unknown>, segments: string[]): void {
  const [head, ...rest] = segments;
  if (rest.length === 0) {
    delete obj[head];
    return;
  }
  const next = obj[head];
  if (isPlainObject(next)) deleteAtPath(next, rest);
}

/** Deep-clones a JSON-shaped raw payload so section extraction can consume (delete) paths without mutating the source. */
export function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
