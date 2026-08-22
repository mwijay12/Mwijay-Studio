'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Pins the section and translates its horizontal track by the exact overflow
 * width, so the last card lands flush with the right edge at any viewport size.
 *
 * Configured with generous top clearance (pt-24 sm:pt-28) so pinned content and
 * headers remain completely visible below fixed top navigation bars.
 */
export default function HorizontalScroll({
  children,
  header,
  className = '',
  speed = 1,
}: {
  children: ReactNode;
  header?: ReactNode;
  className?: string;
  speed?: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Mobile uses the native swipe track — no pinning, no ScrollTrigger.
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    const ancestorBusy = (): boolean => {
      let node: HTMLElement | null = section.parentElement;
      while (node && node !== document.body) {
        const cs = getComputedStyle(node);
        if (cs.transform !== 'none' || cs.filter !== 'none') return true;
        node = node.parentElement;
      }
      return false;
    };

    // Poll until ancestors are clean.
    const waitForStable = (cb: () => void) => {
      const started = performance.now();
      const step = () => {
        if (cancelled) return;
        if (!ancestorBusy() || performance.now() - started > 2500) {
          cb();
          return;
        }
        window.setTimeout(step, 60);
      };
      requestAnimationFrame(step);
    };

    const build = () => {
      if (cancelled) return;
      ctx?.revert();
      ctx = gsap.context(() => {
        gsap.to(track, {
          // Functions so invalidation recalculates against the live widths.
          x: () => -(track.scrollWidth - section.offsetWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${(track.scrollWidth - section.offsetWidth) * speed}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, section);
      window.setTimeout(() => ScrollTrigger.refresh(), 120);
    };

    waitForStable(build);

    // Images finishing decode change the track width — refresh re-measures.
    const imgs = Array.from(track.querySelectorAll('img'));
    const onImgLoad = () => {
      ctx?.revert();
      waitForStable(build);
      ScrollTrigger.refresh();
    };
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', onImgLoad, { once: true });
    });

    document.fonts?.ready
      .then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      imgs.forEach((img) => img.removeEventListener('load', onImgLoad));
      ctx?.revert();
    };
  }, [speed]);

  return (
    <div
      ref={sectionRef}
      className={`relative flex flex-col justify-center overflow-hidden pt-36 pb-8 sm:pt-40 sm:pb-10 md:pt-44 md:pb-12 md:min-h-[90vh] ${className}`}
    >
      {header && (
        <div className="mx-auto mb-4 w-full max-w-7xl flex-shrink-0 px-6 sm:mb-6">
          {header}
        </div>
      )}
      {/* Native swipe on mobile; GSAP-driven pin on desktop. */}
      <div
        ref={trackRef}
        className="scrollbar-hide flex w-max flex-shrink-0 snap-x snap-mandatory gap-6 overflow-x-auto px-6 py-2 md:snap-none md:gap-8 md:overflow-visible md:px-12"
      >
        {children}
      </div>
    </div>
  );
}
