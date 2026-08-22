import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { services } from '../data/services';
import GridBackdrop from '../components/ui/GridBackdrop';
import EyeFollowButton from '../components/ui/EyeFollowButton';

const budgets = ['Under $500', '$500–1,500', '$1,500–5,000', '$5,000+', 'Not sure yet'];
const timelines = ['ASAP (1–2 weeks)', '1 month', '2–3 months', 'Flexible'];

const steps = [
  { n: 1, label: 'About you' },
  { n: 2, label: 'The project' },
  { n: 3, label: 'Budget & timeline' },
  { n: 4, label: 'Review' },
];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function StartProjectPage() {
  const navigate = useNavigate();
  const { addInquiry } = useApp();

  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [done, setDone] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState(budgets[1]);
  const [timeline, setTimeline] = useState(timelines[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const go = (n: number) => { setDir(n > step ? 1 : -1); setStep(n); };

  const toggleSvc = (t: string) =>
    setSelectedServices((p) => (p.includes(t) ? p.filter((s) => s !== t) : [...p, t]));

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!name.trim()) e.name = 'Your name is required';
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Valid email required';
    }
    if (step === 2) {
      if (selectedServices.length === 0) e.services = 'Pick at least one service';
      if (message.trim().length < 15) e.message = 'A little more detail helps us prepare (15+ chars)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) go(step + 1); };
  const back = () => go(step - 1);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    addInquiry({ name, email, company, budget, services: selectedServices, message });
    setDone(true);
  };

  if (done) {
    return (
      <div className="relative flex min-h-[90dvh] flex-col items-center justify-center px-6 text-center overflow-hidden">
        <GridBackdrop />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative z-10 max-w-md"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#1e40af] text-4xl shadow-2xl shadow-[#2563eb]/30">
            ✅
          </div>
          <h1 className="serif text-4xl md:text-5xl text-[#0a1633]">You're in!</h1>
          <p className="mt-4 text-lg text-[#0a1633]/60">
            Thanks <strong>{name.split(' ')[0]}</strong>. David will review your brief and reply to{' '}
            <span className="text-[#2563eb] font-semibold">{email}</span> within one business day.
          </p>
          <p className="mt-2 text-sm text-[#0a1633]/40">In the meantime, check out some of our recent work.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <EyeFollowButton type="button" onClick={() => navigate('/work')}>
              See our work
            </EyeFollowButton>
            <button
              onClick={() => navigate('/')}
              className="rounded-full border border-[#0a1633]/15 px-6 py-3 text-sm font-medium text-[#0a1633]/70 transition hover:border-[#2563eb] hover:text-[#2563eb]"
            >
              Back to home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[90dvh] overflow-hidden">
      <GridBackdrop />
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 md:py-32">
        {/* Page heading */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#0a1633]/12 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#0a1633]/60 mb-4">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2563eb]" />
            Let's build something
          </span>
          <h1 className="serif text-4xl md:text-6xl text-[#0a1633] leading-tight">
            Start a <span className="italic text-[#2563eb]">project</span>
          </h1>
          <p className="mt-3 text-[#0a1633]/55 md:text-lg">Tell us about your idea — we'll reply within one business day.</p>
        </motion.div>

        {/* Step indicator */}
        <div className="mb-10 flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <button
                onClick={() => s.n < step && go(s.n)}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  s.n === step
                    ? 'bg-[#2563eb] text-white scale-110 shadow-lg shadow-[#2563eb]/30'
                    : s.n < step
                    ? 'bg-[#0a1633] text-[#f5f8ff] cursor-pointer hover:bg-[#2563eb]'
                    : 'bg-[#0a1633]/10 text-[#0a1633]/40 cursor-default'
                }`}
              >
                {s.n < step ? '✓' : s.n}
              </button>
              <span className={`hidden sm:block text-xs uppercase tracking-wider ${s.n === step ? 'text-[#0a1633] font-semibold' : 'text-[#0a1633]/35'}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`hidden sm:block mx-1 h-px w-10 transition-colors ${s.n < step ? 'bg-[#0a1633]' : 'bg-[#0a1633]/15'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step panels */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <form onSubmit={submit}>
                <div className="glass-card rounded-3xl p-6 md:p-10">
                  {/* ───── Step 1 */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <h2 className="serif text-2xl md:text-3xl text-[#0a1633]">About you</h2>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Your name *" error={errors.name}>
                          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="David Mwijage" className={inputCls(errors.name)} />
                        </Field>
                        <Field label="Email address *" error={errors.email}>
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@example.com" className={inputCls(errors.email)} />
                        </Field>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Company / Organisation">
                          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Optional" className={inputCls()} />
                        </Field>
                        <Field label="Existing website">
                          <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://…" className={inputCls()} />
                        </Field>
                      </div>
                    </div>
                  )}

                  {/* ───── Step 2 */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <h2 className="serif text-2xl md:text-3xl text-[#0a1633]">The project</h2>
                      <Field label="What do you need? *" error={errors.services}>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {services.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => toggleSvc(s.title)}
                              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                                selectedServices.includes(s.title)
                                  ? 'border-[#2563eb] bg-[#2563eb] text-white shadow-md shadow-[#2563eb]/20'
                                  : 'border-[#0a1633]/15 text-[#0a1633]/70 hover:border-[#2563eb] hover:text-[#2563eb]'
                              }`}
                            >
                              {s.title}
                            </button>
                          ))}
                        </div>
                      </Field>
                      <Field label="Tell us about the project *" error={errors.message}>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={5}
                          placeholder="What problem are you solving? Who is it for? Any existing systems we'd need to work with?"
                          className={inputCls(errors.message) + ' resize-none'}
                        />
                      </Field>
                    </div>
                  )}

                  {/* ───── Step 3 */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <h2 className="serif text-2xl md:text-3xl text-[#0a1633]">Budget & timeline</h2>
                      <Field label="Approximate budget">
                        <div className="mt-1 flex flex-wrap gap-2">
                          {budgets.map((b) => (
                            <button key={b} type="button" onClick={() => setBudget(b)}
                              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${budget === b ? 'border-[#2563eb] bg-[#2563eb] text-white' : 'border-[#0a1633]/15 text-[#0a1633]/70 hover:border-[#2563eb] hover:text-[#2563eb]'}`}>
                              {b}
                            </button>
                          ))}
                        </div>
                      </Field>
                      <Field label="Ideal timeline">
                        <div className="mt-1 flex flex-wrap gap-2">
                          {timelines.map((t) => (
                            <button key={t} type="button" onClick={() => setTimeline(t)}
                              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${timeline === t ? 'border-[#2563eb] bg-[#2563eb] text-white' : 'border-[#0a1633]/15 text-[#0a1633]/70 hover:border-[#2563eb] hover:text-[#2563eb]'}`}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </Field>
                      <div className="rounded-2xl border border-[#0a1633]/8 bg-[#eef2ff] p-4 text-sm text-[#0a1633]/60">
                        💡 Not sure about budget? No problem — just select "Not sure yet". We'll discuss in our discovery call.
                      </div>
                    </div>
                  )}

                  {/* ───── Step 4 Review */}
                  {step === 4 && (
                    <div className="space-y-5">
                      <h2 className="serif text-2xl md:text-3xl text-[#0a1633]">Review & send</h2>
                      <div className="divide-y divide-[#0a1633]/8 rounded-2xl border border-[#0a1633]/10 overflow-hidden">
                        {[
                          { label: 'Name', value: name },
                          { label: 'Email', value: email },
                          { label: 'Company', value: company || '—' },
                          { label: 'Services', value: selectedServices.join(', ') || '—' },
                          { label: 'Budget', value: budget },
                          { label: 'Timeline', value: timeline },
                          { label: 'Message', value: message },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex gap-4 px-5 py-3.5">
                            <span className="w-24 flex-shrink-0 text-xs uppercase tracking-wider text-[#0a1633]/40 pt-0.5">{label}</span>
                            <span className="text-sm text-[#0a1633]/80 break-words">{value}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-[#0a1633]/40">
                        By submitting, you agree to our{' '}
                        <a href="/terms" className="underline hover:text-[#2563eb]">Terms</a> and{' '}
                        <a href="/privacy" className="underline hover:text-[#2563eb]">Privacy Policy</a>.
                      </p>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="mt-6 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={back}
                    className={`rounded-full border border-[#0a1633]/15 px-6 py-3 text-sm font-medium text-[#0a1633]/60 transition hover:border-[#0a1633]/40 ${step === 1 ? 'invisible' : ''}`}
                  >
                    ← Back
                  </button>

                  {step < 4 ? (
                    <EyeFollowButton type="button" onClick={next}>
                      Continue
                    </EyeFollowButton>
                  ) : (
                    <EyeFollowButton type="submit">
                      Send brief
                    </EyeFollowButton>
                  )}
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-[#0a1633]/35">
          Prefer to email?{' '}
          <a href="mailto:mwijaydavie@gmail.com" className="font-medium text-[#2563eb] hover:underline">mwijaydavie@gmail.com</a>
          {' '}· WhatsApp{' '}
          <a href="https://wa.me/255790942616" target="_blank" rel="noopener noreferrer" className="font-medium text-[#2563eb] hover:underline">+255 790 942 616</a>
        </p>
      </div>
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-[#0a1633]/30 ${
    err
      ? 'border-red-400 bg-red-50 focus:border-red-500'
      : 'border-[#0a1633]/12 bg-white/60 text-[#0a1633] focus:border-[#2563eb] focus:bg-white'
  }`;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#0a1633]/50">{label}</span>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </label>
  );
}
