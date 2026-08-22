/**
 * Multi-Provider AI Fallback Engine for Mwijay Studio.
 *
 * Resilient Architecture:
 * 1. Groq Ultra-Fast Inference (13 Rotating Keys Pool)
 * 2. Cerebras Ultra-Fast Inference (20 Rotating Keys Pool)
 * 3. OpenRouter High-Capacity Pool (20 Rotating Keys Pool)
 * 4. Google Gemini Resilient Pool (19 Rotating Keys Pool)
 * 5. ElevenLabs Voice & Audio Engine (17 Rotating Keys Pool + Browser Web Speech Fallback)
 */

import {
  GROQ_KEYS,
  CEREBRAS_KEYS,
  OPENROUTER_KEYS,
  GEMINI_KEYS,
  ELEVENLABS_KEYS,
  getNextGroqKey,
  getNextCerebrasKey,
  getNextOpenRouterKey,
  getNextGeminiKey,
  getNextElevenLabsKey,
} from './aiKeys';
import { getStudioSystemPrompt } from '../data/studioKnowledge';
import { generatePuterTTS, generatePuterChat } from './puter';

export type GenerateOptions = {
  system?: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
  modelPreference?: 'fast' | 'creative' | 'balanced' | 'code';
};

export type GenerateResult = {
  text: string;
  provider: 'groq' | 'cerebras' | 'openrouter' | 'gemini' | 'ollama' | 'puter' | 'none';
  model?: string;
  ok: boolean;
};

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export const isAIConfigured = Boolean(
  GROQ_KEYS.length > 0 ||
    CEREBRAS_KEYS.length > 0 ||
    OPENROUTER_KEYS.length > 0 ||
    GEMINI_KEYS.length > 0 ||
    typeof window !== 'undefined'
);

function withTimeout(ms: number) {
  const controller = new AbortController();
  const id = window.setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => window.clearTimeout(id) };
}

/**
 * Strips reasoning tokens e.g. <think>...</think> and internal brainstorming chains
 * from deepseek/qwen/reasoning models, returning only the final clean output.
 */
function cleanOutput(text: string): string {
  if (!text) return '';
  let cleaned = text
    .replace(/<(think|thought)>[\s\S]*?(?:<\/\1>|$)/gi, '')
    .trim();

  // If a model outputs "1. **Deconstruct...**" or "Brainstorming:" followed by the actual content,
  // extract the actual final content.
  const thoughtsMatch = cleaned.match(/^(?:(?:\d+\.\s*)?\*\*.*(?:Drafting|Deconstruct|Brainstorm|Planning|Thought Process).*\*\*:?[\s\S]*?\n\n)([\s\S]+)$/i);
  if (thoughtsMatch && thoughtsMatch[1] && thoughtsMatch[1].trim().length > 40) {
    cleaned = thoughtsMatch[1].trim();
  }

  // Normalize ugly combinations like ####***Title*** -> ### **Title**
  cleaned = cleaned
    .replace(/^(#{1,6})\s*\*{3,}(.+?)\*{3,}:?/gm, '$1 **$2**')
    .replace(/\*{4,}/g, '**')
    .replace(/#{7,}/g, '######');

  return cleaned.trim();
}

/**
 * Strips stray decorative emojis if strict formatting is required.
 */
export function stripEmoji(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

/* ─────────────────────────────────────────── Groq API Caller */
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'qwen/qwen3.6-27b'
];

async function callGroq(
  messages: ChatMessage[],
  opts: { maxTokens?: number; temperature?: number; timeoutMs?: number }
): Promise<{ text: string; model: string } | null> {
  if (GROQ_KEYS.length === 0) return null;
  const maxAttempts = Math.min(GROQ_KEYS.length, 6);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const key = getNextGroqKey();
    if (!key) continue;
    const model = GROQ_MODELS[attempt % GROQ_MODELS.length];
    const { signal, clear } = withTimeout(opts.timeoutMs ?? 22000);

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: opts.maxTokens ?? 3500,
          temperature: opts.temperature ?? 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const raw = data?.choices?.[0]?.message?.content;
        const text = cleanOutput(raw);
        if (text) {
          clear();
          return { text, model };
        }
      }
    } catch {
      // Try next key / model in the pool
    } finally {
      clear();
    }
  }
  return null;
}

