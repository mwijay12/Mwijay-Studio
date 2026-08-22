import { useEffect, useId, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

type Preset = 'pinyon' | 'allura' | 'dancingscript' | 'greatvibes' | 'alexbrush';

const FONT_FAMILIES: Record<Preset, string> = {
  allura: "'Allura', 'Great Vibes', cursive",
  greatvibes: "'Great Vibes', 'Allura', cursive",
  alexbrush: "'Alex Brush', 'Great Vibes', cursive",
  pinyon: "'Pinyon Script', 'Great Vibes', cursive",
  dancingscript: "'Dancing Script', cursive",
};

type Props = {
  text: string;
  fontPreset?: Preset;
  fontUrl?: string;
  fontSize?: number;
  color?: string;
  strokeThickness?: number;
  animationTime?: number;
  loop?: boolean;
  loopInterval?: number;
  showGuide?: boolean;
  className?: string;
};

export default function CalligraphySignature({
  text,
  fontPreset = 'allura',
  fontSize = 80,
  color = '#60a5fa',
  animationTime = 3.6,
  loop = false,
  loopInterval = 3.0,
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: !loop, amount: 0.3 });
  const [runKey, setRunKey] = useState(0);
  const maskId = useId().replace(/:/g, '-');

  const fontFamily = FONT_FAMILIES[fontPreset] || FONT_FAMILIES.allura;

  // Approximate width calculation based on text length and font size
  const charWidth = fontSize * 0.48;
  const estimatedTextWidth = Math.max(160, text.length * charWidth + fontSize * 0.8);
  const height = fontSize * 1.6;
  const width = estimatedTextWidth + 40;

  // Loop trigger
  useEffect(() => {
    if (!loop || !inView) return;
    const total = (animationTime + loopInterval) * 1000;
    const interval = window.setInterval(() => setRunKey((k) => k + 1), total);
    return () => window.clearInterval(interval);
  }, [loop, inView, animationTime, loopInterval]);

  const playing = inView;

  return (
    <div
      ref={ref}
      className={`relative inline-block select-none overflow-visible ${className}`}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
      aria-label={text}
      role="img"
    >
      <svg
        key={runKey}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* Animated progressive mask that smoothly reveals handwriting stroke from left to right */}
          <mask id={`sig-mask-${maskId}-${runKey}`}>
            {/* Background black = hidden */}
            <rect x="0" y="0" width={width} height={height} fill="black" />
            
            {/* Animated white stroke sweep that unmasks the signature slowly and smoothly */}
            <motion.path
              d={`M 10,${height * 0.52} Q ${width * 0.3},${height * 0.3} ${width * 0.5},${height * 0.55} T ${width - 10},${height * 0.5}`}
              fill="none"
              stroke="white"
              strokeWidth={height * 1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                playing
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{
                pathLength: {
                  duration: animationTime,
                  ease: [0.16, 1, 0.3, 1],
                },
                opacity: { duration: 0.15 },
              }}
            />
          </mask>

          {/* Subtle ink glow filter */}
          <filter id={`sig-glow-${maskId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.8" floodColor={color} floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Primary Calligraphy Text with Smooth Connected Solid Curves */}
        <g mask={`url(#sig-mask-${maskId}-${runKey})`}>
          <text
            x={width / 2}
            y={height * 0.62}
            textAnchor="middle"
            dominantBaseline="central"
            fill={color}
            filter={`url(#sig-glow-${maskId})`}
            style={{
              fontFamily,
              fontSize: `${fontSize}px`,
              fontWeight: 400,
              letterSpacing: '0.01em',
              fontStyle: 'normal',
            }}
          >
            {text}
          </text>
        </g>

        {/* Dynamic hand-drawn underline flourish for signature flair */}
        <motion.path
          d={`M ${width * 0.22},${height * 0.84} Q ${width * 0.55},${height * 0.95} ${width * 0.78},${height * 0.82} Q ${width * 0.84},${height * 0.79} ${width * 0.88},${height * 0.86}`}
          fill="none"
          stroke={color}
          strokeWidth={Math.max(2, fontSize * 0.028)}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.85}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            playing
              ? { pathLength: 1, opacity: 0.85 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            pathLength: {
              duration: animationTime * 0.48,
              delay: animationTime * 0.72,
              ease: [0.16, 1, 0.3, 1],
            },
            opacity: { duration: 0.2, delay: animationTime * 0.72 },
          }}
        />
      </svg>
    </div>
  );
}
