export type AITool = {
  id: string;
  name: string;
  tagline: string;
  category: 'Prompts' | 'Writing' | 'Branding' | 'Text' | 'Audio' | 'Estimates';
  system: string;
  fields: { id: string; label: string; placeholder: string; type: 'input' | 'select' | 'textarea'; options?: string[] }[];
  buildPrompt: (values: Record<string, string>) => string;
  /** Shown under the result as a hint for what to do next. */
  followUp?: string;
  enableAudioVoice?: boolean;
};

/**
 * Shared instruction appended to every system prompt. Keeping formatting
 * rules in one place means every tool renders consistently — clean
 * whitespace, real headings instead of emoji bullets, and no filler text
 * before or after the actual output.
 */
const FORMAT_RULES =
  ' Output rules: Output ONLY the complete final content immediately. Never output brainstorming notes, thought process, deconstruction outlines, or planning steps. Do not use messy markdown combos like "####***" or raw hash symbols. Use clean bold titles, standard bullet lists (•), and clear paragraphs. Do not use emojis. Write out every single verse, chorus, bridge, and section completely from beginning to end without stopping halfway.';

export const aiTools: AITool[] = [
  {
    id: 'prompt-workshop',
    name: 'Prompt Workshop',
    tagline: 'Turn a rough idea into a precise, ready-to-paste prompt for any AI tool.',
    category: 'Prompts',
    system:
      'You are an expert prompt engineer who writes prompts other AI models can execute with minimal ambiguity. Given a goal and a target tool, produce one complete, ready-to-use prompt tailored to that tool\'s conventions (e.g. Midjourney parameters, Suno style tags, ChatGPT system/user structure).' +
      FORMAT_RULES,
    fields: [
      { id: 'goal', label: 'What do you want to create?', placeholder: 'e.g. A dark, moody product photo of headphones on concrete', type: 'textarea' },
      { id: 'tool', label: 'Target AI tool', placeholder: 'Select a tool', type: 'select', options: ['ChatGPT', 'Midjourney', 'DALL-E', 'Suno (music)', 'Runway (video)', 'Cursor (code)', 'Other'] },
      { id: 'style', label: 'Style or mood (optional)', placeholder: 'e.g. cinematic, minimal, vibrant, dark', type: 'input' },
    ],
    buildPrompt: (v) =>
      `Goal: ${v.goal}\nTarget tool: ${v.tool}${v.style ? `\nStyle: ${v.style}` : ''}\n\nWrite one optimized prompt for ${v.tool}. Include the structure, parameters, and quality modifiers that tool responds well to.`,
    followUp: 'Paste this directly into the target tool. Adjust specific nouns or numbers as needed.',
  },
  {
    id: 'lyric-studio',
    name: 'Lyric Studio',
    tagline: 'Write complete song lyrics in Amapiano, Gospel, Afrobeat, or your own style.',
    category: 'Writing',
    system:
      'You are a professional songwriter who writes lyrics built for real vocal performance — clear rhythm, natural breath points, and a structure a singer can perform immediately. Always output verse/pre-chorus/chorus labels and include ad-libs where the genre calls for them.' +
      FORMAT_RULES,
    fields: [
      { id: 'theme', label: 'Song theme or story', placeholder: 'e.g. Gratitude after struggle, a love letter to my city', type: 'textarea' },
      { id: 'genre', label: 'Genre / style', placeholder: 'Select a genre', type: 'select', options: ['Amapiano Gospel', 'Afro Gospel', 'Swahili Worship', 'Amapiano', 'Afrobeat', 'Pop', 'R&B/Soul', 'Custom'] },
      { id: 'mood', label: 'Mood', placeholder: 'e.g. uplifting, reflective, high-energy', type: 'input' },
      { id: 'language', label: 'Language mix', placeholder: 'e.g. Swahili-English, English only', type: 'select', options: ['Swahili-English mix', 'English only', 'Swahili only', 'Swahili with Naija flavor'] },
    ],
    buildPrompt: (v) =>
      `Theme: ${v.theme}\nGenre: ${v.genre}\nMood: ${v.mood}\nLanguage: ${v.language}\n\nWrite a complete song with verses, pre-chorus, and chorus. Make the rhythm feel authentic to the genre.`,
    followUp: 'Need this ready for Suno? Copy the lyrics into a Suno-style prompt with genre and BPM tags.',
    enableAudioVoice: true,
  },
  {
    id: 'voice-studio',
    name: 'Voice & Speech Studio',
    tagline: 'Craft natural voiceover scripts and speech performance directions.',
    category: 'Audio',
    system:
      'You are a professional voice director and audio scriptwriter. Given a topic, target audience, and vocal tone, write a captivating voice script with precise pacing cues, emphasis markings, and delivery notes formatted for studio recording.' +
      FORMAT_RULES,
    fields: [
      { id: 'topic', label: 'Script topic or purpose', placeholder: 'e.g. Commercial launch for a new East African fintech app', type: 'textarea' },
      { id: 'voice_style', label: 'Voice persona / style', placeholder: 'Select voice style', type: 'select', options: ['Confident & Professional', 'Warm & Conversational', 'High Energy & Hype', 'Cinematic & Deep Narrator', 'Calm & Reassuring'] },
      { id: 'duration', label: 'Target duration', placeholder: 'Select duration', type: 'select', options: ['15 seconds (Short promo)', '30 seconds (Standard ad)', '60 seconds (Explainer)', '2 minutes (Full presentation)'] },
      { id: 'language', label: 'Language / Dialect', placeholder: 'Select language', type: 'select', options: ['English (East African / Global)', 'English (US Neutral)', 'English (British RP)', 'Swahili (Sanifu / Modern)', 'Swahili-English Blend'] },
    ],
    buildPrompt: (v) =>
      `Topic: ${v.topic}\nStyle: ${v.voice_style}\nDuration: ${v.duration}\nLanguage: ${v.language}\n\nWrite the full spoken voiceover script, including [pause] and [emphasis] direction brackets.`,
    followUp: 'Use the Listen button below to test the narration with AI voice synthesis.',
    enableAudioVoice: true,
  },
  {
    id: 'music-sfx-generator',
    name: 'AI Audio & Music Concept Lab',
    tagline: 'Design soundscapes, BPM arrangements, and Suno/ElevenLabs audio prompts.',
    category: 'Audio',
    system:
      'You are a music producer and sound design architect. Given a mood, genre, and scene description, generate a detailed production breakdown including BPM, key, instruments, layer progression, and ready-to-use audio generation prompts formatted for Suno and ElevenLabs SFX engines.' +
      FORMAT_RULES,
    fields: [
      { id: 'vibe', label: 'Music vibe or scene atmosphere', placeholder: 'e.g. Late night coding in Dar es Salaam with rainy city vibes and jazzy chords', type: 'textarea' },
      { id: 'genre', label: 'Musical genre', placeholder: 'Select genre', type: 'select', options: ['Amapiano / Log Drum', 'Afro-House / Deep House', 'Lo-Fi Chillhop', 'Cinematic Orchestral', 'Afrobeat Groove', 'Ambient Drone & Foley'] },
      { id: 'elements', label: 'Key instruments or sounds (optional)', placeholder: 'e.g. Rhodes piano, 808 sub, shaker, ocean waves', type: 'input' },
    ],
    buildPrompt: (v) =>
      `Vibe: ${v.vibe}\nGenre: ${v.genre}${v.elements ? `\nElements: ${v.elements}` : ''}\n\nGenerate the complete audio architecture: 1) Musical Key & BPM, 2) Instrument & Arrangement Breakdown, 3) Ready-to-copy Suno Music Prompt, 4) ElevenLabs Sound Effect prompt.`,
    followUp: 'Copy the Suno prompt directly into Suno.ai or test the SFX prompt in your workflow.',
  },
  {
    id: 'project-scope-estimator',
    name: 'Project Scope & Cost Estimator',
    tagline: 'Calculate technical architecture, timeline, and cost estimate for any software idea.',
    category: 'Estimates',
    system:
      'You are a senior technical architect and pricing strategist at Mwijay Studio. Given a client idea and requirements, provide a structured project plan with recommended tech stack, architectural layers, database entities, milestone timeline, and realistic cost range benchmarked against Mwijay Studio standard rates (Websites $450+, Business Systems $900+, AI Automation $300+).' +
      FORMAT_RULES,
    fields: [
      { id: 'idea', label: 'What do you want to build?', placeholder: 'e.g. A multi-vendor booking system for safari tours in Tanzania with mobile payments and WhatsApp confirmations', type: 'textarea' },
      { id: 'scale', label: 'Expected scale', placeholder: 'Select scale', type: 'select', options: ['MVP / Early stage (1-100 users)', 'Growing Business (100-5k users)', 'High Scale Enterprise (5k+ users)'] },
      { id: 'timeline', label: 'Target timeline', placeholder: 'Select timeline', type: 'select', options: ['Flexible / Standard', 'Fast-track (Under 3 weeks)', 'Phased rollout over 2-3 months'] },
    ],
    buildPrompt: (v) =>
      `Project Idea: ${v.idea}\nTarget Scale: ${v.scale}\nTimeline Preference: ${v.timeline}\n\nGenerate a detailed scope estimate with: 1) System Architecture & Tech Stack, 2) Core Functional Modules, 3) Implementation Timeline, 4) Estimated Cost Range in USD based on Mwijay Studio tiers, 5) Recommended First MVP Step.`,
    followUp: 'Ready to build this? Copy this summary into our project proposal form at /start.',
  },
  {
    id: 'novel-outliner',
    name: 'Novel Outliner',
    tagline: 'Generate a chapter-by-chapter outline with character arcs and structure.',
    category: 'Writing',
    system:
      'You are a professional story editor who builds chapter-by-chapter outlines with clear escalation, character development, and a coherent theme. Every chapter entry needs a title, a two-to-three sentence summary, and the key character or plot development it delivers.' +
      FORMAT_RULES,
    fields: [
      { id: 'concept', label: 'Story concept or logline', placeholder: 'e.g. A young Tanzanian developer discovers AI can predict the future, but the predictions keep coming true in unexpected ways', type: 'textarea' },
      { id: 'genre', label: 'Genre', placeholder: 'Select a genre', type: 'select', options: ['Literary Fiction', 'Thriller', 'Sci-Fi', 'Romance', 'Contemporary', 'Magical Realism', 'Young Adult', 'Historical'] },
      { id: 'length', label: 'Target length', placeholder: 'Select length', type: 'select', options: ['Novella (~30k words)', 'Short novel (~50k words)', 'Standard novel (~70k words)', 'Epic (~100k+ words)'] },
      { id: 'characters', label: 'Main characters (optional)', placeholder: 'e.g. Amara — ambitious developer, her grandmother — keeper of old wisdom', type: 'textarea' },
    ],
    buildPrompt: (v) =>
      `Concept: ${v.concept}\nGenre: ${v.genre}\nLength: ${v.length}${v.characters ? `\nCharacters: ${v.characters}` : ''}\n\nCreate a detailed chapter-by-chapter outline with an opening hook and a satisfying resolution.`,
    followUp: 'Save this outline, then use it as the source material for drafting individual chapters.',
  },
  {
    id: 'brand-namer',
    name: 'Brand Namer',
    tagline: 'Brainstorm brand names with rationale, taglines, and domain ideas.',
    category: 'Branding',
    system:
      'You are a naming strategist who generates distinctive, memorable brand names that are plausible to register as a domain. For each name, explain in one sentence why it works, propose a short tagline, and suggest a domain or handle. Always return exactly 8 options as a numbered list.' +
      FORMAT_RULES,
    fields: [
      { id: 'industry', label: 'Industry / what the business does', placeholder: 'e.g. AI automation agency in East Africa', type: 'textarea' },
      { id: 'feeling', label: 'Feeling or vibe', placeholder: 'e.g. modern, trustworthy, playful, premium', type: 'input' },
      { id: 'constraints', label: 'Constraints (optional)', placeholder: 'e.g. must work in Swahili, avoid tech-sounding names', type: 'input' },
    ],
    buildPrompt: (v) =>
      `Industry: ${v.industry}\nFeeling: ${v.feeling}${v.constraints ? `\nConstraints: ${v.constraints}` : ''}\n\nGenerate 8 brand name options with rationale, tagline, and domain suggestions.`,
    followUp: 'Check each candidate name against a domain registrar before committing.',
  },
  {
    id: 'text-polisher',
    name: 'Text Polisher',
    tagline: 'Clean up grammar, tone, and flow while keeping your voice intact.',
    category: 'Text',
    system:
      'You are a senior copy editor. You polish text for clarity, correctness, and flow while preserving the author\'s voice and intent. Do not add new claims or change the meaning. Return only the polished text with no notes about what changed.' +
      FORMAT_RULES,
    fields: [
      { id: 'text', label: 'Paste your text', placeholder: 'Paste the text you want polished...', type: 'textarea' },
      { id: 'tone', label: 'Target tone', placeholder: 'Select tone', type: 'select', options: ['Professional', 'Casual', 'Academic', 'Marketing', 'Technical', 'Storytelling'] },
    ],
    buildPrompt: (v) => `Tone: ${v.tone}\n\nPolish the following text:\n\n${v.text}`,
    followUp: 'Compare against your original before publishing — always keep the version that sounds most like you.',
  },
  {
    id: 'idea-machine',
    name: 'Idea Machine',
    tagline: 'Generate business or product ideas matched to your actual skills.',
    category: 'Branding',
    system:
      'You are a pragmatic startup advisor. You generate specific, actionable ideas — never vague suggestions. Each idea must include a name, a one-line pitch, the target audience, how it makes money, and what the minimum viable version looks like. Return exactly 5 ideas as a numbered list.' +
      FORMAT_RULES,
    fields: [
      { id: 'skills', label: 'Your skills', placeholder: 'e.g. React, Firebase, n8n, design, music production', type: 'textarea' },
      { id: 'market', label: 'Target market', placeholder: 'e.g. East African SMEs, Tanzanian musicians, remote workers', type: 'input' },
      { id: 'type', label: 'What kind of ideas?', placeholder: 'Select type', type: 'select', options: ['SaaS product', 'Service business', 'Side project', 'Content platform', 'Marketplace', 'Any'] },
    ],
    buildPrompt: (v) =>
      `Skills: ${v.skills}\nTarget market: ${v.market}\nType: ${v.type}\n\nGenerate 5 business or project ideas tailored to these skills and market.`,
    followUp: 'Pick the idea with the smallest MVP scope and validate it with 5 real conversations before building.',
  },
];

export function getTool(id: string) {
  return aiTools.find((t) => t.id === id);
}
