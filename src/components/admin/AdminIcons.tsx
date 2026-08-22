import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;
const base = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const DashboardIcon = (p: Props) => <svg {...base} {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
export const ProjectsIcon = (p: Props) => <svg {...base} {...p}><path d="M3 7h6l2 2h10v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/><path d="M3 7V5a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v2"/></svg>;
export const ServicesIcon = (p: Props) => <svg {...base} {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.55V21h-4v-.05a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3v-4h.05A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3h4v.05A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21v4h-.05A1.7 1.7 0 0 0 19.4 15z"/></svg>;
export const InquiriesIcon = (p: Props) => <svg {...base} {...p}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z"/><path d="M8 9h8M8 13h5"/></svg>;
export const VisitorsIcon = (p: Props) => <svg {...base} {...p}><path d="M3 3v18h18"/><path d="m7 16 4-5 3 3 5-7"/></svg>;
export const InvoiceIcon = (p: Props) => <svg {...base} {...p}><path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/></svg>;
export const AgreementIcon = (p: Props) => <svg {...base} {...p}><path d="M8 12 4 8l4-4M16 12l4-4-4-4M4 8h16M8 20l4-4 4 4M12 16V8"/></svg>;
export const ExternalIcon = (p: Props) => <svg {...base} {...p}><path d="M14 3h7v7M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>;
export const MenuIcon = (p: Props) => <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
export const CloseIcon = (p: Props) => <svg {...base} {...p}><path d="m6 6 12 12M18 6 6 18"/></svg>;
export const LogoutIcon = (p: Props) => <svg {...base} {...p}><path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></svg>;