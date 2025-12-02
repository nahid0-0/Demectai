import React, { useState, useCallback, useRef } from 'react';
import type { ImageData } from '../types';
import { UploadIcon, LinkIcon, XCircleIcon } from './Icons';

interface DropzoneProps {
  onImageSet: (data: ImageData | null) => void;
}

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_DIMENSION = 1024; // Max width/height for resizing

// Compress and resize image to reduce payload size
const compressImage = (file: File, maxDimension: number = MAX_DIMENSION): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      let { width, height } = img;
      
      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Use JPEG for better compression, quality 0.85
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const base64 = dataUrl.split(',')[1];
        resolve({ base64, mimeType: 'image/jpeg' });
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = URL.createObjectURL(file);
  });
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });

export function Dropzone({ onImageSet }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');
  const [isPastingUrl, setIsPastingUrl] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setError('Unsupported format. Please use JPG, PNG, WebP, GIF, or BMP.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
        setError(`File is too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
        return;
    }

    try {
      // Always compress/resize to ensure it works with API limits
      const { base64, mimeType } = await compressImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onImageSet({ url: objectUrl, base64, mimeType });
    } catch (e) {
      setError('Could not process file.');
      onImageSet(null);
    }
  }, [onImageSet]);
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && e.target.files.length > 0) {
          await handleFile(e.target.files[0]);
      }
  }
  
  const handleUrlPaste = () => {
    if (!url) return;
    setError(null);
    onImageSet(null);
    setPreview(null);
    if(url && (url.startsWith('http://') || url.startsWith('https://'))) {
      const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
      fetch(proxyUrl)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.blob();
        })
        .then(async blob => {
            // Convert blob to File and compress
            const file = new File([blob], 'image.jpg', { type: blob.type || 'image/jpeg' });
            const { base64, mimeType } = await compressImage(file);
            const previewUrl = URL.createObjectURL(blob);
            setPreview(previewUrl);
            onImageSet({
                url: previewUrl,
                base64,
                mimeType
            });
        })
        .catch(() => {
            setError('Could not fetch image from URL. Please ensure it is publicly accessible.');
            onImageSet(null);
        });
    } else {
        setError('Please enter a valid URL.');
    }
  };

  const clearInput = () => {
    setError(null);
    setPreview(null);
    setUrl('');
    setIsPastingUrl(false);
    onImageSet(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const borderClasses = isDragging ? 'dragging' : '';

  return (
    <div className="w-full space-y-6">
      <div
        className={`relative group glow-border ${borderClasses} w-full h-72 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-500/30 flex flex-col justify-center items-center p-4 transition-all duration-300 ease-in-out`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input type="file" ref={fileInputRef} onChange={onFileChange} accept={SUPPORTED_FORMATS.join(',')} className="hidden" />
        {preview ? (
            <>
                <img src={preview} alt="Image preview" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                <button 
                    onClick={(e) => { e.stopPropagation(); clearInput(); }} 
                    className="absolute top-3 right-3 p-1 bg-black/60 text-white rounded-full hover:bg-red-500/80 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Remove image"
                >
                    <XCircleIcon className="h-7 w-7" />
                </button>
            </>
        ) : (
            isPastingUrl ? (
                <div className="w-full max-w-lg px-4 flex flex-col items-center">
                    <div className="relative w-full">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"/>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleUrlPaste(); }}
                            placeholder="Paste image URL here and press Enter"
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setIsPastingUrl(false); }} className="mt-4 text-sm text-gray-400 hover:text-white">
                        Cancel
                    </button>
                </div>
            ) : (
                <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <UploadIcon className="mx-auto h-16 w-16 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                    <p className="mt-4 text-xl font-semibold text-gray-300">Drag & Drop or Click to Upload</p>
                    <p className="text-sm text-gray-500">
                        Or{' '}
                        <span 
                            onClick={(e) => { e.stopPropagation(); setIsPastingUrl(true); }} 
                            className="font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                        >
                            paste an image URL
                        </span>
                    </p>
                </div>
            )
        )}
      </div>
      {error && <p className="text-sm text-red-400 text-center -mt-2">{error}</p>}
    </div>
  );
}