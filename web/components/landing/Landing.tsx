'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import { Badge, Button, GlassPanel, NavLink, Tag, UniBevel } from '@/components/ds';
import { LIVE_STATUSES } from '@/lib/queries';
import type { RawFixture } from '@/lib/types';
import { ArmoryCarousel } from './ArmoryCarousel';
import type { ShopProduct } from '@/lib/storefront';

const A = '/assets/';

/* ----------------------------- Icons ----------------------------- */

function Ext() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} width="100%" height="100%">
      <path d="M7 17L17 7M17 7H8M17 7v9" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect x={2} y={6} width={20} height={12} rx={3.4} fill="currentColor" />
      <path d="M10 9.3l5 2.7-5 2.7z" fill="#04141a" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width="100%" height="100%">
      <rect x={3.5} y={3.5} width={17} height={17} rx={5} />
      <circle cx={12} cy={12} r={4} />
      <circle cx={17} cy={7} r={1.1} fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
      <path d="M14 3h2.6c.25 1.7 1.2 3.05 2.9 3.5v2.7c-1.1.02-2.1-.28-3-.82v5.42c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5c.3 0 .6.03.9.08v2.8c-.3-.1-.6-.18-.9-.18-1.3 0-2.3 1-2.3 2.3s1 2.3 2.3 2.3 2.3-1 2.3-2.3V3z" />
    </svg>
  );
}

/* ----------------------------- Social ----------------------------- */

type SocialLinkProps = {
  href: string;
  label: string;
  color: string;
  children: ReactNode;
};

function SocialLink({ href, label, color, children }: SocialLinkProps) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 50,
        height: 50,
        flexShrink: 0,
        display: 'inline-flex',
        padding: '3px',
        border: `1px solid ${hover ? 'var(--csfc-emerald-bright)' : 'rgb(52 211 153 / 0.95)'}`,
        background: hover ? 'rgb(34 197 119 / 0.40)' : 'rgb(34 197 119 / 0.26)',
        boxShadow: hover
          ? '0 0 22px rgb(52 211 153 / 0.55), inset 0 0 14px rgb(52 211 153 / 0.18)'
          : '0 0 14px rgb(52 211 153 / 0.34), inset 0 0 12px rgb(52 211 153 / 0.1)',
        transition: 'var(--transition-all)',
        textDecoration: 'none',
      }}
    >
      <span style={{ flex: 1, display: 'flex', padding: '2px', background: 'rgb(6 16 22 / 0.92)' }}>
        <span
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            border: '1.5px solid transparent',
            background:
              'linear-gradient(rgb(10 24 32 / 0.96), rgb(6 16 22 / 0.96)) padding-box, linear-gradient(140deg, #9a5824 0%, #b45309 50%, #9a5824 100%) border-box',
          }}
        >
          <span style={{ width: 22, height: 22, display: 'block' }}>{children}</span>
        </span>
      </span>
    </a>
  );
}

type SocialPillProps = SocialLinkProps & { handle: string };

function SocialPill({ href, label, handle, color, children }: SocialPillProps) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        padding: '3px',
        border: `1px solid ${hover ? 'var(--csfc-emerald-bright)' : 'rgb(52 211 153 / 0.95)'}`,
        background: hover ? 'rgb(34 197 119 / 0.40)' : 'rgb(34 197 119 / 0.26)',
        boxShadow: hover
          ? '0 0 22px rgb(52 211 153 / 0.55), inset 0 0 14px rgb(52 211 153 / 0.18)'
          : '0 0 14px rgb(52 211 153 / 0.34), inset 0 0 12px rgb(52 211 153 / 0.1)',
        transition: 'var(--transition-all)',
        textDecoration: 'none',
      }}
    >
      <span style={{ display: 'flex', padding: '2px', background: 'rgb(6 16 22 / 0.92)' }}>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.5rem 0.85rem 0.5rem 0.6rem',
            border: '1.5px solid transparent',
            background:
              'linear-gradient(rgb(10 24 32 / 0.96), rgb(6 16 22 / 0.96)) padding-box, linear-gradient(140deg, #9a5824 0%, #b45309 50%, #9a5824 100%) border-box',
          }}
        >
          <span style={{ width: 22, height: 22, display: 'block', color, flexShrink: 0 }}>{children}</span>
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--csfc-emerald-bright)' }}>
              {label}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--csfc-text-muted)' }}>{handle}</span>
          </span>
        </span>
      </span>
    </a>
  );
}

function ShoppingBagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function StoreMobileBtn() {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="https://shop.crocodilesaucefc.com"
      className="header-store-mobile"
      aria-label="Store"
      title="Store"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 50,
        height: 50,
        flexShrink: 0,
        padding: '3px',
        border: `1px solid ${hover ? 'var(--csfc-emerald-bright)' : 'rgb(52 211 153 / 0.95)'}`,
        background: hover ? 'rgb(34 197 119 / 0.40)' : 'rgb(34 197 119 / 0.26)',
        boxShadow: hover
          ? '0 0 22px rgb(52 211 153 / 0.55), inset 0 0 14px rgb(52 211 153 / 0.18)'
          : '0 0 14px rgb(52 211 153 / 0.34), inset 0 0 12px rgb(52 211 153 / 0.1)',
        transition: 'var(--transition-all)',
        textDecoration: 'none',
      }}
    >
      <span style={{ flex: 1, display: 'flex', padding: '2px', background: 'rgb(6 16 22 / 0.92)', height: '100%' }}>
        <span style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--csfc-emerald-bright)',
          border: '1.5px solid transparent',
          background: 'linear-gradient(rgb(10 24 32 / 0.96), rgb(6 16 22 / 0.96)) padding-box, linear-gradient(140deg, #9a5824 0%, #b45309 50%, #9a5824 100%) border-box',
        }}>
          <span style={{ width: 22, height: 22, display: 'block' }}><ShoppingBagIcon /></span>
        </span>
      </span>
    </a>
  );
}

function SocialLinks() {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <SocialLink href="https://youtube.com/@CrocodileSauceFC" label="YouTube" color="#ff3d3d">
        <YouTubeIcon />
      </SocialLink>
      <SocialLink href="https://instagram.com/crocodilesaucefc" label="Instagram" color="#e879a8">
        <InstagramIcon />
      </SocialLink>
      <SocialLink href="https://tiktok.com/@crocodilesauce_fc" label="TikTok" color="#f8fafc">
        <TikTokIcon />
      </SocialLink>
    </span>
  );
}

/* ============================ HEADER ============================ */

function Header() {
  const links = ['Home', 'Match Hub', 'About', 'Viral Gallery'];
  const [active, setActive] = useState('Home');
  const [scrolled, setScrolled] = useState(false);
  const slug = (l: string) => '#' + l.toLowerCase().replace(/ /g, '-');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="header-pad"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        padding: scrolled ? '0.55rem 2.5rem' : '0.9rem 2.5rem',
        background: scrolled
          ? 'rgb(2 8 16 / 0.97)'
          : 'linear-gradient(180deg, rgb(2 6 23 / 0.94), rgb(2 6 23 / 0.55))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--csfc-copper-30)',
        transition: 'padding 0.3s ease, background 0.3s ease',
      }}
    >
      <a href="#home" onClick={() => setActive('Home')} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none' }}>
        <Image src={A + 'logo_medallion.png'} alt="CrocodileSauceFC crest" width={46} height={46} style={{ width: 46, height: 46, filter: 'drop-shadow(0 2px 6px rgb(0 0 0 / 0.6))' }} />
        <Image className="hide-sm" src={A + 'wordmark-emerald-wide.png'} alt="Crocodile Sauce F.C." width={922} height={128} style={{ height: 26, width: 'auto', filter: 'drop-shadow(0 2px 5px rgb(0 0 0 / 0.55))' }} />
      </a>

      <nav className="nav-links">
        {links.map((l) => (
          <NavLink key={l} href={slug(l)} active={active === l} onClick={() => setActive(l)}>
            {l}
          </NavLink>
        ))}
        <NavLink href="https://shop.crocodilesaucefc.com" active={false}>Store</NavLink>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
        <StoreMobileBtn />
        <SocialLinks />
      </div>
    </header>
  );
}

