import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected admin routes including statistics and audit-logs
  const adminRoutes = ['/admin', '/statistics', '/audit-logs'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  if (isAdminRoute) {
    try {
      // Create Supabase client for middleware
      let supabaseResponse = NextResponse.next({
        request,
      });

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              const cookieStore: { name: string; value: string }[] = [];
              request.cookies.getAll().forEach((cookie) => {
                cookieStore.push({ name: cookie.name, value: cookie.value });
              });
              return cookieStore;
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                request.cookies.set({ name, value });
                supabaseResponse.cookies.set({ name, value, ...options });
              });
            },
          },
        }
      );
      
      // Check user authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(url);
      }

      // Check user role via internal API
      try {
        const roleCheckUrl = new URL('/api/user/role', request.url);
        
        const roleResponse = await fetch(roleCheckUrl.toString(), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.id}`,
            'Content-Type': 'application/json',
            'User-Agent': 'NextJS-Middleware',
            'Cookie': request.headers.get('cookie') || '',
          },
        });

        if (!roleResponse.ok) {
          const url = request.nextUrl.clone();
          url.pathname = '/acesso-negado';
          return NextResponse.redirect(url);
        }

        const roleData = await roleResponse.json();

        if (!roleData.success || !roleData.profile || roleData.profile.role !== 'ADMIN') {
          const url = request.nextUrl.clone();
          url.pathname = '/acesso-negado';
          return NextResponse.redirect(url);
        }

        return NextResponse.next();

      } catch (apiError) {
        // Deny access on API error for security
        const url = request.nextUrl.clone();
        url.pathname = '/acesso-negado';
        return NextResponse.redirect(url);
      }

    } catch (error) {
      const url = request.nextUrl.clone();
      url.pathname = '/acesso-negado';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/statistics/:path*',
    '/audit-logs/:path*'
  ],
};