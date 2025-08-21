"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  quality?: number;
  loading?: 'lazy' | 'eager';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 400,
  height = 300,
  className = "",
  priority = false,
  fallbackSrc = "/assets/default-avatar.webp",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  placeholder = 'blur',
  quality = 75, // Qualité réduite pour de meilleures performances
  loading = 'lazy'
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Optimiser le src pour utiliser WebP si disponible
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.includes('.webp') || originalSrc.includes('.avif')) {
      return originalSrc;
    }
    
    // Essayer de trouver une version WebP
    const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return webpSrc;
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Essayer le fallback, puis l'original si le WebP échoue
      if (imageSrc !== src && imageSrc !== fallbackSrc) {
        setImageSrc(src);
      } else if (imageSrc !== fallbackSrc) {
        setImageSrc(fallbackSrc);
      }
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setImageLoaded(true);
  };

  useEffect(() => {
    setImageSrc(getOptimizedSrc(src));
    setIsLoading(true);
    setHasError(false);
    setImageLoaded(false);
  }, [src]);

  return (
    <div 
      className={`relative overflow-hidden image-optimized cls-image-container ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        aspectRatio: `${width}/${height}`,
        contain: 'layout style paint'
      }}
    >
      {/* Placeholder pendant le chargement */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded skeleton-optimized"
          style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
         
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'loading 1.5s infinite'
          
      }}
        />
      )}
      
      {/* Image optimisée */}
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 image-optimized ${
          isLoading || !imageLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        sizes={sizes}
        quality={quality}
        loading={loading}
        placeholder={placeholder}
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%'
        }}
      />
      
      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Indicateur d'erreur */}
      {hasError && imageSrc === fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Image non disponible</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
