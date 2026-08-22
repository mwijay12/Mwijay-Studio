import { type ReactNode } from 'react';
import { useReveal } from '../../hooks/useReveal';

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'li';
};

export default function Reveal({ children, className = '', delay = 0, as = 'div' }: Props) {
  const { ref, shown } = useReveal();
  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={`transition-all duration-700 ease-out ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
