import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { openPrintDocument, letterhead, docFooter, STUDIO } from '../../lib/pdfTemplate';
import { useToast } from '../../context/ToastContext';
import { AgreementIcon } from '../../components/admin/AdminIcons';
import { getDocsFrom, saveDoc, removeDoc } from '../../lib/firebase';

type AgreementTemplate = {
  id: string;
  name: string;
  type: string;
  scope: string;
  terms: string;
  deliverables: string[];
};

const templates: AgreementTemplate[] = [
  {
    id: 'ngo-proposal',
    name: 'NGO Web Platform Proposal (Pulse Network style)',
    type: 'NGO Website & Systems',
    scope: 'A complete multi-page web presence for the NGO, including a custom blog/news engine, interactive event calendar, donation gateway integrations, and membership portal built on Firebase with n8n automated content distribution.',
    terms: '50% upfront retainer deposit upon signature. 30% upon approval of Figma design mockups and front-end system structure. 20% final balance paid within 7 business days of launch hypercare completion.',
    deliverables: [
      'UX architecture and interactive Figma prototypes',
      'Fully responsive front-end build (React/Next.js)',
      'Custom headless CMS with Firebase database setup',
      'n8n automated content pipelines & newsletter integrations',
      'Role-based membership access & event management system',
      'Complete documentation & admin training sessions',
    ],
  },
  {
    id: 'uaut-app',
    name: 'Campus App Service Agreement (UAUT Connect style)',
    type: 'Mobile & Web Application',
    scope: 'A dedicated, lightweight community application customized for university students. Features include faculty-wide announcement boards, modular group chats, class schedule trackers, and resource-sharing hubs.',
    terms: '40% upfront deposit to initiate development. 40% upon completion of alpha dashboard testing. 20% final payment upon deployment to Production (Vercel and Google Play).',
    deliverables: [
      'Database schema modeling with Supabase / PostgreSQL',
      'Mobile-responsive web application with Progressive Web App (PWA) support',
      'Classroom and faculty bulletin board systems',
      'Direct messaging & group coordination modules',
      'Documentation of system architecture & API endpoints',
    ],
  },
  {
    id: 'saas-system',
    name: 'Business Management System (FaidaHQ style)',
    type: 'SaaS / Enterprise Dashboard',
    scope: 'A tailor-made business management dashboard bringing operations, client invoicing, and custom analytical tracking into a single unified workspace.',
    terms: '50% upfront deposit to initiate design & schema mapping. 50% paid upon deployment of the production database and user acceptance testing.',
    deliverables: [
      'Role-based access control and secure authentication pipeline',
      'Invoicing and client contact directory management modules',
      'Data visualization charts for revenue and operation logs',
      'CSV/PDF exports for client records and reports',
    ],
  },
];

