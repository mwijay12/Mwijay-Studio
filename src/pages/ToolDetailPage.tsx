import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTool } from '../data/tools';
import { generate, generateSpeechAudioUrl, isAIConfigured } from '../lib/ai';
import { useToast } from '../context/ToastContext';
import FormattedAIOutput from '../components/ui/FormattedAIOutput';
import { TOOL_ICON_MAP, PromptIcon } from '../components/ui/ToolIcons';

export default function ToolDetailPage() {
  const { toolId } = useParams();
  const tool = toolId ? getTool(toolId) : undefined;
  const { notify } = useToast();

  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');
  const [provider, setProvider] = useState<string>('');
  const [resultOk, setResultOk] = useState(true);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [playingVoice, setPlayingVoice] = useState(false);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!tool) return <Navigate to="/tools" replace />;

  const Icon = TOOL_ICON_MAP[tool.id] ?? PromptIcon;

  const requiredFields = tool.fields.filter((f) => !f.label.includes('optional'));
  const isValid = requiredFields.every((f) => (values[f.id] || '').trim().length > 0);

  const handleChange = (id: string, v: string) => setValues((prev) => ({ ...prev, [id]: v }));

  const handleVoicePlay = async () => {
    if (!result) return;
    if (playingVoice) {
      if (audioRef.current) audioRef.current.pause();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingVoice(false);
      return;
    }

    setLoadingVoice(true);
    try {
      if (audioUrl) {
        if (!audioRef.current) audioRef.current = new Audio(audioUrl);
        else audioRef.current.src = audioUrl;
        audioRef.current.onended = () => setPlayingVoice(false);
        await audioRef.current.play();
        setPlayingVoice(true);
      } else {
        const speech = await generateSpeechAudioUrl(result);
        if (speech.audioUrl) {
          setAudioUrl(speech.audioUrl);
          if (!audioRef.current) audioRef.current = new Audio(speech.audioUrl);
          else audioRef.current.src = speech.audioUrl;
          audioRef.current.onended = () => setPlayingVoice(false);
          await audioRef.current.play();
          setPlayingVoice(true);
        } else if (speech.synthesizedViaBrowser) {
          setPlayingVoice(true);
          const interval = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
              setPlayingVoice(false);
              clearInterval(interval);
            }
          }, 300);
        }
      }
    } catch {
      notify({ title: 'Audio playback failed', variant: 'error' });
      setPlayingVoice(false);
    } finally {
      setLoadingVoice(false);
    }
  };

  const runGeneration = async () => {
    setLoading(true);
    setResult('');
    setAudioUrl(null);
    setPlayingVoice(false);
    setCopied(false);
    setAttempts((n) => n + 1);
    try {
      const output = await generate({
        system: tool.system,
        prompt: tool.buildPrompt(values),
        maxTokens: 3500,
        temperature: 0.75,
      });
      setResult(output.text);
      setResultOk(output.ok);
      setProvider(output.provider);
      if (!output.ok) {
        notify({
          title: isAIConfigured ? 'Generation failed' : 'AI not configured',
          description: isAIConfigured
            ? 'The provider timed out or errored — try again.'
            : 'Add an API key to enable live results.',
          variant: 'warning',
        });
      }
    } catch {
      setResult('Something went wrong on this end. Please try again.');
      setResultOk(false);
      notify({ title: 'Unexpected error', description: 'Please try again.', variant: 'error' });
    }
    setLoading(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      notify({ title: 'Missing details', description: 'Fill in the required fields first.', variant: 'warning' });
      return;
    }
    runGeneration();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      notify({ title: 'Copied to clipboard', variant: 'success', duration: 2200 });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      notify({ title: 'Copy failed', description: 'Select and copy the text manually.', variant: 'error' });
    }
  };

  return (
    <>
      {/* Header */}
      <section className="pt-36 pb-10 md:pt-44 md:pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            to="/tools"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[#0a1633]/50 transition hover:text-[#2563eb]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M13 18l-6-6 6-6" />
            </svg>
            All tools
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2563eb]/10 text-[#2563eb]">
                <Icon width={26} height={26} />
              </span>
              <span className="rounded-full bg-[#2563eb]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#2563eb]">
                {tool.category}
              </span>
            </div>
            <h1 className="serif mt-4 text-4xl md:text-6xl">{tool.name}</h1>
            <p className="mt-3 max-w-lg text-lg text-[#0a1633]/60">{tool.tagline}</p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 md:pb-32">
        <form onSubmit={handleSubmit} className="space-y-5">
          {tool.fields.map((field) => (
            <label key={field.id} className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#0a1633]/50">
                {field.label}
              </span>
              {field.type === 'textarea' ? (
                <textarea
                  value={values[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className="w-full rounded-2xl border border-[#0a1633]/12 bg-white/60 px-4 py-3 text-sm text-[#0a1633] outline-none transition placeholder:text-[#0a1633]/30 focus:border-[#2563eb] focus:bg-white shadow-sm"
                />
              ) : field.type === 'select' ? (
                <select
                  value={values[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="w-full rounded-2xl border border-[#0a1633]/12 bg-white/60 px-4 py-3 text-sm text-[#0a1633] outline-none transition focus:border-[#2563eb] focus:bg-white shadow-sm"
                >
                  <option value="">{field.placeholder}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  value={values[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-2xl border border-[#0a1633]/12 bg-white/60 px-4 py-3 text-sm text-[#0a1633] outline-none transition placeholder:text-[#0a1633]/30 focus:border-[#2563eb] focus:bg-white shadow-sm"
                />
              )}
            </label>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-[#0a1633] px-8 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 shadow-lg shadow-[#0a1633]/20"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating with AI
              </>
            ) : (
              <>
                Generate Output
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Result */}
        {(result || loading) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`mt-10 rounded-3xl border p-6 md:p-8 shadow-xl ${
              !resultOk && !loading ? 'border-amber-300 bg-amber-50/60' : 'border-[#0a1633]/10 bg-white'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0a1633]/8 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0a1633]/50">
                  {loading ? 'Working' : resultOk ? 'AI Output' : 'Notice'}
                </span>
                {provider && resultOk && !loading && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    {provider} Engine
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {result && resultOk && !loading && (
                  <button
                    type="button"
                    onClick={handleVoicePlay}
                    disabled={loadingVoice}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#2563eb]/30 bg-[#2563eb]/5 px-3 py-1.5 text-xs font-medium text-[#2563eb] transition hover:bg-[#2563eb] hover:text-white"
                  >
                    {loadingVoice ? (
                      <span className="animate-spin">⏳</span>
                    ) : playingVoice ? (
                      <span>⏹ Stop Audio</span>
                    ) : (
                      <span>🔊 Listen Voice</span>
                    )}
                  </button>
                )}

                {!loading && !resultOk && (
                  <button
                    type="button"
                    onClick={runGeneration}
                    className="rounded-full border border-[#0a1633]/15 px-3 py-1.5 text-xs font-medium transition hover:border-[#2563eb] hover:text-[#2563eb]"
                  >
                    Try again
                  </button>
                )}
                {result && resultOk && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded-full border border-[#0a1633]/15 px-3 py-1.5 text-xs font-medium transition hover:border-[#2563eb] hover:text-[#2563eb]"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5 text-[#0a1633] leading-relaxed font-normal text-[15px]">
              {loading && !result ? (
                <span className="inline-flex items-center gap-2 text-[#0a1633]/50 py-4">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0a1633]/20 border-t-[#2563eb]" />
                  Generating tailored response with Mwijay Studio AI...
                </span>
              ) : result ? (
                <FormattedAIOutput text={result} />
              ) : null}
            </div>

            {result && resultOk && tool.followUp && !loading && (
              <div className="mt-6 border-t border-[#0a1633]/8 pt-4 flex items-center justify-between text-xs text-[#0a1633]/55">
                <p>{tool.followUp}</p>
                <Link to="/start" className="text-[#2563eb] font-semibold hover:underline flex-shrink-0 ml-4">
                  Need custom build? Start project →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </section>
    </>
  );
}
