import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AdminVisitors() {
  const { visits } = useApp();
  const [range, setRange] = useState<'today' | '7d' | '30d' | 'all'>('7d');

  const now = Date.now();
  const ms = { today: 86400000, '7d': 604800000, '30d': 2592000000, all: Infinity };

  const filtered = useMemo(
    () => visits.filter((v) => now - new Date(v.ts).getTime() < ms[range]),
    [visits, range, now]
  );

  // Top pages
  const pageCounts = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((v) => { map[v.path] = (map[v.path] || 0) + 1; });
    return Object.entries(map).sort(([, a], [, b]) => b - a).slice(0, 12);
  }, [filtered]);

  // Referrers
  const refCounts = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((v) => {
      const host = v.referrer === 'Direct' ? 'Direct' : (() => { try { return new URL(v.referrer).hostname; } catch { return v.referrer; } })();
      map[host] = (map[host] || 0) + 1;
    });
    return Object.entries(map).sort(([, a], [, b]) => b - a).slice(0, 8);
  }, [filtered]);

  // Visits per day (last 7 days)
  const dailyCounts = useMemo(() => {
    const days: { label: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const key = d.toDateString();
      const count = visits.filter((v) => new Date(v.ts).toDateString() === key).length;
      days.push({ label: d.toLocaleDateString('en-US', { weekday: 'short' }), count });
    }
    return days;
  }, [visits, now]);

  const maxDay = Math.max(...dailyCounts.map((d) => d.count), 1);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="serif text-4xl">Visitor Analytics</h2>
          <p className="mt-1 text-sm text-[#f5f8ff]/50">{filtered.length} page views in this range</p>
        </div>
        <div className="flex gap-1.5">
          {(['today', '7d', '30d', 'all'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                range === r ? 'bg-[#2563eb] text-white' : 'border border-[#f5f8ff]/15 text-[#f5f8ff]/50 hover:text-white'
              }`}
            >
              {r === 'all' ? 'All' : r === 'today' ? 'Today' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Mini bar chart — last 7 days */}
      <div className="mb-10 rounded-2xl border border-[#f5f8ff]/8 bg-[#0d1f40] p-5">
        <p className="mb-4 text-xs uppercase tracking-widest text-[#f5f8ff]/40">Last 7 days</p>
        <div className="flex items-end gap-2" style={{ height: 100 }}>
          {dailyCounts.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] text-[#f5f8ff]/50">{d.count}</span>
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-[#2563eb] to-[#60a5fa] transition-all duration-500"
                style={{ height: `${(d.count / maxDay) * 80}px`, minHeight: d.count ? 4 : 0 }}
              />
              <span className="text-[10px] text-[#f5f8ff]/35">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top pages */}
        <div className="rounded-2xl border border-[#f5f8ff]/8 bg-[#0d1f40] p-5">
          <p className="mb-4 text-xs uppercase tracking-widest text-[#f5f8ff]/40">Top pages</p>
          {pageCounts.length === 0 ? (
            <p className="text-sm text-[#f5f8ff]/30">No data yet — browse the site to generate page views.</p>
          ) : (
            <div className="space-y-2">
              {pageCounts.map(([path, count]) => (
                <div key={path} className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm text-[#f5f8ff]/70">{path || '/'}</span>
                  <span className="shrink-0 text-xs text-[#60a5fa] font-medium">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top referrers */}
        <div className="rounded-2xl border border-[#f5f8ff]/8 bg-[#0d1f40] p-5">
          <p className="mb-4 text-xs uppercase tracking-widest text-[#f5f8ff]/40">Referrers</p>
          {refCounts.length === 0 ? (
            <p className="text-sm text-[#f5f8ff]/30">No referrer data yet.</p>
          ) : (
            <div className="space-y-2">
              {refCounts.map(([host, count]) => (
                <div key={host} className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm text-[#f5f8ff]/70">{host}</span>
                  <span className="shrink-0 text-xs text-[#60a5fa] font-medium">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Raw log */}
      <div className="mt-8 rounded-2xl border border-[#f5f8ff]/8 bg-[#0d1f40] p-5">
        <p className="mb-4 text-xs uppercase tracking-widest text-[#f5f8ff]/40">Raw visit log (latest 30)</p>
        <div className="max-h-64 space-y-1.5 overflow-y-auto scrollbar-hide">
          {filtered.slice(0, 30).map((v, i) => (
            <div key={i} className="flex items-center gap-4 text-xs">
              <span className="w-32 shrink-0 text-[#f5f8ff]/30">
                {new Date(v.ts).toLocaleString()}
              </span>
              <span className="truncate text-[#f5f8ff]/60">{v.path}</span>
              <span className="ml-auto shrink-0 text-[#f5f8ff]/25">{v.referrer === 'Direct' ? '→ Direct' : v.referrer}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
