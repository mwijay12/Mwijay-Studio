import { useEffect, useRef, useState } from 'react';

type Props = {
  liveUrl?: string;
  posterImage: string;
  posterVideo?: string;
  title: string;
  status: 'Completed' | 'In Progress';
};

/**
 * Shows a poster (video if provided, else image) with an option to load a real,
 * interactive live preview of the site in an iframe. Some production sites block
 * embedding via X-Frame-Options/CSP — since that can't be reliably detected across
 * browsers, we always keep an "Open live site" escape hatch visible.
 */
export default function LivePreviewFrame({ liveUrl, posterImage, posterVideo, title, status }: Props) {
  const [mode, setMode] = useState<'poster' | 'live'>('poster');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showBlockedHint, setShowBlockedHint] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (mode !== 'live') return;
    setIframeLoaded(false);
    setShowBlockedHint(false);
    timeoutRef.current = setTimeout(() => setShowBlockedHint(true), 4500);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [mode]);

  const goLive = () => setMode('live');
  const goPoster = () => setMode('poster');

  return (
    <div className="overflow-hidden rounded-3xl border border-[#0a1633]/8 bg-[#dbeafe] shadow-sm">
      {mode === 'poster' ? (
        <div className="group relative aspect-[16/9] w-full overflow-hidden">
          {posterVideo ? (
            <video
              src={posterVideo}
              poster={posterImage}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img src={posterImage} alt={title} className="h-full w-full object-cover" />
          )}

          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a1633]/60 via-transparent to-transparent" />

          {/* Status pill */}
          <span
            className={`glass-card-dark absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-widest text-white backdrop-blur-md`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                status === 'Completed' ? 'bg-emerald-400' : 'animate-pulse bg-[#ec4899]'
              }`}
            />
            {status === 'Completed' ? 'Live' : 'In progress'}
          </span>

          {/* Center action */}
          {liveUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={goLive}
                className="flex items-center gap-3 rounded-full bg-white/95 px-6 py-3.5 text-sm font-semibold text-[#0a1633] shadow-xl backdrop-blur transition hover:scale-105 hover:bg-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563eb] text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </span>
                Load live preview
              </button>
            </div>
          )}

          {/* Bottom-right open link, always available */}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-[#0a1633]/70 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-md transition hover:bg-[#2563eb]"
            >
              Open site ↗
            </a>
          )}
        </div>
      ) : (
        <div className="relative">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 border-b border-[#0a1633]/8 bg-[#0a1633] px-4 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="hidden sm:flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ec4899]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#facc15]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              </span>
              <span className="truncate rounded-full bg-white/10 px-3 py-1 text-[11px] text-white/70">
                {liveUrl?.replace(/^https?:\/\//, '')}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-medium text-white/80 transition hover:border-[#60a5fa] hover:text-[#60a5fa]"
              >
                Open in new tab ↗
              </a>
              <button
                type="button"
                onClick={goPoster}
                className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-medium text-white/80 transition hover:border-white/40"
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Frame */}
          <div data-lenis-prevent className="relative aspect-[16/9] w-full bg-[#0a1633]">
            {!iframeLoaded && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0a1633]">
                <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-[#60a5fa]" />
                <p className="text-xs text-white/40">Loading live preview…</p>
              </div>
            )}
            {liveUrl && (
              <iframe
                src={liveUrl}
                title={`${title} live preview`}
                className="h-full w-full"
                loading="lazy"
                onLoad={() => setIframeLoaded(true)}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                referrerPolicy="no-referrer"
              />
            )}

            {showBlockedHint && (
              <div className="absolute bottom-3 left-1/2 z-20 w-[92%] -translate-x-1/2 rounded-xl border border-white/10 bg-[#0a1633]/95 px-4 py-3 text-center text-xs text-white/60 backdrop-blur">
                Seeing a blank preview? Some sites block embedded previews for security —{' '}
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#60a5fa] underline">
                  open it directly
                </a>{' '}
                instead.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
