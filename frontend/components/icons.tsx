/* eslint-disable prettier/prettier */
import * as React from "react";

import { IconSvgProps } from "@/types";

export const Logo: React.FC<IconSvgProps> = ({
  size = 36,
  width,
  height,
  ...props
}) => (
  <svg
    fill="none"
    height={size || height}
    viewBox="0 0 32 32"
    width={size || width}
    {...props}>
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const DiscordIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}>
      <path
        d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z"
        fill="currentColor"
      />
    </svg>
  );
};
export const AutismLogo: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 200 200"
      width={size || width}
      // eslint-disable-next-line prettier/prettier
      {...props}>
      <circle cx={100} cy={100} fill="#f2f2f2" r={90} />
      <path
        d="M100 30 A30 30 0 0 1 130 60 L130 100 A30 30 0 0 1 100 130 L100 170 A30 30 0 0 1 70 140 L70 100 A30 30 0 0 1 100 70 Z"
        fill="#0066cc"
      />
      <circle cx={165} cy={100} fill="#cc3300" r={15} />
      <circle cx={35} cy={100} fill="#ff9900" r={15} />
      <circle cx={100} cy={165} fill="#33cc33" r={15} />
      <path
        d="M85 95 A10 10 0 1 1 95 105 A10 10 0 1 1 105 95 A10 10 0 1 1 115 105 A10 10 0 1 1 85 95"
        fill="none"
        stroke="white"
        strokeWidth={3}
      />
    </svg>
  );
};

// Nouvelle icône de menu burger personnalisée pour AutiStudy
export const AutiStudyMenuIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 32 32"
      width={size || width}
      {...props}
    >
      {/* Fond circulaire avec dégradé */}
      <defs>
        <linearGradient id="menuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0066cc" />
          <stop offset="50%" stopColor="#33cc33" />
          <stop offset="100%" stopColor="#ff9900" />
        </linearGradient>
      </defs>
      
      {/* Cercle de fond */}
      <circle cx="16" cy="16" r="15" fill="url(#menuGradient)" opacity="0.1" />
      
      {/* Ligne supérieure avec cercle coloré */}
      <g transform="translate(8, 10)">
        <circle cx="2" cy="2" r="2" fill="#0066cc" />
        <rect x="6" y="1.5" width="10" height="1" rx="0.5" fill="currentColor" />
      </g>
      
      {/* Ligne centrale avec cercle coloré */}
      <g transform="translate(8, 15)">
        <circle cx="2" cy="2" r="2" fill="#ff9900" />
        <rect x="6" y="1.5" width="10" height="1" rx="0.5" fill="currentColor" />
      </g>
      
      {/* Ligne inférieure avec cercle coloré */}
      <g transform="translate(8, 20)">
        <circle cx="2" cy="2" r="2" fill="#33cc33" />
        <rect x="6" y="1.5" width="10" height="1" rx="0.5" fill="currentColor" />
      </g>
      
      {/* Petit cercle rouge en haut à droite */}
      <circle cx="24" cy="8" r="3" fill="#cc3300" opacity="0.8" />
    </svg>
  );
};

// Icône pour les commandes en cours (remplace ⏳)
export const PendingOrdersIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 32 32"
      width={size || width}
      {...props}
    >
      {/* Cercle de fond */}
      <circle cx="16" cy="16" r="14" fill="#ffeb3b" opacity="0.2" />
      
      {/* Horloge stylisée */}
      <circle cx="16" cy="16" r="12" fill="none" stroke="#ff9800" strokeWidth="2" />
      <circle cx="16" cy="16" r="2" fill="#ff9800" />
      
      {/* Aiguilles de l'horloge */}
      <line x1="16" y1="16" x2="16" y2="8" stroke="#ff9800" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="16" x2="20" y2="16" stroke="#ff9800" strokeWidth="2" strokeLinecap="round" />
      
      {/* Points de suspension animés */}
      <circle cx="8" cy="8" r="1.5" fill="#ff9800" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="12" cy="8" r="1.5" fill="#ff9800" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
      </circle>
      <circle cx="16" cy="8" r="1.5" fill="#ff9800" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" begin="1s" />
      </circle>
    </svg>
  );
};

