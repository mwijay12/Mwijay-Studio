import { useMemo, useRef } from 'react';
import { motion, useInView, type TargetAndTransition } from 'framer-motion';

type SplitBy = 'character' | 'word' | 'line';
type Order = 'forward' | 'reverse' | 'center' | 'random';
type Preset =
  | 'rise'
  | 'drop'
  | 'slide'
  | 'blur'
  | 'focus'
  | 'mask'
  | 'wipe'
  | 'roll'
  | 'pop'
  | 'punch'
  | 'zoom'
  | 'flip'
  | 'swivel'
  | 'tilt'
  | 'twist'
  | 'cascade'
  | 'wave'
  | 'scatter'
  | 'warp'
  | 'explode';

type Props = {
  text: string;
  preset?: Preset;
  splitBy?: SplitBy;
  order?: Order;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  threshold?: number;
};

type Custom = { i: number; total: number; seed: number };

function pseudo(v: number) {
  const x = Math.sin((v + 1) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function staggerIndex(i: number, total: number, order: Order): number {
  switch (order) {
    case 'reverse':
      return total - 1 - i;
    case 'center':
      return Math.abs(i - (total - 1) / 2);
    case 'random':
      return Math.floor(pseudo(i) * total);
    default:
      return i;
  }
}

const SPRING = { type: 'spring', bounce: 0 } as const;
const SMOOTH = { ease: [0.22, 1, 0.36, 1] } as const;
const SNAPPY = { ease: [0.16, 1, 0.3, 1] } as const;

type Recipe = {
  splitBy: SplitBy;
  origin: string;
  hidden: (c: Custom) => Record<string, number | string | string[]>;
  ease: typeof SPRING | typeof SMOOTH | typeof SNAPPY | { type: 'spring'; bounce: number };
};

const R = (splitBy: SplitBy, origin: string, hidden: Recipe['hidden'], ease: Recipe['ease']): Recipe => ({
  splitBy,
  origin,
  hidden,
  ease,
});

const RECIPES: Record<Preset, Recipe> = {
  rise: R('line', '50% 100%', () => ({ opacity: 0, y: 90 }), SPRING),
  drop: R('character', '50% 0%', () => ({ opacity: 0, y: -70 }), SPRING),
  slide: R('word', '0% 50%', () => ({ opacity: 0, x: -70 }), SMOOTH),
  blur: R('word', '50% 50%', () => ({ opacity: 0, filter: 'blur(18px)' }), SMOOTH),
  focus: R('character', '50% 50%', () => ({ opacity: 0, filter: 'blur(20px)', scale: 1.25 }), SMOOTH),
  mask: R('line', '50% 100%', () => ({ opacity: 1, y: 120 }), SNAPPY),
  wipe: R('line', '0% 50%', () => ({ opacity: 1, x: -60, skewX: -12 }), SNAPPY),
  roll: R('character', '50% 100%', () => ({ opacity: 0, rotateX: -85 }), SNAPPY),
  pop: R('character', '50% 50%', () => ({ opacity: 0, scale: 0.4 }), SNAPPY),
  punch: R('line', '50% 100%', () => ({ opacity: 0, scale: 0.8, y: 24 }), { type: 'spring', bounce: 0.55 }),
  zoom: R('line', '50% 50%', () => ({ opacity: 0, scale: 1.6, filter: 'blur(14px)' }), SMOOTH),
  flip: R('character', '50% 50%', () => ({ opacity: 0, rotateX: 80, y: 30 }), SMOOTH),
  swivel: R('word', '50% 50%', () => ({ opacity: 0, rotateY: 90 }), SMOOTH),
  tilt: R('character', '50% 50%', (c) => ({ opacity: 0, rotate: c.i % 2 ? 8 : -8, y: 34 }), SPRING),
  twist: R('character', '50% 50%', () => ({ opacity: 0, rotate: 180, scale: 0.5 }), SNAPPY),
  cascade: R('line', '50% 0%', () => ({ opacity: 0, y: -90, scaleY: 1.4 }), SPRING),
  wave: R('character', '50% 50%', () => ({ opacity: 0, y: 40 }), SPRING),
  scatter: R('character', '50% 50%', (c) => ({
    opacity: 0,
    x: (pseudo(c.seed * 3 + 1) - 0.5) * 180,
    y: (pseudo(c.seed * 3 + 2) - 0.5) * 160,
    rotate: (pseudo(c.seed * 3 + 3) - 0.5) * 60,
  }), SPRING),
  warp: R('word', '0% 50%', () => ({ opacity: 0, z: -900, rotateY: 65, filter: 'blur(14px)' }), SMOOTH),
  explode: R('character', '50% 50%', () => ({ opacity: 0, scale: 0.3, filter: 'blur(6px)' }), SPRING),
};

/**
 * TextMotion — character / word / line text reveal engine.
 *
 * Rebuilt natively from the Framer module. Each preset is a recipe describing
 * where tokens start (hidden) and which easing they settle with. `staggerIndex`
 * orders the queue (forward, reverse, center-out, random) so any preset scales
 * to any string without touching math. GPU-friendly transforms only.
 */
export default function TextMotion({
  text,
  preset = 'rise',
  splitBy: splitByOverride,
  order = 'forward',
  className = '',
  delay = 0,
  stagger = 0.03,
  duration = 0.7,
  threshold = 0.3,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: threshold });

  const recipe = RECIPES[preset];
  const splitBy = splitByOverride ?? recipe.splitBy;
  const tail = { splitBy, order, duration, stagger, delay };

  const units = useMemo(() => {
    const lines = text.split('\n').filter((l) => l.trim().length > 0);
    if (tail.splitBy === 'line') return lines;
    if (tail.splitBy === 'word') return lines.flatMap((l) => l.split(/\s+/)).filter(Boolean);
    return Array.from(text.replace(/\n/g, ' '));
  }, [text, tail.splitBy]);

  const tokens = useMemo(
    () =>
      units.map((unit, i) => ({
        unit,
        orderIdx: staggerIndex(i, units.length, tail.order),
        seed: i,
      })),
    [units, tail.order]
  );

  const total = units.length;

  const showTransform = (custom: Custom): TargetAndTransition => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    scaleY: 1,
    skewX: 0,
    filter: 'blur(0px)',
    transition: {
      ...recipe.ease,
      duration: tail.duration,
      delay: tail.delay + custom.i * tail.stagger,
    },
  });

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ display: 'inline', perspective: 900 }}
    >
      {splitBy === 'line' ? (
        tokens.map((t, i) => (
          <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <motion.span
              className="inline-block"
              initial={recipe.hidden({ i: t.orderIdx, total, seed: t.seed })}
              animate={inView ? showTransform({ i: t.orderIdx, total, seed: t.seed }) : recipe.hidden({ i: t.orderIdx, total, seed: t.seed })}
              style={{ transformOrigin: recipe.origin, willChange: 'transform' }}
            >
              {t.unit}
            </motion.span>
          </span>
        ))
      ) : splitBy === 'word' ? (
        tokens.map((t, i) => (
          <motion.span
            key={i}
            className="inline-block whitespace-nowrap"
            initial={recipe.hidden({ i: t.orderIdx, total, seed: t.seed })}
            animate={inView ? showTransform({ i: t.orderIdx, total, seed: t.seed }) : recipe.hidden({ i: t.orderIdx, total, seed: t.seed })}
            style={{ transformOrigin: recipe.origin, willChange: 'transform' }}
          >
            {t.unit}
            {t.unit ? '\u00A0' : ''}
          </motion.span>
        ))
      ) : (
        tokens.map((t, i) => (
          <motion.span
            key={i}
            className="inline-block whitespace-nowrap"
            initial={recipe.hidden({ i: t.orderIdx, total, seed: t.seed })}
            animate={inView ? showTransform({ i: t.orderIdx, total, seed: t.seed }) : recipe.hidden({ i: t.orderIdx, total, seed: t.seed })}
            style={{ transformOrigin: recipe.origin, willChange: 'transform' }}
          >
            {t.unit}
          </motion.span>
        ))
      )}
    </motion.span>
  );
}
