'use client';

import { useState, type CSSProperties } from 'react';

export type Tab = { id: string; label: string };

type TabsProps = {
  tabs: Tab[];
  value?: string;
  onChange?: (id: string) => void;
  style?: CSSProperties;
};

/**
 * CrocodileSauceFC — Tabs
 * Chamfered segmented bar with a copper-lit active state.
 * Ported 1:1 from the design system bundle (components/navigation/Tabs.jsx).
 */
export function Tabs({ tabs, value, onChange, style }: TabsProps) {
  const [internal, setInternal] = useState(tabs[0]?.id);
  const active = value !== undefined ? value : internal;

  const select = (id: string) => {
    setInternal(id);
    onChange?.(id);
  };

  return (
    <div role="tablist" style={{ display: 'flex', gap: 2, ...style }}>
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={on}
            onClick={() => select(t.id)}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
              padding: '0.6rem 1.2rem',
              color: on ? 'var(--csfc-bronze)' : 'var(--csfc-text-muted)',
              background: on ? 'linear-gradient(180deg,#0c1424,#070d1a)' : 'transparent',
              border: `1px solid ${on ? 'var(--csfc-copper)' : 'transparent'}`,
              borderBottom: on ? '1px solid var(--csfc-copper)' : '1px solid var(--csfc-copper-30)',
              clipPath: 'var(--clip-tag)',
              cursor: 'pointer',
              transition: 'var(--transition-all)',
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
