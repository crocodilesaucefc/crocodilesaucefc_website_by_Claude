import type { CSSProperties, ReactNode } from 'react';

type StatWidgetSize = 'sm' | 'md' | 'lg';

type StatWidgetProps = {
  label: string;
  value: ReactNode;
  delta?: ReactNode | null;
  align?: 'center' | 'left';
  size?: StatWidgetSize;
  framed?: boolean;
  style?: CSSProperties;
};

const VALUE_SIZE: Record<StatWidgetSize, string> = { sm: '1.25rem', md: '1.9rem', lg: '2.75rem' };

/**
 * CrocodileSauceFC — StatWidget
 * Labelled metric block: Orbitron micro-label over a glowing mono value.
 * Ported 1:1 from the design system bundle (components/data/StatWidget.jsx).
 */
export function StatWidget({ label, value, delta = null, align = 'center', size = 'md', framed = true, style }: StatWidgetProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align,
        padding: framed ? '0.7rem 0.9rem' : 0,
        background: framed ? 'rgb(2 6 23 / 0.45)' : 'transparent',
        border: framed ? '1px solid var(--csfc-copper-30)' : 'none',
        clipPath: framed ? 'var(--clip-tag)' : 'none',
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: '0.625rem',
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
          color: 'var(--csfc-text-muted)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: VALUE_SIZE[size],
          lineHeight: 1,
          letterSpacing: 'var(--tracking-data)',
          color: 'var(--csfc-bronze)',
          filter: 'drop-shadow(0 0 6px rgb(245 158 11 / 0.6))',
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.4rem',
        }}
      >
        {value}
        {delta != null ? <span style={{ fontSize: '0.7em', color: 'var(--csfc-emerald-bright)', filter: 'none' }}>{delta}</span> : null}
      </span>
    </div>
  );
}
