import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateStudioChat, generateSpeechAudioUrl, type ChatMessage } from "../../lib/ai";
import TypewriterText from "./TypewriterText";

/* ─────────────────────────────────────────── types */
type Role = "bot" | "user";
interface Msg {
  id: number;
  role: Role;
  text: string;
  options?: string[];
  audioUrl?: string;
  provider?: string;
}

const GREETING =
  "Habari! 👋 I'm David's AI Assistant at Mwijay Studio.\n\nWe design high-performance websites, custom business systems, dashboards, and automated AI workflows. How can I help you today?";

const INITIAL_OPTIONS = [
  "What services & prices do you offer?",
  "Tell me about Business Systems & Dashboards",
  "How does AI & n8n Automation work?",
  "How do I start a project with David?",
];

let msgIdCounter = 0;
function createMsg(
  role: Role,
  text: string,
  options?: string[],
  provider?: string
): Msg {
  return { id: ++msgIdCounter, role, text, options, provider };
}

/* ─────────────────────────────────────────── Markdown text renderer */
function cleanTextForChatTypewriter(text: string): string {
  return text
    .replace(/<(think|thought)>[\s\S]*?(?:<\/\1>|$)/gi, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*{1,3}(.+?)\*{1,3}/g, "$1")
    .replace(/_{1,3}(.+?)_{1,3}/g, "$1")
    .replace(/^[\*\-+]\s+/gm, "• ")
    .replace(/`{1,3}(.+?)`{1,3}/g, "$1")
    .trim();
}

