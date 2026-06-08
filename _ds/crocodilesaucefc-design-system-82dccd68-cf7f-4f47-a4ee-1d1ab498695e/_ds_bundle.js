/* @ds-bundle: {"format":3,"namespace":"CrocodileSauceFCDesignSystem_82dccd","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"ScoreWidget","sourcePath":"components/data/ScoreWidget.jsx"},{"name":"StatWidget","sourcePath":"components/data/StatWidget.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"VideoTile","sourcePath":"components/media/VideoTile.jsx"},{"name":"NavLink","sourcePath":"components/navigation/NavLink.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"GlassPanel","sourcePath":"components/surfaces/GlassPanel.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"e93fcb0c4a63","components/buttons/IconButton.jsx":"3cc4aaa3a4d4","components/data/ScoreWidget.jsx":"97add82ff35e","components/data/StatWidget.jsx":"36a7ef224b9b","components/feedback/Badge.jsx":"35bcd59b9ac0","components/feedback/Tag.jsx":"04feff167806","components/media/VideoTile.jsx":"61f80afac964","components/navigation/NavLink.jsx":"ec06927c9958","components/navigation/Tabs.jsx":"2ccd93657db2","components/surfaces/GlassPanel.jsx":"b35b7d7efe05","ui_kits/portal/Hero.jsx":"7cb2047829d7","ui_kits/portal/PortalHeader.jsx":"295bd6c7104f","ui_kits/portal/Sections.jsx":"9af2b362a8ba"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CrocodileSauceFCDesignSystem_82dccd = window.CrocodileSauceFCDesignSystem_82dccd || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CrocodileSauceFC — Button
 * Beveled metallic frame: bright→dark copper gradient rim, navy gradient fill,
 * bronze gradient label, soft copper halo. Chamfered silhouette (never round).
 *
 * Variants:
 *  - 'brand'   : navy fill, copper bevel, bronze gradient text (default workhorse)
 *  - 'cta'     : full bronze→copper metallic fill, dark ink label (primary action)
 *  - 'tactical': emerald fill, white label (confirm / action states)
 *  - 'ghost'   : transparent, muted text → emerald on hover (nav)
 */
function Button({
  children,
  variant = 'brand',
  size = 'md',
  // 'sm' | 'md' | 'lg'
  icon = null,
  iconRight = null,
  disabled = false,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const sizes = {
    sm: {
      padding: '0.5rem 1rem',
      fontSize: '0.6875rem',
      gap: '0.4rem'
    },
    md: {
      padding: '0.8rem 1.7rem',
      fontSize: '0.8125rem',
      gap: '0.55rem'
    },
    lg: {
      padding: '1.05rem 2.5rem',
      fontSize: '0.9375rem',
      gap: '0.7rem'
    }
  };
  const s = sizes[size] || sizes.md;

  // Real faceted bronze metal — conic gradient so each chamfered edge reads
  // as a distinct facet catching light (NOT a flat neon-orange line).
  const copperBevel = 'var(--metal-bronze)';
  const copperBevelLit = 'var(--metal-bronze-lit)';
  const emeraldBevel = 'linear-gradient(150deg, #5ee9a6 0%, #15803d 55%, #0c4f26 100%)';
  const config = {
    brand: {
      rim: hover ? copperBevelLit : copperBevel,
      fill: 'linear-gradient(180deg, #14233f 0%, #0a1424 48%, #060d1a 100%)',
      label: {
        background: 'var(--metal-text)',
        clip: true
      },
      iconColor: 'var(--csfc-bronze)',
      restGlow: 'var(--raise-3d)',
      hoverGlow: 'var(--raise-3d) drop-shadow(0 0 9px rgb(207 154 82 / 0.45))'
    },
    cta: {
      rim: hover ? copperBevelLit : copperBevel,
      fill: hover ? copperBevelLit : copperBevel,
      label: {
        color: '#241204',
        clip: false
      },
      iconColor: '#241204',
      restGlow: 'var(--raise-3d)',
      hoverGlow: 'var(--raise-3d) drop-shadow(0 0 11px rgb(231 192 150 / 0.45))'
    },
    tactical: {
      rim: emeraldBevel,
      fill: 'linear-gradient(180deg, #1c9c4d 0%, #15803d 55%, #0d5527 100%)',
      label: {
        color: '#eafff3',
        clip: false
      },
      iconColor: '#eafff3',
      restGlow: 'var(--raise-3d)',
      hoverGlow: 'var(--raise-3d) drop-shadow(0 0 10px rgb(52 211 153 / 0.5))'
    },
    ghost: {
      rim: 'transparent',
      fill: 'transparent',
      label: {
        color: hover ? 'var(--csfc-emerald-bright)' : 'var(--csfc-text-muted)',
        clip: false
      },
      iconColor: 'currentColor',
      restGlow: 'none',
      hoverGlow: 'none'
    }
  }[variant] || {};
  const isGhost = variant === 'ghost';
  const labelStyle = config.label.clip ? {
    background: config.label.background,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent'
  } : {
    color: config.label.color
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    role: "button",
    "aria-disabled": disabled || undefined,
    style: {
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
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    tabIndex: disabled ? -1 : 0,
    style: {
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
      color: 'inherit'
    }
  }, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: '1.05em',
      height: '1.05em',
      color: config.iconColor
    }
  }, icon) : null, /*#__PURE__*/React.createElement("span", {
    style: labelStyle
  }, children), iconRight ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: '1.05em',
      height: '1.05em',
      color: config.iconColor
    }
  }, iconRight) : null));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CrocodileSauceFC — IconButton
 * Square chamfered control with a beveled copper frame and a single glyph.
 * Copper halo on hover; emerald variant for action states.
 */