/* ===== CHEF — animated mocap studio viewport (hero centerpiece) ===== */

function Led({ style }: { style?: CSSProperties }) {
  return <span style={{ position: 'absolute', background: '#34d399', boxShadow: 'var(--led-emerald)', ...style }} />;
}

function ChefStage() {
  return (
    <div className="chef-stage" style={{ position: 'relative', width: '100%', maxWidth: 580, justifySelf: 'end' }}>
      <div style={{ position: 'relative', padding: '7px',
        background: 'rgb(34 197 119 / 0.26)',
        border: '1px solid rgb(52 211 153 / 0.95)',
        boxShadow: '0 0 24px rgb(52 211 153 / 0.38), inset 0 0 16px rgb(52 211 153 / 0.12)' }}>
        <div
          style={{
            position: 'relative',
            borderStyle: 'solid',
            borderWidth: 14,
            borderColor: '#0a1c24',
            background: 'var(--csfc-teal-deep)',
            boxShadow: 'inset 0 0 0 1px rgb(52 211 153 / 0.14), 0 20px 44px rgb(0 0 0 / 0.6)',
          }}
        >
          <Led style={{ top: '10%', left: -2, width: 3, height: 50 }} />
          <Led style={{ top: '10%', right: -2, width: 3, height: 50 }} />
          <Led style={{ bottom: '10%', left: '26%', width: 60, height: 3 }} />
          <Led style={{ bottom: '10%', right: '26%', width: 60, height: 3 }} />
          <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3 / 4', background: 'var(--csfc-teal-deep)', boxShadow: 'var(--bevel-inset)' }}>
            <video
              src={A + 'chef_animated.mp4'}
              poster={A + 'chef_poster.png'}
              preload="metadata"
              autoPlay
              loop
              muted
              playsInline
              style={{ position: 'absolute', inset: 0, objectFit: 'cover', objectPosition: '50% 38%', width: '100%', height: '100%' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'var(--csfc-teal)', mixBlendMode: 'multiply', opacity: 0.5, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 40%, transparent 28%, rgb(4 20 26 / 0.55) 72%, rgb(3 12 16 / 0.92) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.18, background: 'repeating-linear-gradient(0deg, rgb(0 0 0 / 0.5) 0 1px, transparent 1px 3px)' }} />
            <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Badge tone="emerald" pulse>REC · Mocap Live</Badge>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--csfc-text-muted)', letterSpacing: '0.1em', background: 'rgb(2 6 23 / 0.6)', padding: '0.18rem 0.4rem', border: '1px solid var(--csfc-copper-30)' }}>
                CAM&nbsp;01
              </span>
            </div>
            <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.15rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--csfc-text-primary)', textShadow: '0 2px 10px rgb(0 0 0 / 0.9)' }}>
                &ldquo;Chef&rdquo;
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--csfc-bronze)', marginTop: 3 }}>
                Captain · No. 10
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== LIVE WIRE — world football news feed (mock; becomes a real RSS/API feed in web/) ===== */

