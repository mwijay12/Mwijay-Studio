import { type ReactNode } from "react";
import CountUp from "./CountUp";

const NUM_RE = /([+-]?)(\d+(?:\.\d+)?)([%×xkKmM]*)/g;

export default function CountUpText({
  text,
  className,
  duration = 2,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const parts: ReactNode[] = [];
  const re = new RegExp(NUM_RE);
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let key = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    const sign = m[1];
    const raw = m[2];
    const suffix = m[3];
    const num = parseFloat(raw);
    const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
    parts.push(
      <CountUp
        key={`num-${key++}`}
        end={num}
        prefix={sign}
        suffix={suffix}
        decimals={decimals}
        duration={duration}
      />
    );
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return <span className={className}>{parts}</span>;
}
