import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Dropzone } from './components/Dropzone';
import { ResultsDisplay } from './components/ResultsDisplay';
import { detectImageHF } from './services/hfService';
import type { DetectionResult, ImageData } from './types';
import { LoaderIcon, SparklesIcon } from './components/Icons';
import { HeroImage } from './components/HeroImage';
import { HowItWorks } from './components/HowItWorks';

export default function App() {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSet = useCallback((data: ImageData | null) => {
    setImageData(data);
    setDetectionResult(null);
    setError(null);
  }, []);

  const handleDetect = async () => {
    if (!imageData) {
      setError('Please select an image or provide a URL first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDetectionResult(null);

    try {
      const result = await detectImageHF(imageData.base64, imageData.mimeType);
      setDetectionResult(result);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze image. The API may be busy or the image format is not supported. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0D1117] text-gray-100 font-sans selection:bg-cyan-300 selection:text-cyan-900 bg-grid-pattern">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
        <div className="w-full max-w-7xl mx-auto">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-8 lg:gap-16">
                
                {/* Left Column: Text & Uploader */}
                <div className="lg:w-1/2 w-full flex flex-col items-center lg:items-start text-center lg:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 mb-2 sm:mb-3 tracking-tight">
                        Demectai
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-10 max-w-2xl mx-auto lg:mx-0">
                        Uncover the digital truth. Instantly determine if an image is human-created or AI-generated.
                    </p>

                    <HowItWorks />

                    <Dropzone onImageSet={handleImageSet} />

                    <div className="mt-8 w-full max-w-md mx-auto lg:mx-0">
                        <button
                        onClick={handleDetect}
                        disabled={!imageData || isLoading}
                        className="w-full inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out hover:bg-gradient-to-br hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-1 disabled:from-gray-600 disabled:to-gray-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                        >
                        {isLoading ? (
                            <>
                            <LoaderIcon className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" />
                            Analyzing...
                            </>
                        ) : (
                            <>
                            <SparklesIcon className="mr-3 h-6 w-6" />
                            Run Detection
                            </>
                        )}
                        </button>
                        <p className="text-xs text-gray-500 mt-3">
                        Your image is processed securely and is not stored. Analysis may take a few seconds.
                        </p>
                    </div>
                </div>

                {/* Right Column: Hero Image */}
                <div className="lg:w-1/2 w-full max-w-lg lg:max-w-none mx-auto">
                    <HeroImage />
                </div>
            </div>

            {/* Results and Error Section */}
            <div className="w-full max-w-5xl mx-auto">
                {error && (
                    <div className="mt-10 p-4 text-center text-red-300 bg-red-900/30 border border-red-500/50 rounded-xl">
                    <p>{error}</p>
                    </div>
                )}

                {!isLoading && detectionResult && (
                    <div className="mt-10">
                    <ResultsDisplay result={detectionResult} imagePreview={imageData?.url ?? ''} />
                    </div>
                )}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}