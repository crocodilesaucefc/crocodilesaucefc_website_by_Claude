'use client';

import type { CSSProperties, ReactNode } from 'react';

type UniBevelProps = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};

/**
 * CrocodileSauceFC — UniBevel
 * Wraps any card (gallery Short tiles, store product cards) in the shared outer
 * border language so they match the GlassPanel HUD frame:
 *   outer → semi-transparent GREEN band + thin EMERALD outer line · dark bevel band → children
 * (The child supplies its own inner copper line / bronze frame.)
 * `style` flows to the OUTER layer — use it for grid sizing / margins.
 */
export function UniBevel({ children, style, className }: UniBevelProps) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        padding: 7,
        background: 'rgb(34 197 119 / 0.26)',
        WebkitBackdropFilter: 'blur(4px)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgb(52 211 153 / 0.95)',
        boxShadow: '0 0 24px rgb(52 211 153 / 0.38), inset 0 0 16px rgb(52 211 153 / 0.12)',
        ...style,
      }}
    >
      <div style={{ position: 'relative', padding: 8, background: 'rgb(6 16 22 / 0.92)' }}>
        {children}
      </div>
    </div>
  );
}
