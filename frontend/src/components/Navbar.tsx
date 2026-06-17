import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function Navbar({ isDarkMode, toggleDarkMode }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-transparent pointer-events-auto px-6 py-4 flex justify-between items-center bg-gradient-to-b from-[var(--bg)]/50 to-transparent">
      <div className="font-display font-bold text-xl tracking-tight">
        Akasha
      </div>
      <button 
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-[var(--glass-bg)] transition-transform hover:scale-105 active:scale-95"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </nav>
  );
}
