import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { services } from '../data/services';
import PageHero from '../components/ui/PageHero';
import CTABlock from '../components/ui/CTABlock';
import Reveal from '../components/ui/Reveal';
import TextMotion from '../components/ui/TextMotion';

/** Relevant background photo for each service's process steps. */
const PROCESS_IMAGES: Record<string, string> = {
  web: 'https://images.pexels.com/photos/943096/pexels-photo-943096.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  systems: 'https://images.pexels.com/photos/577210/pexels-photo-577210.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  ai: 'https://images.pexels.com/photos/8294663/pexels-photo-8294663.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  design: 'https://images.pexels.com/photos/27668992/pexels-photo-27668992.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
};

export default function ServicesPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title={
          <>
            Services built around
            <span className="italic text-[#2563eb]"> outcomes</span>
          </>
        }
        rotatingPrefix="we design"
        rotating={['brands.', 'systems.', 'products.']}
        subtitle="Whether you need a full brand system or a razor-sharp landing page, we assemble the right craft for the job."
      />

      <section className="mx-auto max-w-7xl px-4 md:px-6 pb-6 md:pb-10">
        <div className="flex flex-wrap gap-2 md:gap-3 overflow-x-auto scrollbar-hide">
          {services.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border border-[#14110f]/15 px-3 py-1.5 md:px-4 md:py-2 text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap transition hover:border-[#c4552e] hover:text-[#c4552e]"
            >
              {s.title}
            </a>
          ))}
        </div>
      </section>

      <div className="space-y-8 px-3 pb-24 md:px-6">
        {services.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            style={{ top: `${76 + i * 10}px`, zIndex: i + 1 }}
            className={`relative scroll-mt-20 md:scroll-mt-28 overflow-hidden rounded-2xl md:rounded-[2rem] border border-[#0a1633]/8 shadow-[0_-8px_40px_rgba(10,22,51,.08)] md:sticky ${
              i % 2 === 1 ? 'bg-[#eef2ff]' : 'bg-[#f5f8ff]'
            }`}
          >
            {/* Soft full-bleed backdrop photo — hidden on mobile to keep things clean */}
            <div className="pointer-events-none absolute inset-0 hidden md:block">
              <img
                src={PROCESS_IMAGES[s.id]}
                alt=""
                aria-hidden
                loading="lazy"
                className="h-full w-full object-cover opacity-[0.07]"
              />
            </div>
            <div className="relative mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-16 lg:py-24">
              <Reveal>
                <div className="grid gap-12 md:grid-cols-12">
                  <div className="md:col-span-5">
                    <span className="text-xs sm:text-sm text-[#2563eb]">{s.n}</span>
                    <h2 className="serif mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
                      <TextMotion text={s.title} preset="rise" splitBy="word" stagger={0.05} />
                    </h2>
                    <p className="mt-3 text-base sm:text-lg leading-relaxed text-[#0a1633]/70 md:mt-6">{s.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs sm:text-sm md:mt-8 md:gap-6">
                      <div>
                        <div className="uppercase tracking-widest text-[#0a1633]/45">From</div>
                        <div className="serif mt-0.5 text-xl sm:text-2xl md:mt-1">{s.priceFrom}</div>
                      </div>
                      <div>
                        <div className="uppercase tracking-widest text-[#0a1633]/45">Timeline</div>
                        <div className="serif mt-0.5 text-xl sm:text-2xl md:mt-1">{s.duration}</div>
                      </div>
                    </div>
                    <Link
                      to="/start"
                      state={{ service: s.title }}
                      className="mt-4 inline-flex rounded-full bg-[#0a1633] px-5 py-2.5 text-xs sm:text-sm md:mt-8 md:px-6 md:py-3 font-medium text-[#f5f8ff] transition hover:-translate-y-0.5"
                    >
                      Inquire about {s.title} →
                    </Link>
                  </div>

                  <div className="space-y-10 md:col-span-7">
                    <div>
                      <h3 className="text-sm font-medium uppercase tracking-widest text-[#0a1633]/50">
                        Deliverables
                      </h3>
                      <ul className="mt-3 grid gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3">
                        {s.deliverables.map((d) => (
                          <li
                            key={d}
                            className="flex items-start gap-2 rounded-lg sm:rounded-xl border border-[#0a1633]/10 bg-[#f5f8ff]/60 px-3 py-2.5 text-xs sm:text-sm sm:px-4 sm:py-3 backdrop-blur-sm"
                          >
                            <span className="mt-0.5 text-[#2563eb] sm:mt-1">✳</span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium uppercase tracking-widest text-[#0a1633]/50">
                        Process
                      </h3>
                      <ol className="mt-4 grid gap-3 sm:grid-cols-2">
                        {s.process.map((p, idx) => (
                          <li
                            key={p.step}
                            className="group relative overflow-hidden rounded-xl p-4 text-[#f5f8ff] sm:min-h-[140px] sm:p-5"
                          >
                            {/* Background photo on desktop only — mobile keeps it simple */}
                            <img
                              src={PROCESS_IMAGES[s.id]}
                              alt=""
                              aria-hidden
                              loading="lazy"
                              className="absolute inset-0 hidden h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:block"
                            />
                            {/* Dark gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1633]/95 via-[#0a1633]/60 to-[#0a1633]/30 sm:from-[#0a1633]/95" />
                            <div className="relative z-10">
                              <span className="text-[10px] sm:text-xs text-[#60a5fa]">Step 0{idx + 1}</span>
                              <div className="serif mt-1 text-lg sm:text-2xl">{p.step}</div>
                              <p className="mt-1 text-xs sm:text-sm text-[#f5f8ff]/70 sm:mt-2">{p.detail}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      <CTABlock title="Not sure where to start?" subtitle="Book a free 30-minute discovery call and we’ll map the right path." />
    </>
  );
}
