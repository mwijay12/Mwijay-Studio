import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Service } from '../../data/services';

/**
 * "Expand on hover" list — recreates the Framer component's behaviour natively:
 * rows live in a shared LayoutGroup and the hovered row spring-expands
 * (stiffness 400 / damping 49) to reveal its full description while siblings
 * stay compact. Mobile falls back to tap-to-toggle.
 */
export default function ExpandableServices({ services }: { services: Service[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      {services.map((s) => {
        const open = openId === s.id;
        return (
          <Link
            key={s.id}
            to={`/services#${s.id}`}
            onMouseEnter={() => setOpenId(s.id)}
            onMouseLeave={() => setOpenId((cur) => (cur === s.id ? null : cur))}
            onClick={(e) => {
              // Allow link navigation, but on mobile the tap first toggles expansion.
              if (window.matchMedia('(hover: none)').matches) {
                e.preventDefault();
                setOpenId(open ? null : s.id);
              }
            }}
            className="group relative border-b border-[#0a1633]/10 transition-colors duration-500 hover:bg-[#0a1633]/[0.03]"
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 400, damping: 49 }}
              className="flex items-center gap-6 py-7 md:py-9"
            >
              {/* Index number */}
              <span
                className={`serif text-xl md:text-2xl transition-colors duration-300 ${
                  open ? 'text-[#2563eb]' : 'text-[#0a1633]/30'
                }`}
              >
                {s.n}
              </span>

              {/* Title */}
              <h3
                className={`serif flex-1 text-3xl transition-all duration-500 group-hover:translate-x-2 sm:text-4xl md:text-6xl ${
                  open ? '-translate-y-0.5 text-[#2563eb]' : 'text-[#0a1633]'
                }`}
              >
                {s.title}
              </h3>

              {/* Meta: price + duration */}
              <div className="hidden text-right sm:block">
                <div className="text-xs uppercase tracking-widest text-[#0a1633]/40">From</div>
                <div className="serif text-xl md:text-2xl">{s.priceFrom}</div>
              </div>

              {/* Arrow */}
              <span
                className={`hidden h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 md:flex ${
                  open
                    ? 'rotate-45 border-[#2563eb] bg-[#2563eb] text-white'
                    : 'border-[#0a1633]/15 text-[#0a1633]/40 group-hover:border-[#2563eb]/40'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H8M17 7v9" />
                </svg>
              </span>
            </motion.div>

            {/* Expanding description */}
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 49 }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-4 pb-8 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
                    <p className="max-w-xl text-base leading-relaxed text-[#0a1633]/65 md:text-lg">
                      {s.desc}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-[#0a1633]/50">
                      <span className="uppercase tracking-widest text-xs">{s.duration}</span>
                      <span
                        className="inline-flex items-center gap-1.5 text-[#2563eb] font-medium"
                      >
                        View details
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        );
      })}
    </div>
  );
}
