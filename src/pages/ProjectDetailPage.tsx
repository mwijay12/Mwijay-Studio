import { Link, Navigate, useParams } from 'react-router-dom';
import { getProject, getRelated } from '../data/projects';
import { useApp } from '../context/AppContext';
import ProjectCard from '../components/ui/ProjectCard';
import CTABlock from '../components/ui/CTABlock';
import Reveal from '../components/ui/Reveal';
import CountUpText from '../components/ui/CountUpText';
import LivePreviewFrame from '../components/ui/LivePreviewFrame';
import TextMotion from '../components/ui/TextMotion';
import EchoStack from '../components/ui/EchoStack';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = slug ? getProject(slug) : undefined;
  const { toggleSave, isSaved } = useApp();

  if (!project) return <Navigate to="/work" replace />;

  const related = getRelated(project.slug);
  const saved = isSaved(project.id);

  return (
    <>
      <section className="pt-36 pb-10 md:pt-44">
        <div className="mx-auto max-w-7xl px-6">
          <Link
            to="/work"
            className="text-sm font-medium uppercase tracking-widest text-[#0a1633]/50 transition hover:text-[#2563eb]"
          >
            ← All work
          </Link>

          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-widest text-[#0a1633]/50">
                <span>{project.category}</span>
                <span>·</span>
                <span>{project.year}</span>
                <span>·</span>
                <span>{project.client}</span>
              </div>
              <h1 className="serif mt-4 text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
                <TextMotion text={project.title} preset="rise" splitBy="word" stagger={0.06} />
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-[#0a1633]/70">{project.summary}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-widest ${
                    project.status === 'Completed'
                      ? 'bg-[#0a1633]/[0.06] text-[#0a1633]/70'
                      : 'bg-[#2563eb]/10 text-[#2563eb]'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      project.status === 'Completed'
                        ? 'bg-emerald-500'
                        : 'animate-pulse bg-[#2563eb]'
                    }`}
                  />
                  {project.status}
                </span>

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-[#0a1633] px-6 py-3 text-xs font-medium uppercase tracking-widest text-[#f5f8ff] transition hover:-translate-y-0.5 hover:bg-[#2563eb] sm:text-sm"
                  >
                    Visit live site
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      <path d="M7 17L17 7M17 7H8M17 7v9" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                toggleSave({
                  id: project.id,
                  type: 'project',
                  title: project.title,
                  slug: project.slug,
                  img: project.img,
                })
              }
              className={`inline-flex items-center gap-2 self-start rounded-full px-5 py-3 text-sm font-medium transition ${
                saved
                  ? 'bg-[#2563eb] text-white'
                  : 'border border-[#0a1633]/20 hover:border-[#2563eb] hover:text-[#2563eb]'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              {saved ? 'Saved' : 'Save project'}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <LivePreviewFrame
          liveUrl={project.liveUrl}
          posterImage={project.img}
          posterVideo={project.previewVideo}
          title={project.title}
          status={project.status}
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="text-sm font-medium uppercase tracking-widest text-[#0a1633]/50">
              Services
            </h2>
            <ul className="mt-4 space-y-2">
              {project.services.map((s) => (
                <li key={s} className="serif text-2xl">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-10 md:col-span-8">
            <Reveal>
              <h2 className="text-sm font-medium uppercase tracking-widest text-[#2563eb]">
                The challenge
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-[#0a1633]/75">{project.challenge}</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="text-sm font-medium uppercase tracking-widest text-[#2563eb]">
                The solution
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-[#0a1633]/75">{project.solution}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {project.gallery.map((img, i) => (
            <Reveal key={img + i} delay={i * 70}>
              <EchoStack
                image={img}
                alt={`${project.title} gallery ${i + 1}`}
                layerCount={1}
                borderRadius={16}
                hoverScale={1.03}
                hoverDuration={350}
                className={`bg-[#0a1633]/5 ${i === 0 ? 'aspect-[4/5] md:aspect-square' : 'aspect-square'} border border-black/5 shadow-sm hover:shadow-lg transition-all duration-300`}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-[#eef2ff] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="serif text-4xl md:text-5xl">Results</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {project.results.map((r, i) => (
              <Reveal
                key={r}
                delay={i * 80}
                className="rounded-2xl border border-[#0a1633]/10 bg-[#f5f8ff] p-6"
              >
                <span className="text-sm text-[#2563eb]">0{i + 1}</span>
                <p className="serif mt-3 text-2xl leading-snug md:text-3xl">
                  <CountUpText text={r} />
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="serif text-4xl md:text-5xl">More work</h2>
          <Link to="/work" className="text-sm uppercase tracking-widest text-[#0a1633]/50 hover:text-[#2563eb]">
            View all →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {related.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </section>

      <CTABlock />
    </>
  );
}
