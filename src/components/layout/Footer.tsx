import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export default function Footer() {
  const { newsletterEmail, subscribeNewsletter } = useApp();
  const { notify } = useToast();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(!!newsletterEmail);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    subscribeNewsletter(email.trim());
    setDone(true);
    notify({ title: 'Subscription confirmed', description: 'You are on the Mwijay Studio journal list.', variant: 'success' });
  };

  const navLinks = [
    ['/', 'Home'],
    ['/work', 'Work'],
    ['/studio', 'Studio'],
    ['/services', 'Services'],
    ['/tools', 'AI Tools'],
    ['/journal', 'Journal'],
    ['/start', 'Start a project'],
    ['/contact', 'Contact'],
  ];

  const socialLinks = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mwijay-davie' },
    { label: 'GitHub', href: 'https://github.com/mwijay12' },
    { label: 'Instagram', href: 'https://instagram.com/mwijay.davie' },
    { label: 'Portfolio', href: 'http://mwijayportfolio.vercel.app/' },
  ];

  return (
    <footer className="bg-[#0a1633] text-[#f5f8ff]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand + Newsletter */}
          <div className="md:col-span-5">
            <Link to="/" className="serif flex items-center gap-2 text-3xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f5f8ff]/20 text-sm font-semibold">
                MD
              </span>
              Mwijay<span className="text-[#60a5fa]">Studio</span>
            </Link>
            <p className="mt-4 max-w-sm text-[#f5f8ff]/55 text-sm leading-relaxed">
              A Dar es Salaam studio building fast websites, complete business systems,
              and AI automation for African businesses and beyond.
            </p>

            {done ? (
              <p className="mt-8 text-sm text-[#60a5fa]">
                You're on the list{newsletterEmail ? ` — ${newsletterEmail}` : ''}. ✳
              </p>
            ) : (
              <form onSubmit={onSubmit} className="mt-8 flex max-w-md gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Join our journal newsletter"
                  className="w-full rounded-full border border-[#f5f8ff]/15 bg-transparent px-5 py-3 text-sm text-[#f5f8ff] outline-none placeholder:text-[#f5f8ff]/35 focus:border-[#2563eb] transition"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#2563eb] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1e40af]"
                >
                  Join
                </button>
              </form>
            )}
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7 md:justify-items-end">
            <div>
              <h4 className="text-xs font-medium uppercase tracking-widest text-[#f5f8ff]/40 mb-4">
                Navigate
              </h4>
              <ul className="space-y-2.5 text-sm">
                {navLinks.map(([to, label]) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className={`transition hover:text-[#60a5fa] ${
                        label === 'Start a project'
                          ? 'text-[#60a5fa] font-semibold'
                          : 'text-[#f5f8ff]/65'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-medium uppercase tracking-widest text-[#f5f8ff]/40 mb-4">
                Social
              </h4>
              <ul className="space-y-2.5 text-sm">
                {socialLinks.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f5f8ff]/65 transition hover:text-[#60a5fa]"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs font-medium uppercase tracking-widest text-[#f5f8ff]/40 mb-4">
                Contact
              </h4>
              <ul className="space-y-2.5 text-sm text-[#f5f8ff]/65">
                <li>
                  <a href="mailto:mwijaydavie@gmail.com" className="transition hover:text-[#60a5fa]">
                    mwijaydavie@gmail.com
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/255790942616" target="_blank" rel="noopener noreferrer" className="transition hover:text-[#60a5fa]">
                    +255 790 942 616
                  </a>
                </li>
                <li>Dar es Salaam, Tanzania</li>
                <li>Remote worldwide</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#f5f8ff]/8 pt-8 text-xs text-[#f5f8ff]/35 md:flex-row">
          <span>© {new Date().getFullYear()} Mwijay Studio — Dar es Salaam, Tanzania</span>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="transition hover:text-[#60a5fa]">Privacy</Link>
            <Link to="/terms" className="transition hover:text-[#60a5fa]">Terms</Link>
            <Link to="/admin" className="transition hover:text-[#60a5fa]">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
