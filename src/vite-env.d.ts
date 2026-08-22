/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;

  readonly VITE_ADMIN_EMAIL?: string;
  readonly VITE_ADMIN_EMAILS?: string;

  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_GEMINI_KEYS?: string;

  readonly VITE_GROQ_API_KEY?: string;
  readonly VITE_GROQ_KEYS?: string;

  readonly VITE_CEREBRAS_API_KEY?: string;
  readonly VITE_CEREBRAS_KEYS?: string;

  readonly VITE_OPENROUTER_API_KEY?: string;
  readonly VITE_OPENROUTER_KEYS?: string;

  readonly VITE_ELEVENLABS_API_KEY?: string;
  readonly VITE_ELEVENLABS_KEYS?: string;

  readonly VITE_OLLAMA_KEYS?: string;
  readonly VITE_HUGGINGFACE_KEYS?: string;

  readonly VITE_R2_PUBLIC_URL?: string;
  readonly VITE_R2_BUCKET_NAME?: string;
  readonly VITE_R2_ENDPOINT?: string;
  readonly VITE_CF_ACCOUNT_ID?: string;
  readonly VITE_CLOUDFLARE_API_TOKEN?: string;

  readonly VITE_AUDIODB_API_KEY?: string;
  readonly VITE_JAMENDO_CLIENT_ID?: string;
  readonly VITE_JAMENDO_CLIENT_ID_BACKUP?: string;
  readonly VITE_LASTFM_API_KEY?: string;
  readonly VITE_GENIUS_ACCESS_TOKEN?: string;

  readonly VITE_TELEGRAM_BOT_TOKEN?: string;
  readonly VITE_TELEGRAM_CHAT_ID?: string;
  readonly VITE_PUTER_TOKEN?: string;

  readonly VITE_CLOUDINARY_CLOUD_NAME?: string;
  readonly VITE_CLOUDINARY_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