// Icône pour les commandes envoyées (remplace 🚚)
export const ShippedOrdersIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 32 32"
      width={size || width}
      {...props}
    >
      {/* Fond */}
      <rect x="4" y="12" width="20" height="8" rx="2" fill="#2196f3" opacity="0.2" />
      
      {/* Camion stylisé */}
      <rect x="6" y="14" width="12" height="4" rx="1" fill="#2196f3" />
      <rect x="18" y="14" width="4" height="4" rx="1" fill="#1976d2" />
      
      {/* Roues */}
      <circle cx="10" cy="20" r="2" fill="#424242" />
      <circle cx="22" cy="20" r="2" fill="#424242" />
      <circle cx="10" cy="20" r="1" fill="#9e9e9e" />
      <circle cx="22" cy="20" r="1" fill="#9e9e9e" />
      
      {/* Phares */}
      <circle cx="8" cy="16" r="0.5" fill="#ffeb3b" />
      <circle cx="24" cy="16" r="0.5" fill="#ffeb3b" />
      
      {/* Traces de mouvement */}
      <path d="M4 20 Q8 18 12 20" stroke="#2196f3" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M12 20 Q16 18 20 20" stroke="#2196f3" strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  );
};

// Icône pour les commandes livrées (remplace ✅)
export const DeliveredOrdersIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 32 32"
      width={size || width}
      {...props}
    >
      {/* Cercle de fond */}
      <circle cx="16" cy="16" r="14" fill="#4caf50" opacity="0.2" />
      
      {/* Cercle principal */}
      <circle cx="16" cy="16" r="10" fill="none" stroke="#4caf50" strokeWidth="2" />
      
      {/* Coches de validation */}
      <path d="M12 16 L14 18 L20 12" stroke="#4caf50" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Étoiles décoratives */}
      <path d="M8 8 L9 10 L11 10 L9.5 11.5 L10 13.5 L8 12 L6 13.5 L6.5 11.5 L5 10 L7 10 Z" fill="#4caf50" opacity="0.6" />
      <path d="M24 8 L25 10 L27 10 L25.5 11.5 L26 13.5 L24 12 L22 13.5 L22.5 11.5 L21 10 L23 10 Z" fill="#4caf50" opacity="0.6" />
      
      {/* Animation de pulsation */}
      <circle cx="16" cy="16" r="10" fill="none" stroke="#4caf50" strokeWidth="1" opacity="0.3">
        <animate attributeName="r" values="10;12;10" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

// Icône de fermeture personnalisée (remplace le X)
export const CloseMenuIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 32 32"
      width={size || width}
      {...props}
    >
      {/* Cercle de fond */}
      <circle cx="16" cy="16" r="14" fill="#f44336" opacity="0.1" />
      
      {/* Croix stylisée */}
      <path d="M10 10 L22 22 M22 10 L10 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      
      {/* Cercle décoratif */}
      <circle cx="16" cy="16" r="8" fill="none" stroke="#f44336" strokeWidth="1" opacity="0.3" />
    </svg>
  );
};

// Nouvelle icône de menu burger originale pour AutiStudy
export const AutiStudyBurgerIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 32 32"
      width={size || width}
      {...props}
    >
      {/* Fond avec dégradé subtil */}
      <defs>
        <linearGradient id="burgerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0066cc" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#33cc33" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ff9900" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      
      {/* Rectangle de fond arrondi */}
      <rect x="4" y="6" width="24" height="20" rx="10" fill="url(#burgerGradient)" />
      
      {/* Ligne supérieure avec cercle coloré */}
      <g transform="translate(8, 10)">
        <circle cx="2" cy="2" r="2" fill="#0066cc" />
        <rect x="6" y="1.5" width="10" height="1" rx="0.5" fill="currentColor" />
        <circle cx="18" cy="2" r="1" fill="#cc3300" opacity="0.8" />
      </g>
      
      {/* Ligne centrale avec cercle coloré */}
      <g transform="translate(8, 15)">
        <circle cx="2" cy="2" r="2" fill="#ff9900" />
        <rect x="6" y="1.5" width="10" height="1" rx="0.5" fill="currentColor" />
        <circle cx="18" cy="2" r="1" fill="#33cc33" opacity="0.8" />
      </g>
      
      {/* Ligne inférieure avec cercle coloré */}
      <g transform="translate(8, 20)">
        <circle cx="2" cy="2" r="2" fill="#33cc33" />
        <rect x="6" y="1.5" width="10" height="1" rx="0.5" fill="currentColor" />
        <circle cx="18" cy="2" r="1" fill="#0066cc" opacity="0.8" />
      </g>
      
      {/* Petits points décoratifs */}
      <circle cx="6" cy="6" r="0.5" fill="#ff9900" opacity="0.6" />
      <circle cx="26" cy="6" r="0.5" fill="#cc3300" opacity="0.6" />
      <circle cx="6" cy="26" r="0.5" fill="#33cc33" opacity="0.6" />
      <circle cx="26" cy="26" r="0.5" fill="#0066cc" opacity="0.6" />
    </svg>
  );
};