/* ─────────────────────────────────────────── Cerebras API Caller */
const CEREBRAS_MODELS = [
  'llama-3.3-70b',
  'llama3.1-8b'
];

async function callCerebras(
  messages: ChatMessage[],
  opts: { maxTokens?: number; temperature?: number; timeoutMs?: number }
): Promise<{ text: string; model: string } | null> {
  if (CEREBRAS_KEYS.length === 0) return null;
  const maxAttempts = Math.min(CEREBRAS_KEYS.length, 6);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const key = getNextCerebrasKey();
    if (!key) continue;
    const model = CEREBRAS_MODELS[attempt % CEREBRAS_MODELS.length];
    const { signal, clear } = withTimeout(opts.timeoutMs ?? 18000);

    try {
      const res = await fetch('https://api.cerebras.ai/v1/chat/completions', {
        method: 'POST',
        signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: opts.maxTokens ?? 3500,
          temperature: opts.temperature ?? 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const raw = data?.choices?.[0]?.message?.content;
        const text = cleanOutput(raw);
        if (text) {
          clear();
          return { text, model: `cerebras/${model}` };
        }
      }
    } catch {
      // Try next key in the pool
    } finally {
      clear();
    }
  }
  return null;
}

/* ─────────────────────────────────────────── OpenRouter API Caller */
const OPENROUTER_MODELS = [
  'meta-llama/llama-3.3-70b-instruct',
  'mistralai/mistral-small-24b-instruct-2501',
  'qwen/qwen-2.5-72b-instruct',
  'google/gemini-2.0-flash-exp:free'
];

async function callOpenRouter(
  messages: ChatMessage[],
  opts: { maxTokens?: number; temperature?: number; timeoutMs?: number }
): Promise<{ text: string; model: string } | null> {
  if (OPENROUTER_KEYS.length === 0) return null;
  const maxAttempts = Math.min(OPENROUTER_KEYS.length, 6);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const key = getNextOpenRouterKey();
    if (!key) continue;
    const model = OPENROUTER_MODELS[attempt % OPENROUTER_MODELS.length];
    const { signal, clear } = withTimeout(opts.timeoutMs ?? 24000);

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://mwijay.studio',
          'X-Title': 'Mwijay Studio',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: opts.maxTokens ?? 3500,
          temperature: opts.temperature ?? 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const raw = data?.choices?.[0]?.message?.content;
        const text = cleanOutput(raw);
        if (text) {
          clear();
          return { text, model };
        }
      }
    } catch {
      // Try next key in the pool
    } finally {
      clear();
    }
  }
  return null;
}

/* ─────────────────────────────────────────── Google Gemini Caller with Multi-Key Rotation */
const GEMINI_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest'
];

async function callGemini(opts: GenerateOptions): Promise<string | null> {
  if (GEMINI_KEYS.length === 0) return null;
  const maxAttempts = Math.min(GEMINI_KEYS.length, 8);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const key = getNextGeminiKey();
    if (!key) continue;
    const model = GEMINI_MODELS[attempt % GEMINI_MODELS.length];
    const { signal, clear } = withTimeout(opts.timeoutMs ?? 22000);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: opts.prompt }] }],
            ...(opts.system ? { systemInstruction: { parts: [{ text: opts.system }] } } : {}),
            generationConfig: {
              temperature: opts.temperature ?? 0.7,
              maxOutputTokens: opts.maxTokens ?? 3500,
            },
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const text = cleanOutput(data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '');
        if (text) {
          clear();
          return text;
        }
      }
    } catch {
      // Try next gemini key in the pool
    } finally {
      clear();
    }
  }
  return null;
}

