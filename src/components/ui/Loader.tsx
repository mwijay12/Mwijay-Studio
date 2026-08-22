import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Loader({ onDone }: { onDone?: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(rootRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
          onComplete: () => {
            setHidden(true);
            onDone?.();
          },
        });
      },
    });

    tl.to(barRef.current, {
      scaleX: 1,
      duration: 2.1,
      ease: "power2.inOut",
    });

    tl.to(
      counter,
      {
        v: 100,
        duration: 2.1,
        ease: "power2.inOut",
        onUpdate: () => {
          if (countRef.current) {
            countRef.current.textContent = Math.round(counter.v).toString().padStart(2, "0");
          }
        },
      },
      "<"
    );

    return () => {
      tl.kill();
    };
  }, [onDone]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a1633] text-white"
    >
      {/* glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2563eb]/25 blur-[100px] pulse-glow" />

      <div className="relative flex flex-col items-center">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-sm font-semibold tracking-tight">
            MD
          </span>
          <span className="serif text-3xl md:text-4xl">
            Mwijay <span className="grad-blue">Studio</span>
          </span>
        </div>

        <p className="shimmer-text serif text-5xl md:text-7xl">
          <span ref={countRef}>00</span>
          <span className="text-2xl align-top md:text-3xl">%</span>
        </p>

        {/* progress track */}
        <div className="mt-8 h-[2px] w-56 overflow-hidden rounded-full bg-white/10 md:w-72">
          <div
            ref={barRef}
            className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#2563eb] to-[#60a5fa]"
          />
        </div>

        <p className="mt-6 text-[0.65rem] uppercase tracking-[0.35em] text-white/40">
          Building digital systems
        </p>
      </div>
    </div>
  );
}
