export type ProjectStatus = 'Completed' | 'In Progress';

export type Project = {
  id: string;
  slug: string;
  title: string;
  client: string;
  tag: string;
  category: 'Branding' | 'Web' | 'App' | 'Automation';
  year: string;
  img: string;
  /** Optional fallback video (mp4/webm) shown instead of the still image when available */
  previewVideo?: string;
  gallery: string[];
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  services: string[];
  featured: boolean;
  color: string;
  liveUrl?: string;
  status: ProjectStatus;
};

export const projects: Project[] = [
  {
    id: '1',
    slug: 'aymi-africa',
    title: 'Aymi Africa',
    client: 'Aymi Africa',
    tag: 'Non-profit · Web',
    category: 'Web',
    year: '2026',
    img: 'https://images.pexels.com/photos/5256819/pexels-photo-5256819.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    gallery: [
      'https://images.pexels.com/photos/5256819/pexels-photo-5256819.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/8547282/pexels-photo-8547282.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/9301902/pexels-photo-9301902.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    ],
    summary:
      'A full responsive website for a pan-African organisation — built to tell their story and grow their reach.',
    challenge:
      'Aymi Africa had a powerful mission but no digital home. They needed a site that communicated credibility to international partners while staying fast and accessible for visitors on low-bandwidth mobile connections across the continent.',
    solution:
      'We delivered a complete responsive website with a clear content hierarchy, programme showcases, and a lightweight asset pipeline. Every page was optimised for mobile-first performance, with progressive image loading and a design system that the team can extend themselves.',
    results: [
      '100% responsive across all breakpoints',
      'Sub-2s load on 3G connections',
      'Live and serving a real client',
    ],
    services: ['Web Design', 'Development', 'Art Direction'],
    featured: true,
    color: '#c4552e',
    liveUrl: 'https://aymiafrica.org',
    status: 'Completed',
  },
  {
    id: '2',
    slug: 'audenic',
    title: 'Audenic',
    client: 'Audenic Audio',
    tag: 'E-commerce · Audio',
    category: 'Web',
    year: '2026',
    img: 'https://images.pexels.com/photos/106344/pexels-photo-106344.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    gallery: [
      'https://images.pexels.com/photos/106344/pexels-photo-106344.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/12969403/pexels-photo-12969403.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/27141307/pexels-photo-27141307.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    ],
    summary:
      'A premium storefront for an audio brand selling headphones, speakers, and radios online.',
    challenge:
      'Audio hardware is tactile — people want to hold it before they buy. The challenge was translating that physical confidence into a screen, so a shopper could feel the build quality of a pair of headphones through a browser alone.',
    solution:
      'We built a premium product showcase with large-format photography, spec-forward product pages, and a checkout flow designed to remove hesitation. Deep blacks and precise typography give the catalogue the weight of a high-end audio catalogue.',
    results: [
      'Full product catalogue with online ordering',
      'Premium showcase for headphones, speakers & radios',
      'Conversion-focused product detail pages',
    ],
    services: ['Web Design', 'E-commerce', 'Art Direction', 'Development'],
    featured: true,
    color: '#1f1d1b',
    liveUrl: 'https://audenic.vercel.app/',
    status: 'Completed',
  },
  {
    id: '3',
    slug: 'tanzania-reach',
    title: 'Tanzania Reach',
    client: 'Tanzania Reach',
    tag: 'Tourism · Education',
    category: 'Web',
    year: '2026',
    img: 'https://images.pexels.com/photos/106344/pexels-photo-106344.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200&sat=-20',
    gallery: [
      'https://images.pexels.com/photos/12969403/pexels-photo-12969403.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/27141316/pexels-photo-27141316.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/89724/pexels-photo-89724.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    ],
    summary:
      'A digital gateway to Tanzania — showcasing its richness while guiding visitors through real migration and travel processes.',
    challenge:
      'Information about Tanzanian travel protocols, visa processes, and migration steps was scattered across outdated government portals. Tourists and prospective migrants had no single, trustworthy place to understand what to actually do.',
    solution:
      'We designed a site that does two jobs at once: it sells the beauty of Tanzania through immersive photography, then drops visitors into clear, step-by-step guidance on protocols and processes. Editorial storytelling up top, practical utility underneath.',
    results: [
      'Centralised protocol & process guidance',
      'Tourism showcase with immersive imagery',
      'Built for education and migration support',
    ],
    services: ['Web Design', 'Content Strategy', 'Development'],
    featured: true,
    color: '#7a7a52',
    liveUrl: 'https://www.tanzaniareach.com/',
    status: 'In Progress',
  },
  {
    id: '4',
    slug: 'bongo-foodie',
    title: 'Bongo Foodie',
    client: 'Bongo Foodie',
    tag: 'Restaurant · Ordering',
    category: 'Web',
    year: '2026',
    img: 'https://images.pexels.com/photos/12969403/pexels-photo-12969403.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    gallery: [
      'https://images.pexels.com/photos/12969403/pexels-photo-12969403.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/106344/pexels-photo-106344.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/89724/pexels-photo-89724.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    ],
    summary:
      'An online ordering and delivery platform built for restaurants moving into the digital era.',
    challenge:
      'Local restaurants were losing ground to delivery apps that took heavy commissions and owned the customer relationship. They needed their own digital presence — one that showcased their food properly and let them take orders directly.',
    solution:
      'We built a platform where restaurants showcase dishes with appetite-first photography, and customers browse, order, and arrange delivery across multiple locations. The ordering flow is deliberately short — browse, add, checkout — to keep drop-off low.',
    results: [
      'Multi-location ordering system',
      'Integrated food delivery flow',
      'Appetite-first dish showcase',
    ],
    services: ['Web Design', 'UX Design', 'Development'],
    featured: false,
    color: '#c4552e',
    liveUrl: 'https://bongofoodie.vercel.app',
    status: 'In Progress',
  },
  {
    id: '5',
    slug: 'gta-tz',
    title: 'GTA Tz',
    client: 'Personal Project',
    tag: 'Scroll Experience · Concept',
    category: 'Web',
    year: '2026',
    img: 'https://images.pexels.com/photos/27141307/pexels-photo-27141307.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    gallery: [
      'https://images.pexels.com/photos/27141307/pexels-photo-27141307.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/27141316/pexels-photo-27141316.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/8386356/pexels-photo-8386356.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    ],
    summary:
      'A premium scroll-driven concept site — a Tanzanian take on the GTA visual language.',
    challenge:
      'This one was a pure craft exercise: how far can scroll-based storytelling go in a browser before it starts to feel like a game trailer rather than a website?',
    solution:
      'We built a heavily art-directed, scroll-driven experience with pinned sections, parallax layers, and cinematic type treatments. Every scroll tick advances a scene. It doubles as a stress test for our motion and performance tooling.',
    results: [
      'Fully scroll-driven cinematic narrative',
      'Pinned sections with parallax depth',
      'Motion & performance showcase',
    ],
    services: ['Art Direction', 'Motion', 'Development'],
    featured: false,
    color: '#2a2420',
    liveUrl: 'https://gta-tz.vercel.app/',
    status: 'In Progress',
  },
  {
    id: '6',
    slug: 'faida-hq',
    title: 'FaidaHQ',
    client: 'FaidaHQ',
    tag: 'SaaS · Business Tools',
    category: 'App',
    year: '2026',
    img: 'https://images.pexels.com/photos/27141316/pexels-photo-27141316.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    gallery: [
      'https://images.pexels.com/photos/27141316/pexels-photo-27141316.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/106344/pexels-photo-106344.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/12969403/pexels-photo-12969403.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    ],
    summary:
      'A business management system bringing operations, clients, and finances into one dashboard.',
    challenge:
      'Small businesses run on a patchwork of spreadsheets, WhatsApp threads, and paper receipts. FaidaHQ set out to replace that with one system — without the bloat and cost of enterprise software.',
    solution:
      'We are building a modular dashboard: client records, invoicing, and operational tracking, all in one interface. The design language stays deliberately plain so that daily users can move fast without fighting the UI.',
    results: [
      'Unified business operations dashboard',
      'Modular architecture for staged rollout',
      'Currently in active development',
    ],
    services: ['Product Design', 'UX Design', 'Development'],
    featured: false,
    color: '#3b5f6b',
    liveUrl: 'https://faida-hq.vercel.app/',
    status: 'In Progress',
  },
  {
    id: '7',
    slug: 'nike-tz',
    title: 'Nike Tz',
    client: 'Concept Project',
    tag: 'Retail · Concept',
    category: 'Web',
    year: '2026',
    img: 'https://images.pexels.com/photos/89724/pexels-photo-89724.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    gallery: [
      'https://images.pexels.com/photos/89724/pexels-photo-89724.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/106344/pexels-photo-106344.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/27141307/pexels-photo-27141307.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    ],
    summary:
      'A concept storefront exploring how a global sneaker brand could show up locally.',
    challenge:
      'Global brand sites often feel identical everywhere. We wanted to test what a footwear storefront looks like when it is designed for a specific local market rather than translated into one.',
    solution:
      'A bold, product-led layout with oversized type, high-contrast product photography, and a browsing flow built around drops and silhouettes rather than generic categories.',
    results: [
      'Product-led storefront concept',
      'Drop-focused browsing structure',
      'High-contrast retail art direction',
    ],
    services: ['Web Design', 'Art Direction', 'Development'],
    featured: false,
    color: '#1a1a1a',
    liveUrl: 'https://niketz.vercel.app/',
    status: 'In Progress',
  },
  {
    id: '8',
    slug: 'mwijaya-portfolio',
    title: 'Mwijaya Portfolio',
    client: 'Personal',
    tag: 'Portfolio · Web',
    category: 'Web',
    year: '2026',
    img: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    gallery: [
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/89724/pexels-photo-89724.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/27141307/pexels-photo-27141307.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    ],
    summary:
      'The public portfolio site — a live index of shipped work and ongoing builds.',
    challenge:
      'A portfolio has about five seconds to prove competence. It needed to load instantly, read clearly, and get out of the way of the work itself.',
    solution:
      'A restrained, typography-led layout with fast navigation between case studies. No decoration for its own sake — the projects carry the page.',
    results: [
      'Live public portfolio',
      'Fast, typography-led layout',
      'Central hub for all project links',
    ],
    services: ['Web Design', 'Development'],
    featured: false,
    color: '#7a7a52',
    liveUrl: 'http://mwijayportfolio.vercel.app/',
    status: 'Completed',
  },
  {
    id: '9',
    slug: 'linkedin-ai-bot',
    title: 'LinkedIn AI Bot',
    client: 'Internal Tool',
    tag: 'Automation · AI',
    category: 'Automation',
    year: '2026',
    img: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    gallery: [
      'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/8386369/pexels-photo-8386369.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/8386356/pexels-photo-8386356.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    ],
    summary:
      'An n8n automation that researches, writes, and publishes four AI-generated posts daily.',
    challenge:
      'Consistent posting is the single biggest lever on LinkedIn — and the hardest to sustain manually. The goal was to remove the human bottleneck without producing generic filler content.',
    solution:
      'We built an n8n workflow that pulls source material, generates drafts through an AI model with a tuned prompt chain, applies formatting rules, and schedules four posts per day. A review step keeps a human in the loop before anything ships.',
    results: [
      '4 automated posts published daily',
      'Full n8n workflow with AI generation',
      'Human review step before publishing',
    ],
    services: ['Automation', 'AI Integration', 'Systems Design'],
    featured: false,
    color: '#4a5568',
    status: 'Completed',
  },
  {
    id: '10',
    slug: 'uaut-connect',
    title: 'UAUT Connect',
    client: 'United African University of Tanzania',
    tag: 'Education · Community',
    category: 'App',
    year: '2026',
    img: 'https://images.pexels.com/photos/5905902/pexels-photo-5905902.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    gallery: [
      'https://images.pexels.com/photos/5905902/pexels-photo-5905902.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/5905710/pexels-photo-5905710.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/5940841/pexels-photo-5940841.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    ],
    summary:
      'A campus community platform connecting UAUT students — announcements, class groups, and resource sharing in one place.',
    challenge:
      'University communication was scattered across WhatsApp groups, notice boards, and word of mouth. Students had no central place to find class updates, connect with coursemates, or access shared resources — especially difficult for new students settling in.',
    solution:
      'We built a campus-first community platform with class group spaces, announcement feeds, and a resource-sharing hub. Built for real student usage patterns — fast on mobile data, simple enough that no onboarding is required, and structured around faculties and cohorts rather than generic forums.',
    results: [
      'Central hub replacing scattered WhatsApp groups',
      'Class-based community spaces',
      'Built for real campus mobile usage',
    ],
    services: ['Web Development', 'Product Design', 'Business Systems'],
    featured: false,
    color: '#2563eb',
    liveUrl: 'https://www.uautconnect.com/',
    status: 'In Progress',
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getRelated(slug: string, limit = 2) {
  const current = getProject(slug);
  if (!current) return projects.slice(0, limit);
  return projects
    .filter((p) => p.slug !== slug && p.category === current.category)
    .concat(projects.filter((p) => p.slug !== slug && p.category !== current.category))
    .slice(0, limit);
}

export const categories = ['All', 'Web', 'App', 'Automation', 'Branding'] as const;
export type Category = (typeof categories)[number];
