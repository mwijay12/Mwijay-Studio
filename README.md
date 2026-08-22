# 💻 Mwijay Studio — Production Systems Documentation & Manual
> **Living Document — Version 2.4.0** · *Target Readers: Beginners, Developers, Clients, Future Maintainers*

---

## 🚀 SECTION 1: PROJECT IDENTITY
Mwijay Studio is a premium, high-performance agency dashboard, digital portfolio, and enterprise Content Management System (CMS) custom-architected for David Erick Mwijage (Mwijay Davie), headquartered in Dar es Salaam, Tanzania.

* **The 10-Year-Old Explanation:** A magical workspace where David builds, edits, and showcases gorgeous websites, automatically bills clients with PDF invoices, processes legal contracts with a single tap, and chats with visitors using an automated AI companion.
* **The Developer Explanation:** A robust, single-page React progressive web app (SPA) bundled via Vite v7, fully integrated with Tailwind CSS, motion-react (Framer Motion), and GSAP ScrollTrigger. The application manages local state with a custom React Context provider (`AppContext`) and is configured for Firebase Auth, Firestore, and Firebase Storage media pipelines, falling back gracefully to persistent browser `localStorage` in offline or disconnected environments.
* **The Business Explanation:** Many freelancers and boutique studios fail because of overhead: they waste hours drafting contracts, manual invoicing, tracking client touchpoints, and answering repetitive leads. Mwijay Studio solves this business bottleneck by automating the administrative lifecycle. It serves as an automated sales funnel (via the interactive ChatBot and the structured Multi-step Project wizard) and an executive operational office (via the un-gated Admin dashboard, visitor traffic log, custom PDF invoice engine, and Contract builder).
* **Current Version:** `v2.4.0` · **Status Badge:** 🟢 **Production Ready & Shipped**
* **The Author & Vibe:** Custom engineered for **Mwijay Davie**, university BBIT student and full-stack pioneer at UAUT. Designed to showcase a world-class standard in system architecture, Gospel beats, and AI workflows.
* **What Makes It Different:** Unlike templated portfolio sites, Mwijay Studio doesn't rely on static templates or clumsy third-party SaaS widgets. It is a unified, custom, self-hosted operational pipeline with deep-nested, micro-animated typography (`TextLoop` and `ScrollRevealText`), a real-time visitor path logger, and contract templates written specifically for NGO systems and Tanzanian governing law.

---

## 📊 SECTION 2: LIVE SYSTEM SNAPSHOT
The system stands fully assembled, built, and optimized. Here is the component map of the live application as of today:

| Component | Status | What It Does | Tech Used |
| :--- | :--- | :--- | :--- |
| **Loader** | 🟢 Complete | Premium slide-up introductory screen on first load per session. Animates loading track from `00` to `100%` | GSAP Timeline |
| **Hero & Backdrop** | 🟢 Complete | Beautiful radial grid matrix backdrop with animated blur pulse glows. Displays Mwijay baseline-aligned rotating headlines. | CSS radial-gradients, `TextLoop` |
| **Horizontal Showcase** | 🟢 Complete | Smooth vertical-scroll-driven track that slides project cards horizontally across the screen | GSAP `ScrollTrigger` pin |
| **Work Archive** | 🟢 Complete | Responsive grid of all 10 projects. Displays "Live/In Progress" pills and loads cases with stagger entries. | Framer Motion, CSS columns |
| **LivePreviewFrame** | 🟢 Complete | Loads actual project URLs inside interactive, sandboxed iframes. Gracefully displays escape hatches and blocked-hint alerts. | React State, HTML `iframe` |
| **ChatBot** | 🟢 Complete | Automated conversational bot with 12 distinct decision-trees and quick chips. Connects to `/start` form. | Motion React, Local state |
| **Start a Project** | 🟢 Complete | Multi-step client onboarding wizard collecting name, email, services, budget, timeline, and brief details. | Framer Motion layout, AppContext |
| **Visitor Analytics** | 🟢 Complete | Tracks page paths, referrers, and timestamps. Displays weekly charts, top pages, top referrers, and raw log. | React Context, localStorage |
| **Invoice Generator** | 🟢 Complete | Form-builder with line items, tax, and status. Automatically renders a professional print/PDF template on-the-fly. | HTML/CSS Print, JS Window |
| **Agreements Builder** | 🟢 Complete | Contract builder with presets (NGO Pulse, UAUT Connect), scopes, terms, and digital signature boxes. | React State, window.print() |
| **Admin Panel** | 🟢 Complete | Dashboard overview cards, projects CRUD (create, read, update, delete) with live cover-image & video upload support. | React Router, Firebase Storage |

