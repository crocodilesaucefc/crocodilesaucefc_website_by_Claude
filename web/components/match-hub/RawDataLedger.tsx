import type { LedgerSection } from '@/lib/data-ledger';

type RawDataLedgerProps = {
  sections: LedgerSection[];
  emptyMessage?: string;
};

/**
 * Renders whatever a `build*Ledger` mapping function extracted from a raw
 * payload — grouped label/value rows, styled purely with the design system's
 * type roles (`csfc-eyebrow` for labels, `csfc-data` for values). Shared by
 * every HUD pane (header, events, tactics, stats): no section is ever rendered
 * empty and no row is ever rendered blank, since the mapping functions only
 * emit what the API actually returned — an incomplete payload simply yields a
 * shorter ledger, never placeholders, "null", or broken layout.
 */
export function RawDataLedger({ sections, emptyMessage = 'The API returned no readable fields for this view.' }: RawDataLedgerProps) {
  if (sections.length === 0) {
    return <p className="csfc-body">{emptyMessage}</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
      {sections.map((section) => (
        <div key={section.title}>
          <span
            className="csfc-eyebrow"
            style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--csfc-emerald-bright)' }}
          >
            {section.title}
          </span>
          <dl style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
            {section.rows.map((row) => (
              <div
                key={row.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '1.2rem',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--csfc-copper-30)',
                }}
              >
                <dt className="csfc-eyebrow" style={{ fontSize: '0.7rem', whiteSpace: 'nowrap', opacity: 0.75 }}>
                  {row.label}
                </dt>
                <dd
                  className="csfc-data"
                  style={{ margin: 0, fontSize: '0.85rem', textAlign: 'right', overflowWrap: 'anywhere' }}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
