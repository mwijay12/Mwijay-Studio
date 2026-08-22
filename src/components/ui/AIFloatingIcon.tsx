import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AIFloatingIcon() {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY < window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.5 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 right-6 z-[60]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        onClick={() => {
          const el = document.getElementById("services-ai");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          } else {
            navigate("/tools");
          }
        }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-[0_8px_32px_rgba(37,99,235,0.35)] backdrop-blur-md cursor-pointer"
        style={{
          background: "linear-gradient(135deg, rgba(37,99,235,0.85), rgba(10,22,51,0.9))",
          border: "1px solid rgba(96,165,250,0.25)",
        }}
        aria-label="AI Studio Tools"
      >
        <span className="text-lg">🤖</span>
        <span className="absolute -top-1.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[#ec4899] animate-pulse shadow-lg shadow-[#ec4899]/50" />
      </button>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-16 right-0 rounded-2xl border border-[#2563eb]/20 bg-[#0a1633]/90 px-4 py-3 shadow-2xl backdrop-blur-xl"
            style={{ minWidth: 160 }}
          >
            <p className="text-sm font-semibold text-white">AI Automation</p>
            <p className="text-xs text-[#f5f8ff]/50 mt-0.5">n8n, Gemini, Groq, OpenRouter</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
