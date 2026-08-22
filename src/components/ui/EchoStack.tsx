import { useCallback, useEffect, useRef, useState } from 'react';

type MirrorMode = 'none' | 'alternateH' | 'alternateV';
type ParallaxDir = 'vertical' | 'horizontal' | 'both';
type StaggerDir = 'topToBottom' | 'bottomToTop' | 'centerOut';

type Props = {
  image: string;
  alt?: string;
  /** Number of stacked copies. More layers = deeper tunnel. */
  layerCount?: number;
  /** Each layer shrinks to this fraction of the one in front. */
  scaleFactor?: number;
  offsetX?: number;
  offsetY?: number;
  /** Degrees added per layer — creates a fanned deck. */
  rotationOffset?: number;
  opacityFalloff?: number;
  /** Back layers blur progressively; the front layer is always sharp. */
  blurFalloff?: number;
  /** 0 = square, 50 = circle. */
  borderRadius?: number;
  enableShadow?: boolean;
  shadowColor?: string;
  shadowSize?: number;
  mirrorMode?: MirrorMode;
  enableScrollParallax?: boolean;
  scrollParallaxStrength?: number;
  scrollParallaxDirection?: ParallaxDir;
  enablePointerParallax?: boolean;
  pointerParallaxStrength?: number;
  hoverScale?: number;
  hoverDuration?: number;
  hoverStagger?: boolean;
  hoverStaggerDirection?: StaggerDir;
  hoverStaggerDelay?: number;
  objectPosition?: string;
  className?: string;
};

/**
 * EchoStack — a depth illusion built from N copies of one image.
 *
 * Rebuilt natively from the Framer module. Each layer sits absolutely on top
 * of the last, scaled by `scaleFactor^i` and pushed by `offset * i`, with
 * opacity and blur falling off toward the back. The result reads as a tunnel
 * or a fanned deck depending on `rotationOffset`.
 *
 * Two independent parallax sources shift the layers by index, so deeper
 * layers travel further and the stack feels volumetric:
 *  - scroll progress through the viewport
 *  - pointer position relative to the element's centre
 *
 * On hover the inner <img> scales with a per-layer delay, which makes the
 * stack "breathe" front-to-back rather than snapping as one block. Touch taps
 * play the full in→out cycle once, and synthetic mouse events that browsers
 * fire ~300ms after a tap are suppressed so mobile doesn't double-fire.
 */
