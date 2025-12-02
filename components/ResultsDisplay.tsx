import React, { useState } from 'react';
import type { DetectionResult } from '../types';
import { InfoIcon, AiIcon, HumanIcon, CheckCircleIcon } from './Icons';

interface ResultsDisplayProps {
  result: DetectionResult;
  imagePreview: string;
}

const ResultBadge: React.FC<{ isAi: boolean, confidence: number }> = ({ isAi, confidence }) => {
  const bgColor = isAi ? 'bg-rose-500/10' : 'bg-emerald-500/10';
  const textColor = isAi ? 'text-rose-400' : 'text-emerald-400';
  const ringColor = isAi ? 'ring-rose-500/30' : 'ring-emerald-500/30';
  const Icon = isAi ? AiIcon : HumanIcon;
  const percentage = Math.round(isAi ? confidence * 100 : (1 - confidence) * 100);

  return (
    <div className={`inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-xl font-semibold ${bgColor} ${textColor} ring-1 ring-inset ${ringColor}`}>
      <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
      <span>{isAi ? 'AI-Generated' : 'Human-Made'}</span>
      <span className="text-xs sm:text-sm font-medium text-gray-400">({percentage}% confident)</span>
    </div>
  );
};

const ConfidenceBar: React.FC<{ confidence: number }> = ({ confidence }) => {
    const isAi = confidence >= 0.5;
    const aiPercentage = Math.round(confidence * 100);
    const humanPercentage = 100 - aiPercentage;
    
    const humanBarColor = isAi ? 'bg-gray-600' : 'bg-gradient-to-r from-emerald-500 to-green-400';
    const aiBarColor = isAi ? 'bg-gradient-to-r from-rose-500 to-red-400' : 'bg-gray-600';

    return (
        <div className="w-full my-4 sm:my-6">
            <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-300 mb-2">
                <span className={`transition-opacity duration-500 ${!isAi ? 'opacity-100' : 'opacity-50'}`}>Human ({humanPercentage}%)</span>
                <span className={`transition-opacity duration-500 ${isAi ? 'opacity-100' : 'opacity-50'}`}>AI ({aiPercentage}%)</span>
            </div>
            <div className="flex w-full bg-gray-800 rounded-full h-2 sm:h-3 overflow-hidden">
                <div className={`${humanBarColor} transition-all duration-500 ease-out`} style={{ width: `${humanPercentage}%` }}></div>
                <div className={`${aiBarColor} transition-all duration-500 ease-out`} style={{ width: `${aiPercentage}%` }}></div>
            </div>
        </div>
    );
};

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced'>('simple');
  const tabs = ['Summary', 'Advanced Analysis'];

  return (
    <div className="w-full text-left bg-gray-900/50 backdrop-blur-sm border border-gray-500/30 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 animate-fade-in">
      <div className="flex justify-center mb-4 sm:mb-6">
        <ResultBadge isAi={result.isAiGenerated} confidence={result.confidence} />
      </div>

      <ConfidenceBar confidence={result.confidence} />

      <div className="flex justify-center mb-4 sm:mb-6 p-1 bg-gray-800/60 rounded-lg">
        {tabs.map((tab, index) => {
          const tabKey = index === 0 ? 'simple' : 'advanced';
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tabKey as 'simple' | 'advanced')}
              className={`w-full py-2.5 text-sm font-semibold rounded-md transition-colors duration-300
                ${activeTab === tabKey
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
                }`
              }
            >
              {tab}
            </button>
          )
        })}
      </div>

      <div>
        {activeTab === 'simple' && (
          <div className="text-gray-300 prose-p:my-2 prose-invert max-w-none">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Analysis Summary</h3>
            <p className="text-sm sm:text-base leading-relaxed">{result.analysis}</p>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-white mb-2">Guessed AI Model</h4>
              <p className="px-2 sm:px-3 py-1 inline-block bg-gray-700/50 text-cyan-300 text-xs sm:text-sm font-mono rounded-md">{result.modelGuessed}</p>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">Suspicious Regions</h4>
              {result.suspiciousRegions.length > 0 ? (
                <ul className="space-y-2 sm:space-y-3">
                  {result.suspiciousRegions.map((region, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-800/60 rounded-lg border border-gray-700/50">
                      <div className="flex-shrink-0">
                        <InfoIcon className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400 mt-0.5" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-gray-200">{region.area}</p>
                        <p className="text-gray-400 text-xs sm:text-sm leading-normal">{region.reason}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-800/60 rounded-lg border border-gray-700/50">
                    <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400 flex-shrink-0" />
                    <p className="text-gray-300 text-sm sm:text-base">No specific suspicious regions were identified.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}