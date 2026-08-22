import { useEffect, useRef } from 'react';

const ITEMS = [
  'Web Development',
  'Business Systems',
  'AI Automation',
  'Brand & UI',
  'Firebase',
  'Supabase',
  'n8n Workflows',
];

const SPEED_PX_PER_SECOND = 72;

/**
 * Bulletproof infinite marquee.
 *
 * This deliberately does not depend on CSS `animation`, because the global
 * reduced-motion rule can disable CSS animations and make the strip look
 * frozen. Instead, a tiny requestAnimationFrame loop writes a translate3d()
 * transform every frame. It waits for web fonts, recalculates on resize, and
 * loops by one exact duplicated group width.
 */
export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cycleWidthRef = useRef(0);
  const xRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const speedRef = useRef(SPEED_PX_PER_SECOND);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      cycleWidthRef.current = track.scrollWidth / 2;
      // Keep x inside the new bounds after resize/font swap.
      if (cycleWidthRef.current > 0) {
        xRef.current = -(((-xRef.current % cycleWidthRef.current) + cycleWidthRef.current) % cycleWidthRef.current);
      }
    };

    const tick = (time: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const dt = Math.min(0.05, (time - lastTimeRef.current) / 1000);
      lastTimeRef.current = time;

      const cycle = cycleWidthRef.current;
      if (cycle > 0) {
        xRef.current -= speedRef.current * dt;
        if (xRef.current <= -cycle) xRef.current += cycle;
        track.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    measure();
    document.fonts?.ready.then(measure).catch(() => {});

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(measure, 120);
    };

    const slow = () => {
      speedRef.current = SPEED_PX_PER_SECOND * 0.35;
    };
    const resume = () => {
      speedRef.current = SPEED_PX_PER_SECOND;
    };

    window.addEventListener('resize', onResize);
    track.addEventListener('pointerenter', slow);
    track.addEventListener('pointerleave', resume);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      track.removeEventListener('pointerenter', slow);
      track.removeEventListener('pointerleave', resume);
    };
  }, []);

  const group = [...ITEMS, ...ITEMS];
  const row = [...group, ...group];

  return (
    <section className="relative overflow-hidden border-y border-[#0a1633]/15 bg-[#0a1633] py-6 text-[#f5f8ff]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0a1633] to-transparent md:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0a1633] to-transparent md:w-32" />

      <div ref={trackRef} className="flex w-max select-none will-change-transform">
        {row.map((item, i) => (
          <div key={i} className="flex shrink-0 items-center" aria-hidden={i >= group.length}>
            <span className="serif whitespace-nowrap px-8 text-4xl md:text-6xl">{item}</span>
            <span className="text-2xl text-[#2563eb]">✳</span>
          </div>
        ))}
      </div>
    </section>
  );
}