import { useState } from 'react';
import { services as localServices, type Service } from '../../data/services';
import { useFirestoreCollection, useFirestoreWrite } from '../../hooks/useFirestore';
import { motion, AnimatePresence } from 'framer-motion';

const COL = 'services';

const emptyDeliverables = [''] as string[];
const emptyProcess = [{ step: '', detail: '' }] as { step: string; detail: string }[];

export default function AdminServices() {
  const { data: remote, refresh } = useFirestoreCollection<Service>(COL);
  const { save } = useFirestoreWrite(COL);

  const all = remote.length > 0 ? remote : [...localServices.map((s) => ({ ...s }))];
  const [editing, setEditing] = useState<(Service & { id: string }) | null>(null);

  const startEdit = (s: (typeof all)[number]) => {
    setEditing({
      ...s,
      deliverables: s.deliverables?.length ? s.deliverables : emptyDeliverables,
      process: s.process?.length ? s.process : emptyProcess,
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    const { ...data } = editing;
    await save(data.id || data.id, data);
    await refresh();
    setEditing(null);
  };

  return (
    <div>
      <div className="mb-10">
        <h2 className="serif text-4xl">Services & Pricing</h2>
        <p className="mt-1 text-sm text-[#f4f0e8]/50">
          Edit service descriptions, deliverables, pricing, and process steps
        </p>
      </div>

      <div className="space-y-8">
        {all.map((s) => (
          <div
            key={s.id}
            className="rounded-3xl border border-[#f4f0e8]/10 bg-[#1c1816] p-6 md:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="text-xs text-[#c4552e]">{s.n}</span>
                <h3 className="serif mt-2 text-3xl md:text-4xl">{s.title}</h3>
                <p className="mt-2 text-sm text-[#f4f0e8]/60">{s.short}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <span>
                    <span className="text-[#f4f0e8]/40">From:</span>{' '}
                    <strong>{s.priceFrom}</strong>
                  </span>
                  <span>
                    <span className="text-[#f4f0e8]/40">Duration:</span>{' '}
                    <strong>{s.duration}</strong>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => startEdit(s)}
                className="rounded-full border border-[#f4f0e8]/15 px-4 py-2 text-xs uppercase tracking-wider hover:border-[#c4552e]"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0a1633]/90 py-10 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl border border-[#f4f0e8]/10 bg-[#1c1816] p-6 md:p-10"
            >
              <h3 className="serif text-3xl">Edit: {editing.title}</h3>

              <div className="mt-8 space-y-5">
                <Field label="Short description">
                  <textarea
                    value={editing.short}
                    onChange={(e) => setEditing({ ...editing, short: e.target.value })}
                    rows={2}
                    className={inputClass}
                  />
                </Field>
                <Field label="Full description">
                  <textarea
                    value={editing.desc}
                    onChange={(e) => setEditing({ ...editing, desc: e.target.value })}
                    rows={4}
                    className={inputClass}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Price from">
                    <input
                      value={editing.priceFrom}
                      onChange={(e) => setEditing({ ...editing, priceFrom: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Duration">
                    <input
                      value={editing.duration}
                      onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <Field label="Deliverables (one per line)">
                  <textarea
                    value={editing.deliverables.join('\n')}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        deliverables: e.target.value.split('\n').filter(Boolean),
                      })
                    }
                    rows={5}
                    className={inputClass}
                  />
                </Field>
                <Field label="Process steps (step: detail, one per line)">
                  <textarea
                    value={editing.process
                      .map((p) => `${p.step}: ${p.detail}`)
                      .join('\n')}
                    onChange={(e) => {
                      const steps = e.target.value
                        .split('\n')
                        .filter(Boolean)
                        .map((line) => {
                          const [step, ...rest] = line.split(':');
                          return {
                            step: step.trim(),
                            detail: rest.join(':').trim(),
                          };
                        });
                      setEditing({ ...editing, process: steps });
                    }}
                    rows={4}
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-full bg-[#c4552e] px-6 py-3 text-sm font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-full border border-[#f4f0e8]/20 px-6 py-3 text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-[#f4f0e8]/15 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[#c4552e] resize-none';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-[#f4f0e8]/45">
        {label}
      </span>
      {children}
    </label>
  );
}
