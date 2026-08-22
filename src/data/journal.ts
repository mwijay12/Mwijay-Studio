export type JournalPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  date: string;
  readTime: string;
  img: string;
  author: string;
};

export const posts: JournalPost[] = [
  {
    id: '1',
    slug: 'quiet-luxury-web-design',
    title: 'Quiet luxury is rewriting the rules of web design',
    excerpt:
      'How restraint, craft, and material honesty are shaping the next wave of digital brands.',
    content: [
      'For years, the loudest brands won. Gradient-soaked hero sections, autoplay video, and type so bold it screamed. That era is cooling. In its place: quiet luxury — a design language borrowed from fashion and interiors that prizes material honesty, generous space, and confidence without volume.',
      'Quiet doesn’t mean boring. It means every element earns its place. A single well-set headline can carry more weight than a carousel of claims. A restrained palette — sand, ink, one warm accent — creates a world people want to stay in.',
      'In our recent work with Maison Verte, we stripped the e-commerce experience down to editorial storytelling and product photography that feels almost tactile. Conversion went up. Bounce rate went down. People stayed because the site felt like a place, not a funnel.',
      'If you’re building a brand that wants longevity over virality, quiet luxury isn’t a trend to copy — it’s a discipline. Start by removing. Then, only add what you can’t live without.',
    ],
    category: 'Design',
    date: '2026-02-12',
    readTime: '6 min',
    img: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    author: 'David Mwijage',
  },
  {
    id: '2',
    slug: 'design-systems-that-breathe',
    title: 'Design systems that breathe',
    excerpt:
      'Why rigid component libraries fail creative teams — and how to build systems with room to play.',
    content: [
      'Design systems are supposed to free teams. Too often they cage them. When every button, spacing token, and illustration rule is locked, designers stop designing and start assembling.',
      'The best systems we’ve built leave intentional gaps. Core components stay strict — accessibility, type scale, color contrast. Everything else gets flexible recipes: “here’s how a card usually works; here’s when you break it.”',
      'At Pulse Analytics we shipped a system with three layers: foundations (tokens), patterns (composed UI), and narratives (marketing layouts that intentionally deviate). Product stayed consistent. Marketing stayed expressive. Both spoke the same language.',
      'If your system has no room for judgment, it isn’t a system — it’s a template. Build for the 80%, document the 20%, and trust your team with the rest.',
    ],
    category: 'Process',
    date: '2026-01-28',
    readTime: '5 min',
    img: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    author: 'David Mwijage',
  },
  {
    id: '3',
    slug: 'type-as-personality',
    title: 'Type is personality. Choose carefully.',
    excerpt:
      'A practical guide to pairing typefaces that feel human — not like a default template.',
    content: [
      'People feel type before they read it. A sharp geometric sans says tech and efficiency. A soft serif says heritage and care. Mixing them poorly says “we didn’t decide.”',
      'Our rule of thumb: one voice for headlines, one for body, and a strict hierarchy so neither has to shout. Instrument Serif with Space Grotesk — the pairing on this site — works because the serif carries emotion while the grotesk handles the workmanlike details.',
      'When we rebranded Hearth Bakery, custom lettering for the wordmark did more brand work than any logo mark. Flour-dust textures in the terminals made the type feel handmade without becoming a gimmick.',
      'Test type in real content, at real sizes, on real devices. If it only looks good in a specimen sheet, it isn’t ready.',
    ],
    category: 'Typography',
    date: '2025-12-09',
    readTime: '4 min',
    img: 'https://images.pexels.com/photos/89724/pexels-photo-89724.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    author: 'David Mwijage',
  },
  {
    id: '4',
    slug: 'from-brief-to-launch',
    title: 'From brief to launch: how we actually work',
    excerpt:
      'A transparent look at our studio process — the rituals, reviews, and red flags we watch for.',
    content: [
      'Clients often ask what working with us feels like week to week. Here’s the honest version — not the polished process diagram.',
      'Week one is almost entirely listening. We run a workshop, review everything you’ve tried before, and write back a creative platform: the one-page north star for the project. If we can’t agree on that, we don’t start designing.',
      'Mid-project, we share work early and often — rough, not polished. Feedback lands better on sketches than on high-fidelity mocks people feel bad about changing. We timebox exploration so decisions don’t drift forever.',
      'Launch isn’t the end. We stay on for two weeks of hypercare, then a lighter retainer if you want ongoing craft. The brands that thrive treat design as a practice, not a project with a finish line.',
    ],
    category: 'Studio',
    date: '2025-11-18',
    readTime: '7 min',
    img: 'https://images.pexels.com/photos/12969403/pexels-photo-12969403.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    author: 'David Mwijage',
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function getRecentPosts(limit = 3, exclude?: string) {
  return posts.filter((p) => p.slug !== exclude).slice(0, limit);
}
