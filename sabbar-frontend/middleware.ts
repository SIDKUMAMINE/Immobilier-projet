import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware simplifie
 * La protection des routes est geree cote client par AdminProtectedLayout
 */
export function middleware(request: NextRequest) {
  try {
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};