function IconButton({
  children,
  // icon node
  label,
  // aria-label (required for a11y)
  variant = 'brand',
  // 'brand' | 'tactical' | 'ghost'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  active = false,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const dims = {
    sm: 34,
    md: 44,
    lg: 54
  }[size] || 44;
  const isOn = active || hover;
  const isGhost = variant === 'ghost';
  const copperRim = isOn ? 'var(--metal-bronze-lit)' : 'var(--metal-bronze)';
  const emeraldRim = 'linear-gradient(150deg, #5ee9a6, #15803d 55%, #0c4f26)';
  const cfg = {
    brand: {
      rim: copperRim,
      fill: 'linear-gradient(180deg,#14233f,#0a1424 50%,#060d1a)',
      fg: isOn ? '#f7cd86' : 'var(--csfc-bronze)'
    },
    tactical: {
      rim: emeraldRim,
      fill: 'linear-gradient(180deg,#1c9c4d,#15803d 55%,#0d5527)',
      fg: '#eafff3'
    },
    ghost: {
      rim: 'transparent',
      fill: 'transparent',
      fg: isOn ? 'var(--csfc-emerald-bright)' : 'var(--csfc-text-muted)'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("span", _extends({
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-block',
      background: cfg.rim,
      padding: isGhost ? 0 : '3px',
      clipPath: 'var(--clip-button)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      filter: disabled || isGhost ? 'none' : isOn ? 'var(--raise-3d) drop-shadow(0 0 8px rgb(207 154 82 / 0.45))' : 'var(--raise-3d)',
      transition: 'var(--transition-all)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("button", {
    "aria-label": label,
    "aria-pressed": active || undefined,
    disabled: disabled,
    style: {
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
      transition: 'var(--transition-all)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: dims * 0.46,
      height: dims * 0.46,
      display: 'inline-flex'
    }
  }, children)));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data/ScoreWidget.jsx
try { (() => {
/**
 * CrocodileSauceFC — ScoreWidget
 * Horizontal live match score row: home crest + abbr, blocky monospace score
 * totals, away abbr + crest. Optional LIVE pulse and minute clock.
 */
function ScoreWidget({
  home,
  // { name, abbr, flag, score }
  away,
  // { name, abbr, flag, score }
  live = false,
  minute = null,
  // e.g. "67'"
  style
}) {
  const Crest = ({
    team
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      minWidth: 0
    }
  }, team.flag ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 22,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.3rem',
      border: '1px solid var(--csfc-copper-30)',
      overflow: 'hidden',
      flex: '0 0 auto'
    }
  }, team.flag) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: '0.8rem',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      color: 'var(--csfc-text-primary)',
      whiteSpace: 'nowrap'
    }
  }, team.abbr));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.9rem 1.1rem',
      background: 'rgb(2 6 23 / 0.5)',
      border: '1px solid var(--csfc-copper-30)',
      clipPath: 'var(--clip-card)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(Crest, {
    team: home
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.2rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 800,
      fontSize: '1.7rem',
      lineHeight: 1,
      letterSpacing: 'var(--tracking-data)',
      color: 'var(--csfc-bronze)',
      filter: 'drop-shadow(0 0 6px rgb(245 158 11 / 0.6))',
      display: 'flex',
      alignItems: 'center',
      gap: '0.55rem'
    }
  }, /*#__PURE__*/React.createElement("span", null, home.score), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--csfc-text-muted)',
      filter: 'none',
      fontSize: '0.8em'
    }
  }, ":"), /*#__PURE__*/React.createElement("span", null, away.score)), live ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      fontFamily: 'var(--font-display)',
      fontSize: '0.55rem',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: 'var(--csfc-emerald-bright)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      background: 'var(--csfc-emerald-bright)',
      borderRadius: '50%',
      boxShadow: '0 0 6px var(--csfc-emerald-bright)',
      animation: 'csfcPulse 1.4s ease-in-out infinite'
    }
  }), "Live ", minute || '') : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '0.55rem',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: 'var(--csfc-text-muted)'
    }
  }, minute || 'FT')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Crest, {
    team: away
  })), /*#__PURE__*/React.createElement("style", null, `@keyframes csfcPulse{0%,100%{opacity:1}50%{opacity:.3}}`));
}
Object.assign(__ds_scope, { ScoreWidget });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ScoreWidget.jsx", error: String((e && e.message) || e) }); }

