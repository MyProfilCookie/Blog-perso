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
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f2f2f2',
          borderRadius: '25%',
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" fill="#f2f2f2" r="90" />
          <path
            d="M100 30 A30 30 0 0 1 130 60 L130 100 A30 30 0 0 1 100 130 L100 170 A30 30 0 0 1 70 140 L70 100 A30 30 0 0 1 100 70 Z"
            fill="#0066cc"
          />
          <circle cx="165" cy="100" fill="#cc3300" r="15" />
          <circle cx="35" cy="100" fill="#ff9900" r="15" />
          <circle cx="100" cy="165" fill="#33cc33" r="15" />
          <path
            d="M85 95 A10 10 0 1 1 95 105 A10 10 0 1 1 105 95 A10 10 0 1 1 115 105 A10 10 0 1 1 85 95"
            fill="none"
            stroke="white"
            stroke-width="3"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}

