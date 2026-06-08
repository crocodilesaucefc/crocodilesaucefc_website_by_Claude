# Handoff: World Cup Hub (CrocodileSauce F.C.)

## Overview
The **World Cup Hub** (a.k.a. "Match Hub" / "World Cup Command") is the live-football section of the CrocodileSauce F.C. site. Today it is a **static prototype** with hard-coded fixtures and stats. The goal of this handoff is to turn it into a **real, data-driven page**: live scores, real fixtures (Live / Upcoming / Results), and real per-match tactical statistics, with the live match auto-refreshing.

## About the design files
The files in this bundle are **design references created in HTML/React (Babel-in-browser)** — a prototype showing the intended look and behavior, **not production code to ship directly**. Your task is to **recreate this design in the target codebase's environment** using its established patterns (a real React/Next.js app, Vue, etc.). If there is no codebase yet, **Next.js (App Router) + TypeScript** is the recommended choice (server components for data fetching + a client island for the live-refresh tabs).

The visual system is governed by the **CrocodileSauce F.C. Design System** bundled under `_ds/` — reuse its tokens and components; do not reinvent the styling.

## Fidelity
**High-fidelity.** Colors, typography, spacing, clip-path geometry, and component styling are final. Recreate pixel-faithfully using the design-system tokens/components listed below. Only the **data** should change (static → live).

---

## The page, section by section
File: `world_cup_hub_prototype.html` → the `MatchHub()` React component (also `HudShield`, `ScoreWidget`, `StatWidget`, `Tabs`, `GlassPanel`).

Layout container: `.section` (max-width 1280px, centered, padding `5rem 2.5rem`).

### 1. Section header (centered)
- Eyebrow: `MATCH HUB` — `--font-display`, 0.72rem, letter-spacing 0.22em, uppercase, color `--csfc-bronze`.
- Title: **"World Cup Command"** — class `csfc-display-gradient`, `clamp(2rem, 4vw, 3rem)`.

### 2. Featured live match (2-col grid `1fr 0.85fr`, gap 2.4rem)
Left column:
- Eyebrow `FEATURED · LIVE NOW` (color `--csfc-emerald-bright`).
- `<h3 class="csfc-display">` match title, e.g. **"Argentina vs Canada"** (`clamp(1.5rem,3vw,2.1rem)`).
- Body paragraph (`csfc-body`, ~44ch): group/matchday + state-of-play sentence.
- Buttons: `<Button variant="cta">Open Match Centre</Button>` + `<Button variant="ghost">Share</Button>` (each with a chevron/share icon).

Right column:
- `<HudShield />` — the chamfered bronze scoreboard shield. Shows: two nations (abbr + flag emoji), big mono score `2 – 1`, a "Live Match Stats" label, and stat rows (Goals, Possession, Shots (on goal), Offsides). LED accents on the shield edges, a `REC/LIVE` pulse. This is the visual centerpiece — drive it from the featured live fixture.
- Collapses below the text on mobile (`.feature-grid` → 1 column under 760px; mirror this).

### 3. Main panel — `<GlassPanel clip="panel" bracket frameWidth={20}>` containing a 2-col grid `.hub-grid` (`0.92fr 1.08fr`, gap 1.6rem; **single column under 980px**, with the left column gaining a bottom border instead of a right border).

**Left column — "FIXTURES"**
- Header row: label `FIXTURES` + `<Tabs>` with three tabs: `Live`, `Upcoming`, `Results` (ids `live`, `next`, `res`).
- Body: vertical list (gap 0.9rem) of `<ScoreWidget>` rows, one per fixture in the active tab.
- `ScoreWidget` props per row: `{ live: bool, minute: string, home: {abbr, flag, score}, away: {abbr, flag, score} }`.
  - `minute` examples: `"67'"` (live), `"SAT 20:00"` (upcoming), `"FT"` (result).
  - `score` is a number, or `"–"` when not yet played.
  - When `live` is true, ScoreWidget shows a pulsing LIVE badge.

**Right column — "TACTICAL READOUT"**
- Header row: label `TACTICAL READOUT` + `<Badge tone="emerald" pulse>ARG vs CAN</Badge>` (the currently-featured match).
- Stat grid: `repeat(3,1fr)`, gap 0.7rem — six `<StatWidget size="md">`:
  - `Goals 2 (+1)`, `xG 2.4`, `Shots 14 (7)`, `Possession 58%`, `Passes 486`, `Offsides 2`.
  - `StatWidget` props: `{ label, value, delta? , size }`. Value is mono, embossed bronze.
- Possession bar: a row of mono labels `ARG 58%` / `POSSESSION` / `42% CAN`, then a 12px-tall split bar (`clip-path: var(--clip-button)`) with a bronze segment (`--metal-bronze`) at 58% and an emerald gradient segment (`linear-gradient(90deg,#0c4f26,#15803d)`) at 42%.
- Footer: `<Button variant="tactical" size="sm">Full Match Centre</Button>` + an `<IconButton variant="tactical">` share (38×38).

