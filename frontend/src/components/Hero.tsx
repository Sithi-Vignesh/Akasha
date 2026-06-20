import React from 'react';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  isDarkMode: boolean;
}

export function Hero({ isDarkMode }: HeroProps) {
  return (
    <div className="relative w-full h-[100vh] flex flex-col items-center justify-center text-center p-6 z-10 pointer-events-none -translate-y-8">
      <img
        src={isDarkMode ? "/logo-full-white.png" : "/logo-full-black.png"}
        alt="Akasha"
        className="w-72 md:w-96 h-auto"
      />
      <h1 className="font-display font-extrabold text-[clamp(2rem,5vw,4rem)] tracking-tight leading-tight mb-6">
        Akasha
      </h1>
      <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-medium max-w-2xl mx-auto">
        Every candidate has a story. Akasha tells it right.
      </p>
      
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-[var(--text-secondary)]">
        <ChevronDown size={32} />
      </div>
    </div>
  );
}