// components/data/StatWidget.jsx
try { (() => {
/**
 * CrocodileSauceFC — StatWidget
 * A single labelled metric block. Orbitron micro-label over a big glowing
 * monospace value. Used across the live-match shield (GOALS, POSSESSION…).
 */
function StatWidget({
  label,
  value,
  delta = null,
  // optional small trailing note
  align = 'center',
  // 'center' | 'left'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  framed = true,
  // draw the thin copper block frame
  style
}) {
  const valueSize = {
    sm: '1.25rem',
    md: '1.9rem',
    lg: '2.75rem'
  }[size] || '1.9rem';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.3rem',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      textAlign: align,
      padding: framed ? '0.7rem 0.9rem' : 0,
      background: framed ? 'rgb(2 6 23 / 0.45)' : 'transparent',
      border: framed ? '1px solid var(--csfc-copper-30)' : 'none',
      clipPath: framed ? 'var(--clip-tag)' : 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: '0.625rem',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      color: 'var(--csfc-text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      fontSize: valueSize,
      lineHeight: 1,
      letterSpacing: 'var(--tracking-data)',
      color: 'var(--csfc-bronze)',
      filter: 'drop-shadow(0 0 6px rgb(245 158 11 / 0.6))',
      display: 'flex',
      alignItems: 'baseline',
      gap: '0.4rem'
    }
  }, value, delta != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.7em',
      color: 'var(--csfc-emerald-bright)',
      filter: 'none'
    }
  }, delta) : null));
}
Object.assign(__ds_scope, { StatWidget });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatWidget.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CrocodileSauceFC — Badge
 * Compact chamfered status marker. Orbitron micro-caps. Tones map to the
 * tactical palette. `pulse` adds a live indicator dot.
 */
function Badge({
  children,
  tone = 'copper',
  // 'copper' | 'bronze' | 'emerald' | 'muted'
  pulse = false,
  style,
  ...rest
}) {
  const tones = {
    copper: {
      fg: 'var(--csfc-bronze)',
      bd: 'var(--csfc-copper)',
      bg: 'rgb(180 83 9 / 0.12)'
    },
    bronze: {
      fg: '#1a0e02',
      bd: 'var(--csfc-copper-bright)',
      bg: 'linear-gradient(180deg,var(--csfc-bronze),var(--csfc-copper))'
    },
    emerald: {
      fg: 'var(--csfc-emerald-bright)',
      bd: 'var(--csfc-emerald)',
      bg: 'rgb(21 128 61 / 0.16)'
    },
    muted: {
      fg: 'var(--csfc-text-muted)',
      bd: 'var(--csfc-copper-30)',
      bg: 'rgb(2 6 23 / 0.5)'
    }
  };
  const t = tones[tone] || tones.copper;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), pulse ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor',
      boxShadow: '0 0 6px currentColor',
      animation: 'csfcBadgePulse 1.4s ease-in-out infinite'
    }
  }) : null, children, /*#__PURE__*/React.createElement("style", null, `@keyframes csfcBadgePulse{0%,100%{opacity:1}50%{opacity:.25}}`));
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CrocodileSauceFC — Tag
 * Category / filter chip. Toggleable; selected state lifts to copper border
 * and bronze text. Lighter weight than Badge, sentence of metadata friendly.
 */
function Tag({
  children,
  selected = false,
  onClick,
  removable = false,
  onRemove,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const lit = selected || hover;
  return /*#__PURE__*/React.createElement("span", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
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
      ...style
    }
  }, rest), children, removable ? /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onRemove && onRemove();
    },
    "aria-label": "Remove",
    style: {
      background: 'none',
      border: 'none',
      color: 'inherit',
      cursor: 'pointer',
      padding: 0,
      display: 'inline-flex',
      fontSize: '0.9em',
      lineHeight: 1
    }
  }, "\xD7") : null);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag.jsx", error: String((e && e.message) || e) }); }

// components/media/VideoTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CrocodileSauceFC — VideoTile
 * Viral-gallery thumbnail: thin copper bounding line, centered play reticle,
 * optional duration + title overlay. Hover deepens the wash and lights the
 * copper frame. Pass `src` for a real thumbnail or leave blank for placeholder.
 */
