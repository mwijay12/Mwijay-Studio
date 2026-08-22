import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

export type BarDatum = {
  label: string;
  value: number;
  color?: string;
};

type Props = {
  data: BarDatum[];
  height?: number;
  /** Delay (s) before the first bar starts. */
  delay?: number;
  stagger?: number;
  showValues?: boolean;
  /** Tailwind class for the value label. */
  valueClassName?: string;
  className?: string;
};

/**
 * Animated vertical bar graph.
 *
 * Each bar grows from zero height to its final height on scroll. Values are
 * normalised to the dataset maximum so the tallest bar always fills the chart
 * region. Derived from the Framer BarGraph module (the original compiles
 * against Framer's runtime, which doesn't execute outside their canvas).
 */
export default function BarGraph({
  data,
  height = 260,
  delay = 0.15,
  stagger = 0.08,
  showValues = true,
  valueClassName = '',
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const max = Math.max(...data.map((d) => d.value), 1);

  const parent: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  const bar: Variants = {
    hidden: { scaleY: 0, opacity: 0 },
    show: {
      scaleY: 1,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={`flex items-end justify-center gap-3 sm:gap-4 ${className}`}
      style={{ height }}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={parent}
    >
      {data.map((d) => {
        const pct = (d.value / max) * 100;
        return (
          <div
            key={d.label}
            className="flex flex-col items-center gap-2"
            style={{ flex: 1, maxWidth: 80 }}
          >
            {showValues && (
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45, delay: stagger + 0.2 },
                  },
                }}
                className={`text-xs font-semibold tabular-nums ${valueClassName}`}
              >
                {d.value.toLocaleString()}
              </motion.span>
            )}
            <motion.div
              variants={bar}
              className="w-full origin-bottom rounded-t-lg"
              style={{
                height: `${pct}%`,
                background: d.color || 'linear-gradient(to top, #2563eb, #60a5fa)',
              }}
            />
            <span className="w-full truncate text-center text-[10px] font-medium uppercase tracking-wider text-[#0a1633]/55">
              {d.label}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
}