// Icône de menu burger alternative plus simple mais originale
export const SimpleAutiStudyBurgerIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 32 32"
      width={size || width}
      {...props}
    >
      {/* Ligne supérieure avec cercle */}
      <g>
        <circle cx="8" cy="12" r="2" fill="#0066cc" />
        <rect x="12" y="11.5" width="12" height="1" rx="0.5" fill="currentColor" />
        <circle cx="26" cy="12" r="1" fill="#cc3300" />
      </g>
      
      {/* Ligne centrale avec cercle */}
      <g>
        <circle cx="8" cy="16" r="2" fill="#ff9900" />
        <rect x="12" y="15.5" width="12" height="1" rx="0.5" fill="currentColor" />
        <circle cx="26" cy="16" r="1" fill="#33cc33" />
      </g>
      
      {/* Ligne inférieure avec cercle */}
      <g>
        <circle cx="8" cy="20" r="2" fill="#33cc33" />
        <rect x="12" y="19.5" width="12" height="1" rx="0.5" fill="currentColor" />
        <circle cx="26" cy="20" r="1" fill="#0066cc" />
      </g>
    </svg>
  );
};

// Icône de menu burger avec design puzzle/pièces
export const PuzzleBurgerIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 32 32"
      width={size || width}
      {...props}
    >
      {/* Pièce supérieure gauche */}
      <path d="M6 10 L10 10 L10 14 L14 14 L14 10 L18 10 L18 14 L14 14 L14 18 L10 18 L10 14 L6 14 Z" fill="#0066cc" />
      
      {/* Pièce centrale */}
      <path d="M12 14 L16 14 L16 18 L20 18 L20 14 L24 14 L24 18 L20 18 L20 22 L16 22 L16 18 L12 18 Z" fill="#ff9900" />
      
      {/* Pièce inférieure droite */}
      <path d="M18 18 L22 18 L22 22 L26 22 L26 18 L30 18 L30 22 L26 22 L26 26 L22 26 L22 22 L18 22 Z" fill="#33cc33" />
      
      {/* Points de connexion */}
      <circle cx="14" cy="14" r="1" fill="white" opacity="0.8" />
      <circle cx="20" cy="18" r="1" fill="white" opacity="0.8" />
      <circle cx="26" cy="22" r="1" fill="white" opacity="0.8" />
    </svg>
  );
};

// Icône de menu burger simple et visible
export const VisibleBurgerIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 32 32"
      width={size || width}
      {...props}
    >
      {/* Ligne supérieure avec cercle bleu */}
      <rect x="4" y="8" width="20" height="2" rx="1" fill="currentColor" />
      <circle cx="28" cy="9" r="3" fill="#0066cc" />
      
      {/* Ligne centrale avec cercle orange */}
      <rect x="4" y="15" width="20" height="2" rx="1" fill="currentColor" />
      <circle cx="28" cy="16" r="3" fill="#ff9900" />
      
      {/* Ligne inférieure avec cercle vert */}
      <rect x="4" y="22" width="20" height="2" rx="1" fill="currentColor" />
      <circle cx="28" cy="23" r="3" fill="#33cc33" />
      
      {/* Petit cercle rouge décoratif */}
      <circle cx="6" cy="6" r="2" fill="#cc3300" />
    </svg>
  );
};

export const TwitterIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}>
      <path
        d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"
        fill="currentColor"
      />
    </svg>
  );
};

export const GithubIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}>
      <path
        clipRule="evenodd"
        d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const MoonFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}>
    <path
      d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
      fill="currentColor"
    />
  </svg>
);

export const SunFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}>
    <g fill="currentColor">
      <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
      <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
    </g>
  </svg>
);

export const HeartFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}>
    <path
      d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);

export const SearchIcon = (props: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}>
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

