'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

/**
 * Curated timezone/locale pairings for the Hub's "Timezone & Location"
 * selector — anchored on the 2026 host markets plus UTC, since "every
 * timezone in the IANA database" is an unusable wall of options for picking
 * how kickoff times should read. Each pairing drives BOTH the `Intl` locale
 * (number/date formatting conventions) and the `timeZone` (the actual clock
 * shift) for every formatted value across the Hub.
 */
export type LocaleOption = { id: string; label: string; locale: string; timeZone: string };

export const LOCALE_OPTIONS: LocaleOption[] = [
  { id: 'utc', label: 'UTC — Coordinated Universal Time', locale: 'en-GB', timeZone: 'UTC' },
  { id: 'mexico-city', label: 'Mexico City — Central Time', locale: 'es-MX', timeZone: 'America/Mexico_City' },
  { id: 'new-york', label: 'New York — Eastern Time', locale: 'en-US', timeZone: 'America/New_York' },
  { id: 'los-angeles', label: 'Los Angeles — Pacific Time', locale: 'en-US', timeZone: 'America/Los_Angeles' },
  { id: 'toronto', label: 'Toronto — Eastern Time', locale: 'en-CA', timeZone: 'America/Toronto' },
  { id: 'vancouver', label: 'Vancouver — Pacific Time', locale: 'en-CA', timeZone: 'America/Vancouver' },
  { id: 'london', label: 'London — Greenwich/British Time', locale: 'en-GB', timeZone: 'Europe/London' },
  { id: 'buenos-aires', label: 'Buenos Aires — Argentina Time', locale: 'es-AR', timeZone: 'America/Argentina/Buenos_Aires' },
  { id: 'tokyo', label: 'Tokyo — Japan Standard Time', locale: 'ja-JP', timeZone: 'Asia/Tokyo' },
];

// Defaults to the viewer's own market — Vancouver — so kickoff times and the
// date slider read in local wall-clock time the moment the Hub opens.
const DEFAULT_OPTION = LOCALE_OPTIONS.find((o) => o.id === 'vancouver') ?? LOCALE_OPTIONS[0];

export type LocaleState = {
  option: LocaleOption;
  setOptionId: (id: string) => void;
  /** Formats an API-Sports ISO timestamp using the selected locale + timezone — the single source of truth every pane reads kickoff times through. */
  formatDateTime: (iso: string, opts?: Intl.DateTimeFormatOptions) => string;
};

const LocaleContext = createContext<LocaleState | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [optionId, setOptionId] = useState(DEFAULT_OPTION.id);

  const value = useMemo<LocaleState>(() => {
    const option = LOCALE_OPTIONS.find((o) => o.id === optionId) ?? DEFAULT_OPTION;
    const formatDateTime = (iso: string, opts: Intl.DateTimeFormatOptions = {}) => {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return iso;
      return new Intl.DateTimeFormat(option.locale, { timeZone: option.timeZone, ...opts }).format(date);
    };
    return { option, setOptionId, formatDateTime };
  }, [optionId]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleState {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
  return ctx;
}