---

## Data model (what the live API must supply)
```ts
type Team = { abbr: string; flag: string; score: number | '–' };
type Fixture = {
  id: string;
  status: 'live' | 'upcoming' | 'result';
  minute: string;          // "67'" | "SAT 20:00" | "FT"
  live: boolean;
  home: Team;
  away: Team;
  competition?: string;    // e.g. "Group A, Matchday 3"
};
type MatchStats = {         // for the Tactical Readout of the featured match
  goals: number; xg: number; shots: number; shotsOnTarget: number;
  possessionHome: number; possessionAway: number;  // sum to 100
  passes: number; offsides: number;
};
```
The three tabs map to `status` (`live` / `upcoming` / `result`). The **Featured** block + HudShield + Tactical Readout all describe the **currently selected live match** (default: the first live fixture).

## Suggested data source & fetching
- **API options:** [football-data.org](https://www.football-data.org/) (free tier, World Cup competition id), **API-Football** (api-sports.io), or **Sportmonks**. Pick per budget/coverage. Store the API key in an env var (`FOOTBALL_API_KEY`) — never in client code.
- **Endpoints needed:** (1) fixtures by competition + status, (2) live scoreboard, (3) per-fixture statistics (possession, shots, xG, passes, offsides).
- **Live refresh:** poll the live endpoint every ~20–30s (respect rate limits) and update scores/minute/HUD in place; or use the provider's websocket/SSE if available. Server-fetch upcoming/results (cache 1–5 min); client-poll only the live tab.
- **Flags:** the prototype uses Unicode flag emoji keyed off the nation; map ISO country code → emoji (or swap for the bronze hex-chip flag treatment already in the DS).
- **Empty/loading/error states (currently missing — please add):** skeleton rows for fixtures, "No live matches right now" empty state for the Live tab, and a retry on fetch error. Keep the HUD shield rendering a neutral state when nothing is live.

## Interactions & behavior
- **Tabs**: clicking Live/Upcoming/Results swaps the fixture list (client state). Keep the DS `Tabs` look (chamfered segmented bar, copper underline).
- **Featured selection**: selecting a live fixture updates the HudShield + Tactical Readout. (Prototype hard-codes ARG vs CAN — wire this up.)
- **Open Match Centre / Full Match Centre**: route to a (future) match-detail page; stub the route for now.
- **Share**: Web Share API with a fallback copy-link.
- **Transitions**: 300ms standard (`--transition-all`); hover lifts/grows per DS. Respect `prefers-reduced-motion`.

## Design system, tokens & components
The DS is bound under `_ds/crocodilesaucefc-design-system-82dccd68-cf7f-4f47-a4ee-1d1ab498695e/`. Load order and component namespace are documented there. Reuse these components: **GlassPanel, Tabs, ScoreWidget, StatWidget, Badge, Tag, Button, IconButton, VideoTile**. `HudShield` is a composite built in the prototype (see `world_cup_hub_prototype.html`) — port it as a component.

Key tokens (see `_ds/.../tokens/*.css`):
- Colors: field teal `#04141a`/`#0a242b`/`#14323a`, panel navy `#0e1726`; bronze `#b45309`/`#f59e0b` (use the `--metal-bronze` gradient, never flat orange); emerald `#15803d` / `#34d399`; text `#f8fafc` / muted `#94a3b8`.
- Type: `Orbitron` (display, uppercase, ~0.2em tracking), `JetBrains Mono` (all stats/scores), `Inter` Light 300 (body). Loaded from Google Fonts.
- Geometry: `border-radius: 0` everywhere; shapes via clip-path tokens `--clip-card`, `--clip-button`, `--clip-panel`, `--clip-hex`.
- Bronze frames: `border-image` tokens (`--frame-bronze*`); LEDs `--led-emerald`.

## Assets
In `assets/` (project root): `bg_circuit.png` (page background), `wordmark_board.png` (keyed bronze nameboard logo), `logo_medallion.png` (crest), `hero_croc.png` / Chef mocap video, jersey crops, plus `assets/library/` — a set of pre-cut transparent bronze **frames, corners, and rails** for building borders. Nation flags are Unicode emoji today.

## Files in this bundle
- `world_cup_hub_prototype.html` — the full prototype (the `MatchHub` component is the World Cup Hub; rest of the page is context). **Note:** it references `_ds/` and `assets/` by relative path, so view it from the full project download, not standalone.
- This `README.md`.

> For a runnable reference, download the **whole project** (it includes `_ds/`, `assets/`, and this handoff folder) and open it in Claude Code.
