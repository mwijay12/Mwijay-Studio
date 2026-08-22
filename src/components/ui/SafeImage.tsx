import { useState } from 'react';

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** Text shown on the gradient fallback when the image fails to load */
  fallbackLabel?: string;
};

/**
 * An <img> that never collapses into raw alt-text. If the source fails
 * to load, it renders a branded gradient placeholder with the project
 * initial instead — so archive/grid layouts always keep their shape.
 */
export default function SafeImage({ src, alt, className = '', fallbackLabel }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#0d1f40] via-[#12275a] to-[#2563eb] ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="serif text-4xl text-white/30 md:text-6xl select-none">
          {(fallbackLabel || alt || '•').charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
