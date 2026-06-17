import React, { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { ScoreTab } from './tabs/ScoreTab';
import { GapsTab, SuggestionsTab } from './tabs/ListTabs';
import { ResumeTab } from './tabs/ResumeTab';

export type TabId = 'score' | 'gaps' | 'suggestions' | 'resume';

interface ResultsPanelProps {
  data: {
    fit_score: number;
    fit_summary: string;
    gaps: string[];
    suggestions: string[];
  };
  onGenerate: () => void;
  isGenerating: boolean;
  latexCode: string | null;
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
}

export function ResultsPanel({ data, onGenerate, isGenerating, latexCode, activeTab, setActiveTab }: ResultsPanelProps) {
  const isResumeLocked = !latexCode;
  
  // Pulse animation trigger when latexCode arrives
  const [justUnlocked, setJustUnlocked] = useState(false);
  
  useEffect(() => {
    if (latexCode) {
      setJustUnlocked(true);
      setTimeout(() => setJustUnlocked(false), 2000);
    }
  }, [latexCode]);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'score', label: 'Score' },
    { id: 'gaps', label: 'Gaps' },
    { id: 'suggestions', label: 'Suggestions' },
    { id: 'resume', label: 'Resume' },
  ];

  return (
    <div className="w-full max-w-[800px] mx-auto h-[70vh] glass-card flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-600 ease-out z-10 relative">
      <div className="flex w-full overflow-x-auto border-b border-[var(--glass-border)] no-scrollbar">
        {tabs.map((tab) => {
          const isResume = tab.id === 'resume';
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              disabled={isResume && isResumeLocked}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] py-4 px-6 font-display font-semibold text-[0.95rem] whitespace-nowrap transition-all duration-300 relative
                ${isActive 
                  ? 'bg-[var(--tab-active-bg)] text-[var(--text-primary)]' 
                  : 'bg-[var(--tab-inactive-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}
                ${isResume && isResumeLocked ? 'opacity-50 !hover:text-[var(--text-secondary)] cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-center justify-center gap-2">
                {isResume && isResumeLocked && <Lock size={14} className="mt-[2px]" />}
                <span className={isResume && justUnlocked ? 'animate-pulse text-[var(--accent)] drop-shadow-[0_0_8px_var(--accent)]' : ''}>
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="flex-1 overflow-y-auto w-full custom-scrollbar relative">
        {activeTab === 'score' && (
           <ScoreTab 
             score={data.fit_score} 
             summary={data.fit_summary} 
             onGenerate={onGenerate}
             isGenerating={isGenerating}
           />
        )}
        {activeTab === 'gaps' && <GapsTab gaps={data.gaps} />}
        {activeTab === 'suggestions' && <SuggestionsTab suggestions={data.suggestions} />}
        {activeTab === 'resume' && latexCode && <ResumeTab latexCode={latexCode} />}
      </div>
    </div>
  );
}
