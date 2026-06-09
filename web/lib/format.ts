/**
 * Localizes a fixture's kickoff time into the viewer's timezone.
 * Live/finished fixtures keep their authoritative minute/"FT" label —
 * only "upcoming" fixtures (which the prototype shows as "SAT 20:00")
 * get reformatted, since that's the only state where a viewer's local
 * clock differs meaningfully from the raw kickoff instant.
 */
export function formatFixtureClock(fixture: { status: string; minute: string; kickoff: string }): string {
  if (fixture.status !== 'upcoming') return fixture.minute;

  const date = new Date(fixture.kickoff);
  if (Number.isNaN(date.getTime())) return fixture.minute;

  const weekday = new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(date);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  return `${weekday.toUpperCase()} ${time}`;
}

/** ISO 3166-1 alpha-2 country code → Unicode regional-indicator flag emoji. */
export function flagEmoji(countryCode: string): string {
  const code = countryCode.trim().toUpperCase();
  if (code.length !== 2) return '';
  const A = 0x1f1e6;
  const codePoints = [...code].map((c) => A + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...codePoints);
}

/** Nation name/abbr → ISO alpha-2, for the subset of teams the hub features. */
const NATION_TO_ISO: Record<string, string> = {
  ARG: 'AR',
  CAN: 'CA',
  BRA: 'BR',
  FRA: 'FR',
  POR: 'PT',
  ESP: 'ES',
  ENG: 'GB',
  GER: 'DE',
  NED: 'NL',
  ITA: 'IT',
  USA: 'US',
  MEX: 'MX',
};

export function flagForAbbr(abbr: string): string {
  const iso = NATION_TO_ISO[abbr.toUpperCase()];
  return iso ? flagEmoji(iso) : '';
}