export default function EchoStack({
  image,
  alt = '',
  layerCount = 5,
  scaleFactor = 0.85,
  offsetX = 0,
  offsetY = -15,
  rotationOffset = 0,
  opacityFalloff = 0.1,
  blurFalloff = 1,
  borderRadius = 24,
  enableShadow = false,
  shadowColor = 'rgba(10,22,51,0.25)',
  shadowSize = 10,
  mirrorMode = 'none',
  enableScrollParallax = true,
  scrollParallaxStrength = 20,
  scrollParallaxDirection = 'vertical',
  enablePointerParallax = false,
  pointerParallaxStrength = 10,
  hoverScale = 1.05,
  hoverDuration = 300,
  hoverStagger = true,
  hoverStaggerDirection = 'topToBottom',
  hoverStaggerDelay = 50,
  objectPosition = 'center',
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  // Browsers emit a synthetic mouseenter shortly after a tap. Track the last
  // touch so those phantom events don't re-trigger the hover animation.
  const lastTouch = useRef(0);
  const touchOutTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!enableScrollParallax) return;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = 1 - (rect.top + rect.height) / (vh + rect.height);
      setScrollProgress(Math.max(-0.5, Math.min(0.5, progress - 0.5)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [enableScrollParallax]);

  useEffect(() => () => {
    if (touchOutTimer.current) window.clearTimeout(touchOutTimer.current);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!enablePointerParallax) return;
      const el = ref.current;
      if (!el) return;
      const touch = 'touches' in e ? e.touches[0] : null;
      const cx = touch ? touch.clientX : (e as React.MouseEvent).clientX;
      const cy = touch ? touch.clientY : (e as React.MouseEvent).clientY;
      const rect = el.getBoundingClientRect();
      setPointer({
        x: (cx - rect.left - rect.width / 2) / (rect.width / 2),
        y: (cy - rect.top - rect.height / 2) / (rect.height / 2),
      });
    },
    [enablePointerParallax]
  );

  const onEnter = useCallback(() => {
    if (Date.now() - lastTouch.current < 500) return;
    setHovered(true);
  }, []);

  const onLeave = useCallback(() => {
    if (Date.now() - lastTouch.current < 500) return;
    setPointer({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  const onTouchStart = useCallback(() => {
    lastTouch.current = Date.now();
    if (touchOutTimer.current) window.clearTimeout(touchOutTimer.current);
    setHovered(true);
    const maxDelay = hoverStagger ? (layerCount - 1) * hoverStaggerDelay : 0;
    touchOutTimer.current = window.setTimeout(() => {
      setHovered(false);
      touchOutTimer.current = null;
    }, hoverDuration + maxDelay);
  }, [hoverDuration, hoverStagger, layerCount, hoverStaggerDelay]);

  const br = `${borderRadius}px`;

  return (
    <div
      ref={ref}
      onMouseMove={handlePointerMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onTouchStart={onTouchStart}
      onTouchMove={handlePointerMove}
      onTouchEnd={() => setPointer({ x: 0, y: 0 })}
      className={`relative overflow-hidden ${className}`}
      style={{ borderRadius: br }}
    >
      {Array.from({ length: layerCount }).map((_, i) => {
        const scale = Math.pow(scaleFactor, i);
        if (scale < 0.05) return null;

        const blur = (layerCount - 1 - i) * blurFalloff;
        const opacity = Math.max(0, 1 - i * opacityFalloff);
        const rotation = i * rotationOffset;

        let scrollTx = 0;
        let scrollTy = 0;
        if (enableScrollParallax) {
          const p = scrollProgress * scrollParallaxStrength * i;
          if (scrollParallaxDirection === 'vertical') scrollTy = p;
          else if (scrollParallaxDirection === 'horizontal') scrollTx = p;
          else {
            scrollTx = p;
            scrollTy = p;
          }
        }

        let ptrTx = 0;
        let ptrTy = 0;
        if (enablePointerParallax) {
          ptrTx = pointer.x * -pointerParallaxStrength * i;
          ptrTy = pointer.y * -pointerParallaxStrength * i;
        }

        const tx = i * offsetX + scrollTx + ptrTx;
        const ty = i * offsetY + scrollTy + ptrTy;

        let msx = 1;
        let msy = 1;
        if (mirrorMode === 'alternateH' && i % 2 === 1) msx = -1;
        else if (mirrorMode === 'alternateV' && i % 2 === 1) msy = -1;

        const transform = [
          `translate(${tx}px, ${ty}px)`,
          `scale(${scale})`,
          rotation !== 0 ? `rotate(${rotation}deg)` : null,
          msx !== 1 || msy !== 1 ? `scale(${msx}, ${msy})` : null,
        ]
          .filter(Boolean)
          .join(' ');

        const shadow =
          enableShadow && i > 0
            ? `0px ${i * shadowSize * 0.4}px ${i * shadowSize}px ${shadowColor}`
            : 'none';

        let hoverDelay = 0;
        if (hoverStagger) {
          if (hoverStaggerDirection === 'topToBottom') hoverDelay = (layerCount - 1 - i) * hoverStaggerDelay;
          else if (hoverStaggerDirection === 'bottomToTop') hoverDelay = i * hoverStaggerDelay;
          else hoverDelay = Math.abs(i - (layerCount - 1) / 2) * hoverStaggerDelay;
        }

        return (
          <div
            key={i}
            className="absolute inset-0 overflow-hidden"
            style={{
              borderRadius: br,
              opacity,
              filter: blur > 0 ? `blur(${blur}px)` : 'none',
              boxShadow: shadow,
              // Only the front layer takes pointer events, so hover targets
              // the visible image rather than a blurred ghost behind it.
              pointerEvents: i === 0 ? 'auto' : 'none',
              transform,
              transition: 'transform 0.12s ease-out',
              willChange: 'transform',
            }}
          >
            <img
              src={image}
              alt={i === 0 ? alt : ''}
              draggable={false}
              className="block h-full w-full object-cover"
              style={{
                objectPosition,
                transform: `scale(${hovered ? hoverScale : 1})`,
                transition: `transform ${hoverDuration}ms ease-out ${hoverDelay}ms`,
                willChange: 'transform',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