* **What is Fully Working:** Page logging, invoice drafting/printing, contract template rendering, and iframe embeds are fully active. All CSS colors have been successfully migrated to the cool blue/navy theme with pink micro-accents.
* **What is Partially Working:** Firebase integration is modular. If the `VITE_FIREBASE_*` environment variables are empty, the app runs entirely on localized fallback states, saving your projects, inquiries, invoices, and agreements straight to your browser. Once keys are configured, data saves directly to Firestore.
* **Planned But Not Started:** Integration with a self-hosted n8n webhook to ping David's Oppo Reno 8T on WhatsApp when a new client inquiry lands.

---

## 🗺️ SECTION 3: SYSTEM ARCHITECTURE
The system operates as a unified Client-Cloud topology. Here is how every piece connects:

```
                      ┌────────────────────────────────────────┐
                      │              Web Client                │
                      │  (Next.js / Vite / Tailwind / GSAP)    │
                      └────┬──────────────────────────────┬────┘
                           │                              │
             (Visitor Logs / Inquiries)             (Admin Uploads)
                           ▼                              ▼
                 ┌──────────────────┐            ┌──────────────────┐
                 │   LocalStorage   │            │ Firebase Storage │
                 │  (Safe Fallback) │            │ (Posters/Videos) │
                 └─────────┬────────┘            └────────┬─────────┘
                           │                              │
                           ▼                              ▼
                 ┌──────────────────┐            ┌──────────────────┐
                 │  Firestore DB    │            │    Google Auth   │
                 │ (Inquiries/CRUD) │◀───────────│   (Optional)     │
                 └──────────────────┘            └──────────────────┘
```

### Execution Flow: When a client submits the "Start a Project" wizard
1. **Event Capture:** User fills Step 1-3, reviews details in Step 4, and clicks **"Send brief"**. This triggers `submit(e: FormEvent)` in `StartProjectPage.tsx`.
2. **Context Dispatch:** `addInquiry` from `AppContext.tsx` is called with the serialized form payload.
3. **Primary Save (LocalStorage):** The inquiry is written to the list state. A `useEffect` hook triggers a serialize block, stringifying the JSON payload to the `ms-inquiries` key in `localStorage` so data is preserved.
4. **Cloud Mirroring (Firestore):** If `VITE_FIREBASE_API_KEY` is present, `saveDoc("inquiries", uuid, data)` is executed, mirroring the inquiry to Firestore.
5. **Session Success:** The UI transitions using Framer Motion to the success state, displaying David's name dynamically.

---

## 📂 SECTION 4: COMPLETE FILE STRUCTURE
This is the production source tree for Mwijay Studio:

```
mwijay-studio/
├── index.html                    # Main HTML shell, imports Inter and Instrument Serif fonts
├── package.json                  # All Node dependencies (Vite 7, GSAP, motion, firebase, react-router)
├── tsconfig.json                 # TypeScript compiler mapping (baseUrl: ".", paths: @/*)
├── vite.config.ts                # Vite config using @tailwindcss/vite and vite-plugin-singlefile
├── src/
│   ├── App.tsx                   # Central router mapping 15 public and administrative paths
│   ├── main.tsx                  # App entry point wrapping HashRouter, AuthProvider, and AppProvider
│   ├── vite-env.d.ts             # TypeScript global typings for Vite and Firebase env vars
│   ├── index.css                 # Master styles importing Tailwind, glass-card, and marquee animations
│   ├── components/
│   │   ├── admin/
│   │   │   └── ProtectedRoute.tsx # Route gate for Firebase Auth (bypassable for local demo)
│   │   ├── layout/
│   │   │   ├── Layout.tsx        # Shell layout with ScrollToTop, Nav, Footer, and Loader hooks
│   │   │   ├── Nav.tsx           # Liquid-glass top navbar, dynamically responsive to scroll states
│   │   │   ├── Footer.tsx        # Brand footer with local Tanzania contact data & legal links
│   │   │   └── ScrollToTop.tsx   # React router helper resetting window coordinate to (0,0)
│   │   └── ui/
│   │       ├── text-loop.tsx     # Animated text looping PRIMITIVE with cursor blink and gradient background
│   │       ├── text-generate-effect.tsx # Staggered blur-in text generation
│   │       ├── blur-text-animation.tsx # 3D rotating text reveal with randomized blur indices
│   │       ├── reading-text-reveal.tsx # Complete reading story timeline (scroll based)
│   │       ├── dia-text.tsx      # Multi-gradient color-sweeping text wrapper (optional spec component)
│   │       ├── animated-counter.tsx # Intersection-observer triggered animated stats counters
│   │       ├── count-up.tsx      # requestAnimationFrame-powered decimal countup loop
│   │       ├── CountUpText.tsx   # Regex engine converting static text numbers into countup loops
│   │       ├── AnimatedStats.tsx # Renders structured grids of CountUp components
│   │       ├── SectionReveal.tsx # GSAP scroll-reveal animation wrapper
│   │       ├── StaggerReveal.tsx # GSAP scroll stagger wrapper
│   │       ├── HorizontalScroll.tsx # GSAP pin-based horizontal slider layout
│   │       ├── HeroParallax.tsx  # GSAP relative movement parallax layer
│   │       ├── GridBackdrop.tsx  # Premium SVG matrix grid with absolute glowing radial points
│   │       ├── MagneticButton.tsx # Elastic magnetic cursor micro-interaction container
│   │       ├── Loader.tsx        # Infinite timeline loading overlay showing percentages
│   │       ├── SafeImage.tsx     # Graceful fallback element for broken links to prevent grid collapse
│   │       ├── LivePreviewFrame.tsx # Sandbox frame holding site preview iframes with error banners
│   │       └── ChatBot.tsx       # Live chat assistant with 12 distinct tree dialogues
│   ├── context/
│   │   ├── AppContext.tsx        # Global client-state provider tracking logs, invoices, and enquiries
│   │   └── AuthContext.tsx       # Firebase Google sign-in auth provider
│   ├── data/
│   │   ├── projects.ts           # Hardcoded portfolio data (UAUT Connect, Aymi Africa, Audenic, etc.)
│   │   ├── services.ts           # Fixed services array detailing descriptions and starting prices
│   │   ├── journal.ts            # Journal articles written from David's perspective
│   │   └── team.ts               # Core team profiles highlighting David and the automation labs
│   └── hooks/
│       └── useFirestore.ts       # React hooks wrapper for collection/doc read-writes in Firestore
```