export default function AdminAgreements() {
  const { inquiries } = useApp();
  const { notify } = useToast();
  const [agreements, setAgreements] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('ms-agreements');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const loadRemoteAgreements = useCallback(async () => {
    try {
      const remote = await getDocsFrom<any>('agreements');
      if (remote.length > 0) {
        setAgreements((prev) => {
          const map = new Map<string, any>();
          remote.forEach((r) => map.set(r.id, r));
          prev.forEach((p) => {
            if (!map.has(p.id)) map.set(p.id, p);
          });
          const merged = Array.from(map.values());
          localStorage.setItem('ms-agreements', JSON.stringify(merged));
          return merged;
        });
      }
    } catch (err) {
      console.warn('Agreements sync note:', err);
    }
  }, []);

  useEffect(() => {
    loadRemoteAgreements();
  }, [loadRemoteAgreements]);

  const [form, setForm] = useState({
    clientName: '',
    clientOrg: '',
    clientEmail: '',
    title: '',
    type: 'NGO Website & Systems',
    scope: '',
    terms: '',
    deliverables: [''],
    governingLaw: 'Tanzania',
    status: 'Draft' as 'Draft' | 'Sent' | 'Signed',
    date: new Date().toISOString().split('T')[0],
  });

  const persist = (list: any[]) => {
    setAgreements(list);
    localStorage.setItem('ms-agreements', JSON.stringify(list));
  };

  const applyTemplate = (tplId: string) => {
    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl) return;
    setForm((f) => ({
      ...f,
      title: tpl.name,
      type: tpl.type,
      scope: tpl.scope,
      terms: tpl.terms,
      deliverables: [...tpl.deliverables],
    }));
  };

  const handleInquiryPreset = (inqId: string) => {
    const inq = inquiries.find((i) => i.id === inqId);
    if (!inq) return;
    setForm((f) => ({
      ...f,
      clientName: inq.name,
      clientOrg: inq.company || '',
      clientEmail: inq.email,
      message: inq.message,
    }));
  };

  const handleSave = async () => {
    if (!form.clientName || !form.title) {
      notify({ title: 'Missing details', description: 'Client name and agreement title are required.', variant: 'warning' });
      return;
    }
    if (editing) {
      const updated = { ...editing, ...form };
      const next = agreements.map((a) => (a.id === editing.id ? updated : a));
      persist(next);
      await saveDoc('agreements', editing.id, updated);
      notify({ title: 'Agreement updated', description: form.title, variant: 'success' });
    } else {
      const newDoc = { ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      const next = [newDoc, ...agreements];
      persist(next);
      await saveDoc('agreements', newDoc.id, newDoc);
      notify({ title: 'Agreement created', description: form.title, variant: 'success' });
    }
    setCreating(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    const next = agreements.filter((a) => a.id !== id);
    persist(next);
    await removeDoc('agreements', id);
    notify({ title: 'Agreement deleted', variant: 'info' });
  };

  const startCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm({
      clientName: '',
      clientOrg: '',
      clientEmail: '',
      title: '',
      type: 'NGO Website & Systems',
      scope: '',
      terms: '',
      deliverables: [''],
      governingLaw: 'Tanzania',
      status: 'Draft',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const startEdit = (a: any) => {
    setEditing(a);
    setCreating(false);
    setForm({ ...a });
  };

  const printAgreement = (a: any) => {
    const delRows = a.deliverables
      .map((d: string) => `<li>${d}</li>`)
      .join('');

    const body = `
      ${letterhead('Service Agreement', a.title ? a.id?.slice(0, 8).toUpperCase() ?? 'DRAFT' : 'DRAFT', `Effective ${new Date(a.date).toLocaleDateString()}`, a.status)}

      <p>This Service Agreement ("Agreement") is entered into and made effective as of <strong>${new Date(a.date).toLocaleDateString()}</strong>, by and between the parties below.</p>

      <div class="section-label">Provider</div>
      <p><strong>${STUDIO.name}</strong><br><span class="muted">${STUDIO.location} &middot; ${STUDIO.email} &middot; ${STUDIO.phone}</span></p>

      <div class="section-label">Client</div>
      <p><strong>${a.clientName}</strong>${a.clientOrg ? ` &middot; ${a.clientOrg}` : ''}<br><span class="muted">${a.clientEmail}</span></p>

      <div class="section-label">1. Project title &amp; scope of work</div>
      <p><strong>${a.title}</strong></p>
      <p>${a.scope}</p>

      <div class="section-label">2. Key deliverables</div>
      <ul class="deliverables">${delRows}</ul>

      <div class="section-label">3. Financial terms &amp; payment schedule</div>
      <p>${a.terms}</p>

      <div class="section-label">4. Governing law</div>
      <p>This Agreement is governed by and construed in accordance with the laws of <strong>${a.governingLaw}</strong>. Disputes shall be brought before the competent courts of ${STUDIO.location}.</p>

      <div class="section-label">5. Signatures &amp; acceptance</div>
      <p class="muted">By signing below, both parties agree to the terms outlined in this Agreement. A signed copy — physical or digital — is fully binding.</p>

      <div class="sign-grid">
        <div>
          <div class="sign-role">Provider</div>
          <div class="sign-name">${STUDIO.name}</div>
          <div class="sign-mark">${STUDIO.founder}</div>
          <div class="sign-line">Authorized signature &amp; date</div>
        </div>
        <div>
          <div class="sign-role">Client</div>
          <div class="sign-name">${a.clientName}${a.clientOrg ? ` &middot; ${a.clientOrg}` : ''}</div>
          <div class="sign-mark">&nbsp;</div>
          <div class="sign-line">Authorized signature &amp; date</div>
        </div>
      </div>

      ${docFooter('Service Agreement')}
    `;

    const opened = openPrintDocument(`Service Agreement — ${a.clientName}`, body);
    if (!opened) {
      notify({
        title: 'Pop-up blocked',
        description: 'Allow pop-ups for this site to open the agreement PDF.',
        variant: 'warning',
      });
    }
  };

  const addDel = () => setForm((f) => ({ ...f, deliverables: [...f.deliverables, ''] }));
  const removeDel = (idx: number) =>
    setForm((f) => ({ ...f, deliverables: f.deliverables.filter((_, i) => i !== idx) }));
  const updateDel = (idx: number, val: string) =>
    setForm((f) => ({
      ...f,
      deliverables: f.deliverables.map((d, i) => (i === idx ? val : d)),
    }));

  const open = creating || !!editing;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="serif text-4xl">Service Agreements</h2>
          <p className="mt-1 text-sm text-[#f5f8ff]/50">
            {agreements.length} total agreements processed
          </p>
        </div>
        <button
          onClick={startCreate}
          className="rounded-full bg-[#2563eb] px-6 py-2.5 text-sm font-medium"
        >
          + Create Agreement
        </button>
      </div>

      {agreements.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#f5f8ff]/15 py-20 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563eb]/10 text-[#60a5fa]">
            <AgreementIcon width={24} height={24} />
          </span>
          <p className="serif mt-4 text-2xl text-[#f5f8ff]/40">No agreements processed yet</p>
          <p className="mt-1 text-sm text-[#f5f8ff]/25">
            Select an inquiry preset or template to generate client agreements.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {agreements.map((a: any) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#f5f8ff]/8 bg-[#0d1f40] px-5 py-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{a.title}</p>
                <p className="text-xs text-[#f5f8ff]/40">
                  Client: {a.clientName} {a.clientOrg ? `(${a.clientOrg})` : ''} · Dated{' '}
                  {new Date(a.date).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${
                  a.status === 'Signed'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : a.status === 'Sent'
                    ? 'bg-blue-500/15 text-blue-400'
                    : 'bg-[#f5f8ff]/10 text-[#f5f8ff]/40'
                }`}
              >
                {a.status}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(a)}
                  className="rounded-full border border-[#f5f8ff]/15 px-3 py-1.5 text-xs hover:border-[#2563eb]"
                >
                  Edit
                </button>
                <button
                  onClick={() => printAgreement(a)}
                  className="rounded-full border border-[#f5f8ff]/15 px-3 py-1.5 text-xs hover:border-[#60a5fa]"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="rounded-full border border-[#f5f8ff]/15 px-3 py-1.5 text-xs text-red-400 hover:border-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
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
              className="w-full max-w-2xl rounded-3xl border border-[#f5f8ff]/10 bg-[#0d1f40] p-6 md:p-10"
            >
              <h3 className="serif text-3xl">
                {creating ? 'Create Agreement' : 'Edit Agreement'}
              </h3>

              {/* Presets and templates */}
              <div className="mt-6 rounded-2xl bg-white/5 p-4 space-y-3">
                <p className="text-xs uppercase tracking-wider text-[#f5f8ff]/45">
                  Templates & presets
                </p>
                <div className="flex flex-wrap gap-2">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => applyTemplate(t.id)}
                      className="rounded-full border border-[#f5f8ff]/10 bg-white/5 px-3 py-1.5 text-xs text-[#60a5fa] hover:bg-[#2563eb]/20"
                    >
                      {t.name.split(' (')[0]}
                    </button>
                  ))}
                </div>

                {inquiries.length > 0 && (
                  <div className="border-t border-[#f5f8ff]/10 pt-3">
                    <p className="text-xs uppercase tracking-wider text-[#f5f8ff]/45 mb-2">
                      Load from inquiry
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {inquiries.slice(0, 4).map((inq) => (
                        <button
                          key={inq.id}
                          type="button"
                          onClick={() => handleInquiryPreset(inq.id)}
                          className="rounded-full border border-[#f5f8ff]/10 bg-white/5 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/15"
                        >
                          {inq.name.split(' ')[0]} ({inq.budget})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Client Name *">
                    <input
                      value={form.clientName}
                      onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                      placeholder="e.g. David Erick"
                      className={ic}
                    />
                  </Field>
                  <Field label="Client Email *">
                    <input
                      type="email"
                      value={form.clientEmail}
                      onChange={(e) => setForm((f) => ({ ...f, clientEmail: e.target.value }))}
                      placeholder="client@org.com"
                      className={ic}
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Client Organisation">
                    <input
                      value={form.clientOrg}
                      onChange={(e) => setForm((f) => ({ ...f, clientOrg: e.target.value }))}
                      placeholder="Optional"
                      className={ic}
                    />
                  </Field>
                  <Field label="Status">
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, status: e.target.value as any }))
                      }
                      className={ic}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Signed">Signed</option>
                    </select>
                  </Field>
                </div>

                <Field label="Agreement / Proposal Title *">
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="NGO Web Platform Proposal / Service Agreement"
                    className={ic}
                  />
                </Field>

                <Field label="Project Scope">
                  <textarea
                    value={form.scope}
                    onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}
                    rows={4}
                    placeholder="Define project deliverables and boundaries..."
                    className={ic + ' resize-none'}
                  />
                </Field>

                {/* Deliverables */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-[#f5f8ff]/45">
                      Deliverables Checklist
                    </span>
                    <button
                      type="button"
                      onClick={addDel}
                      className="text-xs text-[#60a5fa] hover:underline"
                    >
                      + Add deliverable
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.deliverables.map((d, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          placeholder="e.g. UX architecture & Figma prototype"
                          value={d}
                          onChange={(e) => updateDel(idx, e.target.value)}
                          className={ic + ' flex-1'}
                        />
                        {form.deliverables.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDel(idx)}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Field label="Payment Terms & Retainer Schedule">
                  <textarea
                    value={form.terms}
                    onChange={(e) => setForm((f) => ({ ...f, terms: e.target.value }))}
                    rows={3}
                    placeholder="e.g. 50% upfront retainer, 50% on launch..."
                    className={ic + ' resize-none'}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Governing Law">
                    <input
                      value={form.governingLaw}
                      onChange={(e) => setForm((f) => ({ ...f, governingLaw: e.target.value }))}
                      className={ic}
                    />
                  </Field>
                  <Field label="Agreement Date">
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                      className={ic}
                    />
                  </Field>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleSave}
                  className="rounded-full bg-[#2563eb] px-6 py-3 text-sm font-medium"
                >
                  Save Agreement
                </button>
                <button
                  onClick={() => {
                    setEditing(null);
                    setCreating(false);
                  }}
                  className="rounded-full border border-[#f5f8ff]/20 px-6 py-3 text-sm"
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

const ic =
  'w-full rounded-xl border border-[#f5f8ff]/15 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[#2563eb]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-[#f5f8ff]/45">
        {label}
      </span>
      {children}
    </label>
  );
}
