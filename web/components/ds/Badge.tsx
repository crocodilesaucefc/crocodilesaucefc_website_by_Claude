import type { CSSProperties, ReactNode } from 'react';

type BadgeTone = 'copper' | 'bronze' | 'emerald' | 'muted';

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  pulse?: boolean;
  style?: CSSProperties;
};

const TONES: Record<BadgeTone, { fg: string; bd: string; bg: string }> = {
  copper: { fg: 'var(--csfc-bronze)', bd: 'var(--csfc-copper)', bg: 'rgb(180 83 9 / 0.12)' },
  bronze: { fg: '#1a0e02', bd: 'var(--csfc-copper-bright)', bg: 'linear-gradient(180deg,var(--csfc-bronze),var(--csfc-copper))' },
  emerald: { fg: 'var(--csfc-emerald-bright)', bd: 'var(--csfc-emerald)', bg: 'rgb(21 128 61 / 0.16)' },
  muted: { fg: 'var(--csfc-text-muted)', bd: 'var(--csfc-copper-30)', bg: 'rgb(2 6 23 / 0.5)' },
};

/**
 * CrocodileSauceFC — Badge
 * Compact chamfered status marker. Ported 1:1 from the design system bundle
 * (components/feedback/Badge.jsx).
 */
export function Badge({ children, tone = 'copper', pulse = false, style }: BadgeProps) {
  const t = TONES[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.3rem 0.6rem',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '0.5625rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: t.fg,
        background: t.bg,
        border: `1px solid ${t.bd}`,
        clipPath: 'var(--clip-tag)',
        lineHeight: 1,
        ...style,
      }}
    >
      {pulse ? (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'currentColor',
            boxShadow: '0 0 6px currentColor',
            animation: 'csfcPulse 1.4s ease-in-out infinite',
          }}
        />
      ) : null}
      {children}
    </span>
  );
}