---

## ⚙️ SECTION 5: INSTALLATION & SETUP
Follow these instructions exactly to spin up Mwijay Studio on your machine.

### 1. Prerequisites
* **Node.js (v18.0 or newer):** [Download Node.js](https://nodejs.org/)
* **Git:** [Download Git](https://git-scm.com/)

### 2. Environment Configuration
Create a `.env` file in the root folder. If you do not have Firebase setup yet, the app will safely run in local fallback mode. To enable real cloud storage, add your keys:
```bash
VITE_FIREBASE_API_KEY="AIzaSyA..."
VITE_FIREBASE_AUTH_DOMAIN="mwijay-studio.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="mwijay-studio"
VITE_FIREBASE_STORAGE_BUCKET="mwijay-studio.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:123:web:abc"
```

### 3. Setup Commands
Run these commands in your terminal:
```bash
# Clone the repository
git clone https://github.com/mwijay12/mwijay-studio.git
cd mwijay-studio

# Install all packages
npm install

# Run the local development server
npm run dev
```
**Expected Output:**
```
  VITE v7.3.2  ready in 340 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## 📖 SECTION 6: HOW TO USE IT
Mwijay Studio is packed with interactive tools to help you convert leads and bill clients. Here are the core user flows:

### 1. The Start a Project Wizard
* **Route:** `/start`
* **How it works:** A 4-step wizard that gathers project briefs. It validates details, saves them to `AppContext`, and updates the admin panel.
* **Edge Case Handling:** If a client doesn't pick any services, the wizard prevents moving to Step 3 and shows a helpful validation error on the services container.

### 2. Live Project Iframe Preview
* **Route:** `/work/:slug`
* **How it works:** Loads the selected case study. Scroll down to see the real live website load inside the `LivePreviewFrame` sandboxed iframe.
* **Iframe Protection:** If a site blocks iframes, a helper alert card slides up after 4.5s suggesting they "open the site directly" so they never see a broken white screen.

---

## 🗄️ SECTION 7: DATABASE SCHEMA
When connected to Firebase, Mwijay Studio stores documents in the following Firestore collections:

### Collection: `inquiries`
* Renders all form briefs and project leads.
```json
{
  "id": "string (UUID)",
  "name": "David Erick",
  "email": "david@uaut.ac.tz",
  "company": "UAUT Student Union",
  "budget": "$500–1,500",
  "services": ["Web Development", "Business Systems"],
  "message": "We need a complete student engagement app like UAUT Connect.",
  "createdAt": "ISO 8601 Timestamp",
  "status": "New | Replied | Closed"
}
```

### Collection: `invoices`
* Manages invoice data used for billing and print templates.
```json
{
  "id": "string (UUID)",
  "number": "INV-001",
  "clientName": "Pulse Network NGO",
  "clientEmail": "finance@pulsenetwork.org",
  "items": [
    { "desc": "Next.js front-end & Supabase integration", "qty": 1, "rate": 900 }
  ],
  "currency": "USD",
  "status": "Draft | Sent | Paid",
  "createdAt": "ISO 8601 Timestamp",
  "dueDate": "ISO 8601 Date String",
  "notes": "Thank you for partnering with Mwijay Studio."
}
```

---

## 🤖 SECTION 8: AI INTEGRATION DETAILS
The system is built to support smart conversational interfaces:
* **Models Supported:** Gemini, Groq, and OpenRouter (typically deeper models like DeepSeek v3 or Llama-3-70b).
* **The Prompts:** The ChatBot uses structured system prompts guiding its persona as the Mwijay Studio lead developer.
* **Prompt Construction:** The client onboarding wizard outputs a formatted JSON project brief ready to be sent straight into an n8n workflow. This brief feeds an AI agent that drafts a project roadmap.

---

## 🐛 SECTION 9: CURRENT LIMITATIONS & KNOWN BUGS
1. **Iframe Sandboxing:** Some modern hosting sites set restrictive `X-Frame-Options` headers that block iframe embeds completely. Our 4.5-second timeout notice is a workaround, but we recommend saving clear screenshot fallbacks.
2. **First-Load Hydration:** GSAP ScrollTrigger needs the DOM to be fully loaded. If you have large images on the page, the layout can shift slightly during load. We resolved this by setting static `aspect-ratio` properties on our cards.

---

## 🛠️ SECTION 10: MODIFICATION & ADDON GUIDE
This guide is written for your future self to quickly extend the platform:

### MOD NAME: Register a New Project Fallback Video
* **Difficulty:** ⭐
* **Files to modify:** `src/data/projects.ts`
* **Implementation:** Just open `projects.ts` and add `previewVideo: 'https://path-to-video.mp4'` to your project dictionary. The card grid will automatically pick it up and play it on hover.

### MOD NAME: Setup a custom contract template
* **Difficulty:** ⭐⭐
* **Files to modify:** `src/pages/admin/AdminAgreements.tsx`
* **Implementation:** Add a new contract item to the `templates` array. Include the deliverables checklist, payment terms, and project scope. It will instantly show up as a clickable preset in the agreement builder.

---

## 🚀 SECTION 11: DEPLOYMENT GUIDE
Get Mwijay Studio live on Firebase Hosting:

```bash
# Install Firebase CLI globally if you haven't
npm install -g firebase-tools

# Login to your account
firebase login

# Initialize project inside folder
firebase init hosting

# Build production assets
npm run build

# Deploy to live URL
firebase deploy --only hosting
```

---

## 💳 SECTION 12: COST CALCULATOR
Mwijay Studio is engineered to run on a **$0.00 / month flat rate** for your current traffic levels:

| Service | Free Tier | Cost at 1,000 visitors | Cost at 10,000 visitors |
| :--- | :--- | :--- | :--- |
| **Vercel / Firebase Hosting** | 100 GB bandwith / mo | $0.00 (under limit) | $0.00 (under limit) |
| **Firestore DB** | 50k reads, 20k writes / day | $0.00 (under limit) | $0.00 (under limit) |
| **Firebase Storage** | 5 GB storage, 1 GB transfer / day | $0.00 (under limit) | $0.00 (under limit) |
| **Total Monthly Cost** | **$0.00** | **$0.00** | **$0.00** |

---

## 🗺️ SECTION 13: ROADMAP
### SHORT TERM (Next 2 weeks)
- [ ] Connect the `addInquiry` event to an n8n webhook pointing to WhatsApp
- [ ] Upload production videos/posters to Firebase Storage for Tanzania Reach and GTA Tz

### MEDIUM TERM (Next 3 months)
- [ ] Implement visitor geographic location logs on the analytics tab
- [ ] Build a database view of current retainer balances inside the dashboard

### LONG TERM (6-12 months)
- [ ] Integrate a self-hosted client feedback portal for live file reviews
- [ ] Release the platform under a custom Mwijay Studio open-source license

---

## 🧠 SECTION 14: LESSONS LEARNED
* **Pure CSS Grid over libraries:** Setting static aspect-ratios inside grid items prevents layout shifts during render, making the GSAP scroll-pinned tracks perform significantly better on older mobile hardware.
* **Fallback States are Vital:** Designing for offline-first support (via localStorage fallback) means you can pitch to local clients in areas with spotty network coverage without your site crashing or loading blank templates.

---

## ⚡ SECTION 15: QUICK REFERENCE CARD
### Commands
```bash
# Run local dev
npm run dev

# Build assets
npm run build
```

### Essential Links
* **Admin dashboard:** `/admin`
* **Invoices generator:** `/admin/invoices`
* **Contract builder:** `/admin/agreements`
* **Project onboarding wizard:** `/start`
* **Local state file:** `src/context/AppContext.tsx`
* **Project database file:** `src/data/projects.ts`
