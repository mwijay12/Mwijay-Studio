import { useRef, useState, useEffect, forwardRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { subscribePointer, useHasPointer } from '../../hooks/useGlobalPointer';

type Props = {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'outline';
};

/**
 * Eye-Follow Button — pupils track the cursor from anywhere on the page.
 *
 * Key detail: tracking is global, not hover-scoped. Each eye subscribes to a
 * single shared `pointermove` stream and computes its own direction from its
 * own bounding box, so the two pupils converge slightly when the cursor is
 * close (real eyes do this) and stay parallel when it's far away.
 *
 * Pupil centering is done with flexbox on a wrapper — never with Tailwind
 * translate classes on the same node Framer Motion writes `x`/`y` to, because
 * Motion overwrites the whole `transform` property and the class-based
 * centering would silently lose.
 */
export default function EyeFollowButton({
  children,
  to,
  onClick,
  type = 'button',
  disabled,
  className = '',
  variant = 'primary',
}: Props) {
  const [blinking, setBlinking] = useState(false);

  // Randomized blink loop so the two eyes feel alive rather than mechanical.
  useEffect(() => {
    let timeoutId: number;
    const schedule = () => {
      timeoutId = window.setTimeout(() => {
        setBlinking(true);
        window.setTimeout(() => {
          setBlinking(false);
          schedule();
        }, 130);
      }, 2200 + Math.random() * 2600);
    };
    schedule();
    return () => window.clearTimeout(timeoutId);
  }, []);

  const bg =
    variant === 'primary'
      ? 'bg-[#0a1633] text-white hover:bg-[#12275a]'
      : 'bg-white text-[#0a1633] border-2 border-[#0a1633]/10 hover:border-[#0a1633]/30';

  const button = (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`group relative inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold shadow-[0_10px_28px_-8px_rgba(10,22,51,.45)] transition-colors disabled:cursor-not-allowed disabled:opacity-40 sm:gap-4 sm:px-7 sm:py-3.5 ${bg} ${className}`}
    >
      <span className="whitespace-nowrap tracking-tight">{children}</span>

      <span className="relative flex h-8 items-center gap-1 rounded-full bg-[#f5f8ff] px-2 sm:h-10 sm:gap-1.5 sm:px-2.5">
        <PupilEye blinking={blinking} />
        <PupilEye blinking={blinking} />
      </span>
    </motion.button>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block">
        {button}
      </Link>
    );
  }
  return button;
}

const MAX_TRAVEL = 5;

const PupilEye = forwardRef<HTMLDivElement, { blinking: boolean }>(function PupilEye(
  { blinking },
  ref
) {
  const eyeRef = useRef<HTMLDivElement>(null);
  const hasPointer = useHasPointer();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 220, damping: 20, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 220, damping: 20, mass: 0.4 });

  useEffect(() => {
    if (!hasPointer) return;

    return subscribePointer((px, py) => {
      const el = eyeRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Skip work when the eye is scrolled out of view.
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = px - cx;
      const dy = py - cy;

      // Normalise to a unit vector, then scale by how close the cursor is.
      // Distant cursors still get full deflection; nearby ones ease off so the
      // pupil doesn't slam against the edge of the eye.
      const dist = Math.hypot(dx, dy) || 1;
      const pull = Math.min(1, dist / 160);
      rawX.set((dx / dist) * MAX_TRAVEL * pull);
      rawY.set((dy / dist) * MAX_TRAVEL * pull);
    });
  }, [hasPointer, rawX, rawY]);

  return (
    <motion.div
      ref={ref ?? eyeRef}
      className="relative h-5 w-5 overflow-hidden rounded-full bg-white sm:h-6 sm:w-6"
      animate={{ scaleY: blinking ? 0.1 : 1 }}
      transition={{ duration: 0.12, ease: 'easeInOut' }}
      style={{ transformOrigin: '50% 50%' }}
    >
      {/* Inner ref target for measurement (the outer one may be forwarded). */}
      <div ref={eyeRef} className="absolute inset-0 flex items-center justify-center">
        <motion.div
          aria-hidden
          className="h-2.5 w-2.5 rounded-full bg-[#0a1633] sm:h-3 sm:w-3"
          style={{ x, y }}
        />
      </div>

      <span className="pointer-events-none absolute right-0.5 top-0.5 h-1 w-1 rounded-full bg-white/80" />
    </motion.div>
  );
});
