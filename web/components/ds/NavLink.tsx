'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';

type NavLinkProps = {
  children: ReactNode;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
};

/**
 * CrocodileSauceFC — NavLink
 * Header navigation text. Orbitron, uppercase, micro size.
 * Transitions slate-400 → emerald-400 on hover. Active shows a copper underline.
 * Ported 1:1 from the design system bundle (components/navigation/NavLink.jsx).
 */
export function NavLink({ children, href = '#', active = false, onClick, style }: NavLinkProps) {
  const [hover, setHover] = useState(false);
  const lit = hover || active;
  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        color: lit ? 'var(--csfc-emerald-bright)' : 'var(--csfc-text-muted)',
        textDecoration: 'none',
        padding: '0.4rem 0',
        transition: 'color var(--duration) var(--ease-standard)',
        ...style,
      }}
    >
      {children}
      <span
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 1,
          width: lit ? '100%' : '0%',
          background: active ? 'var(--csfc-emerald-bright)' : 'var(--csfc-copper-bright)',
          transition: 'width var(--duration) var(--ease-out)',
        }}
      />
    </a>
  );
}
