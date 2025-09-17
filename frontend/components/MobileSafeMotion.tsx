"use client";

import { motion, MotionProps } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";

interface MobileSafeMotionProps extends MotionProps {
  children: ReactNode;
  fallback?: ReactNode;
  disableOnMobile?: boolean;
}

export default function MobileSafeMotion({ 
  children, 
  fallback, 
  disableOnMobile = true,
  ...motionProps 
}: MobileSafeMotionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
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

  // Si on est côté serveur ou si on désactive les animations sur mobile
  if (!isClient || (isMobile && disableOnMobile)) {
    return <>{fallback || children}</>;
  }

  return (
    <motion.div {...motionProps}>
      {children}
    </motion.div>
  );
}
