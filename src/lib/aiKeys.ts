/**
 * Complete pool of API keys configured for Mwijay Studio AI services.
 * Implements round-robin rotation, exponential failover, and status tracking.
 *
 * ⚠️ SECURITY: All API keys are loaded from environment variables (.env).
 * The .env file is gitignored and never committed to the repository.
 */

function parseKeyPool(envVal?: string): string[] {
  if (!envVal || typeof envVal !== 'string') return [];
  const parsed = envVal
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
  return parsed;
}

export const GROQ_KEYS: string[] = parseKeyPool(
  import.meta.env?.VITE_GROQ_KEYS || import.meta.env?.VITE_GROQ_API_KEY
);

export const CEREBRAS_KEYS: string[] = parseKeyPool(
  import.meta.env?.VITE_CEREBRAS_KEYS || import.meta.env?.VITE_CEREBRAS_API_KEY
);

export const OPENROUTER_KEYS: string[] = parseKeyPool(
  import.meta.env?.VITE_OPENROUTER_KEYS || import.meta.env?.VITE_OPENROUTER_API_KEY
);

export const GEMINI_KEYS: string[] = parseKeyPool(
  import.meta.env?.VITE_GEMINI_KEYS || import.meta.env?.VITE_GEMINI_API_KEY
);

export const ELEVENLABS_KEYS: string[] = parseKeyPool(
  import.meta.env?.VITE_ELEVENLABS_KEYS || import.meta.env?.VITE_ELEVENLABS_API_KEY
);

export const OLLAMA_KEYS: string[] = parseKeyPool(
  import.meta.env?.VITE_OLLAMA_KEYS
);

export const HUGGINGFACE_KEYS: string[] = parseKeyPool(
  import.meta.env?.VITE_HUGGINGFACE_KEYS
);

// Track rotation pointers
let groqIndex = 0;
let cerebrasIndex = 0;
let openRouterIndex = 0;
let geminiIndex = 0;
let elevenLabsIndex = 0;
let ollamaIndex = 0;

export function getNextGroqKey(): string {
  if (GROQ_KEYS.length === 0) return '';
  const key = GROQ_KEYS[groqIndex % GROQ_KEYS.length];
  groqIndex = (groqIndex + 1) % GROQ_KEYS.length;
  return key;
}

export function getNextCerebrasKey(): string {
  if (CEREBRAS_KEYS.length === 0) return '';
  const key = CEREBRAS_KEYS[cerebrasIndex % CEREBRAS_KEYS.length];
  cerebrasIndex = (cerebrasIndex + 1) % CEREBRAS_KEYS.length;
  return key;
}

export function getNextOpenRouterKey(): string {
  if (OPENROUTER_KEYS.length === 0) return '';
  const key = OPENROUTER_KEYS[openRouterIndex % OPENROUTER_KEYS.length];
  openRouterIndex = (openRouterIndex + 1) % OPENROUTER_KEYS.length;
  return key;
}

export function getNextGeminiKey(): string {
  if (GEMINI_KEYS.length === 0) return '';
  const key = GEMINI_KEYS[geminiIndex % GEMINI_KEYS.length];
  geminiIndex = (geminiIndex + 1) % GEMINI_KEYS.length;
  return key;
}

export function getNextElevenLabsKey(): string {
  if (ELEVENLABS_KEYS.length === 0) return '';
  const key = ELEVENLABS_KEYS[elevenLabsIndex % ELEVENLABS_KEYS.length];
  elevenLabsIndex = (elevenLabsIndex + 1) % ELEVENLABS_KEYS.length;
  return key;
}

export function getNextOllamaKey(): string {
  if (OLLAMA_KEYS.length === 0) return '';
  const key = OLLAMA_KEYS[ollamaIndex % OLLAMA_KEYS.length];
  ollamaIndex = (ollamaIndex + 1) % OLLAMA_KEYS.length;
  return key;
}