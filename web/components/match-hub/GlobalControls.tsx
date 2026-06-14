'use client';

import { useEffect, useMemo, useRef, type CSSProperties } from 'react';

import { GlassPanel } from '@/components/ds';
import { LOCALE_OPTIONS, useLocale } from '@/lib/locale-context';

/** Date is always set — navigation is 100% date-driven, never null. */
export type FixturesFilterState = { date: string };

type GlobalControlsProps = {
  filter: FixturesFilterState;
  onFilterChange: (next: FixturesFilterState) => void;
  /** Today's ISO date in the active timezone — used for highlighting. */
  todayIso: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const SLIDER_DAYS_BEFORE = 7;
const SLIDER_DAYS_AFTER = 21;

/** `en-CA` formats dates as `YYYY-MM-DD` — exactly the API's date shape. */
function isoDateInZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

// ── Calendar icon ─────────────────────────────────────────────────────────────

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <rect x="0.5" y="1.5" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1" />
      <path d="M0.5 4.5h12" stroke="currentColor" strokeWidth="1" />
      <path d="M3.5 0.5v2M9.5 0.5v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function GlobalControls({ filter, onFilterChange, todayIso }: GlobalControlsProps) {
  const { option, setOptionId } = useLocale();
  const sliderRef = useRef<HTMLDivElement>(null);
  const hiddenDateRef = useRef<HTMLInputElement>(null);

  const days = useMemo(() => {
    const now = Date.now();
    const list: { iso: string; date: Date }[] = [];
    for (let offset = -SLIDER_DAYS_BEFORE; offset <= SLIDER_DAYS_AFTER; offset += 1) {
      const date = new Date(now + offset * DAY_MS);
      list.push({ iso: isoDateInZone(date, option.timeZone), date });
    }
    return list;
  }, [option.timeZone]);

  const monthLabel = useMemo(() => {
    const anchor = days.find((d) => d.iso === filter.date)?.date ?? days[SLIDER_DAYS_BEFORE]?.date;
    if (!anchor) return null;
    return new Intl.DateTimeFormat(option.locale, {
      timeZone: option.timeZone,
      month: 'long',
      year: 'numeric',
    }).format(anchor);
  }, [days, filter.date, option.locale, option.timeZone]);

  // Scroll active date into view on mount and when date changes.
  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;
    const activeBtn = container.querySelector('[data-active="true"]') as HTMLElement | null;
    activeBtn?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [filter.date]);

  function handleCalendarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value) onFilterChange({ date: e.target.value });
  }

  return (
    <GlassPanel clip="panel" bracket padding="1.2rem" style={{ marginBottom: '1.6rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.6rem', alignItems: 'flex-start' }}>

        {/* Timezone selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '15rem' }}>
          <span className="csfc-eyebrow" style={{ color: 'var(--csfc-emerald-bright)' }}>
            Timezone &amp; Location
          </span>
          <select value={option.id} onChange={(e) => setOptionId(e.target.value)} style={fieldStyle}>
            {LOCALE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id} style={optionStyle}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '1 1 24rem', minWidth: '18rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.75rem' }}>
            <span className="csfc-eyebrow" style={{ color: 'var(--csfc-emerald-bright)' }}>
              {monthLabel ?? 'Match Date'}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', position: 'relative' }}>
              {/* Jump to today */}
              {filter.date !== todayIso && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ date: todayIso })}
                  className="csfc-eyebrow"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--csfc-copper)',
                    textDecoration: 'underline',
                    padding: 0,
                    fontSize: '0.65rem',
                  }}
                >
                  Jump to today
                </button>
              )}

              {/* Calendar icon — triggers native date picker */}
              <button
                type="button"
                aria-label="Pick a date"
                onClick={() => hiddenDateRef.current?.click()}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.1rem',
                  color: 'var(--csfc-copper)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <CalendarIcon />
              </button>

              {/* Hidden native date input — opened programmatically by the icon */}
              <input
                ref={hiddenDateRef}
                type="date"
                value={filter.date}
                onChange={handleCalendarChange}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0, right: 0, top: 0 }}
                tabIndex={-1}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Scrollable day strip */}
          <div ref={sliderRef} style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
            {days.map(({ iso, date }) => {
              const active = filter.date === iso;
              const isToday = iso === todayIso;
              const weekday = new Intl.DateTimeFormat(option.locale, {
                timeZone: option.timeZone,
                weekday: 'short',
              }).format(date);
              const day = new Intl.DateTimeFormat(option.locale, {
                timeZone: option.timeZone,
                day: 'numeric',
              }).format(date);

              return (
                <button
                  key={iso}
                  type="button"
                  data-active={String(active)}
                  onClick={() => onFilterChange({ date: iso })}
                  className="ds-clip-tag"
                  style={{
                    flex: '0 0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.2rem',
                    padding: '0.5rem 0.7rem',
                    minWidth: '3.2rem',
                    fontFamily: 'var(--font-display)',
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--tracking-wide)',
                    fontSize: '0.65rem',
                    color: active ? 'var(--csfc-bronze)' : 'var(--csfc-text-muted)',
                    background: active ? 'linear-gradient(180deg,#0c1424,#070d1a)' : 'transparent',
                    border: `1px solid ${active ? 'var(--csfc-copper)' : 'var(--csfc-copper-30)'}`,
                    /* Today indicator — copper underline on the button itself */
                    borderBottom: isToday
                      ? `2px solid var(--csfc-copper)`
                      : `1px solid ${active ? 'var(--csfc-copper)' : 'var(--csfc-copper-30)'}`,
                    cursor: 'pointer',
                    transition: 'var(--transition-all)',
                  }}
                >
                  <span>{isToday ? 'Today' : weekday}</span>
                  <span className="csfc-data" style={{ fontSize: '0.95rem' }}>
                    {day}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </GlassPanel>
  );
}

const fieldStyle: CSSProperties = {
  background: 'var(--csfc-glass)',
  border: '1px solid var(--csfc-copper-30)',
  borderRadius: 0,
  padding: '0.6rem 0.8rem',
  fontSize: '0.8rem',
  color: 'var(--text-data)',
  fontFamily: 'var(--font-mono)',
};

const optionStyle: CSSProperties = { background: '#0a1424', color: 'var(--text-data)' };
