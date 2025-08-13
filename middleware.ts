import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Percorsi che non richiedono autenticazione
  const publicPaths = ['/login', '/api/auth/login', '/api/auth/logout'];
  const { pathname } = request.nextUrl;

  // Se è un percorso pubblico, lascia passare
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Controlla se l'utente è autenticato tramite cookie
  const authSession = request.cookies.get('auth-session');

  if (!authSession || authSession.value !== 'authenticated') {
    // Reindirizza alla pagina di login con il percorso di ritorno
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se autenticato, prosegui normalmente
  return NextResponse.next();
}

// Configura il matcher per applicare il middleware a tutte le pagine
export const config = {
  matcher: [
    /*
     * Applica il middleware a tutti i percorsi eccetto:
     * - api routes che iniziano con /api/auth
     * - _next/static (file statici)
     * - _next/image (ottimizzazione immagini)
     * - favicon.ico
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
