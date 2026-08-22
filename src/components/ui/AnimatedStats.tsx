import CountUp from "./CountUp";

type Stat = { k: string; v: string };

function parseStat(k: string): { value: number; suffix: string } {
  const match = k.match(/([\d.]+)/);
  if (!match) return { value: 0, suffix: k };
  const value = parseFloat(match[1]);
  const suffix = k.replace(match[1], "");
  return { value, suffix };
}

export default function AnimatedStats({
  stats,
  columns = 4,
  dark = false,
}: {
  stats: Stat[];
  columns?: 2 | 4;
  dark?: boolean;
}) {
  const grid = columns === 4 ? "md:grid-cols-4" : "md:grid-cols-2";
  return (
    <div className={`grid grid-cols-2 gap-8 ${grid}`}>
      {stats.map((s) => {
        const { value, suffix } = parseStat(s.k);
        return (
          <div key={s.v} className="transition-transform duration-500 hover:-translate-y-1">
            <div
              className={`serif text-5xl md:text-6xl ${
                dark ? "text-[#f5f8ff]" : "text-[#0a1633]"
              }`}
            >
              <CountUp end={value} suffix={suffix} duration={2.2} />
            </div>
            <div
              className={`mt-2 text-sm uppercase tracking-widest ${
                dark ? "text-[#f5f8ff]/50" : "text-[#0a1633]/50"
              }`}
            >
              {s.v}
            </div>
          </div>
        );
      })}
    </div>
  );
}
