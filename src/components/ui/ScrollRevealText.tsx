import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  paragraphs: string[];
  /** Vertical point in the viewport (0 = top, 1 = bottom) that acts as the reading line. */
  focusLine?: number;
  /** Opacity for text below the reading line. */
  dimOpacity?: number;
  /** Transition on each word, in ms. */
  fadeMs?: number;
  className?: string;
};

/**
 * Reading-progress text: words brighten as the reading line passes over them.
 *
 * How it differs from a simple scroll-linked opacity:
 * - The reading line sits at a fixed fraction of the viewport height rather
 *   than the middle, so on a phone the highlighted zone lands where your
 *   thumb isn't covering the screen.
 * - Progress is computed per word from that word's own position, not from a
 *   percentage of the whole block. This means every word lights up exactly
 *   when it crosses the line — no batch reveal, no waiting for the paragraph
 *   to catch up.
 * - Word offsets are cached after layout and only recomputed on resize, so
 *   the scroll handler stays a cheap array read instead of forcing layout on
 *   every frame.
 * - Works with Lenis because it reads `getBoundingClientRect()` (the settled
 *   position) rather than listening to a scroll event.
 * - Falls back to fully-visible text when the user prefers reduced motion.
 */
export default function ScrollRevealText({
  paragraphs,
  focusLine = 0.62,
  dimOpacity = 0.16,
  fadeMs = 380,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const offsets = useRef<number[]>([]);
  const [lit, setLit] = useState<number | null>(null);

  const total = useMemo(
    () => paragraphs.reduce((n, p) => n + p.split(/\s+/).filter(Boolean).length, 0),
    [paragraphs]
  );

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Measure each word's document-space top position once, then reuse it.
  // Recomputing on resize keeps it correct when the viewport reflows text.
  useEffect(() => {
    if (reduced) return;
    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      const scrollY = window.scrollY;
      offsets.current = wordRefs.current.map((w) => {
        if (!w) return 0;
        return w.getBoundingClientRect().top + scrollY;
      });
      update();
    };

    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const line = window.scrollY + vh * focusLine;

      // Count how many words have crossed the reading line.
      let count = 0;
      for (let i = 0; i < offsets.current.length; i++) {
        if (offsets.current[i] <= line) count = i + 1;
        else break;
      }
      setLit(count);
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    // Words may not be laid out on the first pass — wait a frame.
    const measureRaf = requestAnimationFrame(measure);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(measureRaf);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [focusLine, reduced, total]);

  // With reduced motion (or before JS measures), render everything visible.
  const litCount = reduced || lit === null ? total : lit;

  let wordIndex = 0;

  return (
    <div ref={containerRef} className={className}>
      {paragraphs.map((para, pi) => {
        const words = para.split(/\s+/).filter(Boolean);
        const start = wordIndex;
        wordIndex += words.length;

        return (
          <p
            key={pi}
            className="text-base leading-[1.85] sm:text-lg md:text-xl md:leading-[1.8]"
            style={{ marginBottom: pi === paragraphs.length - 1 ? 0 : "1.5em" }}
          >
            {words.map((word, wi) => {
              const global = start + wi;
              const isLit = global < litCount;
              return (
                <span
                  key={wi}
                  ref={(el) => {
                    if (el) wordRefs.current[global] = el;
                  }}
                  style={{
                    opacity: isLit ? 1 : dimOpacity,
                    transition: `opacity ${fadeMs}ms ease-out, filter ${fadeMs}ms ease-out`,
                    filter: isLit ? "blur(0px)" : "blur(0.4px)",
                  }}
                >
                  {word}{" "}
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}