function VideoTile({
  src = null,
  title,
  duration,
  views,
  badge = null,
  // optional Badge-style label node
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      aspectRatio: '16 / 9',
      overflow: 'hidden',
      background: src ? `center/cover no-repeat url(${src})` : 'repeating-linear-gradient(135deg, #0a1424 0 14px, #07101e 14px 28px)',
      border: `1px solid ${hover ? 'var(--csfc-copper-bright)' : 'var(--csfc-copper-30)'}`,
      clipPath: 'var(--clip-notch)',
      cursor: 'pointer',
      transition: 'var(--transition-all)',
      boxShadow: hover ? 'var(--shadow-frame-hover)' : 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: hover ? 'linear-gradient(180deg, rgb(2 6 23 / .25), rgb(2 6 23 / .8))' : 'linear-gradient(180deg, rgb(2 6 23 / .35), rgb(2 6 23 / .65))',
      transition: 'var(--transition-all)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: '1.6rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px solid ${hover ? 'var(--csfc-emerald-bright)' : 'var(--csfc-copper)'}`,
      background: hover ? 'rgb(21 128 61 / 0.35)' : 'rgb(2 6 23 / 0.5)',
      clipPath: 'var(--clip-button)',
      color: hover ? 'var(--csfc-emerald-bright)' : 'var(--csfc-bronze)',
      transition: 'var(--transition-all)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    width: "20",
    height: "20",
    style: {
      marginLeft: 2
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 5v14l11-7z"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 10,
      left: 10,
      right: 10,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", null, badge), duration ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      fontSize: '0.6875rem',
      color: 'var(--csfc-text-primary)',
      background: 'rgb(2 6 23 / 0.7)',
      border: '1px solid var(--csfc-copper-30)',
      padding: '0.12rem 0.4rem',
      letterSpacing: 'var(--tracking-data)'
    }
  }, duration) : null), title || views ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 12,
      right: 12,
      bottom: 10
    }
  }, title ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: '0.6rem',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--csfc-text-primary)',
      lineHeight: 1.25,
      textWrap: 'pretty',
      textShadow: '0 1px 4px rgb(0 0 0 / 0.9)'
    }
  }, title) : null, views ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      fontSize: '0.625rem',
      color: 'var(--csfc-text-muted)',
      marginTop: 3,
      letterSpacing: 'var(--tracking-data)'
    }
  }, views) : null) : null);
}
Object.assign(__ds_scope, { VideoTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/VideoTile.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavLink.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CrocodileSauceFC — NavLink
 * Header navigation text. Orbitron, uppercase, micro size.
 * Transitions slate-400 → emerald-400 on hover. Active shows a copper underline.
 */
function NavLink({
  children,
  href = '#',
  active = false,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const lit = hover || active;
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)',
      color: active ? 'var(--csfc-emerald-bright)' : hover ? 'var(--csfc-emerald-bright)' : 'var(--csfc-text-muted)',
      textDecoration: 'none',
      padding: '0.4rem 0',
      transition: 'color var(--duration) var(--ease-standard)',
      ...style
    }
  }, rest), children, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      height: 1,
      width: lit ? '100%' : '0%',
      background: active ? 'var(--csfc-emerald-bright)' : 'var(--csfc-copper-bright)',
      transition: 'width var(--duration) var(--ease-out)'
    }
  }));
}
Object.assign(__ds_scope, { NavLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavLink.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/**
 * CrocodileSauceFC — Tabs
 * Chamfered tab bar. Active tab gets copper border + bronze text;
 * inactive tabs read muted and light emerald on hover.
 */
function Tabs({
  tabs = [],
  value,
  onChange,
  style
}) {
  const [internal, setInternal] = React.useState(tabs[0] && tabs[0].id);
  const active = value !== undefined ? value : internal;
  const select = id => {
    setInternal(id);
    onChange && onChange(id);
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 2,
      ...style
    }
  }, tabs.map(t => {
    const on = t.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      role: "tab",
      "aria-selected": on,
      onClick: () => select(t.id),
      style: {
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
        transition: 'var(--transition-all)'
      }
    }, t.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/GlassPanel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CrocodileSauceFC — GlassPanel
 * Translucent tactical container framed by a real faceted, studio-lit BRONZE
 * border (baked 9-slice image — multi-light specular, mitered corners). The
 * inner face is teal glass with a recessed bevel shadow.
 */
function GlassPanel({
  children,
  clip = 'card',
  // 'card' | 'panel' | 'notch' | 'none' (inner-face chamfer)
  interactive = false,
  active = false,
  padding = '1.75rem',
  bracket = true,
  frameWidth = 18,
  // rendered bronze border thickness (px)
  style,
  onClick,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const lit = active || interactive && hover;
  const clipVal = clip === 'none' ? 'none' : `var(--clip-${clip})`;
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      position: 'relative',
      borderStyle: 'solid',
      borderWidth: frameWidth,
      borderImageSource: lit ? 'var(--frame-bronze-lit)' : 'var(--frame-bronze)',
      borderImageSlice: 120,
      borderImageWidth: frameWidth + 'px',
      borderImageOutset: 0,
      borderImageRepeat: 'stretch',
      borderColor: 'transparent',
      background: lit ? 'var(--csfc-glass-hover)' : 'var(--csfc-glass)',
      WebkitBackdropFilter: 'var(--blur-glass)',
      backdropFilter: 'var(--blur-glass)',
      cursor: interactive ? 'pointer' : 'default',
      filter: lit ? 'var(--cast-bronze) drop-shadow(0 0 14px rgb(207 154 82 / 0.3))' : 'var(--cast-bronze)',
      transition: 'background var(--duration) var(--ease-standard), filter var(--duration) var(--ease-standard)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding,
      boxShadow: 'var(--bevel-inset)'
    }
  }, bracket ? /*#__PURE__*/React.createElement(Bracket, {
    lit: lit
  }) : null, children));
}
function Bracket({
  lit
}) {
  const c = lit ? '#ffe0ba' : '#e3b487';
  const s = {
    position: 'absolute',
    width: 13,
    height: 13,
    transition: 'var(--transition-all)',
    pointerEvents: 'none',
    opacity: 0.85
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      ...s,
      top: -4,
      left: -4,
      borderTop: `2px solid ${c}`,
      borderLeft: `2px solid ${c}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...s,
      top: -4,
      right: -4,
      borderTop: `2px solid ${c}`,
      borderRight: `2px solid ${c}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...s,
      bottom: -4,
      left: -4,
      borderBottom: `2px solid ${c}`,
      borderLeft: `2px solid ${c}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...s,
      bottom: -4,
      right: -4,
      borderBottom: `2px solid ${c}`,
      borderRight: `2px solid ${c}`
    }
  }));
}
Object.assign(__ds_scope, { GlassPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/GlassPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/Hero.jsx
try { (() => {
/* ============================================================
   CrocodileSauceFC Portal — Hero
   Layered: low-poly stadium base · mascot · faceted bronze HUD shield.
   ============================================================ */

function StatRow({
  label,
  value
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      padding: '0.5rem 0.4rem',
      background: 'rgb(3 14 18 / 0.6)',
      border: '1px solid var(--csfc-copper-30)',
      clipPath: 'var(--clip-tag)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '0.55rem',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--csfc-text-muted)',
      whiteSpace: 'nowrap'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "csfc-data",
    style: {
      fontSize: '1.15rem',
      whiteSpace: 'nowrap'
    }
  }, value));
}
function Led({
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      background: '#34d399',
      boxShadow: 'var(--led-emerald)',
      ...style
    }
  });
}
function Hero({
  Button,
  Badge
}) {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Hero",
    style: {
      position: 'relative',
      minHeight: '88vh',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      alignItems: 'center',
      gap: '1rem',
      padding: '2rem 2.5rem 4rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      background: 'radial-gradient(ellipse at 70% 10%, rgb(52 211 153 / 0.08), transparent 55%), radial-gradient(ellipse at 30% 90%, rgb(180 83 9 / 0.10), transparent 50%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/hero_croc.png",
    alt: "CrocodileSauceFC mascot",
    style: {
      position: 'absolute',
      left: '30%',
      bottom: '-4rem',
      width: '27rem',
      maxWidth: '40vw',
      filter: 'drop-shadow(0 26px 40px rgb(0 0 0 / 0.6))',
      pointerEvents: 'none',
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
      marginBottom: '1.2rem'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "emerald",
    pulse: true
  }, "2026 World Squad"), /*#__PURE__*/React.createElement(Badge, {
    tone: "bronze"
  }, "Low-Poly United")), /*#__PURE__*/React.createElement("h1", {
    className: "csfc-display-brand",
    style: {
      fontSize: 'clamp(2.6rem, 5vw, 4.6rem)',
      letterSpacing: '0.14em',
      margin: '0 0 0.5rem'
    }
  }, "Crocodile", /*#__PURE__*/React.createElement("br", null), "Sauce F.C."), /*#__PURE__*/React.createElement("p", {
    className: "csfc-body",
    style: {
      fontSize: '1.1rem',
      maxWidth: '42ch',
      margin: '0 0 1.8rem'
    }
  }, "The most ferocious low-poly football squad on the planet. Live match HUDs, viral highlight reels, and the legendary \"Solid Poly Blank\" kit collection."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
      position: 'relative',
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "cta",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Chevron, null)
  }, "Watch Highlights"), /*#__PURE__*/React.createElement(Button, {
    variant: "brand",
    size: "lg"
  }, "World Cup Hub"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 3,
      justifySelf: 'end',
      width: '100%',
      maxWidth: 380
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderWidth: 24,
      borderImageSource: 'var(--frame-bronze-cham)',
      borderImageSlice: 120,
      borderImageWidth: '24px',
      borderImageOutset: 0,
      borderImageRepeat: 'stretch',
      background: 'linear-gradient(180deg, rgb(8 26 32 / 0.97), rgb(4 16 21 / 0.97))',
      filter: 'var(--cast-bronze) drop-shadow(0 18px 40px rgb(0 0 0 / 0.55))'
    }
  }, /*#__PURE__*/React.createElement(Led, {
    style: {
      top: '14%',
      left: -2,
      width: 3,
      height: 46
    }
  }), /*#__PURE__*/React.createElement(Led, {
    style: {
      top: '14%',
      right: -2,
      width: 3,
      height: 46
    }
  }), /*#__PURE__*/React.createElement(Led, {
    style: {
      bottom: '12%',
      left: '24%',
      width: 56,
      height: 3
    }
  }), /*#__PURE__*/React.createElement(Led, {
    style: {
      bottom: '12%',
      right: '24%',
      width: 56,
      height: 3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '1.4rem 1.2rem 1.6rem',
      boxShadow: 'var(--bevel-inset)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.9rem',
      marginBottom: '1.2rem'
    }
  }, /*#__PURE__*/React.createElement(Flag, {
    a: "\uD83C\uDDE6\uD83C\uDDF7"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: '0.9rem',
      letterSpacing: '0.1em',
      color: 'var(--csfc-text-primary)',
      lineHeight: 1.3
    }
  }, "ARGENTINA", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--csfc-bronze)',
      fontSize: '0.7rem'
    }
  }, "vs."), /*#__PURE__*/React.createElement("br", null), "CANADA"), /*#__PURE__*/React.createElement(Flag, {
    a: "\uD83C\uDDE8\uD83C\uDDE6"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: '0.7rem',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--csfc-bronze)',
      marginBottom: '0.9rem'
    }
  }, "Live Match Stats"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement(StatRow, {
    label: "Goals",
    value: "2 \u2013 1"
  }), /*#__PURE__*/React.createElement(StatRow, {
    label: "Possession",
    value: "58\u201342"
  }), /*#__PURE__*/React.createElement(StatRow, {
    label: "Shots (OG)",
    value: "14(7)"
  }), /*#__PURE__*/React.createElement(StatRow, {
    label: "Offsides",
    value: "2 \u2013 3"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1.3rem',
      textAlign: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: '0.66rem',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--csfc-emerald-bright)',
      textShadow: '0 0 8px rgb(52 211 153 / 0.5)'
    }
  }, "Trending \xB7 Viral Clips"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '0.7rem'
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 46,
      height: 26,
      background: 'rgb(3 14 18 / 0.7)',
      border: '1px solid var(--csfc-emerald-30)',
      clipPath: 'var(--clip-button)',
      boxShadow: '0 0 10px rgb(52 211 153 / 0.18) inset'
    }
  })))))));
}
function Flag({
  a
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.7rem',
      background: 'var(--metal-bronze)',
      clipPath: 'polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)',
      boxShadow: '0 2px 8px rgb(0 0 0 / 0.5)',
      filter: 'var(--raise-3d)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      filter: 'drop-shadow(0 1px 1px rgb(0 0 0 /.4))'
    }
  }, a));
}
function Chevron() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/PortalHeader.jsx
try { (() => {
/* ============================================================
   CrocodileSauceFC Portal — Header
   ============================================================ */
function PortalHeader({
  NavLink,
  Button
}) {
  const links = ['Home', 'About', 'World Cup Hub', 'Viral Gallery', 'Store'];
  const [active, setActive] = React.useState('Home');
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2rem',
      padding: '0.9rem 2.5rem',
      background: 'linear-gradient(180deg, rgb(4 18 24 / 0.92), rgb(4 18 24 / 0.5))',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--csfc-copper-30)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.8rem'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo_medallion.png",
    alt: "CrocodileSauceFC",
    style: {
      width: 46,
      height: 46,
      filter: 'drop-shadow(0 2px 6px rgb(0 0 0 / 0.6))'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "csfc-display-brand",
    style: {
      fontSize: '1.05rem',
      letterSpacing: '0.18em'
    }
  }, "CrocodileSauce\xA0F.C.")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: '2rem',
      alignItems: 'center'
    }
  }, links.map(l => /*#__PURE__*/React.createElement(NavLink, {
    key: l,
    href: '#' + l.toLowerCase().replace(/ /g, '-'),
    active: active === l,
    onClick: e => {
      e.preventDefault();
      setActive(l);
    }
  }, l))), /*#__PURE__*/React.createElement(Button, {
    variant: "cta",
    size: "sm"
  }, "Sign Up"));
}
window.PortalHeader = PortalHeader;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/PortalHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/Sections.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SECTION = {
  position: 'relative',
  padding: '4.5rem 2.5rem',
  maxWidth: 1280,
  margin: '0 auto'
};
const EYEBROW = {
  fontFamily: 'var(--font-display)',
  fontSize: '0.72rem',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'var(--csfc-bronze)',
  marginBottom: '0.6rem'
};

