import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories, projects, type Category } from '../data/projects';
import PageHero from '../components/ui/PageHero';
import CTABlock from '../components/ui/CTABlock';
import SafeImage from '../components/ui/SafeImage';
import StaggerReveal from '../components/ui/StaggerReveal';
import TextMotion from '../components/ui/TextMotion';

export default function WorkPage() {
  const [active, setActive] = useState<Category>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const catOk = active === 'All' || p.category === active;
      const q = query.trim().toLowerCase();
      const qOk =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.services.some((s) => s.toLowerCase().includes(q));
      return catOk && qOk;
    });
  }, [active, query]);

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title={
          <>
            Selected <span className="italic text-[#2563eb]">work</span>
          </>
        }
        rotatingPrefix="we craft"
        rotating={['brands.', 'products.', 'stories.']}
        subtitle="A collection of brands, products, and digital experiences crafted with care."
      />

      {/* Filters + search */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium uppercase tracking-wider transition ${
                  active === c
                    ? 'bg-[#0a1633] text-[#f5f8ff]'
                    : 'border border-[#0a1633]/15 text-[#0a1633]/70 hover:border-[#2563eb] hover:text-[#2563eb]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              className="w-full rounded-full border border-[#0a1633]/15 bg-transparent px-5 py-2.5 pr-10 text-sm outline-none focus:border-[#2563eb]"
            />
            <svg
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0a1633]/40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </div>
        </div>
        <p className="mt-6 text-sm text-[#0a1633]/50">
          Showing {filtered.length} of {projects.length} projects
        </p>
      </section>

      {/* Scroll archive */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#0a1633]/20 py-24 text-center">
            <p className="serif text-3xl">No projects match</p>
            <button
              type="button"
              onClick={() => {
                setActive('All');
                setQuery('');
              }}
              className="mt-4 text-sm uppercase tracking-widest text-[#2563eb]"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Scroll hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-10 flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-[#0a1633]/40"
            >
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="text-[#2563eb]"
              >
                ↓
              </motion.span>
              Keep scrolling — the archive moves with you
            </motion.div>

            {/* Archive rows */}
            <div className="space-y-4 md:space-y-6">
              {filtered.map((p, i) => (
                <StaggerReveal key={p.id} stagger={0}>
                  <Link
                    to={`/work/${p.slug}`}
                    className={`group grid items-center gap-5 rounded-3xl border border-[#0a1633]/8 bg-white/60 p-4 transition-all duration-500 hover:border-[#2563eb]/30 hover:shadow-[0_18px_50px_-24px_rgba(37,99,235,0.35)] hover:-translate-y-1 md:grid-cols-12 md:p-5 ${
                      i % 2 === 1 ? 'md:[direction:rtl]' : ''
                    }`}
                  >
                    {/* Image */}
                    <div className="overflow-hidden rounded-2xl md:col-span-5 md:[direction:ltr]">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <SafeImage
                          src={p.img}
                          alt={p.title}
                          fallbackLabel={p.title}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <span className="glass-card-dark absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.6rem] font-medium uppercase tracking-widest text-white backdrop-blur-md">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              p.status === 'Completed' ? 'bg-emerald-400' : 'animate-pulse bg-[#ec4899]'
                            }`}
                          />
                          {p.status === 'Completed' ? 'Live' : 'In progress'}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="min-w-0 md:col-span-7 md:px-4 md:[direction:ltr]">
                      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[#0a1633]/45">
                        <span>{p.tag}</span>
                        <span className="hidden sm:inline">·</span>
                        <span className="hidden sm:inline">{p.year}</span>
                      </div>
                      <h3 className="serif mt-2 text-3xl transition-colors duration-300 group-hover:text-[#2563eb] md:text-5xl">
                        {p.title}
                      </h3>
                      <p className="mt-3 line-clamp-2 max-w-lg text-sm text-[#0a1633]/60 md:text-base">
                        {p.summary}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#2563eb]">
                        View case study
                        <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                      </span>
                    </div>
                  </Link>
                </StaggerReveal>
              ))}
            </div>

            {/* Archive end note */}
            <div className="mt-16 text-center md:mt-24">
              <p className="serif flex flex-col items-center text-3xl text-[#0a1633]/70 md:text-5xl">
                <span>
                  <TextMotion text="That's everything —" preset="blur" splitBy="word" stagger={0.05} />
                </span>
                <span className="italic text-[#2563eb]">
                  <TextMotion text="for now." preset="wave" splitBy="character" stagger={0.04} />
                </span>
              </p>
              <motion.p
                className="mt-3 text-sm text-[#0a1633]/45"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                More live builds are shipping every month.
              </motion.p>
            </div>
          </>
        )}
      </section>

      <CTABlock title="Like what you see?" subtitle="Let's make the next case study yours." />
    </>
  );
}
