import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Allow access to auth pages when not authenticated
    if (!token && (
      pathname.startsWith('/login') ||
      pathname.startsWith('/signup') ||
      pathname.startsWith('/forgot-password') ||
      pathname.startsWith('/reset-password') ||
      pathname.startsWith('/verify-email') ||
      pathname.startsWith('/resend-verification')
    )) {
      return NextResponse.next();
    }

    // Redirect to login if not authenticated and trying to access protected routes
    if (!token && (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/profile') ||
      pathname.startsWith('/settings') ||
      pathname.startsWith('/change-password') ||
      pathname === '/unauthorized'
    )) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from auth pages
    if (token && (
      pathname.startsWith('/login') ||
      pathname.startsWith('/signup') ||
      pathname === '/'
    )) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Always allow access to auth-related pages
        if (
          pathname.startsWith('/login') ||
          pathname.startsWith('/signup') ||
          pathname.startsWith('/forgot-password') ||
          pathname.startsWith('/reset-password') ||
          pathname.startsWith('/verify-email') ||
          pathname.startsWith('/resend-verification') ||
          pathname.startsWith('/api/auth')
        ) {
          return true;
        }

        // Require authentication for protected routes
        if (
          pathname.startsWith('/dashboard') ||
          pathname.startsWith('/profile') ||
          pathname.startsWith('/settings') ||
          pathname.startsWith('/change-password') ||
          pathname === '/unauthorized'
        ) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/change-password",
    "/unauthorized",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/resend-verification",
    "/"
  ]
};