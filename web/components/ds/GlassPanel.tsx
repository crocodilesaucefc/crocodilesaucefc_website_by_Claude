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
  frameWidth?: number;
  radius?: number;
  glow?: GlassPanelGlow;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
};

function Bracket() {
  // Copper corner brackets (reticle) on the inner panel.
  const c = 'var(--csfc-copper-bright)';
  const s: CSSProperties = {
    position: 'absolute',
    width: 14,
    height: 14,
    pointerEvents: 'none',
    boxShadow: '0 0 6px rgb(180 83 9 / 0.45)',
  };
  return (
    <>
      <span style={{ ...s, top: -1, left: -1, borderTop: `2px solid ${c}`, borderLeft: `2px solid ${c}` }} />
      <span style={{ ...s, top: -1, right: -1, borderTop: `2px solid ${c}`, borderRight: `2px solid ${c}` }} />
      <span style={{ ...s, bottom: -1, left: -1, borderBottom: `2px solid ${c}`, borderLeft: `2px solid ${c}` }} />
      <span style={{ ...s, bottom: -1, right: -1, borderBottom: `2px solid ${c}`, borderRight: `2px solid ${c}` }} />
    </>
  );
}

/**
 * CrocodileSauceFC — GlassPanel (unified "energised HUD" border)
 * When `bracket` is on, the panel wears the shared 4-layer border, inner → outer:
 *   1. dark glass panel with a solid COPPER inner line + copper corner brackets
 *   2. a dark bevel band (breathing space)
 *   3. a semi-transparent GREEN band
 *   4. a thin continuous EMERALD outer line
 * `bracket={false}` renders just the plain copper panel (no green frame).
 */
export function GlassPanel({
  children,
  clip = 'card',
  interactive = false,
  active = false,
  padding = '1.75rem',
  bracket = true,
  frameWidth = 2,
  radius = 0,
  glow = 'none',
  style,
  className,
  onClick,
}: GlassPanelProps) {
  const [hover, setHover] = useState(false);
  const lit = active || (interactive && hover);
  void clip;
  void glow;
  void frameWidth;

  // Innermost panel: dark fill + solid copper gradient line (padding-box / border-box trick).
  const panel = (
    <div
      onClick={onClick}
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        position: 'relative',
        border: '2px solid transparent',
        borderRadius: radius,
        background:
          'linear-gradient(' + (lit ? 'rgb(14 32 42 / 0.97), rgb(9 22 30 / 0.97)' : 'rgb(10 24 32 / 0.96), rgb(6 16 22 / 0.96)') + ') padding-box, ' +
          'linear-gradient(140deg, #9a5824 0%, #b45309 50%, #9a5824 100%) border-box',
        cursor: interactive ? 'pointer' : 'default',
        boxShadow: '0 14px 40px -22px rgb(0 0 0 / 0.85)',
        transition: 'var(--transition-all)',
        ...(bracket ? null : style),
      }}
    >
      <div style={{ position: 'relative', padding, borderRadius: radius }}>
        {bracket ? <Bracket /> : null}
        {children}
      </div>
    </div>
  );

  if (!bracket) return panel;

  return (
    <div
      className={className}
      style={{
        // layer 4: semi-transparent green band + thin continuous emerald outer line
        position: 'relative',
        padding: 7,
        background: 'rgb(34 197 119 / 0.26)',
        WebkitBackdropFilter: 'blur(4px)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgb(52 211 153 / 0.95)',
        borderRadius: radius,
        boxShadow: '0 0 24px rgb(52 211 153 / 0.38), inset 0 0 16px rgb(52 211 153 / 0.12)',
        ...style,
      }}
    >
      <div
        style={{
          // layer 2: dark bevel band (breathing space)
          position: 'relative',
          padding: 8,
          background: 'rgb(6 16 22 / 0.92)',
          borderRadius: radius,
        }}
      >
        {panel}
      </div>
    </div>
  );
}
