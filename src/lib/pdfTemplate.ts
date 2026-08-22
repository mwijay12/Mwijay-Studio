/**
 * Shared print/PDF document shell for invoices and agreements.
 *
 * Renders to a full HTML document opened in a new tab, then triggers the
 * browser's native print dialog (which every browser can "Save as PDF"
 * from). Both templates share one letterhead, one type scale, and one set
 * of print rules so client-facing documents look consistent regardless of
 * which admin tool generated them.
 */

export const STUDIO = {
  name: 'Mwijay Studio',
  email: 'mwijaydavie@gmail.com',
  phone: '+255 790 942 616',
  location: 'Dar es Salaam, Tanzania',
  founder: 'David Mwijage',
};

const BASE_STYLES = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Inter', 'Space Grotesk', system-ui, -apple-system, sans-serif;
    margin: 0;
    color: #0a1633;
    line-height: 1.6;
    font-size: 14px;
    background: #f5f8ff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .sheet {
    max-width: 780px;
    margin: 0 auto;
    background: #ffffff;
    padding: 56px 60px 40px;
  }
  .letterhead {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 28px;
    border-bottom: 2px solid #0a1633;
    margin-bottom: 32px;
  }
  .brand-mark {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .brand-mark .badge {
    width: 34px;
    height: 34px;
    border-radius: 9999px;
    background: linear-gradient(135deg, #2563eb, #1e40af);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 13px;
    flex-shrink: 0;
  }
  .brand-name {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .brand-name span { color: #2563eb; }
  .brand-meta {
    margin-top: 10px;
    font-size: 12px;
    color: #0a163399;
    line-height: 1.7;
  }
  .doc-heading {
    text-align: right;
  }
  .doc-heading h1 {
    margin: 0;
    font-size: 22px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-weight: 800;
  }
  .doc-meta {
    margin-top: 10px;
    font-size: 12px;
    color: #0a163399;
    line-height: 1.7;
  }
  .status-pill {
    display: inline-block;
    margin-top: 8px;
    padding: 3px 12px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .status-draft { background: #f1f5f9; color: #475569; }
  .status-sent  { background: #dbeafe; color: #1e40af; }
  .status-paid, .status-signed { background: #dcfce7; color: #166534; }

  .section-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #2563eb;
    margin: 28px 0 10px;
  }
  .section-label:first-of-type { margin-top: 0; }

  p { margin: 0 0 10px; color: #0a1633; }
  .muted { color: #0a163399; }

  table { width: 100%; border-collapse: collapse; margin-top: 4px; }
  thead th {
    text-align: left;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #0a163380;
    padding: 0 0 8px;
    border-bottom: 1.5px solid #0a1633;
    font-weight: 700;
  }
  tbody td {
    padding: 11px 0;
    border-bottom: 1px solid #e5e9f2;
    font-size: 13px;
    vertical-align: top;
  }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .center { text-align: center; }

  .total-row {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    gap: 10px;
    margin-top: 18px;
    padding-top: 16px;
    border-top: 2px solid #0a1633;
  }
  .total-row .label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #0a163399;
  }
  .total-row .amount {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  .notes-box {
    margin-top: 22px;
    padding: 14px 16px;
    background: #f5f8ff;
    border-left: 3px solid #2563eb;
    border-radius: 6px;
    font-size: 12.5px;
    color: #0a163399;
  }
  .deliverables { margin: 0; padding-left: 18px; }
  .deliverables li { margin-bottom: 8px; line-height: 1.55; }

  .sign-grid {
    margin-top: 48px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  .sign-role {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #0a163399;
    margin-bottom: 6px;
  }
  .sign-name { font-weight: 600; font-size: 14px; }
  .sign-mark {
    font-family: 'Brush Script MT', cursive;
    font-style: italic;
    font-size: 30px;
    color: #2563eb;
    height: 42px;
    margin-top: 20px;
  }
  .sign-line {
    border-top: 1px solid #0a1633;
    margin-top: 6px;
    padding-top: 8px;
    font-size: 11px;
    color: #0a163399;
  }

  .doc-footer {
    margin-top: 48px;
    padding-top: 16px;
    border-top: 1px solid #e5e9f2;
    display: flex;
    justify-content: space-between;
    font-size: 10.5px;
    color: #0a163366;
  }

  @media print {
    body { background: #fff; }
    .sheet { padding: 24px 32px; }
    .no-print { display: none; }
  }
`;

function statusClass(status: string) {
  return `status-${status.toLowerCase()}`;
}

export function letterhead(docType: string, number: string, dateLabel: string, status: string) {
  return `
    <div class="letterhead">
      <div>
        <div class="brand-mark">
          <span class="badge">MD</span>
          <span class="brand-name">Mwijay<span>Studio</span></span>
        </div>
        <div class="brand-meta">
          ${STUDIO.email}<br>
          ${STUDIO.phone}<br>
          ${STUDIO.location}
        </div>
      </div>
      <div class="doc-heading">
        <h1>${docType}</h1>
        <div class="doc-meta">
          <strong>${number}</strong><br>
          ${dateLabel}
        </div>
        <span class="status-pill ${statusClass(status)}">${status}</span>
      </div>
    </div>
  `;
}

export function docFooter(reference: string) {
  return `
    <div class="doc-footer">
      <span>Mwijay Studio &middot; ${STUDIO.location}</span>
      <span>${reference}</span>
    </div>
  `;
}

/** Wraps a body fragment in the full printable document and opens it for printing. */
export function openPrintDocument(title: string, bodyHtml: string) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${title}</title>
<style>${BASE_STYLES}</style>
</head>
<body>
  <div class="sheet">
    ${bodyHtml}
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) return false;
  win.document.write(html);
  win.document.close();
  // Give the new tab a tick to paint before invoking print, so headers /
  // gradients aren't cut off on the first render in some browsers.
  win.onload = () => win.print();
  window.setTimeout(() => win.print(), 300);
  return true;
}
