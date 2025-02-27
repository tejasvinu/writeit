import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/auth/signin',
  },
})

export const config = {
  // Protect all routes under /documents and /editor
  matcher: ['/documents/:path*', '/editor/:path*']
}