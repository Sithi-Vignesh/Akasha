import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { UploadForm } from './components/UploadForm';
import { ResultsPanel, TabId } from './components/ResultsPanel';
import { CosmosCanvas, CosmosState } from './components/CosmosCanvas';
import { ErrorCard } from './components/ErrorCard';
import { analyzeResume, generateResume } from './api';

type ViewState = 'hero-form' | 'results';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Overall orchestrator states
  const [view, setView] = useState<ViewState>('hero-form');
  const [cosmosState, setCosmosState] = useState<CosmosState>('idle');
  
  // Data states
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [latexCode, setLatexCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Temporary storage for 2nd api call
  const [storedFile, setStoredFile] = useState<File | null>(null);
  const [storedCompany, setStoredCompany] = useState('');
  const [storedJd, setStoredJd] = useState('');
  
  const [isFormFadingOut, setIsFormFadingOut] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('score');

  // Set initial dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Minimum wait utility
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleAnalyze = async (file: File, company: string, jd: string) => {
    setStoredFile(file);
    setStoredCompany(company);
    setStoredJd(jd);
    setError(null);
    
    setCosmosState('disrupted');
    setIsFormFadingOut(true);
    
    try {
      const [res] = await Promise.all([
        analyzeResume(file, company, jd),
        delay(1500) // Minimum UX loading duration
      ]);
      setAnalysisData(res);
      setCosmosState('calm');
      setTimeout(() => {
        setView('results');
        setIsFormFadingOut(false);
      }, 500); // Wait for calm to start slightly
    } catch (err: any) {
      setError(err.message || "The cosmos encountered interference. Try again.");
      setCosmosState('idle');
      setIsFormFadingOut(false);
    }
  };

  const handleGenerate = async () => {
    if (!analysisData) return;
    setError(null);
    setCosmosState('disrupted');
    
    try {
      const [res] = await Promise.all([
        generateResume(
          storedCompany,
          storedJd,
          analysisData.fit_score,
          analysisData.fit_summary,
          analysisData.gaps,
          analysisData.suggestions,
          analysisData.resume_chunks
        ),
        delay(1500)
      ]);
      setLatexCode(res.latex_code);
      setCosmosState('calm');
      setActiveTab('resume');
    } catch (err: any) {
      setError(err.message || "The cosmos encountered interference. Try again.");
      setCosmosState('idle');
    }
  };

  const handleRetryError = () => {
    setError(null);
    if (view === 'hero-form') {
      if (storedFile && isFormFadingOut) { // if it failed mid-analyze
         handleAnalyze(storedFile, storedCompany, storedJd);
      }
    } else {
      // If it failed mid-generate
      if (!latexCode) {
         handleGenerate();
      }
    }
  };

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden flex flex-col font-sans">
      <CosmosCanvas cosmosState={cosmosState} isDarkMode={isDarkMode} />
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <main className="flex-1 w-full flex flex-col items-center">
        {view === 'hero-form' && (
          <div className={`w-full max-w-4xl flex flex-col items-center transition-all duration-400 ease-in
            ${isFormFadingOut ? 'opacity-0 -translate-y-5 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
            <Hero isDarkMode={isDarkMode} />
            {!error ? (
               <div id="form-section" className="w-full z-10 pb-16 px-4 relative">
                 <UploadForm onAnalyze={handleAnalyze} isLoading={cosmosState === 'disrupted'} />
               </div>
            ) : (
               <div className="w-full z-10 pb-16 px-4 relative mt-16">
                 <ErrorCard message={error} onRetry={handleRetryError} />
               </div>
            )}
          </div>
        )}

        {view === 'results' && analysisData && (
          <div className={`w-full max-w-5xl flex flex-col items-center pt-24 md:pt-32 pb-16 z-10 px-4 transition-opacity duration-500 ${cosmosState === 'disrupted' ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
            {!error ? (
              <ResultsPanel 
                data={analysisData}
                onGenerate={handleGenerate}
                isGenerating={cosmosState === 'disrupted'}
                latexCode={latexCode}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            ) : (
               <div className="w-full z-10 relative mt-8">
                 <ErrorCard message={error} onRetry={handleRetryError} />
               </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
