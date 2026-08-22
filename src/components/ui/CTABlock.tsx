import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useReveal';
import TextLoop from './text-loop';
import TextMotion from './TextMotion';
import CalligraphySignature from './CalligraphySignature';

type Props = {
  title?: string;
  subtitle?: string;
  rotating?: string[];
};

export default function CTABlock({
  title = 'Have a project in mind?',
  subtitle = 'Tell us about your brand, product, or idea — we\u2019ll reply within a day.',
  rotating,
}: Props) {
  const { ref, shown } = useReveal();
  return (
    <section className="relative overflow-hidden bg-[#0a1633] py-20 text-[#f5f8ff] md:py-28">
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#2563eb]/20 blur-3xl" />
      <div
        ref={ref}
        className={`relative mx-auto max-w-4xl px-6 text-center transition-all duration-700 ${
          shown ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <h2 className="serif text-4xl leading-tight text-[#f5f8ff] sm:text-5xl md:text-7xl">
          <TextMotion text={title} preset="focus" splitBy="word" stagger={0.06} />
        </h2>

        {rotating && (
          <div className="mt-6 flex justify-center">
            <TextLoop
              staticText="Let's make remarkable"
              rotatingTexts={rotating}
              className="serif text-2xl sm:text-3xl md:text-5xl font-normal italic"
              staticTextClassName="text-[#f5f8ff]/50 not-italic"
              rotatingTextClassName="bg-gradient-to-r from-[#93c5fd] to-[#2563eb]"
              backgroundClassName="bg-gradient-to-r from-transparent via-blue-500/10 to-blue-400/15 rounded-lg"
              cursorClassName="bg-[#60a5fa] h-[0.85em]"
              interval={2400}
              transition={{ duration: 0.65, ease: "easeInOut" }}
            />
          </div>
        )}

        <p className="mx-auto mt-5 max-w-md text-sm text-[#f5f8ff]/60 sm:text-base">
          {subtitle}
        </p>
        <Link
          to="/start"
          className="mt-10 inline-flex rounded-full bg-[#2563eb] px-8 py-4 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#1e40af] shadow-lg shadow-[#2563eb]/30"
        >
          Start a project →
        </Link>

        {/* Personal sign-off — the ink draws itself as the block scrolls in. */}
        <div className="mt-12 flex flex-col items-center">
          <CalligraphySignature
            text="Mwijay"
            fontPreset="allura"
            fontSize={88}
            color="#60a5fa"
            animationTime={3.6}
            className="w-full max-w-[210px]"
          />
          <span className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#f5f8ff]/35">
            Dar es Salaam
          </span>
        </div>
      </div>
    </section>
  );
}
