import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import CountUp from '../../components/ui/CountUp';
import { AgreementIcon, ExternalIcon, InquiriesIcon, InvoiceIcon, ProjectsIcon, ServicesIcon, VisitorsIcon } from '../../components/admin/AdminIcons';

export default function AdminHome() {
  const { inquiries, visits, invoices } = useApp();

  const newInquiries = inquiries.filter((i) => i.status === 'New').length;
  const totalRevenue = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((sum, i) => sum + i.items.reduce((s, it) => s + it.qty * it.rate, 0), 0);
  const today = new Date().toDateString();
  const todayVisits = visits.filter((v) => new Date(v.ts).toDateString() === today).length;

  const stats = [
    { label: 'Today visitors', value: todayVisits, color: 'from-blue-500 to-cyan-400' },
    { label: 'Total visits', value: visits.length, color: 'from-purple-500 to-pink-400' },
    { label: 'New inquiries', value: newInquiries, color: 'from-emerald-500 to-teal-400' },
    { label: 'Revenue (paid)', value: totalRevenue, prefix: '$', color: 'from-amber-500 to-orange-400' },
  ];

  const agreements = (() => {
    try {
      const stored = localStorage.getItem('ms-agreements');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })();

  const cards = [
    { to: '/admin/projects', label: 'Projects', desc: 'Add, edit, or remove portfolio projects', icon: ProjectsIcon },
    { to: '/admin/services', label: 'Services', desc: 'Update offers, pricing, and process', icon: ServicesIcon },
    { to: '/admin/inquiries', label: 'Inquiries', desc: `${inquiries.length} total, ${newInquiries} new`, icon: InquiriesIcon },
    { to: '/admin/visitors', label: 'Visitors', desc: `${visits.length} page views tracked`, icon: VisitorsIcon },
    { to: '/admin/invoices', label: 'Invoices', desc: `${invoices.length} invoices created`, icon: InvoiceIcon },
    { to: '/admin/agreements', label: 'Agreements', desc: `${agreements.length} contracts generated`, icon: AgreementIcon },
    { to: '/', label: 'View site', desc: 'Open the live website', icon: ExternalIcon },
  ];

  return (
    <div>
      <h2 className="serif text-3xl sm:text-4xl">Overview</h2>
      <p className="mt-2 text-sm text-[#f5f8ff]/50">
        Welcome back. Here's what's happening at Mwijay Studio.
      </p>

      {/* KPI cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-2xl border border-[#f5f8ff]/8 bg-[#0d1f40] p-5">
            <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${s.color}`} />
            <p className="text-xs uppercase tracking-widest text-[#f5f8ff]/40">{s.label}</p>
            <p className="serif mt-2 text-4xl">
              {s.prefix || ''}
              <CountUp end={s.value} duration={1.5} />
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-wider text-white/20">Live operations data</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return <Link
            key={c.to}
            to={c.to}
            className="group rounded-2xl border border-[#f5f8ff]/8 bg-[#0d1f40] p-5 transition hover:border-[#2563eb]/40 hover:-translate-y-0.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563eb]/10 text-[#60a5fa] transition group-hover:bg-[#2563eb] group-hover:text-white">
              <Icon width={19} height={19} />
            </span>
            <h3 className="serif mt-4 text-2xl">{c.label}</h3>
            <p className="mt-1 text-sm text-[#f5f8ff]/50">{c.desc}</p>
          </Link>;
        })}
      </div>

      {/* Recent activity */}
      {inquiries.length > 0 && (
        <div className="mt-10">
          <h3 className="serif text-2xl mb-4">Recent inquiries</h3>
          <div className="space-y-2">
            {inquiries.slice(0, 5).map((inq) => (
              <div key={inq.id} className="flex items-center justify-between gap-4 rounded-xl border border-[#f5f8ff]/8 bg-[#0d1f40] px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{inq.name}</p>
                  <p className="text-xs text-[#f5f8ff]/40 truncate">{inq.email}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium ${
                  inq.status === 'New' ? 'bg-emerald-500/15 text-emerald-400' :
                  inq.status === 'Replied' ? 'bg-blue-500/15 text-blue-400' :
                  'bg-[#f5f8ff]/10 text-[#f5f8ff]/40'
                }`}>
                  {inq.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
