export type Service = {
  id: string;
  n: string;
  title: string;
  short: string;
  desc: string;
  deliverables: string[];
  process: { step: string; detail: string }[];
  priceFrom: string;
  duration: string;
};

export const services: Service[] = [
  {
    id: 'web',
    n: '01',
    title: 'Web Development',
    short: 'Fast, responsive websites built with React, Next.js and Astro — designed to convert.',
    desc: 'We build modern, high-performance websites for businesses, NGOs and creators across East Africa and beyond. Every build is responsive, SEO-ready, and optimised to load fast even on mobile data.',
    deliverables: [
      'UX research & sitemap',
      'Responsive UI design',
      'React / Next.js / Astro build',
      'CMS or admin panel',
      'Firebase / Supabase backend',
      'Performance & SEO baseline',
    ],
    process: [
      { step: 'Map', detail: 'Goals, audiences, content architecture' },
      { step: 'Design', detail: 'Visual language, pages, components' },
      { step: 'Build', detail: 'Code, database, auth, QA' },
      { step: 'Launch', detail: 'Deploy on Vercel, monitor, support' },
    ],
    priceFrom: '$450',
    duration: '2–5 weeks',
  },
  {
    id: 'systems',
    n: '02',
    title: 'Business Systems',
    short: 'Complete digital systems — dashboards, booking, management tools and PWAs.',
    desc: 'Rather than a simple website, we build the whole system: custom databases, role-based authentication, dashboards, and progressive web apps that run your operations end to end.',
    deliverables: [
      'Requirements & data modelling',
      'Role-based authentication',
      'Admin dashboards',
      'Booking / management modules',
      'Supabase / PostgreSQL backend',
      'Progressive Web App (PWA)',
    ],
    process: [
      { step: 'Scope', detail: 'Workflows, roles, data structure' },
      { step: 'Architect', detail: 'Database, middleware, auth' },
      { step: 'Build', detail: 'Modules, dashboard, integrations' },
      { step: 'Deliver', detail: 'Training, handover, support' },
    ],
    priceFrom: '$900',
    duration: '4–10 weeks',
  },
  {
    id: 'ai',
    n: '03',
    title: 'AI Automation',
    short: 'n8n workflows and AI agents that do the repetitive work so your team doesn\u2019t.',
    desc: 'We design and deploy real automation systems using n8n, self-hosted on the cloud, wired into AI models like Gemini, Groq and OpenRouter — from content pipelines to research assistants and notification bots.',
    deliverables: [
      'Workflow mapping',
      'n8n automation setup',
      'AI agent & prompt design',
      'API & webhook integrations',
      'Scheduling & notifications',
      'Monitoring & documentation',
    ],
    process: [
      { step: 'Audit', detail: 'Find the repetitive, automatable work' },
      { step: 'Design', detail: 'Workflow logic & AI prompt chains' },
      { step: 'Build', detail: 'n8n nodes, APIs, review steps' },
      { step: 'Run', detail: 'Deploy, monitor, iterate' },
    ],
    priceFrom: '$300',
    duration: '1–4 weeks',
  },
  {
    id: 'design',
    n: '04',
    title: 'Brand & UI Design',
    short: 'Logos, brand systems and interface design with a clean, modern edge.',
    desc: 'From a memorable logo to a full design system and pixel-perfect UI, we shape how your brand looks and feels across every screen — bold, clear, and built to scale.',
    deliverables: [
      'Logo & brand mark',
      'Colour & type system',
      'UI kit & components',
      'Social & launch assets',
      'Figma design files',
      'Brand guidelines',
    ],
    process: [
      { step: 'Discover', detail: 'Positioning, references, direction' },
      { step: 'Explore', detail: 'Logo & system exploration' },
      { step: 'Refine', detail: 'UI kit, components, polish' },
      { step: 'Deliver', detail: 'Files, guidelines, assets' },
    ],
    priceFrom: '$200',
    duration: '1–3 weeks',
  },
];

export function getService(id: string) {
  return services.find((s) => s.id === id);
}