/* ─────────────────────────────────────────── Master Text Generator */
export async function generate(opts: GenerateOptions): Promise<GenerateResult> {
  const messages: ChatMessage[] = [
    ...(opts.system ? [{ role: 'system' as const, content: opts.system }] : []),
    { role: 'user' as const, content: opts.prompt },
  ];

  // Swahili Detection: Route Swahili, Swahili Worship, Gospel, and East African requests to Google Gemini first!
  const isSwahili = /swahili|kiswahili|tanzania|dar es salaam|asante|habari|worship|gospel|mungu|kazi|moyo|amani|shukrani|bwana|yesu|neema|kwaya|bongofleva|singeli|taarab/i.test(
    `${opts.system || ''} ${opts.prompt || ''}`
  );

  if (isSwahili) {
    const geminiText = await callGemini(opts);
    if (geminiText) {
      return { text: geminiText, provider: 'gemini', model: 'gemini-3.6-flash', ok: true };
    }
  }

  // 1. Primary: Groq ultra-fast inference
  const groqResult = await callGroq(messages, opts);
  if (groqResult && groqResult.text) {
    return { text: groqResult.text, provider: 'groq', model: groqResult.model, ok: true };
  }

  // 2. Ultra-Fast Fallback: Cerebras Inference Pool
  const cerebrasResult = await callCerebras(messages, opts);
  if (cerebrasResult && cerebrasResult.text) {
    return { text: cerebrasResult.text, provider: 'cerebras', model: cerebrasResult.model, ok: true };
  }

  // 3. Resilient Multi-Model Pool: OpenRouter
  const orResult = await callOpenRouter(messages, opts);
  if (orResult && orResult.text) {
    return { text: orResult.text, provider: 'openrouter', model: orResult.model, ok: true };
  }

  // 4. Google Gemini Multi-Key Rotation Pool
  const geminiText = await callGemini(opts);
  if (geminiText) {
    return { text: geminiText, provider: 'gemini', model: 'gemini-3.6-flash', ok: true };
  }

  // 5. Puter.js Zero-Key Fallback Engine
  const puterResult = await generatePuterChat(opts.prompt);
  if (puterResult.ok && puterResult.text) {
    return { text: puterResult.text, provider: 'puter', model: 'puter/gemini-2.0-flash', ok: true };
  }

  return {
    text: 'Our AI engine is momentarily taking a breath. Please try asking again in a moment, or reach out directly to David on WhatsApp at +255 790 942 616.',
    provider: 'none',
    ok: false,
  };
}

