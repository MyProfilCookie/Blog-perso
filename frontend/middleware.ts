import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Préconnexion pour les ressources externes
  response.headers.set('Link', [
    '<https://fonts.googleapis.com>; rel=preconnect',
    '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
    '<https://blog-perso.onrender.com>; rel=preconnect',
  ].join(', '));
  
  // Optimisation du cache pour les pages statiques
  const staticPaths = ['/about', '/faq', '/contact', '/posts', '/articles', '/blog'];
  if (staticPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=7200'
    );
  }
  
  // Cache optimisé pour la page controle (60s avec stale-while-revalidate)
  if (request.nextUrl.pathname.startsWith('/controle')) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    );
    // Early hints pour précharger les ressources critiques
    response.headers.set('X-DNS-Prefetch-Control', 'on');
  }
  
  // Headers de performance et sécurité
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

