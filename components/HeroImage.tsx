import React from 'react';

export function HeroImage() {
  return (
    <div className="relative w-full h-full flex items-center justify-center animate-fade-in">
      <svg
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-lg"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#00c6ff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0072ff', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#a200ff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#00c6ff', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Central element */}
        <g>
          <path
            d="M 250 50 A 200 200 0 1 1 250 450 A 200 200 0 1 1 250 50 Z"
            fill="none"
            stroke="url(#grad1)"
            strokeWidth="2"
          />
          <path
            d="M 150 150 A 100 100 0 1 1 150 350 A 100 100 0 1 1 150 150 Z"
            transform="rotate(45 250 250)"
            fill="none"
            stroke="url(#grad2)"
            strokeWidth="1.5"
          />
        </g>

        {/* Neural network style nodes and connections */}
        <g opacity="0.7">
          {/* Nodes */}
          <circle cx="100" cy="100" r="5" fill="url(#grad1)" />
          <circle cx="400" cy="100" r="5" fill="url(#grad1)" />
          <circle cx="100" cy="400" r="5" fill="url(#grad1)" />
          <circle cx="400" cy="400" r="5" fill="url(#grad1)" />

          <circle cx="250" cy="150" r="4" fill="url(#grad2)" />
          <circle cx="150" cy="250" r="4" fill="url(#grad2)" />
          <circle cx="350" cy="250" r="4" fill="url(#grad2)" />
          <circle cx="250" cy="350" r="4" fill="url(#grad2)" />

          {/* Connections */}
          <line x1="100" y1="100" x2="250" y2="150" stroke="#00c6ff" strokeWidth="0.5" />
          <line x1="100" y1="100" x2="150" y2="250" stroke="#00c6ff" strokeWidth="0.5" />
          <line x1="400" y1="100" x2="250" y2="150" stroke="#00c6ff" strokeWidth="0.5" />
          <line x1="400" y1="100" x2="350" y2="250" stroke="#00c6ff" strokeWidth="0.5" />

          <line x1="100" y1="400" x2="150" y2="250" stroke="#a200ff" strokeWidth="0.5" />
          <line x1="100" y1="400" x2="250" y2="350" stroke="#a200ff" strokeWidth="0.5" />
          <line x1="400" y1="400" x2="350" y2="250" stroke="#a200ff" strokeWidth="0.5" />
          <line x1="400" y1="400" x2="250" y2="350" stroke="#a200ff" strokeWidth="0.5" />
        </g>
        
        {/* Corner brackets */}
        <g stroke="rgba(255,255,255,0.3)" strokeWidth="2">
            <polyline points="30,50 30,30 50,30" fill="none" />
            <polyline points="470,50 470,30 450,30" fill="none" />
            <polyline points="30,450 30,470 50,470" fill="none" />
            <polyline points="470,450 470,470 450,470" fill="none" />
        </g>
      </svg>
    </div>
  );
}