/* ─────────────────────────────────────────── Studio Assistant Chatbot */
export async function generateStudioChat(
  history: ChatMessage[],
  opts?: { maxTokens?: number; temperature?: number }
): Promise<GenerateResult> {
  const messages: ChatMessage[] = [
    { role: 'system', content: getStudioSystemPrompt() },
    ...history,
  ];

  const lastUserMsg = history[history.length - 1]?.content || '';
  const isSwahili = /swahili|kiswahili|habari|mambo|vipi|shikamoo|bei|gharama|pesa|shilingi|tanzania|dar es salaam|kazi|mradi|habari yako|wimbo/i.test(
    lastUserMsg
  );

  // If user speaks Swahili in chat, respond via Gemini for native fluency
  if (isSwahili) {
    const geminiText = await callGemini({
      system: getStudioSystemPrompt(),
      prompt: lastUserMsg,
      maxTokens: opts?.maxTokens ?? 800,
      temperature: opts?.temperature ?? 0.7,
    });
    if (geminiText) {
      return { text: geminiText, provider: 'gemini', model: 'gemini-3.6-flash', ok: true };
    }
  }

  // Groq first for real-time speed
  const groqResult = await callGroq(messages, { maxTokens: opts?.maxTokens ?? 650, temperature: opts?.temperature ?? 0.7 });
  if (groqResult && groqResult.text) {
    return { text: groqResult.text, provider: 'groq', model: groqResult.model, ok: true };
  }

  // Cerebras second
  const cerebrasResult = await callCerebras(messages, { maxTokens: opts?.maxTokens ?? 650, temperature: opts?.temperature ?? 0.7 });
  if (cerebrasResult && cerebrasResult.text) {
    return { text: cerebrasResult.text, provider: 'cerebras', model: cerebrasResult.model, ok: true };
  }

  // OpenRouter fallback
  const orResult = await callOpenRouter(messages, { maxTokens: opts?.maxTokens ?? 650, temperature: opts?.temperature ?? 0.7 });
  if (orResult && orResult.text) {
    return { text: orResult.text, provider: 'openrouter', model: orResult.model, ok: true };
  }

  // Puter fallback
  const puterResult = await generatePuterChat(lastUserMsg);
  if (puterResult.ok && puterResult.text) {
    return { text: puterResult.text, provider: 'puter', model: 'puter/gemini-2.0-flash', ok: true };
  }

  return {
    text: "Hello! I am David's assistant at Mwijay Studio. We build high-performance websites (from $450), custom business systems & dashboards (from $900), and AI workflows (from $300). Feel free to message David directly on WhatsApp at +255 790 942 616 or visit /start to request a proposal!",
    provider: 'none',
    ok: true,
  };
}

/* ─────────────────────────────────────────── Voice & Speech Generator */
export const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah - Mature, Reassuring, Studio Standard (Premade)

export const STUDIO_VOICES = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Mature, Reassuring)' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George (Warm Storyteller)' },
  { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica (Playful, Warm)' },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian (Deep, Resonant)' },
  { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice (Clear, Engaging)' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel (Steady Broadcaster)' },
];

export async function generateSpeechAudioUrl(
  text: string,
  voiceId: string = DEFAULT_VOICE_ID
): Promise<{ audioUrl?: string; synthesizedViaBrowser?: boolean; provider?: string; ok: boolean }> {
  // Normalize deprecated/restricted library voice IDs to valid premade voice
  const activeVoiceId =
    !voiceId || voiceId === '21m00Tcm4TlvDq8ikWAM' ? DEFAULT_VOICE_ID : voiceId;

  // Clean markdown and bracket tags for pristine audio speech clarity
  const cleanSpeechText = text
    .replace(/\[(?:VERSE|CHORUS|BRIDGE|PRE-CHORUS|OUTRO|INTRO|HOOK).*?\]/gi, '')
    .replace(/[*_#`~>]/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .slice(0, 800)
    .trim();

  if (!cleanSpeechText) return { ok: false };

  // 1. Direct ElevenLabs rotating key pool
  const maxAttempts = Math.min(ELEVENLABS_KEYS.length, 10);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const key = getNextElevenLabsKey();
    if (!key) continue;

    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${activeVoiceId}?output_format=mp3_22050_32`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': key,
        },
        body: JSON.stringify({
          text: cleanSpeechText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        return { audioUrl, provider: 'elevenlabs', ok: true };
      }
    } catch {
      // Continue to next key
    }
  }

  // 2. Zero-Backend Puter.js Multi-Provider TTS (AWS Polly / ElevenLabs / OpenAI)
  try {
    const puterRes = await generatePuterTTS(cleanSpeechText, {
      provider: 'aws-polly',
      voice: 'Joanna',
    });
    if (puterRes.ok && puterRes.audioUrl) {
      return { audioUrl: puterRes.audioUrl, provider: puterRes.provider || 'puter', ok: true };
    }
  } catch {
    // Continue to browser Web Speech API
  }

  // 3. Zero-failure fallback: Browser Web Speech API
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      return { synthesizedViaBrowser: true, provider: 'browser-web-speech', ok: true };
    } catch {
      // Speech failed
    }
  }

  return { ok: false };
}
