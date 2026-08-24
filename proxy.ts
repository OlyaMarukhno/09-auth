import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = 
    request.cookies.get('token')?.value || 
    request.cookies.get('connect.sid')?.value || 
    request.cookies.get('refreshToken')?.value; 

  const isPrivateRoute = privateRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};