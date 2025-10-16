import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div className={`backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}
