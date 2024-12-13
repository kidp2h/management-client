import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/auth',
  '/api/captcha(.*)',
  '/api/uploadthing',
  '/users',
  '/users/(.*)',
  '/forgot-password',
]);

export default clerkMiddleware(
  (auth, request) => {
    // console.log(auth().userId === null);
    if (request.nextUrl.pathname === '/auth') {
      if (auth().userId) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    }
    if (!isPublicRoute(request)) {
      // // console.log('private');
      if (!auth().userId) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth';
        return NextResponse.redirect(url);
      }
      auth().protect();
    }
  },
  { debug: false },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
