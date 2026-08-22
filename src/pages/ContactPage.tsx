import { useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { services } from '../data/services';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import PageHero from '../components/ui/PageHero';
import TextMotion from '../components/ui/TextMotion';
import CalligraphySignature from '../components/ui/CalligraphySignature';

const budgets = ['Under $500', '$500–1,500', '$1,500–5,000', '$5,000+', 'Not sure yet'];

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

export default function ContactPage() {
  const { addInquiry, inquiries } = useApp();
  const { notify } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [budget, setBudget] = useState(budgets[1]);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const toggleService = (title: string) => {
    setSelected((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    );
  };

  const validate = () => {
    const next: Errors = {};
    if (!name.trim()) next.name = 'Please enter your name';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = 'Enter a valid email';
    if (message.trim().length < 20) next.message = 'Tell us a bit more (20+ characters)';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      notify({
        title: 'Check the form',
        description: 'A few fields still need attention.',
        variant: 'warning',
      });
      return;
    }
    addInquiry({
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      budget,
      services: selected,
      message: message.trim(),
    });
    setSubmitted(true);
    notify({ title: 'Message sent', description: "We'll reply within one business day.", variant: 'success' });
  };

  return (
    <>
      <PageHero
        dark
        eyebrow="Contact"
        title={
          <>
            Let's make something
            <span className="italic text-[#60a5fa]"> remarkable</span>
          </>
        }
        subtitle="Share a few details and we'll get back within one business day."
      />

      <section className="bg-[#0a1633] pb-20 text-[#f5f8ff] md:pb-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-12 lg:gap-16">
          {/* Contact details */}
          <div className="lg:col-span-5">
            <div className="space-y-7">
              <div>
                <h3 className="text-[11px] uppercase tracking-widest text-[#f5f8ff]/40">
                  Email
                </h3>
                <a
                  href="mailto:mwijaydavie@gmail.com"
                  className="serif mt-2 block text-xl break-all transition hover:text-[#60a5fa] sm:text-3xl"
                >
                  mwijaydavie@gmail.com
                </a>
              </div>

              <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest text-[#f5f8ff]/40">Phone</h3>
                  <a
                    href="tel:+255790942616"
                    className="mt-2 block text-[#f5f8ff]/70 transition hover:text-[#60a5fa]"
                  >
                    +255 790 942 616
                  </a>
                </div>
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest text-[#f5f8ff]/40">WhatsApp</h3>
                  <a
                    href="https://wa.me/255790942616"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-[#f5f8ff]/70 transition hover:text-[#60a5fa]"
                  >
                    Chat directly
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] uppercase tracking-widest text-[#f5f8ff]/40">Studio</h3>
                <p className="mt-2 text-[#f5f8ff]/70">
                  Kongowe, Dar es Salaam
                  <br />
                  Tanzania — Remote worldwide
                </p>
              </div>

              <div>
                <h3 className="text-[11px] uppercase tracking-widest text-[#f5f8ff]/40">Hours</h3>
                <p className="mt-2 text-[#f5f8ff]/70">Mon–Sat · 09:00–20:00 EAT</p>
              </div>

              {/* Response-time note */}
              <div className="rounded-2xl border border-[#2563eb]/25 bg-[#2563eb]/10 p-5">
                <p className="text-sm leading-relaxed text-[#f5f8ff]/70">
                  Prefer a guided brief? The{' '}
                  <Link
                    to="/start"
                    className="font-medium text-[#60a5fa] underline decoration-[#60a5fa]/40 underline-offset-2 hover:decoration-[#60a5fa]"
                  >
                    project wizard
                  </Link>{' '}
                  walks through scope, budget, and timeline step by step.
                </p>
              </div>

              {inquiries.length > 0 && (
                <div className="rounded-2xl border border-[#f5f8ff]/10 p-5">
                  <p className="text-sm text-[#f5f8ff]/50">
                    You have {inquiries.length} saved inquir{inquiries.length === 1 ? 'y' : 'ies'}{' '}
                    in this browser.
                  </p>
                  <p className="mt-1 text-xs text-[#f5f8ff]/35">
                    Latest: {inquiries[0].name} ·{' '}
                    {new Date(inquiries[0].createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-[#f5f8ff]/10 bg-[#0d1f40] p-8 text-center sm:p-12 md:p-14"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2563eb]">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="serif mt-6 text-3xl sm:text-4xl md:text-5xl">Message received</h2>
                <p className="mx-auto mt-4 max-w-md text-[#f5f8ff]/60">
                  Thanks {name.split(' ')[0] || 'there'}. We'll review your note and reply to{' '}
                  <span className="text-[#f5f8ff]">{email}</span> shortly.
                </p>

                <div className="mt-8 flex justify-center">
                  <CalligraphySignature
                    text="Mwijay"
                    fontPreset="allura"
                    fontSize={80}
                    color="#60a5fa"
                    animationTime={3.4}
                    className="w-full max-w-[190px]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setCompany('');
                    setSelected([]);
                    setMessage('');
                  }}
                  className="mt-6 text-sm uppercase tracking-widest text-[#60a5fa] transition hover:text-white"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="rounded-3xl border border-[#f5f8ff]/10 bg-[#0d1f40] p-5 sm:p-8 md:p-10"
              >
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Name" error={errors.name}>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                        placeholder="Ada Lovelace"
                      />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        placeholder="ada@company.com"
                      />
                    </Field>
                  </div>

                  <Field label="Company (optional)">
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className={inputClass}
                      placeholder="Company name"
                    />
                  </Field>

                  <Field label="Services needed">
                    <div className="flex flex-wrap gap-2">
                      {services.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleService(s.title)}
                          className={`rounded-full px-3.5 py-2 text-xs transition sm:text-sm ${
                            selected.includes(s.title)
                              ? 'bg-[#2563eb] text-white'
                              : 'border border-[#f5f8ff]/15 text-[#f5f8ff]/70 hover:border-[#60a5fa] hover:text-[#60a5fa]'
                          }`}
                        >
                          {s.title}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Budget">
                    <div className="flex flex-wrap gap-2">
                      {budgets.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBudget(b)}
                          className={`rounded-full px-3.5 py-2 text-xs transition sm:text-sm ${
                            budget === b
                              ? 'bg-[#2563eb] text-white'
                              : 'border border-[#f5f8ff]/15 text-[#f5f8ff]/70 hover:border-[#60a5fa] hover:text-[#60a5fa]'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Project details" error={errors.message}>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className={`${inputClass} resize-none`}
                      placeholder="Goals, timeline, links, anything helpful…"
                    />
                  </Field>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2563eb] py-3.5 font-medium transition hover:bg-[#1e40af] sm:w-auto sm:px-10"
                  >
                    Send inquiry
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Availability strip */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24">
        <h2 className="serif flex flex-col text-3xl leading-[0.95] sm:text-4xl md:text-5xl">
          <TextMotion text="Currently booking" preset="mask" splitBy="word" stagger={0.06} />
          <TextMotion text="for Q3 2026." preset="focus" splitBy="word" stagger={0.06} />
        </h2>
        <p className="mt-5 max-w-lg text-[#0a1633]/55">
          Two project slots remain this quarter. If your timeline is tight, mention it in your
          message and we'll prioritise a call.
        </p>
      </section>
    </>
  );
}

const inputClass =
  'w-full rounded-2xl border border-[#f5f8ff]/15 bg-transparent px-4 py-3 text-sm text-[#f5f8ff] outline-none transition placeholder:text-[#f5f8ff]/30 focus:border-[#2563eb]';

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-medium uppercase tracking-widest text-[#f5f8ff]/45">
        {label}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-sm text-red-400">{error}</span>}
    </label>
  );
}
