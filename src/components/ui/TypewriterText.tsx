import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

type Props = {
  text: string;
  /** Characters per second. Higher = faster. */
  speed?: number;
  /** Delay before typing starts (ms). */
  delay?: number;
  className?: string;
  /** When true, typing stops and the full text is revealed instantly. */
  instant?: boolean;
  /** Fires once the last character has been typed. */
  onDone?: () => void;
};

/**
 * Character-by-character typewriter reveal.
 *
 * The component counts up `charCount` using a `requestAnimationFrame` timer,
 * which ticks at `speed` characters per second. The visible text is sliced
 * from the full string to `charCount`. This is simpler and cheaper than
 * rendering individual animated spans — and it degrades to showing the full
 * text immediately when `prefers-reduced-motion` is set.
 */
export default function TypewriterText({
  text,
  speed = 55,
  delay = 0,
  className = '',
  instant = false,
  onDone,
}: Props) {
  const [charCount, setCharCount] = useState(instant ? text.length : 0);
  const startRef = useRef(0);
  const rafRef = useRef(0);

  const reduced = useCallback(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    if (instant || reduced()) {
      setCharCount(text.length);
      onDone?.();
      return;
    }

    setCharCount(0);
    let delayed = true;

    const tick = (time: number) => {
      if (delayed) {
        startRef.current = time;
        delayed = false;
      }

      const elapsed = time - startRef.current;
      if (elapsed < delay) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const chars = Math.floor(((elapsed - delay) / 1000) * speed);
      const next = Math.min(chars, text.length);
      setCharCount(next);

      if (next < text.length) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onDone?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, speed, delay, instant, onDone, reduced]);

  return (
    <span className={className}>
      {text.slice(0, charCount)}
      {charCount < text.length && (
        <motion.span
          aria-hidden
          className="inline-block ml-px h-[1.1em] w-[2px] translate-y-[0.1em] align-bottom bg-current"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.53, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
      )}
    </span>
  );
}
