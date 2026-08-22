import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import TextLoop from './text-loop';

type Props = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  dark?: boolean;
  rotating?: string[];
  rotatingPrefix?: string;
};

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  dark,
  rotating,
  rotatingPrefix = 'that feel',
}: Props) {
  const sub = dark ? 'text-[#f5f8ff]/60' : 'text-[#0a1633]/60';
  return (
    <section
      className={`overflow-hidden pt-36 pb-10 md:pt-44 md:pb-16 ${
        dark ? 'bg-[#0a1633] text-[#f5f8ff]' : ''
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="h-2 w-2 rounded-full bg-[#2563eb]" />
            <span
              className={`text-xs font-medium uppercase tracking-widest sm:text-sm ${
                dark ? 'text-[#f5f8ff]/50' : 'text-[#0a1633]/60'
              }`}
            >
              {eyebrow}
            </span>
          </motion.div>
        )}
        <h1 className="serif text-4xl leading-[0.95] tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
          {title}
        </h1>

        {rotating && (
          <div className="mt-4">
            <TextLoop
              staticText={rotatingPrefix}
              rotatingTexts={rotating}
              className={`serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-normal italic ${
                dark ? 'text-[#f5f8ff]/50' : 'text-[#0a1633]/50'
              }`}
              staticTextClassName="not-italic"
              rotatingTextClassName={
                dark
                  ? 'bg-gradient-to-r from-[#93c5fd] to-[#2563eb]'
                  : 'bg-gradient-to-r from-[#60a5fa] to-[#1e40af]'
              }
              backgroundClassName={
                dark
                  ? 'bg-gradient-to-r from-transparent via-blue-500/8 to-blue-400/12 rounded-lg'
                  : 'bg-gradient-to-r from-transparent via-blue-100/30 to-blue-200/40 rounded-lg'
              }
              cursorClassName={dark ? 'bg-[#60a5fa]' : 'bg-[#2563eb]'}
              interval={3000}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            />
          </div>
        )}

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`mt-6 max-w-xl text-base sm:text-lg ${sub}`}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
