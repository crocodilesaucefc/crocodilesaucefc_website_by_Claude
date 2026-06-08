# CrocodileSauceFC — Design System

The official design system for **CrocodileSauceFC** — the world's first fully low-poly football club. A dark, cinematic, gaming-portal aesthetic built around three pillars: **faceted bronze metal**, a **blue-green stadium field**, and **emerald tactical accents**. Think live-match HUDs, viral highlight reels, and the "Solid Poly Blank" kit collection.

> **Namespace:** components are exposed at `window.CrocodileSauceFCDesignSystem_82dccd` in `@dsCard` HTML.

---

## Sources & provenance
This system was authored from brand materials supplied directly by the client (no external codebase or Figma):
- **Logo** — `Gemini_Generated_Image_5lguvo5lguvo5lgu.png` (the embossed copper challenge-coin crest) → processed to `assets/logo_medallion.png`.
- **Hero mascot** — supplied transparent-bg render → keyed to `assets/hero_croc.png`.
- **Merch** — "Solid Poly Blank" 2026 World Squad jersey lineup → `assets/merch_collection.png` (+ 5 per-jersey crops).
- **Reference frames** — a motion concept video and several style boards (squad roster, HUD shield, beveled buttons) → stored under `assets/ref_*` for designer reference.
- **Typography & color spec** — provided verbatim by the client (see Visual Foundations).

Originally specced as a neon-orange portal; **revised on client direction** toward *real 3D polished bronze* (not glowing orange) and a *blue-green low-poly stadium* base.

---

## Content Fundamentals (voice & copy)
- **Tone:** bold, hype, stadium-announcer energy with a wink. Confident, never corporate.
- **Person:** speaks about the club as *"the squad" / "we"*; addresses fans as *"the faithful."*
- **Casing:** headers and labels are **STRICTLY UPPERCASE** with extreme tracking. Body is sentence case.
- **Numbers:** scores/stats are king — always monospace, embossed bronze (`2 – 1`, `58%–42%`, `14(7)`).
- **Signature phrases:** *"Low-Poly United," "Solid Poly Blank," "World Squad," "faceted,"* croc nicknames in quotes ("SCALE", "CHOMP", "JAW").
- **Emoji:** only national flags as data glyphs (🇦🇷 🇨🇦). No decorative emoji.
- **Example:** *"The most ferocious low-poly football squad on the planet. Live match HUDs, viral highlight reels, and the legendary Solid Poly Blank kit collection."*

---

## Visual Foundations
**Palette** — blue-green field + bronze + emerald:
- Field: Teal-deep `#04141a`, Teal `#0a242b`, Blue-green facet `#14323a`, Panel navy `#0e1726`.
- Metal: Burnished Copper `#b45309`, Polished Bronze `#f59e0b`; rendered as a **brushed-bronze gradient** (`--metal-bronze`), never a flat orange line.
- Accents: Forest Emerald `#15803d`, Emerald-400 `#34d399` (LEDs, nav hover, croc names).
- Text: Slate White `#f8fafc`, Slate Gray muted `#94a3b8`.

**Backgrounds** — a generated low-poly faceted texture (`assets/bg_lowpoly.jpg`) under a teal radial + stadium floodlight washes. Subtle 3D triangulation, dark vignette. Never flat black.

**Typography** — `Orbitron` (display, 900, uppercase, `0.25em` tracking; gradient-clipped slate or bronze fills) · `JetBrains Mono` (stats, embossed bronze) · `Inter` Light 300 (body, muted slate). *Fonts load from Google Fonts CDN — see "Font substitution" below.*

**Geometry** — rounding is **banned globally** (`border-radius: 0`). Shapes are sharp, chamfered, low-poly via `clip-path` tokens (`--clip-card`, `--clip-button`, `--clip-hex`, `--clip-notch`, etc.).

**Metal & depth** — bronze frames are **baked, studio-lit faceted textures** applied via CSS `border-image` (9-slice), not flat gradients. A 3-point lighting rig (key top-left, soft fill opposite, grazing rim/back light) gives each facet its own specular so the metal reads as genuinely 3D. Tokens: `--frame-bronze` / `--frame-bronze-lit` (square, for panels) and `--frame-bronze-cham` / `--frame-bronze-cham-lit` (chamfered octagon, for the HUD shield). Recessed inner faces use `--bevel-inset`; frames cast `--cast-bronze`. The smaller `--metal-bronze` gradient + `--raise-3d` remains for buttons/chips where a 1–3px rim is too thin to show baked facets.

**Illumination** — data text is **embossed** (bronze gradient fill + dark `--emboss-bronze` drop-shadow), NOT neon-glowing. Reserve glow for emerald LEDs and hover lifts.

**Motion** — `300ms` standard transitions (`--transition-all`). Hover deepens panel fills, lifts copper rim to a brighter metal (`--metal-bronze-lit`), grows a soft halo. Press = `translateY(1px) scale(0.99)`. Nav links slide a copper underline and shift slate→emerald.

**Glass** — translucent teal-navy (`--csfc-glass`, ~0.78 alpha) with `backdrop-filter: blur(10px)`, over the faceted bg.

---

## Iconography
- **Line icons:** thin (2–2.5px stroke) geometric SVGs drawn inline in components/cards (play, chevron, share, menu, external-link). Match this weight; no filled/duotone sets.
- **Flags:** Unicode flag emoji used as compact data glyphs inside bronze hex chips — not decorative.
- **Crest:** `assets/logo_medallion.png` is the master mark (header, footer, jersey chest, favicons). Render on dark; it carries its own bronze relief. The **brand wordmark** ("CrocodileSauce F.C.") is best supplied as a finished **faceted-bronze 3D graphic** (per the client's font manifest — flat low-poly facets, weathered patina, matte) rather than CSS text; the hero `<h1>` is a placeholder ready to swap for that asset. Reference manifest kept at `assets/ref_*`. Name is **all bronze — no emerald accent**.
- No icon font is bundled; if you need a broader set, use **Lucide** (CDN) — it matches the thin geometric stroke. Flag the substitution.

---

## Index / Manifest
**Root**
- `styles.css` — entry point (import list only). Consumers link this.
- `tokens/` — `colors.css`, `typography.css`, `geometry.css`, `effects.css`, `fonts.css`, `base.css`.
- `assets/` — logo, mascot, low-poly bg, merch + jersey crops, stadium/tunnel imagery, `ref_*` boards.

**Components** (`window.CrocodileSauceFCDesignSystem_82dccd`)
- `buttons/` — **Button** (brand/cta/tactical/ghost), **IconButton**
- `navigation/` — **NavLink**, **Tabs**
- `surfaces/` — **GlassPanel** (beveled bronze tactical panel)
- `data/` — **ScoreWidget**, **StatWidget**
- `feedback/` — **Badge**, **Tag**
- `media/` — **VideoTile**

**UI Kits**
- `ui_kits/portal/` — the full immersive portal: header, hero + bronze HUD shield, about, match hub + viral gallery, "Solid Poly Blank" store (Printify), footer.

**Guidelines** — foundation specimen cards under `guidelines/` (Colors, Type, Spacing, Brand) render in the Design System tab.

---

## Font substitution ⚠
`Orbitron`, `JetBrains Mono`, and `Inter` are loaded from **Google Fonts CDN** — no binaries are bundled, so consumers need network access. To ship offline, drop `.woff2` files into `assets/fonts/` and replace the `@import` in `tokens/fonts.css` with local `@font-face` rules. **Flagged for client:** confirm these three families (or supply licensed brand fonts).
