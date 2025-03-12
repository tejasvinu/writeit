import { NextResponse } from 'next/server';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';

// Custom middleware to handle authentication and redirects more explicitly
export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    // Get the pathname from the URL
    const pathname = request.nextUrl.pathname;
    
    // If token exists (user is authenticated) but trying to access sign-in page
    if (request.nextauth.token && (
      pathname.startsWith('/auth/signin') || 
      pathname.startsWith('/auth/signup')
    )) {
      // Redirect authenticated users away from auth pages to documents
      return NextResponse.redirect(new URL('/documents', request.url));
    }

    // For all other routes that get here, request is authorized
    return NextResponse.next();
  },
  {
    callbacks: {
      // This is called before the middleware function above
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Always allow access to public routes
        if (
          pathname === '/' || 
          pathname.startsWith('/auth/') ||
          pathname.startsWith('/api/auth/')
        ) {
          return true;
        }
        
        // Only allow access to protected routes if token exists
        return !!token;
      },
    },
    pages: {
      // Make sure this matches your NextAuth configuration
      signIn: '/auth/signin',
    },
  }
);

// Match patterns for routes this middleware should run on
export const config = {
  matcher: [
    // Public routes (to allow redirects from auth pages if logged in)
    '/',
    '/auth/:path*',
    
    // Protected routes
    '/documents/:path*',
    '/editor/:path*',
  ],
};