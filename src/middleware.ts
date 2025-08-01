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
      console.log('🔐 Middleware: checking Supabase authentication for admin route:', pathname);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('❌ Middleware: user not authenticated, redirecting to login');
        console.log('🔍 Auth error:', authError?.message);
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(url);
      }

      console.log('✅ Middleware: user authenticated:', user.id, user.email);

      // Check user role via internal API
      try {
        console.log('📊 Middleware: checking user role via internal API...');
        
        const roleCheckUrl = new URL('/api/user/role', request.url);
        console.log('📡 Middleware: calling API at:', roleCheckUrl.toString());
        
        const roleResponse = await fetch(roleCheckUrl.toString(), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.id}`,
            'Content-Type': 'application/json',
            'User-Agent': 'NextJS-Middleware',
            'Cookie': request.headers.get('cookie') || '',
          },
        });

        console.log('📡 Middleware: role API response status:', roleResponse.status);

        if (!roleResponse.ok) {
          console.log('❌ Middleware: failed to check user role via API');
          const responseText = await roleResponse.text();
          console.log('❌ Response text:', responseText);
          const url = request.nextUrl.clone();
          url.pathname = '/acesso-negado';
          return NextResponse.redirect(url);
        }

        const roleData = await roleResponse.json();
        console.log('📋 Middleware: role data received:', JSON.stringify(roleData, null, 2));

        if (!roleData.success || !roleData.profile || roleData.profile.role !== 'ADMIN') {
          console.log('🚫 Middleware: user is not admin, redirecting to access denied');
          console.log('👤 Current role:', roleData.profile?.role || 'undefined');
          console.log('📊 Full profile:', roleData.profile);
          const url = request.nextUrl.clone();
          url.pathname = '/acesso-negado';
          return NextResponse.redirect(url);
        }

        console.log('✅ Middleware: admin permission confirmed, access granted to:', pathname);
        return NextResponse.next();

      } catch (apiError) {
        console.error('❌ Middleware: API error:', apiError);
        // Deny access on API error for security
        const url = request.nextUrl.clone();
        url.pathname = '/acesso-negado';
        return NextResponse.redirect(url);
      }

    } catch (error) {
      console.error('❌ Middleware: unexpected error:', error);
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