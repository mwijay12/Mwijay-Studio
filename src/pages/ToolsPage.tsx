import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { aiTools } from '../data/tools';
import { isAIConfigured } from '../lib/ai';
import PageHero from '../components/ui/PageHero';
import TextMotion from '../components/ui/TextMotion';
import { TOOL_ICON_MAP, PromptIcon } from '../components/ui/ToolIcons';

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [...new Set(aiTools.map((t) => t.category))];
  const filtered = activeCategory
    ? aiTools.filter((t) => t.category === activeCategory)
    : aiTools;

  return (
    <>
      <PageHero
        eyebrow="Studio AI Suite"
        title={<>Studio AI tools <span className="italic text-[#2563eb]">that deliver</span></>}
        subtitle="Prompt generators, lyric studios, voice scripts, sound design, and project scope estimators — powered by our resilient Groq, OpenRouter & ElevenLabs engines. Free for daily use."
      />

      {!isAIConfigured && (
        <section className="mx-auto max-w-7xl px-6 pb-2">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0">
              <path d="M12 9v4M12 17h.01M10.29 3.86l-8.18 14.18A1.5 1.5 0 0 0 3.4 20.5h17.2a1.5 1.5 0 0 0 1.3-2.46L13.71 3.86a1.5 1.5 0 0 0-2.6 0z" />
            </svg>
            <span>
              These tools are live but not yet connected to an AI provider. Add a free Gemini or OpenRouter API key to your environment to enable real generations.
            </span>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-8 pt-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium uppercase tracking-wider transition ${
              activeCategory === null
                ? 'bg-[#0a1633] text-[#f5f8ff]'
                : 'border border-[#0a1633]/15 text-[#0a1633]/70 hover:border-[#2563eb] hover:text-[#2563eb]'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCategory(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium uppercase tracking-wider transition ${
                activeCategory === c
                  ? 'bg-[#0a1633] text-[#f5f8ff]'
                  : 'border border-[#0a1633]/15 text-[#0a1633]/70 hover:border-[#2563eb] hover:text-[#2563eb]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool, i) => {
            const Icon = TOOL_ICON_MAP[tool.id] ?? PromptIcon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={`/tools/${tool.id}`}
                  className="group flex flex-col rounded-3xl border border-[#0a1633]/10 bg-white/70 p-6 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-[#2563eb]/30 hover:shadow-[0_20px_60px_-16px_rgba(37,99,235,0.2)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563eb]/10 text-[#2563eb] transition-colors group-hover:bg-[#2563eb] group-hover:text-white">
                      <Icon width={22} height={22} />
                    </span>
                    <span className="rounded-full bg-[#2563eb]/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#2563eb]">
                      {tool.category}
                    </span>
                  </div>
                  <h3 className="serif mt-4 text-2xl transition group-hover:text-[#2563eb]">{tool.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[#0a1633]/60">{tool.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#2563eb]">
                    Open tool
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Why section */}
      <section className="bg-[#0a1633] py-20 text-[#f5f8ff] md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="serif flex flex-col text-4xl leading-[0.95] text-[#f5f8ff] md:text-6xl">
            <TextMotion text="Built by developers" preset="mask" splitBy="word" stagger={0.06} />
            <TextMotion text="for developers." preset="focus" splitBy="word" stagger={0.06} />
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[#f5f8ff]/60">
            These tools exist because we use them every day in our own work.
            Prompt Workshop feeds our LinkedIn automation. Lyric Studio powers
            Mwijay's Amapiano Gospel tracks. No login, no paywall — just
            tools made freely available.
          </p>
        </div>
      </section>
    </>
  );
}