/* ---------- SECTION A — About ---------- */
function About({
  GlassPanel,
  Button
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "about",
    "data-screen-label": "About",
    style: {
      ...SECTION,
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      gap: '3rem',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(GlassPanel, {
    clip: "card",
    bracket: true,
    padding: "2.5rem"
  }, /*#__PURE__*/React.createElement("div", {
    style: EYEBROW
  }, "Est. 2026 \xB7 Low-Poly United"), /*#__PURE__*/React.createElement("h2", {
    className: "csfc-display-gradient",
    style: {
      fontSize: '2.4rem',
      marginBottom: '1.1rem'
    }
  }, "About The Squad"), /*#__PURE__*/React.createElement("p", {
    className: "csfc-body",
    style: {
      fontSize: '1.08rem',
      marginBottom: '1rem'
    }
  }, "CrocodileSauceFC is the world's first fully faceted football club \u2014 eleven low-poly reptiles forged in bronze and emerald, each carrying the signature hot-sauce crest into every World Cup fixture."), /*#__PURE__*/React.createElement("p", {
    className: "csfc-body",
    style: {
      marginBottom: '1.6rem'
    }
  }, "We broadcast live tactical HUDs, drop viral highlight reels by the hour, and outfit the faithful in the \"Solid Poly Blank\" kit line."), /*#__PURE__*/React.createElement(Button, {
    variant: "cta"
  }, "Watch Highlights")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/hero_croc.png",
    alt: "Squad mascot",
    style: {
      width: '100%',
      maxWidth: 360,
      transform: 'scaleX(-1)',
      filter: 'drop-shadow(0 24px 36px rgb(0 0 0 / 0.55))'
    }
  })));
}

