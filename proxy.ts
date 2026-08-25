import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';
import { parseSetCookie } from 'cookie';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const cookieStore = await cookies();
  
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPrivateRoute = privateRoutes.some((route) => path === route || path.startsWith(route + '/'));
  const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith(route + '/'));

  let isAuthenticated = !!accessToken;
  const updatedCookies: { name: string; value: string; options: any }[] = [];

  if (!accessToken && refreshToken) {
    try {
      const sessionRes = await checkSession();
      if (sessionRes && sessionRes.status === 200) {
        isAuthenticated = true;

        const setCookieHeader = sessionRes.headers['set-cookie'];
        if (setCookieHeader) {
          const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
          for (const cookieStr of cookieArray) {
            const parsed = parseSetCookie(cookieStr);
            if (parsed.value) {
              cookieStore.set(parsed.name, parsed.value, parsed);
              updatedCookies.push({
                name: parsed.name,
                value: parsed.value,
                options: parsed,
              });
            }
          }
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const response = NextResponse.next();
  for (const cookie of updatedCookies) {
    response.cookies.set({
      name: cookie.name,
      value: cookie.value,
      ...cookie.options,
    });
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};