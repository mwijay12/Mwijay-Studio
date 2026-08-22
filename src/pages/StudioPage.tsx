import { team, values, stats } from '../data/team';
import PageHero from '../components/ui/PageHero';
import CTABlock from '../components/ui/CTABlock';
import Reveal from '../components/ui/Reveal';
import AnimatedStats from '../components/ui/AnimatedStats';
import BarGraph from '../components/ui/BarGraph';
import TextMotion from '../components/ui/TextMotion';
import CalligraphySignature from '../components/ui/CalligraphySignature';
import EchoStack from '../components/ui/EchoStack';

export default function StudioPage() {
  return (
    <>
      <PageHero
        eyebrow="The studio"
        title={
          <>
            A Dar es Salaam studio with an
            <span className="italic text-[#2563eb]"> outsized </span>
            obsession for systems.
          </>
        }
        subtitle="Mwijay Studio was founded on a simple belief: businesses don't just need websites — they need complete digital systems that actually run their work."
      />

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-8 md:grid-cols-2">
          <Reveal className="rounded-3xl bg-[#eef2ff] p-8 md:p-12">
            <p className="text-lg leading-relaxed text-[#14110f]/75 md:text-xl">
              We partner closely with founders, NGOs and teams to build fast websites, complete
              business systems, and AI automation. No middlemen, no filler — direct access to the
              developer building your product, from first call to launch and beyond.
            </p>
          </Reveal>
          <Reveal delay={100} className="rounded-3xl bg-[#0a1633] p-8 text-[#f5f8ff] md:p-12">
            <p className="serif text-3xl leading-snug md:text-4xl">
              “I'd rather build one complete system that works than ten pretty pages that don't.”
            </p>
            {/* Hand-drawn signature — strokes animate on when scrolled into view. */}
            <CalligraphySignature
              text="David Mwijage"
              fontPreset="greatvibes"
              fontSize={96}
              color="#60a5fa"
              animationTime={3.8}
              className="mt-6 w-full max-w-[320px]"
            />
            <p className="mt-2 text-sm uppercase tracking-widest text-[#f5f8ff]/50">
              Founder
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-[#0a1633]/10 bg-[#eef2ff] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedStats stats={stats} columns={4} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="mb-14">
          <span className="text-sm font-medium uppercase tracking-widest text-[#14110f]/50">
            People
          </span>
          <h2 className="serif mt-3 text-5xl md:text-6xl">Meet the team</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {team.map((m, i) => (
            <Reveal key={m.id} delay={i * 90} className="group">
              {/* Crisp, high-definition portrait presentation with smooth luxury hover */}
              <EchoStack
                image={m.img}
                alt={m.name}
                layerCount={1}
                borderRadius={24}
                hoverScale={1.03}
                hoverDuration={400}
                objectPosition={m.id === '1' ? 'center 15%' : 'center'}
                className="aspect-[4/5] bg-[#0a1633]/5 border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300"
              />
              <h3 className="serif mt-5 text-3xl">{m.name}</h3>
              <p className="mt-1 text-sm uppercase tracking-widest text-[#c4552e]">{m.role}</p>
              <p className="mt-3 text-[#14110f]/65">{m.bio}</p>
              <div className="mt-4 flex gap-4">
                {m.social.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="text-sm text-[#14110f]/50 transition hover:text-[#c4552e]"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Growth chart */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <h2 className="serif flex flex-col text-4xl leading-[0.95] text-[#0a1633] md:text-5xl">
          <TextMotion text="Projects" preset="rise" splitBy="word" stagger={0.08} />
          <TextMotion text="shipped" preset="wave" splitBy="character" stagger={0.04} />
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-center">
          <BarGraph
            data={[
              { label: '2023', value: 4, color: 'linear-gradient(to top, #2563eb80, #2563eb)' },
              { label: '2024', value: 12, color: 'linear-gradient(to top, #2563eb80, #2563eb)' },
              { label: '2025', value: 28, color: 'linear-gradient(to top, #60a5fa, #2563eb)' },
              { label: '2026', value: 36, color: 'linear-gradient(to top, #60a5fa, #2563eb)' },
            ]}
            showValues
            valueClassName="text-[#0a1633]"
            height={220}
            stagger={0.12}
          />
          <div className="grid grid-cols-2 gap-6">
            {stats.map((s) => (
              <Reveal key={s.v}>
                <div className="serif text-4xl md:text-5xl">{s.k}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-[#0a1633]/50">{s.v}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a1633] py-24 text-[#f5f8ff] md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="serif flex flex-col text-5xl leading-[0.95] md:text-6xl">
            <TextMotion text="How we" preset="pop" splitBy="word" stagger={0.08} />
            <TextMotion text="work" preset="flip" splitBy="character" stagger={0.045} />
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {values.map((v, i) => (
              <Reveal
                key={v.title}
                delay={i * 80}
                className="rounded-3xl border border-[#f4f0e8]/10 p-8"
              >
                <span className="text-sm text-[#c4552e]">0{i + 1}</span>
                <h3 className="serif mt-3 text-3xl">{v.title}</h3>
                <p className="mt-3 text-[#f4f0e8]/60">{v.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="serif text-5xl leading-[0.95] md:text-6xl">
              <TextMotion text="Based in Dar." preset="drop" splitBy="word" stagger={0.07} />
              <TextMotion text="Working worldwide." preset="warp" splitBy="word" stagger={0.05} />
            </h2>
            <p className="mt-6 text-lg text-[#14110f]/65">
              Our studio is based in Dar es Salaam. Clients span Tanzania, East Africa, Europe,
              and beyond — we run async-friendly collaborations with clear milestones and generous
              overlap hours.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Timezone', 'CET (UTC+1)'],
              ['Languages', 'EN · NO · SE'],
              ['Response', 'Within 24h'],
              ['Kickoff', '2–3 weeks'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-[#eef2ff] p-5">
                <div className="text-xs uppercase tracking-widest text-[#14110f]/50">{k}</div>
                <div className="serif mt-2 text-2xl">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABlock title="Want to work with us?" subtitle="We’re booking projects for spring 2026." />
    </>
  );
}
