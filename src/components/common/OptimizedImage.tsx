import React, { useState } from 'react';
import { ImageOff, Sparkles } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/4';
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  aspectRatio = '4/3',
  priority = false,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const aspectClass = {
    '16/9': 'aspect-[16/9]',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-[1/1]',
    '3/4': 'aspect-[3/4]',
  }[aspectRatio];

  return (
    <div
      className={`relative overflow-hidden bg-stone-200/70 select-none ${aspectClass} ${className}`}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 bg-stone-200/50 animate-pulse flex items-center justify-center">
          <span className="text-[10px] uppercase font-mono text-stone-400 tracking-wider">
            Loading Asset
          </span>
        </div>
      )}

      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 p-4 text-center border border-stone-200">
          <ImageOff className="w-6 h-6 text-stone-400 stroke-[1.5] mb-2" />
          <p className="text-xs font-medium text-stone-600 line-clamp-1">{alt}</p>
          <span className="text-[10px] text-stone-400 mt-0.5 font-mono">
            Architectural Specimen
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
