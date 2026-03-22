import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware simplifié
 * La protection des routes est gérée côté client par AdminProtectedLayout
 * car les tokens sont stockés dans localStorage (inaccessible côté serveur)
 */
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};