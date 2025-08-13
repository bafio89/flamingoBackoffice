// Middleware disabilitato - nessuna autenticazione richiesta
import { NextResponse } from 'next/server';

export function middleware() {
  // Lascia passare tutte le richieste senza controlli
  return NextResponse.next();
}

// Disabilita il matcher - nessuna pagina viene protetta
export const config = {
  matcher: [],
};
