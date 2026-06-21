'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/**
 * Curated timezone/locale pairings for the Hub's "Timezone & Location"
 * selector — anchored on the 2026 host markets plus major global cities.
 * Each pairing drives BOTH the `Intl` locale (number/date formatting
 * conventions) and the `timeZone` (the actual clock shift) for every
 * formatted value across the Hub.
 */
export type LocaleOption = { id: string; label: string; locale: string; timeZone: string };

export const LOCALE_OPTIONS: LocaleOption[] = [
  // ── UTC ───────────────────────────────────────────────────────────────────
  { id: 'utc',           label: 'UTC — Coordinated Universal Time',        locale: 'en-GB', timeZone: 'UTC' },
  // ── Americas ─────────────────────────────────────────────────────────────
  { id: 'vancouver',     label: 'Vancouver — Pacific Time',                 locale: 'en-CA', timeZone: 'America/Vancouver' },
  { id: 'los-angeles',   label: 'Los Angeles — Pacific Time',               locale: 'en-US', timeZone: 'America/Los_Angeles' },
  { id: 'denver',        label: 'Denver — Mountain Time (MT)',               locale: 'en-US', timeZone: 'America/Denver' },
  { id: 'chicago',       label: 'Chicago — Central Time (CT)',               locale: 'en-US', timeZone: 'America/Chicago' },
  { id: 'mexico-city',   label: 'Mexico City — Central Time',               locale: 'es-MX', timeZone: 'America/Mexico_City' },
  { id: 'toronto',       label: 'Toronto — Eastern Time',                   locale: 'en-CA', timeZone: 'America/Toronto' },
  { id: 'new-york',      label: 'New York — Eastern Time',                  locale: 'en-US', timeZone: 'America/New_York' },
  { id: 'buenos-aires',  label: 'Buenos Aires — Argentina Time',            locale: 'es-AR', timeZone: 'America/Argentina/Buenos_Aires' },
  { id: 'sao-paulo',     label: 'São Paulo — Brasília Time (BRT)',          locale: 'pt-BR', timeZone: 'America/Sao_Paulo' },
  // ── Europe / Africa ───────────────────────────────────────────────────────
  { id: 'london',        label: 'London — Greenwich/British Time',          locale: 'en-GB', timeZone: 'Europe/London' },
  { id: 'paris',         label: 'Paris/Berlin — Central European Time (CET)', locale: 'fr-FR', timeZone: 'Europe/Paris' },
  { id: 'lagos',         label: 'Lagos — West Africa Time (WAT)',           locale: 'en-NG', timeZone: 'Africa/Lagos' },
  { id: 'johannesburg',  label: 'Johannesburg — South Africa Time (SAST)',  locale: 'en-ZA', timeZone: 'Africa/Johannesburg' },
  // ── Middle East / Asia ────────────────────────────────────────────────────
  { id: 'dubai',         label: 'Dubai — Gulf Standard Time (GST)',         locale: 'ar-AE', timeZone: 'Asia/Dubai' },
  { id: 'mumbai',        label: 'Mumbai — India Standard Time (IST)',       locale: 'en-IN', timeZone: 'Asia/Kolkata' },
  { id: 'singapore',     label: 'Singapore — Singapore Time (SGT)',         locale: 'en-SG', timeZone: 'Asia/Singapore' },
  { id: 'shanghai',      label: 'Shanghai — China Standard Time (CST)',     locale: 'zh-CN', timeZone: 'Asia/Shanghai' },
  { id: 'hong-kong',     label: 'Hong Kong — Hong Kong Time (HKT)',         locale: 'zh-HK', timeZone: 'Asia/Hong_Kong' },
  { id: 'seoul',         label: 'Seoul — Korea Standard Time (KST)',        locale: 'ko-KR', timeZone: 'Asia/Seoul' },
  { id: 'tokyo',         label: 'Tokyo — Japan Standard Time',              locale: 'ja-JP', timeZone: 'Asia/Tokyo' },
  // ── Pacific ───────────────────────────────────────────────────────────────
  { id: 'sydney',        label: 'Sydney — Australian Eastern Time (AEST)',  locale: 'en-AU', timeZone: 'Australia/Sydney' },
  { id: 'auckland',      label: 'Auckland — New Zealand Time (NZST)',       locale: 'en-NZ', timeZone: 'Pacific/Auckland' },
];

const STORAGE_KEY = 'csfc-timezone';

/** Fallback default when auto-detect finds no exact or near match. */
const DEFAULT_OPTION = LOCALE_OPTIONS.find((o) => o.id === 'utc') ?? LOCALE_OPTIONS[0];

/** Current UTC offset in minutes for any IANA zone. */
function utcOffsetMinutes(tz: string): number {
  try {
    const now = new Date();
    const tzMs  = new Date(now.toLocaleString('en-US', { timeZone: tz })).getTime();
    const utcMs = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' })).getTime();
    return (tzMs - utcMs) / 60_000;
  } catch {
    return 0;
  }
}

/**
 * Match the visitor's IANA zone to one of our curated options.
 * 1. Exact IANA match (preferred).
 * 2. Nearest option by current UTC offset (handles zones we don't list).
 */
function detectOptionId(): string {
  const visitorTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const exact = LOCALE_OPTIONS.find((o) => o.timeZone === visitorTz);
  if (exact) return exact.id;

  const visitorOffset = utcOffsetMinutes(visitorTz);
  let nearest = DEFAULT_OPTION;
  let minDiff = Infinity;
  for (const opt of LOCALE_OPTIONS) {
    const diff = Math.abs(utcOffsetMinutes(opt.timeZone) - visitorOffset);
    if (diff < minDiff) { minDiff = diff; nearest = opt; }
  }
  return nearest.id;
}

export type LocaleState = {
  option: LocaleOption;
  setOptionId: (id: string) => void;
  /** Formats an API-Sports ISO timestamp using the selected locale + timezone. */
  formatDateTime: (iso: string, opts?: Intl.DateTimeFormatOptions) => string;
};

const LocaleContext = createContext<LocaleState | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Start with DEFAULT_OPTION to avoid SSR/hydration mismatch;
  // useEffect immediately updates to saved preference or auto-detected zone.
  const [optionId, setOptionIdRaw] = useState(DEFAULT_OPTION.id);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LOCALE_OPTIONS.some((o) => o.id === saved)) {
      setOptionIdRaw(saved);
    } else {
      setOptionIdRaw(detectOptionId());
    }
  }, []);

  /** Persists the user's manual choice so it survives page reloads. */
  const setOptionId = useCallback((id: string) => {
    localStorage.setItem(STORAGE_KEY, id);
    setOptionIdRaw(id);
  }, []);

  const value = useMemo<LocaleState>(() => {
    const option = LOCALE_OPTIONS.find((o) => o.id === optionId) ?? DEFAULT_OPTION;
    const formatDateTime = (iso: string, opts: Intl.DateTimeFormatOptions = {}) => {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return iso;
      return new Intl.DateTimeFormat(option.locale, { timeZone: option.timeZone, ...opts }).format(date);
    };
    return { option, setOptionId, formatDateTime };
  }, [optionId, setOptionId]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleState {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
  return ctx;
}
