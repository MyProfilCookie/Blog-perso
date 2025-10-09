// Edge config pour optimiser les performances
export const runtime = 'edge';

export async function GET() {
  return new Response(
    JSON.stringify({
      message: 'Edge configuration active',
      performance: 'optimized',
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    }
  );
}

