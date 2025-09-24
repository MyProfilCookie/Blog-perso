"use client";

import React, { Suspense, ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import de motion avec fallback
const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.div })),
  {
    ssr: false,
    loading: () => <div className="opacity-0" />
  }
);

const MotionSection = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.section })),
  {
    ssr: false,
    loading: () => <section className="opacity-0" />
  }
);

const MotionArticle = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.article })),
  {
    ssr: false,
    loading: () => <article className="opacity-0" />
  }
);

const AnimatePresence = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.AnimatePresence })),
  {
    ssr: false,
    loading: () => <div />
  }
);

interface LazyMotionProps {
  children: ReactNode;
  as?: 'div' | 'section' | 'article';
  animate?: any;
  initial?: any;
  exit?: any;
  transition?: any;
  className?: string;
  style?: React.CSSProperties;
  variants?: any;
  whileHover?: any;
  whileTap?: any;
  layout?: boolean;
  layoutId?: string;
  fallback?: ReactNode;
  disableOnMobile?: boolean;
}

const LazyMotion: React.FC<LazyMotionProps> = ({
  children,
  as = 'div',
  animate,
  initial,
  exit,
  transition,
  className,
  style,
  variants,
  whileHover,
  whileTap,
  layout,
  layoutId,
  fallback,
  disableOnMobile = false,
  ...props
}) => {
  // Détection mobile côté client
  const [isMobile, setIsMobile] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        const isSmallScreen = window.innerWidth < 768;
        setIsMobile(isMobileDevice || isSmallScreen);
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Si on désactive sur mobile et qu'on est sur mobile, retourner un élément statique
  if (isClient && disableOnMobile && isMobile) {
    const StaticElement = as;
    return (
      <StaticElement className={className} style={style} {...props}>
        {children}
      </StaticElement>
    );
  }

  // Si pas encore côté client, retourner le fallback ou un élément statique
  if (!isClient) {
    if (fallback) return <>{fallback}</>;
    const StaticElement = as;
    return (
      <StaticElement className={className} style={style} {...props}>
        {children}
      </StaticElement>
    );
  }

  const motionProps = {
    animate,
    initial,
    exit,
    transition,
    className,
    style,
    variants,
    whileHover,
    whileTap,
    layout,
    layoutId,
    ...props
  };

  // Sélectionner le bon composant motion selon le type
  switch (as) {
    case 'section':
      return (
        <Suspense fallback={fallback || <section className={className} style={style}>{children}</section>}>
          <MotionSection {...motionProps}>
            {children}
          </MotionSection>
        </Suspense>
      );
    case 'article':
      return (
        <Suspense fallback={fallback || <article className={className} style={style}>{children}</article>}>
          <MotionArticle {...motionProps}>
            {children}
          </MotionArticle>
        </Suspense>
      );
    default:
      return (
        <Suspense fallback={fallback || <div className={className} style={style}>{children}</div>}>
          <MotionDiv {...motionProps}>
            {children}
          </MotionDiv>
        </Suspense>
      );
  }
};

// Export du composant AnimatePresence lazy
export const LazyAnimatePresence: React.FC<{ children: ReactNode; mode?: string }> = ({ 
  children, 
  mode = "wait" 
}) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={<>{children}</>}>
      <AnimatePresence mode={mode as any}>
        {children}
      </AnimatePresence>
    </Suspense>
  );
};

export default LazyMotion;