import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Global, conservative motion layer inspired by high-end editorial property sites. */
export default function CinematicScrollEffects() {
  const location = useLocation();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx: gsap.Context | undefined;
    const frame = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('main section h2').forEach((heading) => {
          gsap.fromTo(
            heading,
            { yPercent: 65, opacity: 0, rotateX: -12 },
            {
              yPercent: 0,
              opacity: 1,
              rotateX: 0,
              duration: 1.05,
              ease: 'power4.out',
              scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLImageElement>('main section img').forEach((image) => {
          gsap.fromTo(
            image,
            { scale: 1.08 },
            {
              scale: 1,
              duration: 1.5,
              ease: 'power3.out',
              scrollTrigger: { trigger: image, start: 'top 96%', once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((item) => {
          gsap.fromTo(
            item,
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.7,
              },
            },
          );
        });
      });
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(frame);
      ctx?.revert();
    };
  }, [location.pathname]);

  return null;
}