function ExtArrow() {
  return (
    <svg width={11} height={11} viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden="true" style={{ flexShrink: 0, transition: 'transform 0.25s var(--ease-out)' }}>
      <path d="M3 8L8 3M8 3H4M8 3V7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type WireItem = { tag: 'LIVE' | 'UPCOMING' | 'RESULT'; text: string };

const FINISHED_STATUSES = new Set(['FT', 'AET', 'PEN']);

/** "20:00" in the club's reference timezone, for upcoming-kickoff rows. */
function formatKickoff(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Vancouver', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

/** Turn today's fixtures into 3-4 Live Wire rows: live scores first, then next kickoffs, then recent results. */
function buildWireItems(fixtures: RawFixture[]): WireItem[] {
  const live: { date: string; item: WireItem }[] = [];
  const upcoming: { date: string; item: WireItem }[] = [];
  const result: { date: string; item: WireItem }[] = [];

  for (const f of fixtures) {
    const { home, away } = f.teams;
    const { short, elapsed } = f.fixture.status;
    const date = f.fixture.date;
    const score = `${f.goals.home ?? 0}–${f.goals.away ?? 0}`;

    if (LIVE_STATUSES.has(short)) {
      const minute = elapsed != null ? ` ${elapsed}'` : '';
      live.push({ date, item: { tag: 'LIVE', text: `${home.name} ${score} ${away.name}${minute}` } });
    } else if (short === 'NS') {
      upcoming.push({ date, item: { tag: 'UPCOMING', text: `${home.name} vs ${away.name} · ${formatKickoff(date)}` } });
    } else if (FINISHED_STATUSES.has(short)) {
      result.push({ date, item: { tag: 'RESULT', text: `${home.name} ${score} ${away.name} FT` } });
    }
  }

  upcoming.sort((a, b) => a.date.localeCompare(b.date));
  result.sort((a, b) => b.date.localeCompare(a.date));

  return [...live, ...upcoming, ...result].slice(0, 4).map((entry) => entry.item);
}

function LiveWire({ fixtures }: { fixtures: RawFixture[] }) {
  const items = buildWireItems(fixtures);
  if (items.length === 0) return null;

  return (
    <div style={{ marginTop: '2.6rem', maxWidth: '40ch' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.55rem', borderBottom: '1px solid var(--csfc-copper-30)', paddingBottom: '0.5rem' }}>
        <span style={{ width: 6, height: 6, background: 'var(--csfc-emerald-bright)', boxShadow: '0 0 8px rgb(52 211 153 / 0.7)', animation: 'hubpulse 1.4s ease-in-out infinite', flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--csfc-emerald-bright)' }}>
          World Football · Live Wire
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', color: 'var(--csfc-text-muted)', border: '1px solid var(--csfc-copper-30)', padding: '0.1rem 0.35rem' }}>
          AUTO
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((it, i) => (
          <a
            key={i}
            href="#match-hub"
            className="wire-row"
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              alignItems: 'baseline',
              gap: '0.6rem',
              padding: '0.55rem 0',
              textDecoration: 'none',
              borderBottom: i < items.length - 1 ? '1px solid rgb(180 83 9 / 0.16)' : 'none',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.06em', color: 'var(--csfc-copper-bright)', whiteSpace: 'nowrap' }}>{it.tag}</span>
            <span className="wire-text" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.84rem', lineHeight: 1.35, color: 'var(--csfc-text-primary)', transition: 'color 0.25s' }}>
              {it.text}
            </span>
            <ExtArrow />
          </a>
        ))}
      </div>
    </div>
  );
}

/* ============================== HERO ============================== */

function Hero({ fixtures }: { fixtures: RawFixture[] }) {
  return (
    <section id="home" className="anchor hero-sec" data-screen-label="Hero" style={{ position: 'relative', minHeight: '90vh', overflow: 'hidden', padding: '2.5rem 2.5rem 4rem', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 72% 8%, rgb(52 211 153 / 0.09), transparent 55%), radial-gradient(ellipse at 26% 88%, rgb(180 83 9 / 0.12), transparent 52%)' }} />

      <div className="hero-grid" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1.3rem', flexWrap: 'wrap' }}>
            <Badge tone="emerald" pulse>2026 World Squad</Badge>
            <Badge tone="bronze">Low-Poly United</Badge>
          </div>
          <h1 className="logo-free">
            <span className="logo-free-mark">
              <span className="lf-panel" aria-hidden="true" />
              <span className="lf-deco" aria-hidden="true">
                <i className="cn tl" /><i className="cn tr" /><i className="cn bl" /><i className="cn br" />
                <i className="cap l" /><i className="cap r" />
                <span className="node"><i /><span>SQUAD</span></span>
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lf-glow" src={A + 'wordmark_letters_glow.png'} alt="" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lf-traces" src={A + 'wordmark_letters_traces.svg'} alt="" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lf-bronze" src={A + 'wordmark-emerald-wide.png'} alt="Crocodile Sauce F.C." />
            </span>
          </h1>
          <p className="csfc-body" style={{ fontSize: '1.12rem', maxWidth: '42ch', margin: '0 0 2.1rem' }}>
            The most ferocious low-poly football squad on the planet. Live match HUDs, viral highlight reels, and the legendary &ldquo;Solid Poly Blank&rdquo; kit collection.
          </p>
          <div className="hero-stats" style={{ display: 'flex', alignItems: 'center', gap: '1.4rem', marginTop: '0.4rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A + 'logo_medallion.png'}
              alt="CrocodileSauceFC challenge-coin crest"
              style={{ width: 'clamp(124px, 17vw, 168px)', height: 'auto', flexShrink: 0, filter: 'drop-shadow(0 6px 16px rgb(0 0 0 / 0.55))' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--csfc-bronze)' }}>
                Official Club Crest
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.04em', color: 'var(--csfc-text-muted)' }}>
                CrocodileSauce F.C · Est. 2026
              </span>
            </div>
          </div>
          <LiveWire fixtures={fixtures} />
        </div>

        <div className="hero-shield-col" style={{ position: 'relative', zIndex: 3, justifySelf: 'end', width: '100%', maxWidth: 580 }}>
          <ChefStage />
        </div>
      </div>
    </section>
  );
}

/* ============================== ABOUT ============================== */

function GlitchCroc() {
  const poses = [
    { src: A + 'hero_croc.png', flip: true, scale: 1.1 },
    { src: A + 'chef_pose.png', flip: false, scale: 1 },
  ];
  const [idx, setIdx] = useState(0);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    let swapT: ReturnType<typeof setTimeout> | undefined;
    let endT: ReturnType<typeof setTimeout> | undefined;
    const cycle = setInterval(() => {
      setGlitching(true);
      swapT = setTimeout(() => setIdx((i) => 1 - i), 220);
      endT = setTimeout(() => setGlitching(false), 620);
    }, 5000);
    return () => {
      clearInterval(cycle);
      clearTimeout(swapT);
      clearTimeout(endT);
    };
  }, []);

  return (
    <div className="float-croc" style={{ width: '100%', maxWidth: 420, animation: 'floaty 7s ease-in-out infinite' }}>
      <div className={'glitch-stage' + (glitching ? ' glitching' : '')}>
        {poses.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            className="gc"
            src={p.src}
            alt="Chef — squad mascot"
            loading="lazy"
            style={{ opacity: i === idx ? 1 : 0, transform: `translateX(-50%)${p.flip ? ' scaleX(-1)' : ''} scale(${p.scale})` }}
          />
        ))}
        <span className="gc-scan" aria-hidden="true" />
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="section anchor about-grid" data-screen-label="About">
      <GlassPanel clip="card" bracket padding="2.6rem">
        <div className="eyebrow">Est. 2026 · Low-Poly United</div>
        <h2 className="csfc-display-gradient" style={{ fontSize: '2.4rem', marginBottom: '1.1rem' }}>About The Squad</h2>
        <p className="csfc-body" style={{ fontSize: '1.08rem', marginBottom: '1rem' }}>
          CrocodileSauceFC is the world&apos;s first fully faceted football club — eleven low-poly reptiles forged in bronze and emerald, each carrying the signature hot-sauce crest into every World Cup fixture.
        </p>
        <p className="csfc-body" style={{ marginBottom: '1.7rem' }}>
          We broadcast live tactical HUDs, drop viral highlight reels by the hour, and outfit the faithful in the &ldquo;Solid Poly Blank&rdquo; kit line.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          <span className="eyebrow" style={{ color: 'var(--csfc-emerald-bright)' }}>Follow The Squad</span>
          <div className="about-pill-col">
            <SocialPill href="https://youtube.com/@CrocodileSauceFC" label="YouTube" handle="@CrocodileSauceFC" color="#ff3d3d">
              <YouTubeIcon />
            </SocialPill>
            <SocialPill href="https://instagram.com/crocodilesaucefc" label="Instagram" handle="@crocodilesaucefc" color="#e879a8">
              <InstagramIcon />
            </SocialPill>
            <SocialPill href="https://tiktok.com/@crocodilesauce_fc" label="TikTok" handle="@crocodilesauce_fc" color="#f8fafc">
              <TikTokIcon />
            </SocialPill>
          </div>
        </div>
      </GlassPanel>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GlitchCroc />
      </div>
    </section>
  );
}

/* ======================= VIRAL GALLERY ======================= */

type ShortClip = {
  title: string;
  duration: string;
  views: string;
  thumb?: string;
  href?: string;
  badge?: ReactNode;
};

function ShortTile({ c }: { c: ShortClip }) {
  const [hover, setHover] = useState(false);
  return (
    <UniBevel>
      <a
        href={c.href || '#'}
        target={c.href ? '_blank' : undefined}
        rel="noopener noreferrer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: 'relative',
          display: 'block',
          aspectRatio: '9 / 16',
          textDecoration: 'none',
          clipPath: 'polygon(13px 0, 100% 0, 100% calc(100% - 13px), calc(100% - 13px) 100%, 0 100%, 0 13px)',
          border: `1px solid ${hover ? 'var(--csfc-copper-bright)' : 'var(--csfc-copper)'}`,
          background: c.thumb ? `center/cover no-repeat url(${c.thumb})` : 'repeating-linear-gradient(135deg, #0c1a26 0 16px, #08131d 16px 32px)',
          boxShadow: hover ? '0 0 22px rgb(180 83 9 / 0.45), 0 14px 30px -14px rgb(0 0 0 / 0.8)' : '0 10px 26px -16px rgb(0 0 0 / 0.7)',
          transform: hover ? 'translateY(-4px)' : 'none',
          transition: 'var(--transition-all)',
          overflow: 'hidden',
        }}
      >
        <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgb(2 8 11 / 0.35) 0%, transparent 26%, transparent 52%, rgb(2 8 11 / 0.88) 100%)' }} />
        {c.badge && <span style={{ position: 'absolute', top: 9, left: 9, zIndex: 3 }}>{c.badge}</span>}
        <span style={{ position: 'absolute', top: 9, right: 9, zIndex: 3, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.62rem', color: 'var(--csfc-text-primary)', background: 'rgb(2 6 14 / 0.72)', padding: '0.15rem 0.4rem', border: '1px solid var(--csfc-copper-30)', letterSpacing: '0.04em' }}>
          {c.duration}
        </span>
        <span
          style={{
            position: 'absolute',
            top: '44%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            zIndex: 3,
            width: 46,
            height: 46,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${hover ? 'var(--csfc-emerald-bright)' : 'rgb(248 250 252 / 0.85)'}`,
            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
            background: hover ? 'rgb(21 128 61 / 0.3)' : 'rgb(2 6 14 / 0.4)',
            boxShadow: hover ? '0 0 16px rgb(52 211 153 / 0.5)' : 'none',
            transition: 'var(--transition-all)',
          }}
        >
          <svg width={16} height={16} viewBox="0 0 16 16" fill={hover ? 'var(--csfc-emerald-bright)' : '#f8fafc'} aria-hidden="true">
            <path d="M3 1.5l11 6.5-11 6.5z" />
          </svg>
        </span>
        <span style={{ position: 'absolute', left: 11, right: 11, bottom: 11, zIndex: 3, display: 'flex', flexDirection: 'column', gap: '0.18rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.66rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--csfc-text-primary)',
              lineHeight: 1.25,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {c.title}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--csfc-text-muted)', letterSpacing: '0.02em' }}>{c.views}</span>
        </span>
      </a>
    </UniBevel>
  );
}

function ViralGallery() {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Goals', 'Saves', 'Skills', 'Tunnel'];
  const clips: ShortClip[] = [
    { title: 'Messi free-kick rocket', duration: '0:42', views: '2.4M views', badge: <Badge tone="emerald" pulse>Hot</Badge> },
    { title: 'Croc bicycle kick', duration: '0:18', views: '980K views' },
    { title: 'Last-minute winner', duration: '1:05', views: '5.1M views', badge: <Badge tone="bronze">Top</Badge> },
    { title: 'Keeper wonder save', duration: '0:27', views: '1.2M views' },
    { title: 'Tunnel walkout', duration: '0:33', views: '640K views' },
    { title: 'Trophy lift', duration: '0:51', views: '3.8M views', badge: <Badge tone="copper">New</Badge> },
  ];

  return (
    <section id="viral-gallery" className="section anchor" data-screen-label="Viral Gallery">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.8rem' }}>
        <div>
          <div className="eyebrow">Viral Gallery · YouTube Shorts</div>
          <h2 className="csfc-display-gradient" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Trending Clips</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {filters.map((f) => (
            <Tag key={f} selected={filter === f} onClick={() => setFilter(f)}>{f}</Tag>
          ))}
        </div>
      </div>
      <div className="gallery-grid">
        {clips.map((c, i) => <ShortTile key={i} c={c} />)}
      </div>
    </section>
  );
}

/* ============================ STORE ============================ */

const SHOP_URL = 'https://shop.crocodilesaucefc.com';

type Product = { img: string; name: string; team: string; price: string; href: string };

const PRODUCTS: Product[] = [
  { img: 'jersey_albiceleste', name: 'Albiceleste Poly', team: 'Argentina', price: '$74', href: SHOP_URL },
  { img: 'jersey_canary',      name: 'Canary Facet',     team: 'Brazil',    price: '$74', href: SHOP_URL },
  { img: 'jersey_blanco_rojo', name: 'Blanco Rojo',      team: 'Peru',      price: '$79', href: SHOP_URL },
  { img: 'jersey_tricolor',    name: 'Tricolore Blank',  team: 'France',    price: '$74', href: SHOP_URL },
  { img: 'jersey_verderojo',   name: 'Verde Rojo',       team: 'Portugal',  price: '$74', href: SHOP_URL },
];

function ProductCard({ p }: { p: Product }) {
  const [hover, setHover] = useState(false);
  return (
    <UniBevel>
      <a
        href={p.href}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'block',
          textDecoration: 'none',
          background: hover ? 'var(--metal-bronze-lit)' : 'var(--metal-bronze)',
          padding: '3px',
          clipPath: 'var(--clip-card)',
          transition: 'var(--transition-all)',
          transform: hover ? 'translateY(-4px)' : 'none',
          filter: hover ? 'drop-shadow(0 0 14px rgb(207 154 82 / 0.4)) var(--shadow-metal)' : 'var(--shadow-metal)',
        }}
      >
        <div style={{ background: 'linear-gradient(180deg, rgb(9 22 30 / 0.96), rgb(4 16 21 / 0.96))', clipPath: 'var(--clip-card)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          <div style={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden', background: 'radial-gradient(ellipse at 50% 40%, #14323a, #04141a)', border: '1px solid var(--csfc-copper-30)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${A}${p.img}.png`}
              alt={p.name}
              loading="lazy"
              style={{ width: '108%', objectFit: 'contain', transform: hover ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.4s var(--ease-out)' }}
            />
          </div>
          <Button variant="cta" size="sm" style={{ width: '100%' }} iconRight={<Ext />}>Shop Now</Button>
        </div>
      </a>
    </UniBevel>
  );
}

function Store({ shopProducts }: { shopProducts: ShopProduct[] }) {
  return (
    <section id="store" className="section anchor" data-screen-label="Store">
      <div style={{ textAlign: 'center' }} className="eyebrow">Locker Room · Squad Drops</div>
      <h2 className="csfc-display-gradient" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', textAlign: 'center', marginBottom: '0.5rem' }}>The Armory</h2>
      <p className="csfc-body" style={{ textAlign: 'center', maxWidth: '52ch', margin: '0 auto 2.6rem' }}>
        The 2026 World Squad collection. Every kit carries the embossed bronze crest. Printed &amp; shipped worldwide.
      </p>
      <a href={SHOP_URL} style={{ display: 'block', textDecoration: 'none', position: 'relative', margin: '0 auto 3rem', maxWidth: 760,
        background: 'rgb(34 197 119 / 0.26)', padding: '7px',
        border: '1px solid rgb(52 211 153 / 0.95)',
        boxShadow: '0 0 24px rgb(52 211 153 / 0.38), inset 0 0 16px rgb(52 211 153 / 0.12)' }}>
        <div style={{ background: 'rgb(6 16 22 / 0.92)', padding: '8px' }}>
          <div style={{ border: '2px solid transparent',
            background: 'linear-gradient(rgb(10 24 32 / 0.96), rgb(6 16 22 / 0.96)) padding-box, linear-gradient(140deg, #9a5824 0%, #b45309 50%, #9a5824 100%) border-box',
            boxShadow: '0 14px 40px -22px rgb(0 0 0 / 0.85)' }}>
            <div style={{ background: 'radial-gradient(ellipse at 50% 35%, #16323a, #04141a)', padding: '1.4rem 1rem' }}>
              <Image
                src={A + 'merch_collection.jpg'}
                alt="CrocodileSauce F.C. 2026 World Squad collection"
                width={1600}
                height={893}
                sizes="(max-width: 800px) 100vw, 760px"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </a>
      <ArmoryCarousel products={shopProducts} />
    </section>
  );
}

/* ============================ FOOTER ============================ */

function Footer() {
  return (
    <footer style={{ position: 'relative', marginTop: '2rem', borderTop: '1px solid var(--csfc-copper-30)', background: 'rgb(2 6 23 / 0.75)' }}>
      <div className="section footer-grid" style={{ paddingTop: '3rem', paddingBottom: '2.2rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.4rem', alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1rem' }}>
            <Image src={A + 'logo_medallion.png'} alt="" width={44} height={44} style={{ width: 44, height: 44 }} />
            <Image src={A + 'wordmark-emerald-wide.png'} alt="Crocodile Sauce F.C." width={922} height={128} style={{ height: 26, width: 'auto', filter: 'drop-shadow(0 2px 5px rgb(0 0 0 / 0.5))' }} />
          </div>
          <p className="csfc-body" style={{ fontSize: '0.95rem', maxWidth: '40ch', marginBottom: '1.4rem' }}>
            The most ferocious low-poly football squad on the planet. Join the faithful.
          </p>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--csfc-bronze)', marginBottom: '0.55rem' }}>
            Get In Touch
          </div>
          <a href="mailto:crocodilesaucefc@gmail.com" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', color: 'var(--csfc-emerald-bright)', textDecoration: 'none', letterSpacing: '0.02em' }}>
            crocodilesaucefc@gmail.com
          </a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--csfc-bronze)' }}>
            Follow The Squad
          </div>
          <SocialLinks />
        </div>
      </div>
      <div className="section" style={{ paddingTop: '1.2rem', paddingBottom: '1.6rem', borderTop: '1px solid var(--csfc-copper-30)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--csfc-text-muted)' }}>© 2026 · Low-Poly United · All facets reserved</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--csfc-emerald-bright)' }}>Built faceted · Bronze &amp; Emerald</span>
      </div>
    </footer>
  );
}

/* ============================== LANDING ============================== */

export function Landing({ hub, fixtures, shopProducts }: { hub: ReactNode; fixtures: RawFixture[]; shopProducts: ShopProduct[] }) {
  return (
    <>
      <div className="bg-photo" />
      <div className="bg-grad" />
      <div className="vignette" />
      <div id="app">
        <Header />
        <div style={{ height: 68 }} aria-hidden="true" />
        <Hero fixtures={fixtures} />
        <div id="match-hub" className="anchor">{hub}</div>
        <About />
        <ViralGallery />
        <Store shopProducts={shopProducts} />
        <Footer />
      </div>
    </>
  );
}
