import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <svg
        width="180"
        height="180"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          background: 'transparent',
        }}
      >
        {/* Cercle de fond beige */}
        <circle cx="100" cy="100" r="95" fill="#f5f1e6" />
        
        {/* Pièce de puzzle bleue */}
        <path
          d="M 60 40 L 85 40 C 85 32 95 32 95 40 C 95 32 105 32 105 40 L 130 40 C 138 40 140 42 140 50 L 140 75 C 148 75 148 85 140 90 C 148 90 148 100 140 100 L 140 125 C 140 133 138 135 130 135 L 105 135 C 105 143 105 153 95 153 C 85 153 85 143 85 135 L 60 135 C 52 135 50 133 50 125 L 50 100 C 42 100 42 90 50 90 C 42 90 42 80 50 75 L 50 50 C 50 42 52 40 60 40 Z"
          fill="#5eb3d6"
          stroke="#1e3a5f"
          strokeWidth="3"
        />
        
        {/* Points décoratifs */}
        <circle cx="160" cy="95" r="6" fill="#e07856" />
        <circle cx="40" cy="95" r="5" fill="#e07856" opacity="0.7" />
        <circle cx="95" cy="28" r="5" fill="#e07856" />
        <circle cx="95" cy="162" r="5" fill="#e07856" opacity="0.7" />
      </svg>
    ),
    {
      ...size,
    }
  );
}

