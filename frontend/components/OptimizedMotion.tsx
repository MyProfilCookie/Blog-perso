"use client";

import React from 'react';
import { motion, MotionProps } from 'framer-motion';

// Variantes d'animation optimisées pour les performances
export const optimizedVariants = {
  // Animation de fade in/out
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  
  // Animation de slide depuis le bas
  slideUp: {
    initial: { opacity: 0, transform: "translateY(20px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    exit: { opacity: 0, transform: "translateY(-20px)" },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  
  // Animation de slide depuis la gauche
  slideLeft: {
    initial: { opacity: 0, transform: "translateX(-20px)" },
    animate: { opacity: 1, transform: "translateX(0px)" },
    exit: { opacity: 0, transform: "translateX(20px)" },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  
  // Animation de scale
  scale: {
    initial: { opacity: 0, transform: "scale(0.9)" },
    animate: { opacity: 1, transform: "scale(1)" },
    exit: { opacity: 0, transform: "scale(0.9)" },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  
  // Animation de rotation légère
  rotate: {
    initial: { opacity: 0, transform: "rotate(-5deg) scale(0.9)" },
    animate: { opacity: 1, transform: "rotate(0deg) scale(1)" },
    exit: { opacity: 0, transform: "rotate(5deg) scale(0.9)" },
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

interface OptimizedMotionProps extends MotionProps {
  children: React.ReactNode;
  variant?: keyof typeof optimizedVariants;
  delay?: number;
  className?: string;
}

// Composant motion optimisé
export const OptimizedMotion: React.FC<OptimizedMotionProps> = ({
  children,
  variant = 'fadeIn',
  delay = 0,
  className = "",
  ...props
}) => {
  const variantConfig = optimizedVariants[variant];
  
  return (
    <motion.div
      initial={variantConfig.initial}
      animate={variantConfig.animate}
      exit={variantConfig.exit}
      transition={{ 
        ...variantConfig.transition, 
        delay 
      }}
      className={`animation-optimized ${className}`}
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)', // Force GPU acceleration
        backfaceVisibility: 'hidden'
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les listes avec animation en cascade
interface OptimizedMotionListProps {
  children: React.ReactNode[];
  variant?: keyof typeof optimizedVariants;
  staggerDelay?: number;
  className?: string;
}

export const OptimizedMotionList: React.FC<OptimizedMotionListProps> = ({
  children,
  variant = 'slideUp',
  staggerDelay = 0.1,
  className = ""
}) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <OptimizedMotion
          key={index}
          variant={variant}
          delay={index * staggerDelay}
        >
          {child}
        </OptimizedMotion>
      ))}
    </div>
  );
};

// Hook pour les animations de scroll optimisées
export const useOptimizedScrollAnimation = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Arrêter l'observation une fois visible
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

// Composant pour les animations au scroll
interface ScrollAnimationProps {
  children: React.ReactNode;
  variant?: keyof typeof optimizedVariants;
  className?: string;
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  variant = 'slideUp',
  className = ""
}) => {
  const { ref, isVisible } = useOptimizedScrollAnimation();
  const variantConfig = optimizedVariants[variant];

  return (
    <motion.div
      ref={ref}
      initial={variantConfig.initial}
      animate={isVisible ? variantConfig.animate : variantConfig.initial}
      transition={variantConfig.transition}
      className={`animation-optimized ${className}`}
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </motion.div>
  );
};

export default OptimizedMotion;