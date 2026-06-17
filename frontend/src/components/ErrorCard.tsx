import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorCardProps {
  message: string;
  onRetry: () => void;
}

export function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <div className="glass-card max-w-lg mx-auto p-8 flex flex-col items-center text-center gap-6 mt-16 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="w-16 h-16 rounded-full bg-[var(--error)]/20 flex items-center justify-center text-[var(--error)]">
        <AlertTriangle size={32} />
      </div>
      <h3 className="font-display font-medium text-xl">Something went wrong</h3>
      <p className="text-[var(--text-secondary)]">{message}</p>
      <button 
        onClick={onRetry}
        className="mt-2 flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-[var(--bg)] font-display font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform"
      >
        <RefreshCw size={18} />
        Retry
      </button>
    </div>
  );
}
