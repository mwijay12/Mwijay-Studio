import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { posts } from '../data/journal';
import { useApp } from '../context/AppContext';
import PageHero from '../components/ui/PageHero';
import SafeImage from '../components/ui/SafeImage';
import TextMotion from '../components/ui/TextMotion';

const allCategories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function JournalPage() {
  const [cat, setCat] = useState('All');
  const { toggleSave, isSaved } = useApp();

  const filtered = useMemo(
    () => (cat === 'All' ? posts : posts.filter((p) => p.category === cat)),
    [cat]
  );

  const [featured, ...rest] = filtered.length ? filtered : posts;

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title={
          <>
            Notes on craft,
            <span className="italic text-[#2563eb]"> culture</span> &amp; process
          </>
        }
        rotatingPrefix="on"
        rotating={['type.', 'craft.', 'process.']}
        subtitle="Notes on building systems, AI automation, and design — from the Mwijay Studio desk."
      />

      {/* Category filters — horizontally scrollable on mobile so they never wrap awkwardly */}
      <section className="mx-auto max-w-7xl px-5 pb-6 pt-4 sm:px-6 md:pb-8">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {allCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider transition sm:text-sm ${
                cat === c
                  ? 'bg-[#0a1633] text-[#f5f8ff]'
                  : 'border border-[#0a1633]/15 text-[#0a1633]/70 hover:border-[#2563eb] hover:text-[#2563eb]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-6 md:pb-14">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to={`/journal/${featured.slug}`}
              className="group grid overflow-hidden rounded-2xl bg-[#eef2ff] sm:rounded-3xl md:grid-cols-2"
            >
              <div className="aspect-[16/10] overflow-hidden sm:aspect-[16/9] md:aspect-auto md:min-h-[360px]">
                <SafeImage
                  src={featured.img}
                  alt={featured.title}
                  fallbackLabel={featured.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest text-[#0a1633]/45">
                  <span>{featured.category}</span>
                  <span aria-hidden>·</span>
                  <span>{formatDate(featured.date)}</span>
                  <span aria-hidden>·</span>
                  <span>{featured.readTime}</span>
                </div>
                <h2 className="serif mt-4 text-2xl leading-snug transition group-hover:text-[#2563eb] sm:text-4xl md:text-5xl md:leading-tight">
                  {featured.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#0a1633]/60 sm:text-base">
                  {featured.excerpt}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-[#2563eb]">
                  Read article
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 md:pb-32">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-10">
          {rest.map((post, i) => {
            const saved = isSaved(post.id);
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
                <Link to={`/journal/${post.slug}`} className="block">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#dbeafe]">
                    <SafeImage
                      src={post.img}
                      alt={post.title}
                      fallbackLabel={post.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-widest text-[#0a1633]/40">
                    <span>{post.category}</span>
                    <span aria-hidden>·</span>
                    <span>{formatDate(post.date)}</span>
                    <span aria-hidden>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="serif mt-2 text-xl leading-snug transition group-hover:text-[#2563eb] sm:text-2xl">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#0a1633]/55">{post.excerpt}</p>
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    toggleSave({
                      id: post.id,
                      type: 'post',
                      title: post.title,
                      slug: post.slug,
                      img: post.img,
                    })
                  }
                  className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition ${
                    saved
                      ? 'bg-[#2563eb] text-white'
                      : 'bg-[#0a1633]/60 text-white opacity-0 focus-visible:opacity-100 group-hover:opacity-100'
                  }`}
                  aria-label={saved ? 'Remove from saved' : 'Save article'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </motion.div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="py-20 text-center text-[#0a1633]/50">No articles in this category yet.</p>
        )}
      </section>

      {/* Closing statement */}
      <section className="bg-[#0a1633] py-16 text-[#f5f8ff] md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="serif flex flex-col text-3xl leading-[0.95] sm:text-4xl md:text-5xl">
            <TextMotion text="Writing as we" preset="mask" splitBy="word" stagger={0.06} />
            <TextMotion text="build." preset="focus" splitBy="word" stagger={0.06} />
          </h2>
        </div>
      </section>
    </>
  );
}
