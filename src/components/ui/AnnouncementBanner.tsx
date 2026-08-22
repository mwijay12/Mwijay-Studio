import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export type Announcement = {
  /** Bump this when the message changes so dismissed banners reappear. */
  id: string;
  message: string;
  linkLabel?: string;
  linkTo?: string;
  variant?: 'default' | 'success' | 'warning';
};

const STORAGE_KEY = 'ms-dismissed-announcement';

const VARIANT_BG: Record<NonNullable<Announcement['variant']>, string> = {
  default: 'bg-[#0a1633]',
  success: 'bg-[#0a4d3a]',
  warning: 'bg-[#4d3a0a]',
};

type Props = {
  announcement: Announcement | null;
  /** Reports the rendered height (0 when hidden) so the layout can offset the fixed nav below it. */
  onHeightChange?: (height: number) => void;
};

/**
 * Slim, dismissible bar for site-wide notices — new feature launches,
 * availability windows, seasonal offers. Persists dismissal per announcement
 * id in localStorage, so editing the message (and bumping the id) brings it
 * back for everyone without clearing their storage.
 *
 * Rendered as `fixed` above the nav bar. It reports its own height back to
 * the layout via `onHeightChange` so the nav (and page content) can shift
 * down by exactly that amount instead of the two overlapping.
 */
export default function AnnouncementBanner({ announcement, onHeightChange }: Props) {
  const [dismissed, setDismissed] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!announcement) {
      onHeightChange?.(0);
      return;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    setDismissed(stored === announcement.id);
  }, [announcement, onHeightChange]);

  useEffect(() => {
    const el = ref.current;
    if (!el || dismissed) {
      onHeightChange?.(0);
      return;
    }
    const ro = new ResizeObserver(([entry]) => onHeightChange?.(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, [dismissed, onHeightChange]);

  if (!announcement) return null;

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, announcement.id);
    setDismissed(true);
  };

  const bg = VARIANT_BG[announcement.variant ?? 'default'];

  return (
    <AnimatePresence initial={false}>
      {!dismissed && (
        <motion.div
          ref={ref}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed inset-x-0 top-0 z-[70] overflow-hidden ${bg} text-white`}
        >
          <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-3 px-10 py-2.5 text-center">
            <span className="h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full bg-[#60a5fa]" />
            <p className="text-xs font-medium leading-snug sm:text-sm">
              {announcement.message}
              {announcement.linkTo && announcement.linkLabel && (
                <Link
                  to={announcement.linkTo}
                  className="ml-2 inline-flex items-center gap-1 underline decoration-[#60a5fa]/50 decoration-2 underline-offset-2 transition hover:decoration-[#60a5fa]"
                >
                  {announcement.linkLabel}
                  <span aria-hidden>→</span>
                </Link>
              )}
            </p>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss announcement"
              className="absolute right-3 flex-shrink-0 rounded-full p-1 text-white/50 transition hover:bg-white/10 hover:text-white sm:right-5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
