import React from 'react';
import { LogoIcon, GithubIcon, TwitterIcon, MailIcon } from './Icons';

const GITHUB_URL = 'https://github.com/nahid0-0/Demectai';
const GITHUB_README = 'https://github.com/nahid0-0/Demectai#readme';

export function Footer() {
  return (
    <footer className="w-full mt-12 sm:mt-20 bg-[#0D1117]/80 backdrop-blur-md border-t border-gray-500/20 z-10">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4 py-8 sm:py-10">
        
        {/* Left Section: Logo and Disclaimer */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <LogoIcon className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
            <span className="text-lg sm:text-xl font-bold text-white tracking-wide">Demectai</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xs">
            This tool provides an AI-driven analysis and should be used for informational purposes. 
            Results are not guaranteed to be 100% accurate.
          </p>
        </div>

        {/* Middle Section: Quick Links */}
        <div className="flex flex-col items-center text-center">
            <h3 className="text-base sm:text-lg font-semibold text-gray-200 mb-3 sm:mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-1.5 sm:gap-2">
              <a href={GITHUB_README} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-gray-400 hover:text-cyan-400 transition-colors duration-300">How it Works</a>
              <a href={GITHUB_README} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-gray-400 hover:text-cyan-400 transition-colors duration-300">Help/FAQ</a>
              <a href={GITHUB_README} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-gray-400 hover:text-cyan-400 transition-colors duration-300">Privacy Policy</a>
              <a href={GITHUB_README} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-gray-400 hover:text-cyan-400 transition-colors duration-300">Terms of Service</a>
            </nav>
        </div>

        {/* Right Section: Connect */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h3 className="text-base sm:text-lg font-semibold text-gray-200 mb-3 sm:mb-4">Connect with Us</h3>
            <div className="flex items-center gap-4 sm:gap-5">
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="Github" className="text-gray-400 hover:text-white transition-colors"><GithubIcon className="h-5 w-5 sm:h-6 sm:w-6" /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors"><TwitterIcon className="h-5 w-5 sm:h-6 sm:w-6" /></a>
                <a href="mailto:contact@demectai.com" aria-label="Contact" className="text-gray-400 hover:text-white transition-colors"><MailIcon className="h-5 w-5 sm:h-6 sm:w-6" /></a>
            </div>
            <p className="text-xs text-gray-600 mt-3 sm:mt-4">&copy; {new Date().getFullYear()} Demectai. All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  );
}