import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const EASE = [0.76, 0, 0.24, 1] as const;

/** Panels wipe as a staggered column sweep rather than one flat curtain. */
const COLUMNS = 5;

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Reset both Lenis and native scroll so the incoming page always lands at
    // the top, then refresh ScrollTrigger so pinned sections (like the
    // horizontal reel on the homepage) register against the fresh scroll
    // position rather than whatever the outgoing page left behind.
    window.__mwijayLenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);

    // The curtain covers the screen for ~0.62s; refresh once it's cleared so
    // trigger positions include any layout shifts caused by the entering page.
    const t1 = window.setTimeout(() => ScrollTrigger.refresh(), 100);
    const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  /**
   * Curtains are portalled to <body> deliberately. Rendering them inside the
   * animated wrapper below would trap them: an ancestor with a transform or
   * opacity < 1 becomes the containing block for `position: fixed` and opens
   * a new stacking context, so the panels could never cover the viewport or
   * sit above the nav. AnimatePresence still drives their exit because the
   * portal stays part of this component's React subtree.
   */
  const curtains = (
    <>
      <div className="pointer-events-none fixed inset-0 z-[95] flex">
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <motion.div
            key={i}
            aria-hidden
            className="h-full flex-1 origin-top bg-[#0a1633]"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 1 }}
            transition={{ duration: 0.55, ease: EASE, delay: i * 0.045 }}
          />
        ))}
      </div>

      <div className="pointer-events-none fixed inset-0 z-[94] flex">
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <motion.div
            key={i}
            aria-hidden
            className="h-full flex-1 origin-top bg-[#2563eb]"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 1 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.06 + i * 0.045 }}
          />
        ))}
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[96] flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <span className="serif text-3xl tracking-tight text-[#f5f8ff]">
          Mwijay<span className="text-[#60a5fa]">Studio</span>
        </span>
      </motion.div>
    </>
  );

  return (
    <>
      {mounted && createPortal(curtains, document.body)}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={(d) => {
          // Framing complete — drop the transform so nothing downstream (a
          // pinned GSAP section, say) is measuring against a transformed
          // ancestor it inherited transiently. Visual output is identical.
          if (d === 'animate') {
            const el = document.getElementById('ms-page-wrap');
            if (el) el.style.transform = 'none';
          }
        }}
        id="ms-page-wrap"
      >
        {children}
      </motion.div>
    </>
  );
}
