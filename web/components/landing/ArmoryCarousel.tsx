'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { ShopProduct } from '@/lib/storefront';

const SHOP_URL = 'https://shop.crocodilesaucefc.com';

/* ---- arrow icons ---- */
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
        height: '100%',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, rgb(9 22 30 / 0.96), rgb(4 16 21 / 0.96))',
          clipPath: 'var(--clip-card)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.7rem',
          height: '100%',
        }}
      >
        <div
          style={{
            position: 'relative',
            aspectRatio: '3 / 4',
            overflow: 'hidden',
            background: 'radial-gradient(ellipse at 50% 40%, #14323a, #04141a)',
            border: '1px solid var(--csfc-copper-30)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {p.image && (
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
        {/* Shop Now button */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            color: '#241204',
            background: 'var(--metal-bronze)',
            clipPath: 'var(--clip-button)',
            width: '100%',
            whiteSpace: 'nowrap',
          }}
        >
          Shop Now
          <span style={{ display: 'inline-flex', width: '1.05em', height: '1.05em' }}><ExtIcon /></span>
        </span>
      </div>
    </a>
  );
}

/* ---- nav arrow button ---- */
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

/* ---- main carousel ---- */
export function ArmoryCarousel({ products }: { products: ShopProduct[] }) {
  const autoplay = Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: false,
      skipSnaps: false,
    },
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
        <div
          style={{
            display: 'flex',
            touchAction: 'pan-y pinch-zoom',
            marginLeft: '-0.75rem',
          }}
        >
          {products.map((p) => (
            <div
              key={p.handle}
              style={{
                flex: '0 0 var(--slide-basis, 25%)',
                minWidth: 0,
                paddingLeft: '0.75rem',
              }}
              className="armory-slide"
            >
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </div>

      {/* controls row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1.6rem',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        {/* prev/next */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <NavBtn onClick={scrollPrev} disabled={prevDisabled} label="Previous kits">
            <ArrowLeft />
          </NavBtn>
          <NavBtn onClick={scrollNext} disabled={nextDisabled} label="Next kits">
            <ArrowRight />
          </NavBtn>
        </div>

        {/* shop all */}
        <a href={SHOP_URL} style={{ textDecoration: 'none' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '3px',
              background: 'var(--metal-bronze)',
              clipPath: 'var(--clip-button)',
              transition: 'var(--transition-all)',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.8rem 1.7rem',
                background: 'var(--metal-bronze)',
                clipPath: 'var(--clip-button)',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wide)',
                color: '#241204',
                whiteSpace: 'nowrap',
              }}
            >
              Shop All Kits
              <span style={{ display: 'inline-flex', width: '1.05em', height: '1.05em' }}><ExtIcon /></span>
            </span>
          </span>
        </a>
      </div>

      {/* responsive slide width */}
      <style>{`
        .armory-slide { --slide-basis: 25%; }
        @media (max-width: 1200px) { .armory-slide { --slide-basis: 33.333%; } }
        @media (max-width: 900px)  { .armory-slide { --slide-basis: 50%; } }
        @media (max-width: 480px)  { .armory-slide { --slide-basis: 80%; } }
      `}</style>
    </div>
  );
}
