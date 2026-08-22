"use client";

import { useEffect, useRef, useState, useMemo } from "react";

interface WordData {
  text: string;
  duration: number;
  delay: number;
  blur: number;
  scale?: number;
}

interface BlurTextAnimationProps {
  text?: string;
  words?: WordData[];
  className?: string;
  textClassName?: string;
  fontSize?: string;
  fontFamily?: string;
  textColor?: string;
  animationDelay?: number;
  once?: boolean;
}

export default function BlurTextAnimation({
  text = "Elegant blur animation that brings your words to life with cinematic transitions.",
  words,
  className = "",
  textClassName = "",
  fontSize = "text-4xl md:text-5xl lg:text-6xl",
  fontFamily = "font-['Instrument_Serif',_serif]",
  textColor = "text-white",
  animationDelay = 4000,
  once = false,
}: BlurTextAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const textWords = useMemo(() => {
    if (words) return words;

    const splitWords = text.split(" ");
    const totalWords = splitWords.length;

    return splitWords.map((word, index) => {
      const progress = totalWords > 1 ? index / (totalWords - 1) : 0;
      const exponentialDelay = Math.pow(progress, 0.8) * 0.5;
      const baseDelay = index * 0.06;
      const microVariation = (Math.random() - 0.5) * 0.05;

      return {
        text: word,
        duration: 2.2 + Math.cos(index * 0.3) * 0.3,
        delay: baseDelay + exponentialDelay + microVariation,
        blur: 12 + Math.floor(Math.random() * 8),
        scale: 0.9 + Math.sin(index * 0.2) * 0.05,
      };
    });
  }, [text, words]);

  useEffect(() => {
    let mounted = true;

    const clearTimers = () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };

    const startAnimation = () => {
      if (!mounted) return;
      setTimeout(() => mounted && setIsAnimating(true), 200);

      let maxTime = 0;
      textWords.forEach((word) => {
        const totalTime = word.delay + word.duration;
        maxTime = Math.max(maxTime, totalTime);
      });

      if (once) return;

      animationTimeoutRef.current = setTimeout(() => {
        if (!mounted) return;
        setIsAnimating(false);
        resetTimeoutRef.current = setTimeout(() => startAnimation(), animationDelay);
      }, (maxTime + 1) * 1000);
    };

    startAnimation();
    return () => {
      mounted = false;
      clearTimers();
    };
  }, [textWords, animationDelay, once]);

  return (
    <div className={`flex items-center justify-center w-full ${className}`}>
      <p
        className={`${textColor} ${fontSize} ${fontFamily} ${textClassName} font-light leading-tight tracking-tight text-balance text-center`}
      >
        {textWords.map((word, index) => (
          <span
            key={`${word.text}-${index}`}
            className={`inline-block transition-all ${isAnimating ? "opacity-100" : "opacity-0"}`}
            style={{
              transitionDuration: `${word.duration}s`,
              transitionDelay: `${word.delay}s`,
              transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              filter: isAnimating ? "blur(0px) brightness(1)" : `blur(${word.blur}px) brightness(0.6)`,
              transform: isAnimating
                ? "translateY(0) scale(1) rotateX(0deg)"
                : `translateY(20px) scale(${word.scale || 1}) rotateX(-15deg)`,
              marginRight: "0.25em",
              willChange: "filter, transform, opacity",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            {word.text}
          </span>
        ))}
      </p>
    </div>
  );
}
