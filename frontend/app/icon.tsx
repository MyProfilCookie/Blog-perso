import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="32"
        height="32"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          background: 'transparent',
        }}
      >
        {/* Pièce de puzzle bleue */}
        <path
          d="M 30 15 L 45 15 C 45 10 50 10 50 15 C 50 10 55 10 55 15 L 70 15 C 75 15 75 20 75 25 L 75 40 C 80 40 80 45 75 50 C 80 50 80 55 75 55 L 75 70 C 75 75 70 75 65 75 L 50 75 C 50 80 50 85 45 85 C 40 85 40 80 40 75 L 25 75 C 20 75 20 70 20 65 L 20 50 C 15 50 15 45 20 45 C 15 45 15 40 20 40 L 20 25 C 20 20 25 15 30 15 Z"
          fill="#5eb3d6"
          stroke="#1e3a5f"
          strokeWidth="2"
        />
        {/* Points décoratifs */}
        <circle cx="85" cy="50" r="4" fill="#e07856" />
        <circle cx="50" cy="13" r="3" fill="#e07856" />
      </svg>
    ),
    {
      ...size,
    }
  );
}

