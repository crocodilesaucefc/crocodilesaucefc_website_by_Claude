'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';

type ButtonVariant = 'brand' | 'cta' | 'tactical' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  style?: CSSProperties;
};

const SIZES: Record<ButtonSize, { padding: string; fontSize: string; gap: string }> = {
  sm: { padding: '0.5rem 1rem', fontSize: '0.6875rem', gap: '0.4rem' },
  md: { padding: '0.8rem 1.7rem', fontSize: '0.8125rem', gap: '0.55rem' },
  lg: { padding: '1.05rem 2.5rem', fontSize: '0.9375rem', gap: '0.7rem' },
};

const COPPER_BEVEL = 'var(--metal-bronze)';
const COPPER_BEVEL_LIT = 'var(--metal-bronze-lit)';
const EMERALD_BEVEL = 'linear-gradient(150deg, #5ee9a6 0%, #15803d 55%, #0c4f26 100%)';

function variantConfig(variant: ButtonVariant, hover: boolean) {
  switch (variant) {
    case 'brand':
      return {
        rim: hover ? COPPER_BEVEL_LIT : COPPER_BEVEL,
        fill: 'linear-gradient(180deg, #14233f 0%, #0a1424 48%, #060d1a 100%)',
        label: { background: 'var(--metal-text)', clip: true, color: undefined as string | undefined },
        iconColor: 'var(--csfc-bronze)',
        restGlow: 'var(--raise-3d)',
        hoverGlow: 'var(--raise-3d) drop-shadow(0 0 9px rgb(207 154 82 / 0.45))',
      };
    case 'cta':
      return {
        rim: hover ? COPPER_BEVEL_LIT : COPPER_BEVEL,
        fill: hover ? COPPER_BEVEL_LIT : COPPER_BEVEL,
        label: { background: undefined as string | undefined, clip: false, color: '#241204' },
        iconColor: '#241204',
        restGlow: 'var(--raise-3d)',
        hoverGlow: 'var(--raise-3d) drop-shadow(0 0 11px rgb(231 192 150 / 0.45))',
      };
    case 'tactical':
      return {
        rim: EMERALD_BEVEL,
        fill: 'linear-gradient(180deg, #1c9c4d 0%, #15803d 55%, #0d5527 100%)',
        label: { background: undefined as string | undefined, clip: false, color: '#eafff3' },
        iconColor: '#eafff3',
        restGlow: 'var(--raise-3d)',
        hoverGlow: 'var(--raise-3d) drop-shadow(0 0 10px rgb(52 211 153 / 0.5))',
      };
    case 'ghost':
    default:
      return {
        rim: 'transparent',
        fill: 'transparent',
        label: {
          background: undefined as string | undefined,
          clip: false,
          color: hover ? 'var(--csfc-emerald-bright)' : 'var(--csfc-text-muted)',
        },
        iconColor: 'currentColor',
        restGlow: 'none',
        hoverGlow: 'none',
      };
  }
}

/**
 * CrocodileSauceFC — Button
 * Chamfered tech button with a real faceted bronze/emerald metal rim.
 * Ported 1:1 from the design system bundle (components/buttons/Button.jsx).
 */
export function Button({
  children,
  variant = 'brand',
  size = 'md',
  icon = null,
  iconRight = null,
  disabled = false,
  type = 'button',
  onClick,
  style,
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const s = SIZES[size];
  const config = variantConfig(variant, hover);
  const isGhost = variant === 'ghost';

  const labelStyle: CSSProperties = config.label.clip
    ? {
        background: config.label.background,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }
    : { color: config.label.color };

  return (
    <span
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      role="button"
      aria-disabled={disabled || undefined}
      style={{
        display: 'inline-block',
        position: 'relative',
        background: config.rim,
        padding: isGhost ? 0 : '3px',
        clipPath: 'var(--clip-button)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        filter: disabled ? 'none' : hover ? config.hoverGlow : config.restGlow,
        transition: 'var(--transition-all)',
        transform: active && !disabled ? 'translateY(1px) scale(0.99)' : 'none',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
    >
      <button
        type={type}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={onClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: s.gap,
          padding: s.padding,
          width: '100%',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: s.fontSize,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wide)',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          background: config.fill,
          border: 'none',
          clipPath: 'var(--clip-button)',
          boxShadow: isGhost ? 'none' : 'inset 0 1px 0 rgb(255 255 255 / 0.18), inset 0 -2px 6px rgb(0 0 0 / 0.45)',
          cursor: 'inherit',
          color: 'inherit',
        }}
      >
        {icon ? (
          <span style={{ display: 'inline-flex', width: '1.05em', height: '1.05em', color: config.iconColor }}>
            {icon}
          </span>
        ) : null}
        <span style={labelStyle}>{children}</span>
        {iconRight ? (
          <span style={{ display: 'inline-flex', width: '1.05em', height: '1.05em', color: config.iconColor }}>
            {iconRight}
          </span>
        ) : null}
      </button>
    </span>
  );
}