/* ---------- SECTION B — Match Hub + Viral Gallery ---------- */
function MatchHubGallery({
  GlassPanel,
  ScoreWidget,
  VideoTile,
  Badge,
  Tabs
}) {
  const [tab, setTab] = React.useState('live');
  const clips = [{
    title: 'Messi free-kick rocket',
    duration: '0:42',
    views: '2.4M views',
    badge: /*#__PURE__*/React.createElement(Badge, {
      tone: "emerald",
      pulse: true
    }, "Hot")
  }, {
    title: 'Croc bicycle kick',
    duration: '0:18',
    views: '980K views'
  }, {
    title: 'Last-minute winner',
    duration: '1:05',
    views: '5.1M views',
    badge: /*#__PURE__*/React.createElement(Badge, {
      tone: "bronze"
    }, "Top")
  }, {
    title: 'Keeper wonder save',
    duration: '0:27',
    views: '1.2M views'
  }, {
    title: 'Tunnel walkout',
    duration: '0:33',
    views: '640K views'
  }, {
    title: 'Trophy lift',
    duration: '0:51',
    views: '3.8M views',
    badge: /*#__PURE__*/React.createElement(Badge, {
      tone: "copper"
    }, "New")
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "world-cup-hub",
    "data-screen-label": "Match Hub",
    style: {
      ...SECTION,
      display: 'grid',
      gridTemplateColumns: '0.9fr 1.1fr',
      gap: '2.5rem',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: EYEBROW
  }, "Match Hub"), /*#__PURE__*/React.createElement("h2", {
    className: "csfc-display-gradient",
    style: {
      fontSize: '1.9rem',
      marginBottom: '1.3rem'
    }
  }, "Live Fixtures"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '1.1rem'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      id: 'live',
      label: 'Live'
    }, {
      id: 'next',
      label: 'Upcoming'
    }, {
      id: 'res',
      label: 'Results'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.9rem'
    }
  }, /*#__PURE__*/React.createElement(ScoreWidget, {
    live: true,
    minute: "67'",
    home: {
      abbr: 'ARG',
      flag: '🇦🇷',
      score: 2
    },
    away: {
      abbr: 'CAN',
      flag: '🇨🇦',
      score: 1
    }
  }), /*#__PURE__*/React.createElement(ScoreWidget, {
    live: true,
    minute: "54'",
    home: {
      abbr: 'BRA',
      flag: '🇧🇷',
      score: 0
    },
    away: {
      abbr: 'FRA',
      flag: '🇫🇷',
      score: 0
    }
  }), /*#__PURE__*/React.createElement(ScoreWidget, {
    minute: "FT",
    home: {
      abbr: 'POR',
      flag: '🇵🇹',
      score: 3
    },
    away: {
      abbr: 'ESP',
      flag: '🇪🇸',
      score: 2
    }
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: EYEBROW
  }, "Viral Gallery"), /*#__PURE__*/React.createElement("h2", {
    className: "csfc-display-gradient",
    style: {
      fontSize: '1.9rem',
      marginBottom: '1.3rem'
    }
  }, "Trending Clips"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '0.9rem'
    }
  }, clips.map((c, i) => /*#__PURE__*/React.createElement(VideoTile, _extends({
    key: i
  }, c))))));
}

