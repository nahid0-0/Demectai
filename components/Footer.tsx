import React from 'react';
import { LogoIcon, GithubIcon, TwitterIcon, MailIcon } from './Icons';

export function Footer() {
  return (
    <footer className="w-full mt-20 bg-[#0D1117]/80 backdrop-blur-md border-t border-gray-500/20 z-10">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-10">
        
        {/* Left Section: Logo and Disclaimer */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-3 mb-4">
            <LogoIcon className="h-8 w-8 text-cyan-400" />
            <span className="text-xl font-bold text-white tracking-wide">Demectai</span>
          </div>
          <p className="text-sm text-gray-500 max-w-xs">
            This tool provides an AI-driven analysis and should be used for informational purposes. 
            Results are not guaranteed to be 100% accurate.
          </p>
        </div>

        {/* Middle Section: Quick Links */}
        <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">How it Works</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">Help/FAQ</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">Terms of Service</a>
            </nav>
        </div>

        {/* Right Section: Connect */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Connect with Us</h3>
            <div className="flex items-center gap-5">
                <a href="#" aria-label="Github" className="text-gray-400 hover:text-white transition-colors"><GithubIcon className="h-6 w-6" /></a>
                <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors"><TwitterIcon className="h-6 w-6" /></a>
                <a href="#" aria-label="Contact" className="text-gray-400 hover:text-white transition-colors"><MailIcon className="h-6 w-6" /></a>
            </div>
            <p className="text-xs text-gray-600 mt-4">&copy; {new Date().getFullYear()} Demectai. All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  );
}