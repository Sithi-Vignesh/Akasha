import React from 'react';
import { Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--glass-border)] mt-16 py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--text-secondary)]">
      <div className="font-display font-medium">Akasha</div>
      <div>Built by THUNDER</div>
      <div className="flex gap-4">
        <a href="https://github.com/Sithi-Vignesh" target="_blank" className="hover:text-[var(--accent)] transition-colors">
          <Github size={18} />
        </a>
        <a href="https://www.linkedin.com/in/sithi-vignesh/" target="_blank" className="hover:text-[var(--accent)] transition-colors">
          <Linkedin size={18} />
        </a>
      </div>
    </footer>
  );
}
