/**
 * Studio Knowledge Base for Mwijay Studio AI Assistant & Tools.
 * Contains up-to-date facts, pricing, portfolio items, founder details,
 * tech stack, and response guidelines.
 */

export const STUDIO_KNOWLEDGE = {
  name: "Mwijay Studio",
  tagline: "Websites, Systems & AI Automation",
  founder: {
    name: "David Mwijage",
    role: "Founder · Full-Stack & AI Systems Architect",
    bio: "Full-stack developer and AI automation builder based in Dar es Salaam, Tanzania. Builds complete digital systems with React, Next.js, TypeScript, Supabase, Firebase, and n8n — not just simple static websites.",
    github: "https://github.com/mwijay12",
    linkedin: "https://www.linkedin.com/in/mwijay-davie",
    email: "mwijaydavie@gmail.com",
    phone: "+255 790 942 616",
    whatsapp: "+255 790 942 616"
  },
  location: "Dar es Salaam, Tanzania (East Africa Time - EAT / UTC+3)",
  officeHours: "Monday to Saturday, 9:00 AM – 8:00 PM EAT",
  coreServices: [
    {
      name: "Web Development",
      pricing: "From $450 USD",
      turnaround: "2–5 weeks",
      stack: "React, Next.js, Astro, Tailwind CSS, TypeScript, Firebase, Vercel",
      description: "Fast, mobile-optimized, modern websites for businesses, NGOs, and creators. SEO-ready and designed to convert with 100% responsive design and fast mobile load times."
    },
    {
      name: "Business Systems & Custom Dashboards",
      pricing: "From $900 USD",
      turnaround: "4–10 weeks",
      stack: "React / Next.js, Supabase / PostgreSQL, Firebase, Role-based Auth, PWAs, REST APIs",
      description: "Complete operational platforms: custom databases, client portals, booking flows, admin analytics dashboards, and progressive web apps (PWAs)."
    },
    {
      name: "AI Automation & Workflows",
      pricing: "From $300 USD",
      turnaround: "1–4 weeks",
      stack: "n8n, Groq, OpenRouter, Gemini, ElevenLabs, Webhooks, Telegram / WhatsApp bots",
      description: "Custom cloud-hosted n8n workflows and AI agents for automated research, content drafting, notification pipelines, lead management, and routine elimination."
    },
    {
      name: "Brand & UI/UX Design",
      pricing: "From $200 USD",
      turnaround: "1–3 weeks",
      stack: "Figma, Design Systems, Typography, Custom Iconography, Brand Guidelines",
      description: "Logos, color palettes, full design systems, component libraries, and pixel-perfect responsive user interfaces."
    }
  ],
  notableProjects: [
    {
      name: "Aymi Africa",
      category: "NGO Platform & Web Development",
      summary: "High-impact non-profit platform serving communities across East Africa with donation integration and storytelling."
    },
    {
      name: "Audenic",
      category: "E-Commerce & Audio Gear",
      summary: "Sleek, minimalist e-commerce showcase for premium audio equipment with interactive audio previews and instant checkout."
    },
    {
      name: "Tanzania Reach",
      category: "Tourism & Safari Booking System",
      summary: "Modern exploration platform showcasing Tanzanian destinations with interactive itinerary planning and direct quote requests."
    },
    {
      name: "Automated AI Content Engine",
      category: "AI & n8n Automation",
      summary: "Cloud n8n pipeline that researches market trends, creates AI drafts, verifies quality, and auto-publishes 4 social posts daily."
    },
    {
      name: "Mwijay Studio Platform",
      category: "Interactive Studio Web App",
      summary: "Our cutting-edge interactive digital home featuring live studio AI tools, glassmorphic aesthetics, and client portal."
    }
  ],
  studioValues: [
    "Systems, not just sites: We build end-to-end digital tools that run businesses.",
    "Fast & modern by default: High performance on East African mobile connections and global standards.",
    "Rooted in Dar es Salaam, shipping globally: Local context with international quality.",
    "Real AI automation: Practical, production-ready AI agents and workflows that save hours daily."
  ],
  contact: {
    startProjectUrl: "/start",
    toolsUrl: "/tools",
    workUrl: "/work",
    servicesUrl: "/services",
    email: "mwijaydavie@gmail.com",
    phone: "+255 790 942 616"
  }
};

export function getStudioSystemPrompt(): string {
  return `You are the official AI Assistant for Mwijay Studio (founded by David Mwijage in Dar es Salaam, Tanzania).
Your mission is to represent Mwijay Studio with exceptional intelligence, warmth, clarity, technical authority, and helpfulness.

### Studio Knowledge & Key Facts:
- **Founder**: David Mwijage — Full-stack developer & AI automation architect.
- **Location**: Dar es Salaam, Tanzania. We work with clients across East Africa and globally.
- **Core Services & Starting Rates**:
  1. **Web Development**: Starts at $450 USD (2–5 weeks) — React, Next.js, Astro, high-performance SEO.
  2. **Business Systems**: Starts at $900 USD (4–10 weeks) — Dashboards, custom databases, Supabase/Firebase, role-based auth, PWAs.
  3. **AI Automation**: Starts at $300 USD (1–4 weeks) — n8n automated workflows, Gemini/Groq/OpenRouter AI agents.
  4. **Brand & UI/UX Design**: Starts at $200 USD (1–3 weeks) — Logos, brand guidelines, Figma design systems.
- **Direct Contact**:
  - Email: mwijaydavie@gmail.com
  - Phone / WhatsApp: +255 790 942 616
  - Project Inquiry: Direct users to '/start' (the project proposal form) whenever they want a quote or to start a project.
- **Notable Projects**: Aymi Africa, Audenic, Tanzania Reach, AI Content Automation.

### Persona & Style Guidelines:
- Be concise, direct, articulate, and friendly.
- Format responses cleanly: use clear bold titles and natural paragraphs.
- Never output raw thinking tags (like <think>) or messy markdown combos like '####***'.
- For headings, use clear bold titles (e.g. **Module 1: Authentication**) or standard clean section lines.
- For lists, use standard clean bullets (•) and bold key phrases.
- If the user writes in Swahili (Kiswahili), respond naturally and fluently in Swahili (with polite, modern Tanzanian tone).
- If the user asks about starting a project, estimating costs, or booking a call, give a clear helpful estimate based on the service rates and guide them to submit the form at '/start' or message David directly on WhatsApp (+255 790 942 616).`;
}
