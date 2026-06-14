'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';

type TagProps = {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
  style?: CSSProperties;
};

/**
 * CrocodileSauceFC — Tag
 * Softer, toggleable category/filter chip. Lighter weight than Badge.
 * Ported 1:1 from the design system bundle (components/feedback/Tag.jsx).
 */
export function Tag({ children, selected = false, onClick, removable = false, onRemove, style }: TagProps) {
  const [hover, setHover] = useState(false);
  const lit = selected || hover;
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.4rem 0.8rem',
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        fontSize: '0.75rem',
        letterSpacing: '0.02em',
        color: selected ? 'var(--csfc-bronze)' : lit ? 'var(--csfc-text-primary)' : 'var(--csfc-text-muted)',
        background: selected ? 'rgb(180 83 9 / 0.14)' : 'rgb(2 6 23 / 0.5)',
        border: `1px solid ${lit ? 'var(--csfc-copper)' : 'var(--csfc-copper-30)'}`,
        clipPath: 'var(--clip-tag)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'var(--transition-all)',
        ...style,
      }}
    >
      {children}
      {removable ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove && onRemove();
          }}
          aria-label="Remove"
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            display: 'inline-flex',
            fontSize: '0.9em',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      ) : null}
    </span>
  );
}