function BotMessageRenderer({ text, animate }: { text: string; animate?: boolean }) {
  const clean = text.replace(/<(think|thought)>[\s\S]*?(?:<\/\1>|$)/gi, "").trim();

  if (animate) {
    return (
      <span className="whitespace-pre-line text-sm leading-relaxed text-[#f5f8ff]">
        <TypewriterText text={cleanTextForChatTypewriter(clean)} speed={55} delay={30} />
      </span>
    );
  }

  const lines = clean.split("\n");

  return (
    <div className="space-y-1.5 text-sm leading-relaxed text-[#f5f8ff]/95">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Header (# or ## or ### or ####)
        const headerMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
        if (headerMatch) {
          const headerContent = headerMatch[2].replace(/^(\*{1,3}|_{1,3})(.+?)(\1)$/, "$2");
          return (
            <div key={idx} className="font-bold text-white text-[15px] pt-1.5 pb-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#60a5fa]" />
              {renderChatInline(headerContent)}
            </div>
          );
        }

        // Bullet list item (* or - or + or •)
        const bulletMatch = trimmed.match(/^([•\-\*+])\s+(.+)$/);
        if (bulletMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#60a5fa]" />
              <span className="flex-1">{renderChatInline(bulletMatch[2])}</span>
            </div>
          );
        }

        // Numbered list (1. 2.)
        const numMatch = trimmed.match(/^(\d+[\.\)])\s+(.+)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="text-[#60a5fa] font-bold text-xs mt-0.5">{numMatch[1]}</span>
              <span className="flex-1">{renderChatInline(numMatch[2])}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="leading-relaxed">
            {renderChatInline(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderChatInline(str: string) {
  if (!str) return null;

  const cleaned = str.replace(/(?:^|\s)#{1,6}\s+/g, " ");
  const pattern = /(`[^`]+`|\*\*\*[^*]+\*\*\*|___[^_]+___|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;
  const parts = cleaned.split(pattern);

  return parts.map((part, i) => {
    if (!part) return null;

    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={i} className="rounded bg-white/10 px-1 py-0.5 text-xs font-mono text-[#93c5fd]">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (
      (part.startsWith("***") && part.endsWith("***") && part.length > 6) ||
      (part.startsWith("___") && part.endsWith("___") && part.length > 6)
    ) {
      return (
        <strong key={i} className="font-semibold text-white">
          <em>{part.slice(3, -3)}</em>
        </strong>
      );
    }
    if (
      (part.startsWith("**") && part.endsWith("**") && part.length > 4) ||
      (part.startsWith("__") && part.endsWith("__") && part.length > 4)
    ) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (
      (part.startsWith("*") && part.endsWith("*") && part.length > 2) ||
      (part.startsWith("_") && part.endsWith("_") && part.length > 2)
    ) {
      return (
        <em key={i} className="italic text-[#f5f8ff]/90">
          {part.slice(1, -1)}
        </em>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-[#60a5fa] underline hover:text-white">
          {linkMatch[1]}
        </a>
      );
    }

    const sanitized = part.replace(/\*{3,}/g, "").replace(/#{2,}/g, "");
    return <span key={i}>{sanitized}</span>;
  });
}

/* ─────────────────────────────────────────── Component */
export default function ChatBot({
  onStartProject,
}: {
  onStartProject?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    createMsg("bot", GREETING, INITIAL_OPTIONS, "groq"),
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [audioLoadingId, setAudioLoadingId] = useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      inputRef.current?.focus();
    }
  }, [open]);

  // Audio cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleAudioPlay = async (msg: Msg) => {
    if (playingAudioId === msg.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingAudioId(null);
      return;
    }

    setAudioLoadingId(msg.id);

    try {
      if (msg.audioUrl) {
        if (!audioRef.current) {
          audioRef.current = new Audio(msg.audioUrl);
        } else {
          audioRef.current.src = msg.audioUrl;
        }
        audioRef.current.onended = () => setPlayingAudioId(null);
        await audioRef.current.play();
        setPlayingAudioId(msg.id);
      } else {
        const res = await generateSpeechAudioUrl(msg.text);
        if (res.audioUrl) {
          msg.audioUrl = res.audioUrl;
          if (!audioRef.current) {
            audioRef.current = new Audio(res.audioUrl);
          } else {
            audioRef.current.src = res.audioUrl;
          }
          audioRef.current.onended = () => setPlayingAudioId(null);
          await audioRef.current.play();
          setPlayingAudioId(msg.id);
        } else if (res.synthesizedViaBrowser) {
          setPlayingAudioId(msg.id);
          const checkEnd = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
              setPlayingAudioId(null);
              clearInterval(checkEnd);
            }
          }, 300);
        }
      }
    } catch {
      setPlayingAudioId(null);
    } finally {
      setAudioLoadingId(null);
    }
  };

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim()) return;

      const userMsg = createMsg("user", userText.trim());
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      // Build chat history for LLM
      const history: ChatMessage[] = [...messages, userMsg].map((m) => ({
        role: m.role === "bot" ? ("assistant" as const) : ("user" as const),
        content: m.text,
      }));

      try {
        const aiResponse = await generateStudioChat(history);
        let options: string[] | undefined = undefined;

        // Contextual follow-up options
        const lower = userText.toLowerCase();
        if (
          lower.includes("price") ||
          lower.includes("cost") ||
          lower.includes("quote") ||
          lower.includes("service")
        ) {
          options = ["Start a project proposal", "Message David on WhatsApp", "Ask another question"];
        } else if (lower.includes("web") || lower.includes("site")) {
          options = ["View our work portfolio", "What's the turnaround time?", "Request a quote"];
        }

        const botMsg = createMsg("bot", aiResponse.text, options, aiResponse.provider);
        setMessages((prev) => [...prev, botMsg]);

        if (!open) {
          setUnread((n) => n + 1);
        }

        if (userText.toLowerCase().includes("proposal") || userText.toLowerCase().includes("start a project")) {
          if (onStartProject) {
            // Optional direct navigation
          }
        }
      } catch {
        const fallbackMsg = createMsg(
          "bot",
          "David and our team are ready to assist. You can reach David directly at mwijaydavie@gmail.com or via WhatsApp at +255 790 942 616.",
          ["Start a project", "Explore AI Tools"],
          "fallback"
        );
        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setLoading(false);
      }
    },
    [messages, open, onStartProject]
  );

  const handleOptionClick = (opt: string) => {
    if (opt === "Start a project proposal" || opt === "Start a project" || opt === "Request a quote") {
      onStartProject?.();
    } else if (opt === "Message David on WhatsApp") {
      window.open("https://wa.me/255790942616", "_blank");
    } else if (opt === "View our work portfolio") {
      window.location.href = "/work";
    } else if (opt === "Explore AI Tools") {
      window.location.href = "/tools";
    } else {
      sendMessage(opt);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const text = input;
    setInput("");
    sendMessage(text);
  };

  const handleClearChat = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingAudioId(null);
    setMessages([createMsg("bot", GREETING, INITIAL_OPTIONS, "groq")]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label="AI Studio Assistant"
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-[70] flex h-[52px] w-[52px] sm:h-14 sm:w-14 items-center justify-center rounded-full shadow-[0_8px_30px_rgba(37,99,235,0.45)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.65)] backdrop-blur-md transition-all active:scale-95 group"
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 55%, #0a1633 100%)",
          border: "1px solid rgba(96, 165, 250, 0.45)",
        }}
        whileTap={{ scale: 0.92 }}
        animate={{ scale: open ? 0.95 : 1 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg sm:text-xl font-light text-white"
            >
              ✕
            </motion.span>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex items-center justify-center text-white"
            >
              {/* Luxury Bespoke AI Sparkle SVG */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white drop-shadow-[0_2px_8px_rgba(96,165,250,0.6)] transition-transform group-hover:scale-110"
              >
                <path
                  d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z"
                  fill="currentColor"
                />
                <path
                  d="M18.5 15L19.4 17.1L21.5 18L19.4 18.9L18.5 21L17.6 18.9L15.5 18L17.6 17.1L18.5 15Z"
                  fill="#93c5fd"
                />
                <path
                  d="M5.5 15L6.4 17.1L8.5 18L6.4 18.9L5.5 21L4.6 18.9L2.5 18L4.6 17.1L5.5 15Z"
                  fill="#60a5fa"
                />
              </svg>

              {/* Pulsing Live indicator */}
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border border-[#0a1633]" />
            </motion.div>
          )}
        </AnimatePresence>

        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ec4899] text-[10px] font-bold text-white shadow-lg">
            {unread}
          </span>
        )}
      </motion.button>

      {/* Interactive AI Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            data-lenis-prevent
            className="fixed bottom-20 right-3 sm:bottom-24 sm:right-6 z-[70] flex w-[calc(100vw-1.5rem)] sm:w-[380px] max-w-[400px] flex-col overflow-hidden rounded-3xl shadow-[0_24px_80px_rgba(10,22,51,0.65)]"
            style={{
              background: "rgba(10, 22, 51, 0.96)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(96, 165, 250, 0.25)",
              maxHeight: "min(560px, calc(100dvh - 6.5rem))",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between border-b border-white/10 px-4 py-3.5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(37,99,235,0.35), rgba(30,64,175,0.2))",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#3b82f6] text-white shadow-lg shadow-[#2563eb]/40">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">Mwijay Studio AI</p>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-[#93c5fd]">
                    Fast Multi-Model Fallback Engine
                  </p>
                </div>
              </div>

              <button
                onClick={handleClearChat}
                title="Reset conversation"
                className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 px-4 py-4 scrollbar-hide">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-1.5">
                  <div
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`relative max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-br-sm bg-gradient-to-br from-[#2563eb] to-[#1e40af] text-white shadow-md shadow-[#2563eb]/20"
                          : "rounded-bl-sm border border-white/10 bg-white/10 text-[#f5f8ff] shadow-sm backdrop-blur-md"
                      }`}
                    >
                      {msg.role === "bot" ? (
                        <BotMessageRenderer
                          text={msg.text}
                          animate={msg.id === messages[messages.length - 1]?.id}
                        />
                      ) : (
                        <span className="whitespace-pre-line">{msg.text}</span>
                      )}

                      {/* Bot Audio Voice Button */}
                      {msg.role === "bot" && (
                        <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-1.5 text-[11px] text-white/50">
                          <button
                            type="button"
                            onClick={() => handleAudioPlay(msg)}
                            disabled={audioLoadingId === msg.id}
                            className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-[11px] font-medium text-[#93c5fd] hover:bg-white/15 hover:text-white transition disabled:opacity-50 cursor-pointer"
                          >
                            {audioLoadingId === msg.id ? (
                              <>
                                <svg
                                  className="animate-spin h-3 w-3"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                >
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeLinecap="round" />
                                </svg>
                                <span>Synthesizing...</span>
                              </>
                            ) : playingAudioId === msg.id ? (
                              <>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                                  <rect x="6" y="6" width="12" height="12" rx="2" />
                                </svg>
                                <span>Stop Voice</span>
                              </>
                            ) : (
                              <>
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                </svg>
                                <span>Listen Voice</span>
                              </>
                            )}
                          </button>

                          {msg.provider && msg.provider !== "fallback" && (
                            <span className="text-[9px] uppercase tracking-wider text-white/40">
                              {msg.provider}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Suggestion Chips */}
                  {msg.role === "bot" &&
                    msg.options &&
                    msg.options.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5 pl-1">
                        {msg.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleOptionClick(opt)}
                            className="rounded-full border border-[#2563eb]/40 bg-[#2563eb]/15 px-3 py-1 text-[11px] font-medium text-[#93c5fd] transition hover:bg-[#2563eb]/30 hover:border-[#60a5fa] hover:text-white active:scale-95 shadow-sm"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              {/* Typing Animation */}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur-md">
                    <span className="text-[11px] text-white/60">Thinking</span>
                    <div className="flex items-center gap-1">
                      {[0, 150, 300].map((d) => (
                        <span
                          key={d}
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#60a5fa]"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-white/10 bg-[#0a1633]/60 px-3 py-3">
              <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3 py-2 transition focus-within:border-[#2563eb]/70 focus-within:bg-white/10">
                <input
                  ref={inputRef}
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none"
                  placeholder="Ask about pricing, custom builds, AI..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white transition hover:brightness-110 disabled:opacity-30 active:scale-90 shadow-md shadow-[#2563eb]/30"
                  aria-label="Send message"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" />
                  </svg>
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-white/40">
                <span>WhatsApp: +255 790 942 616</span>
                <a
                  href="/start"
                  onClick={(e) => {
                    e.preventDefault();
                    onStartProject?.();
                  }}
                  className="text-[#60a5fa] hover:underline font-medium"
                >
                  Start Project →
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
