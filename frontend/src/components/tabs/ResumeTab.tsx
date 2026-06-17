import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function ResumeTab({ latexCode }: { latexCode: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latexCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500 flex flex-col gap-6 h-full">
      <div className="glass-card p-6 border-l-4 border-l-[var(--accent)] rounded-lg">
        <h4 className="font-bold mb-3">How to use your resume:</h4>
        <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
          <li>Click "Copy" to copy the LaTeX code below.</li>
          <li>Go to <a href="https://www.overleaf.com" target="_blank" rel="noreferrer" className="text-[var(--accent)] underline hover:no-underline">Overleaf</a> and create a new blank project.</li>
          <li>Replace the default content with your copied code.</li>
          <li>Click "Recompile" — your tailored resume will appear as a PDF.</li>
          <li>Download and apply with confidence. 🚀</li>
        </ol>
      </div>

      <div className="relative flex-1 min-h-[300px] flex flex-col rounded-xl overflow-hidden border border-[var(--glass-border)] bg-[#111111]">
        <div className="flex justify-between items-center px-4 py-2 bg-black/40 border-b border-white/10">
          <span className="font-mono text-xs text-white/50">resume.tex</span>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs font-medium text-white/70 hover:text-white transition-colors py-1 px-3 rounded bg-white/5 hover:bg-white/10"
          >
            {copied ? (
               <><Check size={14} className="text-[var(--success)]" /> Copied to cosmos ✓</>
            ) : (
               <><Copy size={14} /> Copy</>
            )}
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
          <pre className="font-mono text-sm text-gray-300">
            {latexCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
