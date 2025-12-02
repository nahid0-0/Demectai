import React from 'react';
import { LogoIcon, GithubIcon } from './Icons';

export function Header() {
  return (
    <header className="relative sticky top-0 z-20 w-full p-4 bg-[#0D1117]/80 backdrop-blur-md border-b border-gray-500/20">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoIcon className="h-8 w-8 text-cyan-400" />
          <span className="text-xl font-bold text-white tracking-wide">Demectai</span>
        </div>

        <nav>
          <a href="#" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors duration-300">
            <GithubIcon className="h-4 w-4" />
            View on GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}