import React from 'react';
import { ScoreCircle } from '../ScoreCircle';

interface ScoreTabProps {
  score: number;
  summary: string;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function ScoreTab({ score, summary, onGenerate, isGenerating }: ScoreTabProps) {
  return (
    <div className="p-8 flex flex-col items-center gap-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <ScoreCircle score={score} />
      
      <p className="text-center leading-relaxed text-[var(--text-primary)]">
        {summary}
      </p>
      
      <button 
        onClick={onGenerate}
        disabled={isGenerating}
        className={`mt-4 px-8 py-4 rounded-xl font-display font-bold text-[var(--bg)] bg-[var(--accent)] hover:scale-[1.02] active:scale-[0.98] transition-transform w-full md:w-auto
          ${isGenerating ? 'opacity-80 pointer-events-none animate-pulse' : ''}`}
      >
        {isGenerating ? "Generating..." : "Boost Your Fit Score → Generate Resume"}
      </button>
    </div>
  );
}
