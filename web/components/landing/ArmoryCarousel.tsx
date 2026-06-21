'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { ShopProduct } from '@/lib/storefront';
import { UniBevel } from '@/components/ds';

const SHOP_URL = 'https://shop.crocodilesaucefc.com';

/* ---- icons ---- */
function ArrowLeft() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 4l-6 6 6 6" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 4l6 6-6 6" />
    </svg>
  );
}
function ExtIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} width="100%" height="100%">
      <path d="M7 17L17 7M17 7H8M17 7v9" />
    </svg>
  );
}

/* ---- single card ---- */
function ProductCard({ p }: { p: ShopProduct }) {
  const [hover, setHover] = useState(false);
  return (
    <UniBevel>
      <a
        href={p.url}
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
          filter: hover
            ? 'drop-shadow(0 0 14px rgb(207 154 82 / 0.4)) var(--shadow-metal)'
            : 'var(--shadow-metal)',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(180deg, rgb(9 22 30 / 0.96), rgb(4 16 21 / 0.96))',
            clipPath: 'var(--clip-card)',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div
            style={{
              position: 'relative',
              aspectRatio: '1 / 1',
              overflow: 'hidden',
              background: 'radial-gradient(ellipse at 50% 40%, #14323a, #04141a)',
              border: '1px solid var(--csfc-copper-30)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {p.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.image}
                alt={p.imageAlt}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: hover ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.4s var(--ease-out)',
                }}
              />
            )}
          </div>

          {/* holographic green SHOP NOW — span because parent <a> is the link */}
          <span
            className="csfc-plasma-btn"
            style={{ fontSize: '0.6875rem', padding: '0.5rem 1rem', width: '100%' }}
          >
            Shop Now
            <span style={{ display: 'inline-flex', width: '1.05em', height: '1.05em' }}><ExtIcon /></span>
          </span>
        </div>
      </a>
    </UniBevel>
  );
}

/* ---- nav arrow ---- */
function NavBtn({ onClick, disabled, children, label }: {
  onClick: () => void; disabled: boolean; children: React.ReactNode; label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        background: disabled ? 'rgb(6 16 22 / 0.5)' : 'rgb(34 197 119 / 0.14)',
        border: `1px solid ${disabled ? 'rgb(180 83 9 / 0.2)' : 'rgb(52 211 153 / 0.55)'}`,
        color: disabled ? 'var(--csfc-text-muted)' : 'var(--csfc-emerald-bright)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)',
        opacity: disabled ? 0.35 : 1,
      }}
    >
      {children}
    </button>
  );
}

/* ---- carousel ---- */
export function ArmoryCarousel({ products }: { products: ShopProduct[] }) {
  const autoplay = Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: false, skipSnaps: false },
    [autoplay],
  );

  const [prevDisabled, setPrevDisabled] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevDisabled(!emblaApi.canScrollPrev());
    setNextDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (products.length === 0) return null;

  return (
    <div>
      {/* viewport */}
      <div
        ref={emblaRef}
        style={{ overflow: 'hidden', cursor: 'grab' }}
        onMouseDown={(e) => { (e.currentTarget as HTMLDivElement).style.cursor = 'grabbing'; }}
        onMouseUp={(e) => { (e.currentTarget as HTMLDivElement).style.cursor = 'grab'; }}
      >
        <div style={{ display: 'flex', touchAction: 'pan-y pinch-zoom', marginLeft: '-0.75rem' }}>
          {products.map((p) => (
            <div
              key={p.handle}
              className="armory-slide"
              style={{ flex: '0 0 var(--slide-basis, 25%)', minWidth: 0, paddingLeft: '0.75rem' }}
            >
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </div>

      {/* controls — 3-col: empty | arrows (center) | Shop All (right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          marginTop: '1.6rem',
          gap: '1rem',
        }}
      >
        <span />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <NavBtn onClick={scrollPrev} disabled={prevDisabled} label="Previous kits">
            <ArrowLeft />
          </NavBtn>
          <NavBtn onClick={scrollNext} disabled={nextDisabled} label="Next kits">
            <ArrowRight />
          </NavBtn>
        </div>
        {/* holographic SHOP ALL KITS — <a> is the link, class supplies the look */}
        <a
          href={SHOP_URL}
          className="csfc-plasma-btn"
          style={{ justifySelf: 'end', fontSize: '0.82rem', padding: '0.85rem 1.8rem', textDecoration: 'none' }}
        >
          Shop All Kits
          <span style={{ display: 'inline-flex', width: '1.05em', height: '1.05em' }}><ExtIcon /></span>
        </a>
      </div>

      <style>{`
        /* ── Responsive slide widths ── */
        .armory-slide { --slide-basis: 25%; }
        @media (max-width: 1200px) { .armory-slide { --slide-basis: 33.333%; } }
        @media (max-width: 900px)  { .armory-slide { --slide-basis: 50%; } }
        @media (max-width: 480px)  { .armory-slide { --slide-basis: 80%; } }

        /* ── Plasma / holographic green button (matches ATC button on product page) ── */
        .csfc-plasma-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          overflow: hidden;
          font-family: 'Orbitron', var(--font-display), sans-serif;
          font-weight: 800;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: #ea9a2e;
          text-shadow: 0 0 10px rgba(234,154,46,0.5), 0 1px 2px rgba(0,0,0,0.5);
          background: linear-gradient(180deg, rgba(34,197,119,0.28), rgba(8,60,38,0.4));
          border: 1px solid #34d399;
          clip-path: polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px);
          -webkit-backdrop-filter: blur(4px);
          backdrop-filter: blur(4px);
          box-shadow: 0 0 0 4px rgba(34,197,119,0.12), 0 0 22px rgba(52,211,153,0.45),
                      inset 0 1px 0 rgba(255,255,255,0.25), inset 0 0 18px rgba(52,211,153,0.18);
          animation: csfc-acPulse 3.2s ease-in-out infinite;
          transition: all 0.2s;
          cursor: pointer;
          white-space: nowrap;
        }
        .csfc-plasma-btn::after {
          content: "";
          position: absolute;
          top: 0; bottom: 0; left: -40%;
          width: 35%;
          background: linear-gradient(100deg, transparent, rgba(190,255,230,0.45), transparent);
          transform: skewX(-18deg);
          animation: csfc-acSweep 3.6s ease-in-out infinite;
          pointer-events: none;
        }
        .csfc-plasma-btn:hover {
          background: linear-gradient(180deg, rgba(52,211,153,0.4), rgba(12,78,50,0.5));
          color: #ffffff;
          box-shadow: 0 0 0 4px rgba(34,197,119,0.2), 0 0 34px rgba(52,211,153,0.7),
                      inset 0 1px 0 rgba(255,255,255,0.35), inset 0 0 22px rgba(52,211,153,0.28);
        }
        @keyframes csfc-acPulse {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(34,197,119,0.12), 0 0 22px rgba(52,211,153,0.4),
                        inset 0 1px 0 rgba(255,255,255,0.25), inset 0 0 18px rgba(52,211,153,0.16);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(34,197,119,0.2), 0 0 32px rgba(52,211,153,0.62),
                        inset 0 1px 0 rgba(255,255,255,0.32), inset 0 0 22px rgba(52,211,153,0.26);
          }
        }
        @keyframes csfc-acSweep {
          0% { left: -40%; }
          55%, 100% { left: 130%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .csfc-plasma-btn { animation: none; }
          .csfc-plasma-btn::after { animation: none; display: none; }
        }
      `}</style>
    </div>
  );
}
