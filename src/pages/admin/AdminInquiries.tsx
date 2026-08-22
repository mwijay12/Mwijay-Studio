import { useApp, type Inquiry } from '../../context/AppContext';

const statuses: Inquiry['status'][] = ['New', 'Replied', 'Closed'];

export default function AdminInquiries() {
  const { inquiries, updateInquiryStatus } = useApp();

  return (
    <div>
      <div className="mb-8">
        <h2 className="serif text-4xl">Inquiries</h2>
        <p className="mt-1 text-sm text-[#f5f8ff]/50">
          {inquiries.length} total · {inquiries.filter((i) => i.status === 'New').length} new
        </p>
      </div>

      {inquiries.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#f5f8ff]/15 py-20 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563eb]/10 text-[#60a5fa]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
              <path d="M8 9h8M8 13h5" />
            </svg>
          </span>
          <p className="serif mt-4 text-2xl text-[#f5f8ff]/40">No inquiries yet</p>
          <p className="mt-1 text-sm text-[#f5f8ff]/25">Inquiries from the contact form and Start a Project page appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="rounded-2xl border border-[#f5f8ff]/8 bg-[#0d1f40] p-5 md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="serif text-2xl">{inq.name}</h3>
                  <p className="mt-0.5 text-sm text-[#f5f8ff]/40">
                    {inq.email}
                    {inq.company && <> · {inq.company}</>}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="rounded-full bg-[#2563eb]/15 px-3 py-1 text-xs text-[#60a5fa]">
                    {inq.budget}
                  </span>
                  <select
                    value={inq.status}
                    onChange={(e) => updateInquiryStatus(inq.id, e.target.value as Inquiry['status'])}
                    className={`rounded-full py-1 pl-3 pr-8 text-[10px] font-medium uppercase tracking-wider outline-none appearance-none cursor-pointer ${
                      inq.status === 'New'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : inq.status === 'Replied'
                        ? 'bg-blue-500/15 text-blue-400'
                        : 'bg-[#f5f8ff]/10 text-[#f5f8ff]/40'
                    }`}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {inq.services.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {inq.services.map((s) => (
                    <span key={s} className="rounded-full border border-[#f5f8ff]/10 px-3 py-1 text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-4 text-sm text-[#f5f8ff]/70 whitespace-pre-line">{inq.message}</p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#f5f8ff]/30">
                <span>{new Date(inq.createdAt).toLocaleString()}</span>
                <a
                  href={`mailto:${inq.email}?subject=Re: Your inquiry to Mwijay Studio&body=Hi ${inq.name.split(' ')[0]},%0D%0A%0D%0AThank you for reaching out about ${inq.services[0] || 'your project'}. `}
                  className="text-[#60a5fa] hover:underline"
                >
                  Reply via email ↗
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hi ${inq.name.split(' ')[0]}, thank you for contacting Mwijay Studio regarding ${inq.services[0] || 'your project'}. I'd love to discuss this further.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  Reply via WhatsApp ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