/* ---------- SECTION C — Store / Locker Room ---------- */
const PRODUCTS = [{
  img: 'jersey_albiceleste',
  name: 'Albiceleste Poly',
  team: 'Argentina',
  price: '$74'
}, {
  img: 'jersey_canary',
  name: 'Canary Facet',
  team: 'Brazil',
  price: '$74'
}, {
  img: 'jersey_blanco_rojo',
  name: 'Blanco Rojo',
  team: 'Peru',
  price: '$79'
}, {
  img: 'jersey_tricolor',
  name: 'Tricolore Blank',
  team: 'France',
  price: '$74'
}, {
  img: 'jersey_verderojo',
  name: 'Verde Rojo',
  team: 'Portugal',
  price: '$74'
}];
function ProductCard({
  p,
  Button,
  Badge
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: hover ? 'var(--metal-bronze-lit)' : 'var(--metal-bronze)',
      padding: '3px',
      clipPath: 'var(--clip-card)',
      transition: 'var(--transition-all)',
      filter: hover ? 'drop-shadow(0 0 12px rgb(207 154 82 / 0.35)) var(--shadow-metal)' : 'var(--shadow-metal)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'linear-gradient(180deg, rgb(9 22 30 / 0.96), rgb(4 16 21 / 0.96))',
      clipPath: 'var(--clip-card)',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.7rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '3 / 4',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 40%, #14323a, #04141a)',
      border: '1px solid var(--csfc-copper-30)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: '../../assets/' + p.img + '.png',
    alt: p.name,
    style: {
      width: '108%',
      objectFit: 'contain',
      transform: hover ? 'scale(1.05)' : 'scale(1)',
      transition: 'transform 0.4s var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 8,
      left: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "bronze"
  }, p.team))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: '0.82rem',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--csfc-text-primary)'
    }
  }, p.name), /*#__PURE__*/React.createElement("span", {
    className: "csfc-data",
    style: {
      fontSize: '1.05rem'
    }
  }, p.price)), /*#__PURE__*/React.createElement(Button, {
    variant: "cta",
    size: "sm",
    style: {
      width: '100%'
    },
    iconRight: /*#__PURE__*/React.createElement(Ext, null)
  }, "Buy on Printify")));
}
function Store({
  Button,
  Badge
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "store",
    "data-screen-label": "Store",
    style: {
      ...SECTION
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: '0.4rem',
      ...EYEBROW
    }
  }, "Locker Room \xB7 Printify Drops"), /*#__PURE__*/React.createElement("h2", {
    className: "csfc-display-gradient",
    style: {
      fontSize: '2.4rem',
      textAlign: 'center',
      marginBottom: '0.4rem'
    }
  }, "\"Solid Poly Blank\""), /*#__PURE__*/React.createElement("p", {
    className: "csfc-body",
    style: {
      textAlign: 'center',
      maxWidth: '52ch',
      margin: '0 auto 2.5rem'
    }
  }, "The 2026 World Squad collection. Every kit carries the embossed bronze crest. Printed & shipped via Printify."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      margin: '0 auto 3rem',
      maxWidth: 760,
      background: 'var(--metal-bronze)',
      padding: '5px',
      clipPath: 'var(--clip-hex)',
      filter: 'var(--raise-3d) drop-shadow(0 20px 44px rgb(0 0 0 / 0.6))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      clipPath: 'var(--clip-hex)',
      background: 'radial-gradient(ellipse at 50% 35%, #16323a, #04141a)',
      padding: '2.5rem 1rem'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/merch_collection.png",
    alt: "Solid Poly Blank collection",
    style: {
      width: '100%',
      display: 'block'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '1rem'
    }
  }, PRODUCTS.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.img,
    p: p,
    Button: Button,
    Badge: Badge
  }))));
}

/* ---------- Footer ---------- */
function PortalFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      position: 'relative',
      marginTop: '3rem',
      padding: '2rem 2.5rem',
      borderTop: '1px solid var(--csfc-copper-30)',
      background: 'rgb(2 10 13 / 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo_medallion.png",
    alt: "",
    style: {
      width: 34,
      height: 34
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "csfc-display",
    style: {
      fontSize: '0.8rem',
      color: 'var(--csfc-emerald-bright)'
    }
  }, "Crocodile Sauce FC")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '0.72rem',
      color: 'var(--csfc-text-muted)'
    }
  }, "\xA9 2026 \xB7 Low-Poly United \xB7 All facets reserved"));
}
function Ext() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 17L17 7M17 7H8M17 7v9"
  }));
}
Object.assign(window, {
  About,
  MatchHubGallery,
  Store,
  PortalFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/Sections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.ScoreWidget = __ds_scope.ScoreWidget;

__ds_ns.StatWidget = __ds_scope.StatWidget;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.VideoTile = __ds_scope.VideoTile;

__ds_ns.NavLink = __ds_scope.NavLink;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.GlassPanel = __ds_scope.GlassPanel;

})();
