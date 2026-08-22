export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  img: string;
  social: { label: string; href: string }[];
};

export const team: TeamMember[] = [
  {
    id: '1',
    name: 'David Mwijage',
    role: 'Founder · Full-Stack & AI Systems',
    bio: 'Full-stack developer and AI automation builder based in Dar es Salaam. Builds complete digital systems with React, Next.js, Firebase and Supabase — not just websites.',
    img: 'https://res.cloudinary.com/xesr11j5/image/upload/f_auto,q_auto,w_800/v1787368464/mwijay_studio/team1.jpg',
    social: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mwijay-davie' },
      { label: 'GitHub', href: 'https://github.com/mwijay12' },
    ],
  },
  {
    id: '2',
    name: 'Automation Lab',
    role: 'AI Workflows · n8n',
    bio: 'Our automation practice designs n8n workflows and AI agents — content pipelines, research assistants, and notification bots wired into Gemini, Groq and OpenRouter.',
    img: 'https://res.cloudinary.com/xesr11j5/image/upload/f_auto,q_auto,w_800/v1787368467/mwijay_studio/team2.png',
    social: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mwijay-davie' },
      { label: 'GitHub', href: 'https://github.com/mwijay12' },
    ],
  },
  {
    id: '3',
    name: 'Design & Brand',
    role: 'UI/UX · Visual Identity',
    bio: 'From logos to full design systems, we shape how brands look and feel across every screen — clean, modern, and built to scale for African businesses.',
    img: 'https://res.cloudinary.com/xesr11j5/image/upload/f_auto,q_auto,w_800/v1787368469/mwijay_studio/team3.png',
    social: [
      { label: 'Instagram', href: 'https://instagram.com/mwijay.davie' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mwijay-davie' },
    ],
  },
];

export const values = [
  {
    title: 'Systems, not just sites',
    desc: 'We build complete digital ecosystems — dashboards, auth, databases and automation — that actually run your work.',
  },
  {
    title: 'Fast & modern by default',
    desc: 'React, Next.js, Astro, Supabase and Firebase. Fast on mobile data, secure, and easy to maintain.',
  },
  {
    title: 'Built for Africa & beyond',
    desc: 'Rooted in Dar es Salaam, we build for East African realities — then ship to clients anywhere.',
  },
  {
    title: 'Real automation',
    desc: 'We use AI and n8n to remove repetitive work, documenting the whole process as we go.',
  },
];

export const stats = [
  { k: '20+', v: 'Projects shipped' },
  { k: '4', v: 'AI posts / day automated' },
  { k: '3', v: 'Live client platforms' },
  { k: '100%', v: 'Responsive builds' },
];
