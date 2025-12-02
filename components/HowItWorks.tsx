import React from 'react';

const steps = [
  {
    title: 'Step 1: Upload Image',
    description: 'Choose a file or paste a URL into the uploader.',
  },
  {
    title: 'Step 2: Start Analysis',
    description: "Press the 'Run Detection' button to begin.",
  },
  {
    title: 'Step 3: View Results',
    description: 'Instantly see the confidence score and analysis.',
  },
];

export function HowItWorks() {
  return (
    <div className="w-full max-w-md mx-auto lg:mx-0 mb-10 relative">
      {/* The continuous vertical line, positioned behind the list items */}
      <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-600/50" aria-hidden="true"></div>

      <ul className="space-y-8">
        {steps.map((step, index) => (
          <li key={index} className="relative pl-8">
            {/* The dot on the timeline */}
            <div className="absolute left-0 top-1 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full border-2 border-gray-500 bg-[#0D1117] flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500"></div>
              </div>
            </div>

            {/* Text content - explicitly aligned left */}
            <div className="text-left">
              <h3 className="text-md font-semibold text-gray-200">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}