export const NextUILogo: React.FC<IconSvgProps> = (props) => {
  const { width, height = 40 } = props;

  return (
    <svg
      fill="none"
      height={height}
      viewBox="0 0 161 32"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        className="fill-black dark:fill-white"
        d="M55.6827 5V26.6275H53.7794L41.1235 8.51665H40.9563V26.6275H39V5H40.89L53.5911 23.1323H53.7555V5H55.6827ZM67.4831 26.9663C66.1109 27.0019 64.7581 26.6329 63.5903 25.9044C62.4852 25.185 61.6054 24.1633 61.0537 22.9582C60.4354 21.5961 60.1298 20.1106 60.1598 18.6126C60.132 17.1113 60.4375 15.6228 61.0537 14.2563C61.5954 13.0511 62.4525 12.0179 63.5326 11.268C64.6166 10.5379 65.8958 10.16 67.1986 10.1852C68.0611 10.1837 68.9162 10.3468 69.7187 10.666C70.5398 10.9946 71.2829 11.4948 71.8992 12.1337C72.5764 12.8435 73.0985 13.6889 73.4318 14.6152C73.8311 15.7483 74.0226 16.9455 73.9968 18.1479V19.0773H63.2262V17.4194H72.0935C72.1083 16.4456 71.8952 15.4821 71.4714 14.6072C71.083 13.803 70.4874 13.1191 69.7472 12.6272C68.9887 12.1348 68.1022 11.8812 67.2006 11.8987C66.2411 11.8807 65.3005 12.1689 64.5128 12.7223C63.7332 13.2783 63.1083 14.0275 62.6984 14.8978C62.2582 15.8199 62.0314 16.831 62.0352 17.8546V18.8476C62.009 20.0078 62.2354 21.1595 62.6984 22.2217C63.1005 23.1349 63.7564 23.9108 64.5864 24.4554C65.4554 24.9973 66.4621 25.2717 67.4831 25.2448C68.1676 25.2588 68.848 25.1368 69.4859 24.8859C70.0301 24.6666 70.5242 24.3376 70.9382 23.919C71.3183 23.5345 71.6217 23.0799 71.8322 22.5799L73.5995 23.1604C73.3388 23.8697 72.9304 24.5143 72.4019 25.0506C71.8132 25.6529 71.1086 26.1269 70.3314 26.4434C69.4258 26.8068 68.4575 26.9846 67.4831 26.9663V26.9663ZM78.8233 10.4075L82.9655 17.325L87.1076 10.4075H89.2683L84.1008 18.5175L89.2683 26.6275H87.103L82.9608 19.9317L78.8193 26.6275H76.6647L81.7711 18.5169L76.6647 10.4062L78.8233 10.4075ZM99.5142 10.4075V12.0447H91.8413V10.4075H99.5142ZM94.2427 6.52397H96.1148V22.3931C96.086 22.9446 96.2051 23.4938 96.4597 23.9827C96.6652 24.344 96.9805 24.629 97.3589 24.7955C97.7328 24.9548 98.1349 25.0357 98.5407 25.0332C98.7508 25.0359 98.9607 25.02 99.168 24.9857C99.3422 24.954 99.4956 24.9205 99.6283 24.8853L100.026 26.5853C99.8062 26.6672 99.5805 26.7327 99.3511 26.7815C99.0274 26.847 98.6977 26.8771 98.3676 26.8712C97.6854 26.871 97.0119 26.7156 96.3973 26.4166C95.7683 26.1156 95.2317 25.6485 94.8442 25.0647C94.4214 24.4018 94.2097 23.6242 94.2374 22.8363L94.2427 6.52397ZM118.398 5H120.354V19.3204C120.376 20.7052 120.022 22.0697 119.328 23.2649C118.644 24.4235 117.658 25.3698 116.477 26.0001C115.168 26.6879 113.708 27.0311 112.232 26.9978C110.759 27.029 109.302 26.6835 107.996 25.9934C106.815 25.362 105.827 24.4161 105.141 23.2582C104.447 22.0651 104.092 20.7022 104.115 19.319V5H106.08V19.1831C106.061 20.2559 106.324 21.3147 106.843 22.2511C107.349 23.1459 108.094 23.8795 108.992 24.3683C109.993 24.9011 111.111 25.1664 112.242 25.139C113.373 25.1656 114.493 24.9003 115.495 24.3683C116.395 23.8815 117.14 23.1475 117.644 22.2511C118.16 21.3136 118.421 20.2553 118.402 19.1831L118.398 5ZM128 5V26.6275H126.041V5H128Z"
      />
      <path
        className="fill-black dark:fill-white"
        d="M23.5294 0H8.47059C3.79241 0 0 3.79241 0 8.47059V23.5294C0 28.2076 3.79241 32 8.47059 32H23.5294C28.2076 32 32 28.2076 32 23.5294V8.47059C32 3.79241 28.2076 0 23.5294 0Z"
      />
      <path
        className="fill-white dark:fill-black"
        d="M17.5667 9.21729H18.8111V18.2403C18.8255 19.1128 18.6 19.9726 18.159 20.7256C17.7241 21.4555 17.0968 22.0518 16.3458 22.4491C15.5717 22.8683 14.6722 23.0779 13.6473 23.0779C12.627 23.0779 11.7286 22.8672 10.9521 22.4457C10.2007 22.0478 9.5727 21.4518 9.13602 20.7223C8.6948 19.9705 8.4692 19.1118 8.48396 18.2403V9.21729H9.72854V18.1538C9.71656 18.8298 9.88417 19.4968 10.2143 20.0868C10.5362 20.6506 11.0099 21.1129 11.5814 21.421C12.1689 21.7448 12.8576 21.9067 13.6475 21.9067C14.4374 21.9067 15.1272 21.7448 15.7169 21.421C16.2895 21.1142 16.7635 20.6516 17.0844 20.0868C17.4124 19.4961 17.5788 18.8293 17.5667 18.1538V9.21729ZM23.6753 9.21729V22.845H22.4309V9.21729H23.6753Z"
      />
    </svg>
  );
};
