import React from 'react';

export function GapsTab({ gaps }: { gaps: string[] }) {
  return (
    <div className="p-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <h3 className="font-display font-semibold text-xl mb-6">What's Missing</h3>
      <ul className="flex flex-col gap-4">
        {gaps.map((gap, i) => (
          <li key={i} className="flex items-start gap-4 text-lg leading-relaxed">
            <span className="text-[var(--text-secondary)] mt-1 opacity-60">✕</span>
            <span>{gap}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SuggestionsTab({ suggestions }: { suggestions: string[] }) {
  return (
    <div className="p-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <h3 className="font-display font-semibold text-xl mb-6">How to Improve</h3>
      <ul className="flex flex-col gap-4">
        {suggestions.map((sug, i) => (
          <li key={i} className="flex items-start gap-4 text-lg leading-relaxed">
            <span className="text-[var(--accent)] mt-1">→</span>
            <span>{sug}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
