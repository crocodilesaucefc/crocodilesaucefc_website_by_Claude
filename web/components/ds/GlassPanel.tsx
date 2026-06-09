'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';

type GlassPanelClip = 'card' | 'panel' | 'notch' | 'none';
type GlassPanelGlow = 'none' | 'soft' | 'strong';

type GlassPanelProps = {
  children: ReactNode;
  clip?: GlassPanelClip;
  interactive?: boolean;
  active?: boolean;
  padding?: string | number;
  bracket?: boolean;
  /** Rim thickness in px — grows or shrinks the procedural frame around the panel. */
  frameWidth?: number;
  /** Corner rounding in px — `0` keeps the faceted/squared HUD look; raise it for a softer "glass" edge. */
  radius?: number;
  /** Outer glow intensity — `'none'` for flush panels, `'strong'` to call out an active/selected one. */
  glow?: GlassPanelGlow;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
};

function Bracket({ lit }: { lit: boolean }) {
  const c = lit ? 'var(--csfc-copper-bright)' : 'var(--csfc-copper)';
  const s: CSSProperties = {
    position: 'absolute',
    width: 13,
    height: 13,
    transition: 'var(--transition-all)',
    pointerEvents: 'none',
    opacity: 0.85,
  };
  return (
    <>
      <span style={{ ...s, top: -4, left: -4, borderTop: `2px solid ${c}`, borderLeft: `2px solid ${c}` }} />
      <span style={{ ...s, top: -4, right: -4, borderTop: `2px solid ${c}`, borderRight: `2px solid ${c}` }} />
      <span style={{ ...s, bottom: -4, left: -4, borderBottom: `2px solid ${c}`, borderLeft: `2px solid ${c}` }} />
      <span style={{ ...s, bottom: -4, right: -4, borderBottom: `2px solid ${c}`, borderRight: `2px solid ${c}` }} />
    </>
  );
}

/**
 * CrocodileSauceFC — GlassPanel
 * "Digital precision" panel — a single-weight solid orange border line driven
 * from the copper/gold tokens, pure CSS, no image assets and no glow by
 * default. Rest state = dim copper border; lit/active/hover = full copper →
 * bright copper + a narrow glow ring. Matches the thin-line HUD reference.
 */
export function GlassPanel({
  children,
  clip = 'card',
  interactive = false,
  active = false,
  padding = '1.75rem',
  bracket = true,
  frameWidth = 1,
  radius = 0,
  glow = 'none',
  style,
  className,
  onClick,
}: GlassPanelProps) {
  const [hover, setHover] = useState(false);
  const lit = active || (interactive && hover);
  void clip;

  const borderColor = lit ? 'var(--csfc-copper-bright)' : 'var(--csfc-copper)';
  const boxShadow =
    glow === 'strong' ? 'var(--shadow-frame-hover)' :
    glow === 'soft'   ? '0 0 0 1px var(--csfc-copper-30)' :
                        'none';

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        position: 'relative',
        border: `${frameWidth}px solid ${borderColor}`,
        borderRadius: radius,
        background: lit ? 'var(--csfc-glass-hover)' : 'var(--csfc-glass)',
        cursor: interactive ? 'pointer' : 'default',
        boxShadow: lit ? '0 0 0 1px var(--csfc-copper-30)' : boxShadow,
        transition: 'var(--transition-all)',
        ...style,
      }}
    >
      <div style={{ position: 'relative', padding, borderRadius: radius }}>
        {bracket ? <Bracket lit={lit} /> : null}
        {children}
      </div>
    </div>
  );
}
