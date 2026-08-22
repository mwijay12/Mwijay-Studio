import { useState, useRef } from 'react';
import { useApp, type Invoice } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { openPrintDocument, letterhead, docFooter } from '../../lib/pdfTemplate';
import { useToast } from '../../context/ToastContext';

const emptyItem = { desc: '', qty: 1, rate: 0 };

export default function AdminInvoices() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useApp();
  const { notify } = useToast();
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [creating, setCreating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    number: '',
    clientName: '',
    clientEmail: '',
    items: [{ ...emptyItem }],
    currency: 'USD',
    status: 'Draft' as Invoice['status'],
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    notes: '',
  });

  const total = form.items.reduce((s, i) => s + i.qty * i.rate, 0);

  const startCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm({
      number: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      clientName: '',
      clientEmail: '',
      items: [{ ...emptyItem }],
      currency: 'USD',
      status: 'Draft',
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      notes: '',
    });
  };

  const startEdit = (inv: Invoice) => {
    setEditing(inv);
    setCreating(false);
    setForm({ ...inv, dueDate: inv.dueDate.split('T')[0] });
  };

  const handleSave = () => {
    if (!form.clientName || !form.number) {
      notify({ title: 'Missing details', description: 'Client name and invoice number are required.', variant: 'warning' });
      return;
    }
    if (editing) {
      updateInvoice(editing.id, form);
      notify({ title: 'Invoice updated', description: form.number, variant: 'success' });
    } else {
      addInvoice(form);
      notify({ title: 'Invoice created', description: form.number, variant: 'success' });
    }
    setEditing(null);
    setCreating(false);
  };

  const addItem = () => setForm((f) => ({ ...f, items: [...f.items, { ...emptyItem }] }));
  const removeItem = (idx: number) => setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  const updateItem = (idx: number, field: keyof typeof emptyItem, value: string | number) =>
    setForm((f) => ({ ...f, items: f.items.map((it, i) => (i === idx ? { ...it, [field]: value } : it)) }));

  const printInvoice = (inv: Invoice) => {
    const itemRows = inv.items
      .map(
        (it) => `<tr>
          <td>${it.desc || '—'}</td>
          <td class="center">${it.qty}</td>
          <td class="num">${inv.currency} ${it.rate.toFixed(2)}</td>
          <td class="num">${inv.currency} ${(it.qty * it.rate).toFixed(2)}</td>
        </tr>`
      )
      .join('');
    const invTotal = inv.items.reduce((s, i) => s + i.qty * i.rate, 0);

    const body = `
      ${letterhead(
        'Invoice',
        inv.number,
        `Issued ${new Date(inv.createdAt).toLocaleDateString()}<br>Due ${new Date(inv.dueDate).toLocaleDateString()}`,
        inv.status
      )}

      <div class="section-label">Billed to</div>
      <p><strong>${inv.clientName}</strong><br><span class="muted">${inv.clientEmail}</span></p>

      <div class="section-label">Items</div>
      <table>
        <thead>
          <tr><th>Description</th><th class="center">Qty</th><th class="num">Rate</th><th class="num">Amount</th></tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <div class="total-row">
        <span class="label">Total due</span>
        <span class="amount">${inv.currency} ${invTotal.toFixed(2)}</span>
      </div>

      ${inv.notes ? `<div class="notes-box"><strong>Notes:</strong> ${inv.notes}</div>` : ''}

      ${docFooter(`Invoice ${inv.number}`)}
    `;

    const opened = openPrintDocument(`Invoice ${inv.number}`, body);
    if (!opened) {
      notify({
        title: 'Pop-up blocked',
        description: 'Allow pop-ups for this site to open the invoice PDF.',
        variant: 'warning',
      });
    }
  };

  const open = creating || !!editing;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="serif text-4xl">Invoices</h2>
          <p className="mt-1 text-sm text-[#f5f8ff]/50">{invoices.length} total</p>
        </div>
        <button onClick={startCreate} className="rounded-full bg-[#2563eb] px-6 py-2.5 text-sm font-medium">
          + New invoice
        </button>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#f5f8ff]/15 py-20 text-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-[#f5f8ff]/25">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="13" y2="17" />
          </svg>
          <p className="serif mt-4 text-2xl text-[#f5f8ff]/40">No invoices yet</p>
          <p className="mt-1 text-sm text-[#f5f8ff]/25">Create your first invoice to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => {
            const t = inv.items.reduce((s, i) => s + i.qty * i.rate, 0);
            return (
              <div key={inv.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#f5f8ff]/8 bg-[#0d1f40] px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{inv.number} — {inv.clientName}</p>
                  <p className="text-xs text-[#f5f8ff]/40">{inv.clientEmail} · Due {new Date(inv.dueDate).toLocaleDateString()}</p>
                </div>
                <p className="serif text-xl">${t.toFixed(2)}</p>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${
                  inv.status === 'Paid' ? 'bg-emerald-500/15 text-emerald-400' :
                  inv.status === 'Sent' ? 'bg-blue-500/15 text-blue-400' :
                  'bg-[#f5f8ff]/10 text-[#f5f8ff]/40'
                }`}>
                  {inv.status}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(inv)} className="rounded-full border border-[#f5f8ff]/15 px-3 py-1.5 text-xs transition hover:border-[#2563eb]">Edit</button>
                  <button onClick={() => printInvoice(inv)} className="rounded-full border border-[#f5f8ff]/15 px-3 py-1.5 text-xs transition hover:border-[#60a5fa]">Download PDF</button>
                  <button
                    onClick={() => {
                      deleteInvoice(inv.id);
                      notify({ title: 'Invoice deleted', description: `${inv.number} was removed.`, variant: 'info' });
                    }}
                    className="rounded-full border border-[#f5f8ff]/15 px-3 py-1.5 text-xs text-red-400 transition hover:border-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0a1633]/90 py-10 px-4 backdrop-blur-sm"
          >
            <motion.div
              ref={printRef}
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl border border-[#f5f8ff]/10 bg-[#0d1f40] p-6 md:p-10"
            >
              <h3 className="serif text-3xl">{creating ? 'New invoice' : 'Edit invoice'}</h3>

              <div className="mt-8 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Invoice #">
                    <input value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))} className={ic} />
                  </Field>
                  <Field label="Status">
                    <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Invoice['status'] }))} className={ic}>
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Client name">
                    <input value={form.clientName} onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))} className={ic} />
                  </Field>
                  <Field label="Client email">
                    <input value={form.clientEmail} onChange={(e) => setForm((f) => ({ ...f, clientEmail: e.target.value }))} className={ic} />
                  </Field>
                </div>
                <Field label="Due date">
                  <input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} className={ic} />
                </Field>

                {/* Line items */}
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-[#f5f8ff]/45">Line items</p>
                  <div className="space-y-2">
                    {form.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input placeholder="Description" value={it.desc} onChange={(e) => updateItem(idx, 'desc', e.target.value)} className={ic + ' flex-1'} />
                        <input type="number" min="1" value={it.qty} onChange={(e) => updateItem(idx, 'qty', +e.target.value)} className={ic + ' w-16 text-center'} />
                        <input type="number" min="0" step="0.01" value={it.rate} onChange={(e) => updateItem(idx, 'rate', +e.target.value)} className={ic + ' w-24 text-right'} />
                        <span className="w-20 text-right text-sm text-[#f5f8ff]/50">${(it.qty * it.rate).toFixed(2)}</span>
                        {form.items.length > 1 && (
                          <button onClick={() => removeItem(idx)} className="text-xs text-red-400 hover:text-red-300">✕</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={addItem} className="mt-2 text-xs text-[#60a5fa] hover:underline">
                    + Add line item
                  </button>
                </div>

                <div className="flex justify-end text-xl font-bold">
                  Total: ${total.toFixed(2)} {form.currency}
                </div>

                <Field label="Notes (optional)">
                  <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={3} className={ic + ' resize-none'} />
                </Field>
              </div>

              <div className="mt-8 flex gap-4">
                <button onClick={handleSave} className="rounded-full bg-[#2563eb] px-6 py-3 text-sm font-medium">Save</button>
                <button onClick={() => { setEditing(null); setCreating(false); }} className="rounded-full border border-[#f5f8ff]/20 px-6 py-3 text-sm">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ic = 'w-full rounded-xl border border-[#f5f8ff]/15 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[#2563eb]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-[#f5f8ff]/45">{label}</span>
      {children}
    </label>
  );
}
