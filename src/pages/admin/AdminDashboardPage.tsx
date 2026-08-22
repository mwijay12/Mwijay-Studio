import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { AgreementIcon, CloseIcon, DashboardIcon, ExternalIcon, InquiriesIcon, InvoiceIcon, LogoutIcon, MenuIcon, ProjectsIcon, ServicesIcon, VisitorsIcon } from '../../components/admin/AdminIcons';

type NavItem = { to: string; label: string; description: string; icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactElement; external?: boolean };
const groups: { label: string; items: NavItem[] }[] = [
  { label: 'Workspace', items: [
    { to: '/admin', label: 'Dashboard', description: 'Business overview', icon: DashboardIcon },
    { to: '/admin/projects', label: 'Projects', description: 'Portfolio content', icon: ProjectsIcon },
    { to: '/admin/services', label: 'Services', description: 'Offers and pricing', icon: ServicesIcon },
  ]},
  { label: 'Sales', items: [
    { to: '/admin/inquiries', label: 'Inquiries', description: 'Leads and replies', icon: InquiriesIcon },
    { to: '/admin/visitors', label: 'Visitors', description: 'Traffic insights', icon: VisitorsIcon },
  ]},
  { label: 'Documents', items: [
    { to: '/admin/invoices', label: 'Invoices', description: 'Billing records', icon: InvoiceIcon },
    { to: '/admin/agreements', label: 'Agreements', description: 'Contracts and PDFs', icon: AgreementIcon },
  ]},
  { label: 'Website', items: [
    { to: '/', label: 'View live site', description: 'Open public website', icon: ExternalIcon, external: true },
  ]},
];

const titles: Record<string, { title: string; subtitle: string }> = {
  '/admin': { title: 'Dashboard', subtitle: 'Operations at a glance' },
  '/admin/projects': { title: 'Projects', subtitle: 'Manage case studies and live previews' },
  '/admin/services': { title: 'Services', subtitle: 'Update packages, pricing, and process' },
  '/admin/inquiries': { title: 'Inquiries', subtitle: 'Track and respond to prospective clients' },
  '/admin/visitors': { title: 'Visitor analytics', subtitle: 'Understand how people use the site' },
  '/admin/invoices': { title: 'Invoices', subtitle: 'Create and export client billing documents' },
  '/admin/agreements': { title: 'Agreements', subtitle: 'Prepare and print service contracts' },
};

const activeFor = (path: string, target: string) => target === '/admin' ? path === target : path.startsWith(target);

function SidebarContent({ pathname, close }: { pathname: string; close?: () => void }) {
  return <div className="flex h-full flex-col">
    <div className="border-b border-white/8 px-5 py-6">
      <Link to="/admin" onClick={close} className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1e40af] text-xs font-bold text-white shadow-lg shadow-[#2563eb]/20">MD</span>
        <span><span className="serif block text-xl leading-none text-white">Mwijay<span className="text-[#60a5fa]">Studio</span></span><span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">Operations</span></span>
      </Link>
    </div>
    <nav data-lenis-prevent className="flex-1 overflow-y-auto px-3 py-5 scrollbar-hide">
      {groups.map((group) => <div key={group.label} className="mb-6 last:mb-0">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">{group.label}</p>
        <div className="space-y-1">{group.items.map((item) => {
          const active = !item.external && activeFor(pathname, item.to);
          const Icon = item.icon;
          return <Link key={item.to} to={item.to} onClick={close} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${active ? 'bg-[#2563eb] text-white shadow-lg shadow-[#2563eb]/15' : 'text-white/55 hover:bg-white/6 hover:text-white'}`}>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${active ? 'bg-white/12' : 'bg-white/5 group-hover:bg-white/8'}`}><Icon width={16} height={16}/></span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{item.label}</span><span className={`block truncate text-[10px] ${active ? 'text-white/55' : 'text-white/25'}`}>{item.description}</span></span>
            {item.external && <ExternalIcon width={13} height={13} className="text-white/25"/>}
          </Link>;
        })}</div>
      </div>)}
    </nav>
    <div className="border-t border-white/8 p-4">
      <div className="rounded-xl border border-white/8 bg-white/[0.035] p-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400"/>
          <span className="text-xs font-medium text-white/70">Firebase Synchronized</span>
        </div>
        <p className="mt-1 text-[10px] leading-relaxed text-white/30">Admin authenticated as David Mwijage</p>
      </div>
    </div>
  </div>;
}

function AdminAvatar({ photoURL, name, email }: { photoURL?: string | null; name?: string | null; email?: string | null }) {
  const [imgError, setImgError] = useState(false);
  const initial = (name || email || 'M').charAt(0).toUpperCase();

  if (photoURL && !imgError) {
    return (
      <img
        src={photoURL}
        alt={name || email || 'Admin'}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setImgError(true)}
        className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/10"
      />
    );
  }

  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1e40af] text-xs font-bold text-white shadow-md shadow-[#2563eb]/20 ring-1 ring-white/10">
      {initial}
    </span>
  );
}

export default function AdminDashboardPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMobileOpen(false), [location.pathname]);
  const current = useMemo(() => titles[location.pathname] ?? { title: 'Admin', subtitle: 'Mwijay Studio operations' }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071127]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2563eb] border-t-transparent" />
      </div>
    );
  }

  // Guard: If not signed in or not the authorized admin email, redirect to login
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#071127] text-[#f5f8ff]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/8 bg-[#0a1633] lg:block">
        <SidebarContent pathname={location.pathname}/>
      </aside>

      <AnimatePresence>{mobileOpen && <>
        <motion.button type="button" aria-label="Close admin menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"/>
        <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 360, damping: 36 }} className="fixed inset-y-0 left-0 z-[60] w-[min(86vw,320px)] border-r border-white/8 bg-[#0a1633] shadow-2xl lg:hidden">
          <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close admin menu" className="absolute right-3 top-3 z-10 rounded-lg p-2 text-white/40 hover:bg-white/8 hover:text-white"><CloseIcon/></button>
          <SidebarContent pathname={location.pathname} close={() => setMobileOpen(false)}/>
        </motion.aside>
      </>}</AnimatePresence>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/8 bg-[#071127]/90 backdrop-blur-xl">
          <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open admin menu" className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 lg:hidden"><MenuIcon/></button>
              <div className="min-w-0">
                <h1 className="serif truncate text-2xl leading-tight text-white sm:text-3xl">{current.title}</h1>
                <p className="hidden truncate text-xs text-white/35 sm:block">{current.subtitle}</p>
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
              <span className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 md:inline-flex">
                Firebase Cloud Live
              </span>
              <div className="hidden items-center gap-2 sm:flex">
                <AdminAvatar photoURL={user.photoURL} name={user.displayName} email={user.email} />
                <span className="hidden max-w-52 truncate text-xs text-white/70 xl:block font-medium" title={user.email || ''}>
                  {user.email}
                </span>
              </div>
              <button
                type="button"
                onClick={() => signOut().then(() => navigate('/admin/login'))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/50 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300"
                aria-label="Log out"
                title="Log out"
              >
                <LogoutIcon width={16} height={16}/>
              </button>
            </div>
          </div>
        </header>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
        >
          <Outlet/>
        </motion.main>
      </div>
    </div>
  );
}