/**
 * Puter.js Zero-Backend AI Integration Layer for Mwijay Studio.
 *
 * Provides:
 * 1. Zero-key multi-provider Text-to-Speech (AWS Polly, ElevenLabs, OpenAI, Gemini, xAI)
 * 2. Voice enumeration & audio playback with automatic fallback
 * 3. Zero-key LLM fallback (Claude 3.5 Sonnet, GPT-4o, Gemini 2.0, DeepSeek)
 * 4. Zero-key image generation
 */

export type PuterTTSProvider = 'aws-polly' | 'openai' | 'elevenlabs' | 'gemini' | 'xai';

export interface PuterVoice {
  id: string;
  name: string;
  language?: {
    code: string;
    name: string;
  };
}

/**
 * Ensures the Puter.js v2 SDK is loaded in the browser.
 */
export async function ensurePuterLoaded(timeoutMs = 6000): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (window.puter?.ai?.txt2speech) return true;

  return new Promise((resolve) => {
    // Check if script is already present
    const existing = document.querySelector('script[src*="js.puter.com"]');
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://js.puter.com/v2/';
      script.async = true;
      document.head.appendChild(script);
    }

    const start = Date.now();
    const interval = setInterval(() => {
      if (window.puter?.ai?.txt2speech) {
        clearInterval(interval);
        resolve(true);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        resolve(Boolean(window.puter?.ai?.txt2speech));
      }
    }, 100);
  });
}

/**
 * Generates and returns speech audio via Puter.js multi-provider engine.
 * Supports: AWS Polly, ElevenLabs, OpenAI, Gemini, xAI without requiring developer API keys.
 */
export async function generatePuterTTS(
  text: string,
  options?: {
    provider?: PuterTTSProvider;
    voice?: string;
    language?: string;
  }
): Promise<{
  audioUrl?: string;
  audioElement?: HTMLAudioElement;
  provider?: string;
  ok: boolean;
}> {
  try {
    const isReady = await ensurePuterLoaded();
    if (!isReady || !window.puter?.ai?.txt2speech) {
      return { ok: false };
    }

    // Clean text for optimal TTS clarity
    const cleanText = text
      .replace(/\[(?:VERSE|CHORUS|BRIDGE|PRE-CHORUS|OUTRO|INTRO|HOOK|SECTION).*?\]/gi, '')
      .replace(/[*_#`~>]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .slice(0, 1000)
      .trim();

    if (!cleanText) return { ok: false };

    const provider = options?.provider || 'aws-polly';
    const audioElement = await window.puter.ai.txt2speech(cleanText, {
      provider,
      ...(options?.voice ? { voice: options.voice } : {}),
      ...(options?.language ? { language: options.language } : {}),
    });

    if (audioElement && audioElement.src) {
      return {
        audioUrl: audioElement.src,
        audioElement,
        provider: `puter/${provider}`,
        ok: true,
      };
    }

    if (audioElement) {
      return {
        audioElement,
        provider: `puter/${provider}`,
        ok: true,
      };
    }

    return { ok: false };
  } catch (err) {
    console.warn('Puter TTS invocation note:', err);
    return { ok: false };
  }
}

/**
 * Lists available voices for a given provider via Puter.js
 */
export async function listPuterVoices(provider: PuterTTSProvider = 'aws-polly'): Promise<PuterVoice[]> {
  try {
    const isReady = await ensurePuterLoaded();
    if (!isReady || !window.puter?.ai?.txt2speech?.listVoices) {
      return [];
    }

    const voices = await window.puter.ai.txt2speech.listVoices({ provider });
    return voices || [];
  } catch {
    return [];
  }
}

/**
 * Zero-key fallback text generation using Puter AI.
 */
export async function generatePuterChat(
  prompt: string,
  model: string = 'gemini-2.0-flash'
): Promise<{ text: string; ok: boolean }> {
  try {
    const isReady = await ensurePuterLoaded();
    if (!isReady || !window.puter?.ai?.chat) {
      return { text: '', ok: false };
    }

    const response = await window.puter.ai.chat(prompt, { model });
    const content = typeof response === 'string' ? response : response?.message?.content || '';

    return {
      text: content.trim(),
      ok: Boolean(content.trim()),
    };
  } catch {
    return { text: '', ok: false };
  }
}

/**
 * Checks if the user is currently signed into Puter.
 */
export function isPuterSignedIn(): boolean {
  if (typeof window === 'undefined' || !window.puter?.auth) return false;
  try {
    return Boolean(window.puter.auth.isSignedIn());
  } catch {
    return false;
  }
}

/**
 * Opens Puter sign-in popup (must be triggered from user action).
 */
export async function signInPuter(): Promise<{ username: string } | null> {
  if (typeof window === 'undefined' || !window.puter?.auth) return null;
  try {
    await window.puter.auth.signIn();
    const user = await window.puter.auth.getUser();
    return user ? { username: user.username } : null;
  } catch {
    return null;
  }
}
