import { NextResponse } from 'next/server';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    // Ensure HTTPS in production and handle Vercel-specific headers
    if (process.env.NODE_ENV === 'production') {
      const proto = request.headers.get("x-forwarded-proto");
      if (proto === "http") {
        const secureUrl = `https://${request.headers.get('host')}${request.nextUrl.pathname}`;
        return NextResponse.redirect(secureUrl);
      }
    }

    // If there's no valid session token, redirect to signin
    if (!request.nextauth.token) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
    
    // Add security headers
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    return response;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
    },
  }
);

export const config = {
  matcher: [
    // Match all routes that need protection
    '/documents/:path*', 
    '/editor/:path*',
    '/api/documents/:path*',
    '/api/ai/:path*',
    // Exclude auth-related API routes and public assets
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};