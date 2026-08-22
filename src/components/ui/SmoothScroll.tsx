import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Keeps Lenis and every GSAP ScrollTrigger on the same animation clock. */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.15,
      wheelMultiplier: 0.9,
      anchors: { offset: -88 },
      prevent: (node) =>
        node.hasAttribute('data-lenis-prevent') ||
        node.closest('[data-lenis-prevent]') !== null,
    });

    const update = (time: number) => lenis.raf(time * 1000);
    const sync = () => ScrollTrigger.update();

    lenis.on('scroll', sync);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Expose programmatic scrolling without coupling components to a provider.
    window.__mwijayLenis = lenis;

    return () => {
      lenis.off('scroll', sync);
      gsap.ticker.remove(update);
      lenis.destroy();
      delete window.__mwijayLenis;
    };
  }, []);

  return null;
}

declare global {
  interface Window {
    __mwijayLenis?: Lenis;
  }
}