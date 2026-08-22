/**
 * A subtle animated dot/grid backdrop for hero sections — pure CSS/SVG, GPU-friendly.
 */
export default function GridBackdrop({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(37,99,235,0.18) 1px, transparent 0)",
          backgroundSize: "34px 34px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)",
        }}
      />
      <div className="pulse-glow absolute -right-32 top-10 h-[380px] w-[380px] rounded-full bg-[#60a5fa]/15 blur-[90px]" />
      <div
        className="pulse-glow absolute -left-24 bottom-0 h-[320px] w-[320px] rounded-full bg-[#2563eb]/15 blur-[90px]"
        style={{ animationDelay: "1.4s" }}
      />
    </div>
  );
}
