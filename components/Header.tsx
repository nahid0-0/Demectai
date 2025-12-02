import React from 'react';
import { LogoIcon, GithubIcon } from './Icons';

const GITHUB_URL = 'https://github.com/nahid0-0/Demectai';

export function Header() {
  return (
    <header className="relative sticky top-0 z-20 w-full px-4 py-2 sm:py-3 bg-[#0D1117]/80 backdrop-blur-md border-b border-gray-500/20">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <LogoIcon className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-400" />
          <span className="text-lg sm:text-xl font-bold text-white tracking-wide">Demectai</span>
        </div>

        <nav>
          <a 
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors duration-300"
          >
            <GithubIcon className="h-4 w-4" />
            <span className="hidden sm:inline">View on GitHub</span>
            <span className="sm:hidden">GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}