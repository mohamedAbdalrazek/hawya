import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from './utils/functions';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Run Next-Intl middleware first (sets locale correctly)
    const intlResponse = intlMiddleware(request);

    // Auth logic
    const session = request.cookies.get('session')?.value;
    const isAuthenticated = !!session;

    if (pathname.includes('/dashboard/admin') && !isAuthenticated) {
        const signInUrl = new URL('/staff-login', request.url);
        signInUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(signInUrl);
    }


    if (session) {
        const role = await validateSession(session, "server")
        if (!role && pathname.includes('/dashboard/admin')) {
            const signInUrl = new URL('/staff-login', request.url);
            signInUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(signInUrl);
        }
        if (role !== "admin" && pathname.includes('/staff')) {
            return NextResponse.redirect(new URL('/dashboard/admin/bookings', request.url))
        }
        if (pathname.includes('/staff-login') && role) {
            return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        }
    }

    return intlResponse; // return the response from Next-Intl
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};