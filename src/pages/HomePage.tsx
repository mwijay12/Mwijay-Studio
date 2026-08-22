import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import { services } from '../data/services';
import { posts } from '../data/journal';
import { stats } from '../data/team';
import ProjectCard from '../components/ui/ProjectCard';
import Marquee from '../components/ui/Marquee';
import CTABlock from '../components/ui/CTABlock';
import AnimatedStats from '../components/ui/AnimatedStats';
import StaggerReveal from '../components/ui/StaggerReveal';
import GridBackdrop from '../components/ui/GridBackdrop';
import MagneticButton from '../components/ui/MagneticButton';
import HorizontalScroll from '../components/ui/HorizontalScroll';
import ExpandableServices from '../components/ui/ExpandableServices';
import TextMotion from '../components/ui/TextMotion';
import { TextGenerateEffect } from '../components/ui/text-generate-effect';
import TextLoop from '../components/ui/text-loop';

export default function HomePage() {
  const featured = projects.filter((p) => p.featured);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-20 md:pt-48 md:pb-28">
        <GridBackdrop />

        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#14110f]/15 px-4 py-1.5 text-[0.7rem] sm:text-xs font-medium uppercase tracking-widest">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#2563eb]" />
              Available for new projects — 2026
            </span>
          </motion.div>

          <div className="mt-8">
            <h1 className="serif block text-[12.5vw] leading-[0.95] tracking-tight sm:text-[13vw] md:text-[10.5rem] md:leading-[0.88]">
              <TextMotion text="Design that" preset="rise" splitBy="word" order="forward" stagger={0.12} />
            </h1>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <TextLoop
                staticText="feels"
                rotatingTexts={["alive.", "considered.", "timeless.", "premium."]}
                className="serif text-[12.5vw] leading-[0.95] tracking-tight sm:text-[13vw] md:text-[10.5rem] md:leading-[0.88] font-normal italic"
                staticTextClassName="not-italic text-[#0a1633]"
                rotatingTextClassName="bg-gradient-to-r from-[#60a5fa] to-[#1e40af]"
                backgroundClassName="bg-gradient-to-r from-transparent via-blue-100/20 to-blue-200/30 rounded-xl"
                cursorClassName="bg-[#2563eb] h-[0.85em] sm:h-[0.8em]"
                interval={2800}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </motion.div>
          </div>

          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="max-w-md text-base leading-relaxed text-[#14110f]/70 sm:text-lg"
            >
              <TextGenerateEffect
                words="We're a small studio crafting bold brand identities and web experiences for people who refuse to blend in."
                filter
                duration={0.5}
                staggerDelay={0.035}
                className="text-[#14110f]/70"
              />
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <MagneticButton>
                <Link to="/work" className="group inline-flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0a1633] text-white transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M17 7H8M17 7v9" />
                    </svg>
                  </span>
                  <span className="text-xs font-medium uppercase tracking-widest sm:text-sm">See our work</span>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  to="/start"
                  className="inline-flex items-center rounded-full border border-[#0a1633]/20 px-6 py-3 text-xs font-medium uppercase tracking-widest transition hover:border-[#2563eb] hover:text-[#2563eb] sm:py-4 sm:text-sm"
                >
                  Start a project
                </Link>
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </section>

      <Marquee />

      {/* Featured work */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-12 md:pt-20 md:pb-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6 md:mb-12">
          <h2 className="serif flex flex-col text-4xl leading-[0.95] md:text-7xl">
            <TextMotion text="Selected" preset="flip" splitBy="character" order="forward" stagger={0.045} />
            <TextMotion text="work" preset="rise" order="forward" stagger={0.08} />
          </h2>
          <Link
            to="/work"
            className="text-xs font-medium uppercase tracking-widest text-[#0a1633]/60 transition hover:text-[#2563eb] sm:text-sm"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} large={i === 0} />
          ))}
        </div>
      </section>

      {/* Horizontal project showcase */}
      <section className="relative my-0 bg-[#0a1633] text-[#f5f8ff]">
        <HorizontalScroll
          speed={1.2}
          header={
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[11px] font-medium uppercase tracking-widest text-[#60a5fa]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#60a5fa] animate-pulse" />
                  Showcase Reel
                </span>
                <h3 className="serif text-2xl sm:text-3xl text-white mt-2">
                  Recent builds & systems
                </h3>
              </div>
              <motion.span
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80 backdrop-blur-md"
              >
                <motion.span
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-[#60a5fa]"
                >
                  →
                </motion.span>
                <span className="hidden sm:inline">Scroll to explore</span>
                <span className="sm:hidden">Swipe to explore</span>
              </motion.span>
            </div>
          }
        >
          {projects.slice(0, 7).map((p) => (
            <Link
              key={p.id}
              to={`/work/${p.slug}`}
              className="group relative w-[320px] flex-shrink-0 overflow-hidden rounded-2xl sm:w-[400px]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1633]/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-xs uppercase tracking-widest text-[#60a5fa]">{p.tag}</span>
                <h3 className="serif mt-1 text-2xl text-white">{p.title}</h3>
                {p.liveUrl && (
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#f5f8ff]/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
                  </span>
                )}
              </div>
            </Link>
          ))}
        </HorizontalScroll>
      </section>

      {/* Services preview */}
      <section className="bg-[#eef2ff] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-2 w-2 rounded-full bg-[#2563eb]" />
            <span className="text-xs font-medium uppercase tracking-widest text-[#0a1633]/60 sm:text-sm">
              What we do
            </span>
          </div>
          <div className="overflow-hidden rounded-3xl bg-[#fff]/70 px-5 backdrop-blur-md sm:px-8">
            <ExpandableServices services={services} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <AnimatedStats stats={stats} columns={4} />
      </section>

      {/* Journal teaser */}
      <section className="border-t border-[#14110f]/10 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6 md:mb-10">
            <h2 className="serif flex flex-col text-4xl leading-[0.95] md:text-6xl">
              <TextMotion text="From the" preset="slide" splitBy="word" stagger={0.05} />
              <TextMotion text="journal" preset="wave" splitBy="character" stagger={0.04} />
            </h2>
            <Link
              to="/journal"
              className="text-xs font-medium uppercase tracking-widest text-[#0a1633]/60 transition hover:text-[#2563eb] sm:text-sm"
            >
              All articles →
            </Link>
          </div>
          <StaggerReveal className="grid gap-8 md:grid-cols-3" stagger={0.08}>
            {posts.slice(0, 3).map((post) => (
              <Link key={post.id} to={`/journal/${post.slug}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#dbeafe]">
                  <img
                    src={post.img}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[#14110f]/50">
                  <span>{post.category}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="serif mt-2 text-2xl leading-snug transition group-hover:text-[#2563eb]">
                  {post.title}
                </h3>
              </Link>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <CTABlock rotating={['brands.', 'websites.', 'products.', 'stories.']} />
    </>
  );
}
