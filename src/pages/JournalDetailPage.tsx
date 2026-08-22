import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { getPost, getRecentPosts } from '../data/journal';
import { useApp } from '../context/AppContext';
import ScrollRevealText from '../components/ui/ScrollRevealText';
import SafeImage from '../components/ui/SafeImage';
import TextMotion from '../components/ui/TextMotion';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function JournalDetailPage() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;
  const { toggleSave, isSaved } = useApp();

  // Reading progress for the article body specifically (not the whole page),
  // so the bar reflects how far through the actual text you are.
  const bodyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: bodyRef,
    offset: ['start 0.85', 'end 0.5'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  // Estimated minutes left, derived from the same progress value.
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const unsub = progress.on('change', (v) => setPct(v));
    return () => unsub();
  }, [progress]);

  if (!post) return <Navigate to="/journal" replace />;

  const related = getRecentPosts(3, post.slug);
  const saved = isSaved(post.id);
  const totalMin = parseInt(post.readTime) || 5;
  const minsLeft = Math.max(0, Math.round(totalMin * (1 - pct)));

  return (
    <>
      {/* Reading progress — scoped to the article body */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-gradient-to-r from-[#60a5fa] via-[#2563eb] to-[#1e40af]"
      />

      <article className="pt-32 pb-16 md:pt-40">
        {/* Head */}
        <div className="mx-auto max-w-3xl px-5 sm:px-6">
          <Link
            to="/journal"
            className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-[#0a1633]/45 transition hover:text-[#2563eb]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M13 18l-6-6 6-6" />
            </svg>
            Journal
          </Link>

          <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-widest text-[#0a1633]/45 sm:text-xs">
            <span className="rounded-full bg-[#2563eb]/10 px-3 py-1 font-medium text-[#2563eb]">
              {post.category}
            </span>
            <span>{formatDate(post.date)}</span>
            <span aria-hidden>·</span>
            <span>{post.readTime}</span>
            <span aria-hidden>·</span>
            <span>{post.author}</span>
          </div>

          <h1 className="serif mt-5 text-[2rem] leading-[1.1] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.05]">
            <TextMotion text={post.title} preset="rise" splitBy="line" stagger={0.09} />
          </h1>

          <p className="mt-5 text-base leading-relaxed text-[#0a1633]/60 sm:text-xl sm:leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
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
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                saved
                  ? 'bg-[#2563eb] text-white'
                  : 'border border-[#0a1633]/15 text-[#0a1633]/70 hover:border-[#2563eb] hover:text-[#2563eb]'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              {saved ? 'Saved' : 'Save article'}
            </button>
            {pct > 0.02 && pct < 0.98 && (
              <span className="text-xs text-[#0a1633]/35 tabular-nums">
                {minsLeft === 0 ? 'Almost done' : `${minsLeft} min left`}
              </span>
            )}
          </div>
        </div>

        {/* Hero image */}
        <div className="mx-auto mt-10 max-w-5xl px-5 sm:mt-12 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-2xl bg-[#dbeafe] sm:rounded-3xl"
          >
            <SafeImage
              src={post.img}
              alt={post.title}
              fallbackLabel={post.title}
              className="aspect-[16/10] w-full object-cover sm:aspect-[16/9]"
            />
          </motion.div>
        </div>

        {/* Body — the reading experience */}
        <div ref={bodyRef} className="mx-auto mt-12 max-w-[42rem] px-5 sm:mt-16 sm:px-6 md:max-w-2xl">
          <ScrollRevealText paragraphs={post.content} focusLine={0.6} dimOpacity={0.17} />
        </div>

        {/* End marker */}
        <div className="mx-auto mt-14 max-w-2xl px-6">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-[#0a1633]/12" />
            <span className="serif text-2xl italic text-[#2563eb]">End</span>
            <span className="h-px flex-1 bg-[#0a1633]/12" />
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="border-t border-[#0a1633]/10 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <h2 className="serif text-3xl sm:text-4xl">Keep reading</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-10">
            {related.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={`/journal/${p.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#dbeafe]">
                    <SafeImage
                      src={p.img}
                      alt={p.title}
                      fallbackLabel={p.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-widest text-[#0a1633]/40">
                    <span>{p.category}</span>
                    <span aria-hidden>·</span>
                    <span>{p.readTime}</span>
                  </div>
                  <h3 className="serif mt-2 text-xl leading-snug transition group-hover:text-[#2563eb] sm:text-2xl">
                    {p.title}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
