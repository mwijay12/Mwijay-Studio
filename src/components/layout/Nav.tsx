import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import EyeFollowButton from '../ui/EyeFollowButton';

const links = [
  { to: '/work', label: 'Work' },
  { to: '/studio', label: 'Studio' },
  { to: '/services', label: 'Services' },
  { to: '/tools', label: 'AI Tools' },
  { to: '/journal', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav({ topOffset = 0 }: { topOffset?: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { saved } = useApp();
  const location = useLocation();
  const dark =
    location.pathname.startsWith('/contact') ||
    location.pathname.startsWith('/start') ||
    location.pathname === '/saved';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const logoColor = dark && !scrolled ? 'text-[#f5f8ff]' : 'text-[#0a1633]';
  const muted = dark && !scrolled ? 'text-[#f5f8ff]/70' : 'text-[#0a1633]/70';
  const bar = dark && !scrolled ? 'bg-[#f5f8ff]' : 'bg-[#0a1633]';

  return (
    <header
      style={{ top: topOffset }}
      className={`fixed inset-x-0 z-50 transition-[top,padding,background-color,border-color] duration-500 ${
        scrolled
          ? 'border-b border-[#0a1633]/10 bg-[#f5f8ff]/90 py-3 backdrop-blur-md'
          : 'py-6'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link to="/" className={`serif flex items-center gap-2 text-2xl leading-none tracking-tight ${logoColor}`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current text-xs font-semibold">
            MD
          </span>
          Mwijay<span className="text-[#2563eb]">Studio</span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex 2xl:gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `group relative text-sm font-medium uppercase tracking-widest transition-colors ${
                  isActive ? 'text-[#2563eb]' : muted
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-[#2563eb] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            to="/saved"
            className={`relative text-sm font-medium uppercase tracking-widest ${muted}`}
          >
            Saved
            {saved.length > 0 && (
              <span className="absolute -right-4 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#2563eb] text-[10px] text-white">
                {saved.length}
              </span>
            )}
          </Link>
          <EyeFollowButton to="/start" variant="primary" className="text-xs">
            Start a project
          </EyeFollowButton>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 xl:hidden"
          aria-label="Menu"
        >
          <span className={`h-0.5 w-6 transition ${bar} ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-6 transition ${bar} ${open ? 'opacity-0' : ''}`} />
          <span
            className={`h-0.5 w-6 transition ${bar} ${open ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
      </div>

      {open && (
        <div className="mx-4 mt-4 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-3xl bg-[#0a1633] p-5 shadow-2xl xl:hidden sm:mx-6 sm:p-6">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="serif text-2xl text-[#f5f8ff] sm:text-3xl">
                {l.label}
              </Link>
            ))}
            <Link to="/saved" className="serif text-2xl text-[#f5f8ff] sm:text-3xl">
              Saved {saved.length > 0 && `(${saved.length})`}
            </Link>
            <div className="mt-2">
              <EyeFollowButton to="/start" variant="primary" className="text-xs">
                Start a project
              </EyeFollowButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
