import { NextResponse } from 'next/server';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';

// This function can be marked `async` if using `await` inside
export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(request: NextRequestWithAuth) {
    // Ensure that the token is valid and session exists
    if (request.nextauth.token) {
      return NextResponse.next();
    }
    
    // If there's no valid session, redirect to signin
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  },
  {
    callbacks: {
      // Only run this middleware for the matched paths
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  // Protect all routes under /documents and /editor
  matcher: ['/documents/:path*', '/editor/:path*']
};