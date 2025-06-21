import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    '/chat/:path*',
    '/problems/:path*',
    '/profile/:path*',
  ],
}; 