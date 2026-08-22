import { motion, type Variants } from 'framer-motion';

type Effect =
  | 'riseBlur'
  | 'flip3D'
  | 'stretchUp'
  | 'splitApart'
  | 'skewSlide'
  | 'scaleSettle'
  | 'dropIn';

type Props = {
  /** One animated line per newline. */
  text: string;
  effect?: Effect;
  className?: string;
  /** Tailwind classes applied to every line. */
  lineClassName?: string;
  /** Per-line delay. */
  stagger?: number;
  /** How much of the block must be visible before it plays (0–1). */
  amount?: number;
  once?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
};

type CustomData = { index: number; total: number };

/**
 * Scroll-triggered typography — each line animates in on its own.
 *
 * Rebuilt natively from the Framer OnScrollTypography module (the original
 * imports Framer's proprietary runtime and can't run outside their canvas).
 * I kept the seven effects that read best at large display sizes and dropped
 * the rest, which were mostly minor variations of the same handful of moves.
 *
 * Index-aware variants receive `{ index, total }` via Motion's `custom` prop,
 * which is what lets effects fan outward from the centre line.
 */
export default function ScrollTypography({
  text,
  effect = 'riseBlur',
  className = '',
  lineClassName = '',
  stagger = 0.09,
  amount = 0.35,
  once = true,
  as: Tag = 'div',
}: Props) {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const parent: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger } },
  };

  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ amount, once }}
      variants={parent}
      style={{ perspective: 1000 }}
    >
      {lines.map((line, index) => (
        <motion.span
          key={index}
          className={`block ${lineClassName}`}
          variants={EFFECTS[effect]}
          custom={{ index, total: lines.length }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {line}
        </motion.span>
      ))}
    </MotionTag>
  );
}

const EFFECTS: Record<Effect, Variants> = {
  // Soft focus-pull — the most versatile, works at any size.
  riseBlur: {
    hidden: { opacity: 0, y: 44, filter: 'blur(12px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.9, ease: [0.19, 1, 0.22, 1] },
    },
  },

  // Lines hinge in from below on the X axis. Great for big serif headlines.
  flip3D: {
    hidden: { opacity: 0, rotateX: -82, y: 38 },
    show: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: { duration: 0.9, ease: [0.25, 0.8, 0.25, 1] },
    },
  },

  // Squash-and-stretch entrance with a light overshoot.
  stretchUp: {
    hidden: { opacity: 0, y: 60, scaleY: 2.1, scaleX: 0.75 },
    show: {
      opacity: 1,
      y: 0,
      scaleY: 1,
      scaleX: 1,
      transition: { duration: 0.85, ease: [0.34, 1.56, 0.64, 1] },
    },
  },

  // Lines converge horizontally toward the centre.
  splitApart: {
    hidden: ({ index, total }: CustomData) => ({
      opacity: 0,
      x: (index - (total - 1) / 2) * 90,
    }),
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  },

  // Alternating skewed slide — editorial, a bit kinetic.
  skewSlide: {
    hidden: ({ index }: CustomData) => ({
      opacity: 0,
      x: index % 2 ? 70 : -70,
      skewX: index % 2 ? -8 : 8,
    }),
    show: {
      opacity: 1,
      x: 0,
      skewX: 0,
      transition: { duration: 0.85, ease: [0.23, 1, 0.32, 1] },
    },
  },

  // Zooms down into place. Reads as confident and calm.
  scaleSettle: {
    hidden: { opacity: 0, scale: 1.18, y: 30 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.19, 1, 0.22, 1] },
    },
  },

  // Falls from above, outer lines travel further. Playful, high impact.
  dropIn: {
    hidden: ({ index, total }: CustomData) => ({
      opacity: 0,
      y: -110 - Math.abs(index - (total - 1) / 2) * 28,
    }),
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.34, 1.56, 0.64, 1] },
    },
  },
};
