import { useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../../data/projects';
import { useApp } from '../../context/AppContext';
import Reveal from './Reveal';
import SafeImage from './SafeImage';
import { useToast } from '../../context/ToastContext';
import PremiumTilt from './PremiumTilt';

type Props = {
  project: Project;
  index?: number;
  large?: boolean;
};

export default function ProjectCard({ project, index = 0, large }: Props) {
  const { toggleSave, isSaved } = useApp();
  const { notify } = useToast();
  const saved = isSaved(project.id);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Reveal delay={index * 80}>
      <PremiumTilt className="group rounded-3xl">
      <Link
        to={`/work/${project.slug}`}
        className="block overflow-hidden rounded-3xl bg-[#dbeafe]"
        onMouseEnter={() => videoRef.current?.play().catch(() => {})}
        onMouseLeave={() => videoRef.current?.pause()}
      >
        <div className={`relative overflow-hidden ${large ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
          <SafeImage
            src={project.img}
            alt={project.title}
            fallbackLabel={project.title}
            className={`h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105 ${
              project.previewVideo ? 'group-hover:opacity-0' : ''
            }`}
          />
          {project.previewVideo && (
            <video
              ref={videoRef}
              src={project.previewVideo}
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          <span
            className="glass-card-dark absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.65rem] font-medium uppercase tracking-widest text-white backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                project.status === 'Completed' ? 'bg-emerald-400' : 'animate-pulse bg-[#ec4899]'
              }`}
            />
            {project.status === 'Completed' ? 'Live' : 'In progress'}
          </span>

          {project.liveUrl && (
            <span className="glass-card-dark absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.65rem] font-medium uppercase tracking-widest text-[#60a5fa] backdrop-blur-md">
              🔗 Preview
            </span>
          )}
        </div>
        <div className="flex items-end justify-between p-5 md:p-6">
          <div className="min-w-0">
            <h3 className="serif text-2xl md:text-3xl">{project.title}</h3>
            <p className="mt-1 text-xs uppercase tracking-widest text-[#0a1633]/60 sm:text-sm">
              {project.tag}
            </p>
          </div>
          <span className="shrink-0 text-sm text-[#0a1633]/50">{project.year}</span>
        </div>
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleSave({
            id: project.id,
            type: 'project',
            title: project.title,
            slug: project.slug,
            img: project.img,
          });
          notify({
            title: saved ? 'Removed from saved' : 'Project saved',
            description: project.title,
            variant: saved ? 'info' : 'success',
            duration: 2200,
          });
        }}
        className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur transition ${
          saved
            ? 'bg-[#2563eb] text-white'
            : 'bg-[#0a1633]/70 text-white opacity-0 group-hover:opacity-100'
        }`}
        aria-label={saved ? 'Remove from saved' : 'Save project'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      <div className="pointer-events-none absolute bottom-24 right-6 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-[#0a1633] text-[#f5f8ff] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17L17 7M17 7H8M17 7v9" />
        </svg>
      </div>
      </PremiumTilt>
    </Reveal>
  );
}
