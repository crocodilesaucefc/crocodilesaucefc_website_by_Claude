'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';

type IconButtonVariant = 'brand' | 'tactical' | 'ghost';
type IconButtonSize = 'sm' | 'md' | 'lg';

type IconButtonProps = {
  children: ReactNode;
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
};

const DIMS: Record<IconButtonSize, number> = { sm: 34, md: 44, lg: 54 };

/**
 * CrocodileSauceFC — IconButton
 * Square chamfered control with a beveled metal frame and a single glyph.
 * Ported 1:1 from the design system bundle (components/buttons/IconButton.jsx).
 */
export function IconButton({
  children,
  label,
  variant = 'brand',
  size = 'md',
  active = false,
  disabled = false,
  onClick,
  style,
}: IconButtonProps) {
  const [hover, setHover] = useState(false);
  const dims = DIMS[size];
  const isOn = active || hover;
  const isGhost = variant === 'ghost';
  const copperRim = isOn ? 'var(--metal-bronze-lit)' : 'var(--metal-bronze)';
  const emeraldRim = 'linear-gradient(150deg, #5ee9a6, #15803d 55%, #0c4f26)';

  const cfg = {
    brand: {
      rim: copperRim,
      fill: 'linear-gradient(180deg,#14233f,#0a1424 50%,#060d1a)',
      fg: isOn ? '#f7cd86' : 'var(--csfc-bronze)',
    },
    tactical: {
      rim: emeraldRim,
      fill: 'linear-gradient(180deg,#1c9c4d,#15803d 55%,#0d5527)',
      fg: '#eafff3',
    },
    ghost: {
      rim: 'transparent',
      fill: 'transparent',
      fg: isOn ? 'var(--csfc-emerald-bright)' : 'var(--csfc-text-muted)',
    },
  }[variant];

  return (
    <span
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-block',
        background: cfg.rim,
        padding: isGhost ? 0 : '3px',
        clipPath: 'var(--clip-button)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        filter: disabled || isGhost ? 'none' : isOn ? 'var(--raise-3d) drop-shadow(0 0 8px rgb(207 154 82 / 0.45))' : 'var(--raise-3d)',
        transition: 'var(--transition-all)',
        ...style,
      }}
    >
      <button
        aria-label={label}
        aria-pressed={active || undefined}
        disabled={disabled}
        onClick={onClick}
        style={{
          width: dims,
          height: dims,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: cfg.fill,
          border: 'none',
          color: cfg.fg,
          clipPath: 'var(--clip-button)',
          boxShadow: isGhost ? 'none' : 'inset 0 1px 0 rgb(255 255 255 / 0.16), inset 0 -2px 6px rgb(0 0 0 / 0.45)',
          cursor: 'inherit',
          transition: 'var(--transition-all)',
        }}
      >
        <span style={{ width: dims * 0.46, height: dims * 0.46, display: 'inline-flex' }}>{children}</span>
      </button>
    </span>
  );
}
