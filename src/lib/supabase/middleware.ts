import { type NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  return response;

  // const isApiRequest = request.nextUrl.pathname.startsWith("/api");
  // const isNeedAPIKey = request.nextUrl.pathname.startsWith("/api/v1");
  // if (isNeedAPIKey) {
  //   const apiKey = request.headers.get("X-API-KEY");
  //   if (apiKey === process.env.X_API_KEY) {
  //     return response;
  //   } else {
  //     return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  //   }
  // }

  // const supabase = await createSeverClient();

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) {
  //   if (isApiRequest) {
  //     return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  //   }

  //   const redirectUrl = request.nextUrl.clone();
  //   redirectUrl.pathname = "/auth/";
  //   redirectUrl.searchParams.set(`redirectTo`, request.nextUrl.pathname);
  //   return NextResponse.redirect(redirectUrl);
  // } else {
  //   if (user.user_metadata.status !== "active") {
  //     if (isApiRequest) {
  //       return new NextResponse(JSON.stringify({ error: "Access forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
  //     }
  //     if (!request.nextUrl.pathname.startsWith("/pages/unauthorized")) {
  //       const redirectUrl = request.nextUrl.clone();
  //       redirectUrl.pathname = "/pages/unauthorized";
  //       redirectUrl.searchParams.set(`redirectTo`, request.nextUrl.pathname);
  //       return NextResponse.redirect(redirectUrl);
  //     }
  //   } else {
  //     if (request.nextUrl.pathname.startsWith("/pages/unauthorized")) {
  //       const redirectUrl = request.nextUrl.clone();
  //       redirectUrl.pathname = request.nextUrl.searchParams.get("redirectTo") || "/";
  //       redirectUrl.searchParams.delete("redirectTo");
  //       return NextResponse.redirect(redirectUrl);
  //     }
  //   }
  // }
}
