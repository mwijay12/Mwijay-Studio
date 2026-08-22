import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function PremiumTilt({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 170, damping: 22 });
  const smoothY = useSpring(y, { stiffness: 170, damping: 22 });
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [4.5, -4.5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-4.5, 4.5]);
  const glowX = useTransform(smoothX, [-0.5, 0.5], ['15%', '85%']);
  const glowY = useTransform(smoothY, [-0.5, 0.5], ['15%', '85%']);

  return (
    <motion.div
      ref={ref}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((event.clientX - rect.left) / rect.width - 0.5);
        y.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`relative transform-gpu ${className}`}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) =>
              `radial-gradient(circle at ${gx} ${gy}, rgba(96,165,250,.22), transparent 36%)`,
          ),
        }}
      />
    </motion.div>
  );
}