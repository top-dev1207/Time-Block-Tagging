import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // The user is already authenticated if this function is called
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;
        
        // Protect dashboard routes - require authentication
        if (pathname.startsWith("/dashboard")) {
          return !!token; // Returns true if token exists, false otherwise
        }
        
        // Allow access to other routes
        return true;
      },
    },
    pages: {
      signIn: "/login", // Redirect to login page if not authenticated
    },
  }
);

// Configure which routes to protect
export const config = {
  matcher: [
    // Protect all dashboard routes
    "/dashboard/:path*",
  ],
};