import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 401 }
      );
    }

    // Check database for Google account tokens
    let googleAccountInfo = null;
    try {
      const dbUser = await prisma.users.findUnique({
        where: { email: session.user.email! }
      });
      
      if (dbUser) {
        const googleAccount = await prisma.accounts.findFirst({
          where: {
            userId: dbUser.id,
            provider: "google"
          }
        });
        
        googleAccountInfo = {
          hasGoogleAccount: !!googleAccount,
          hasAccessToken: !!googleAccount?.access_token,
          hasRefreshToken: !!googleAccount?.refresh_token,
          tokenExpiry: googleAccount?.expires_at,
          scope: googleAccount?.scope,
          isTokenExpired: googleAccount?.expires_at ? (googleAccount.expires_at * 1000) < Date.now() : null
        };
      }
    } catch (dbError) {
      console.error("Database query error:", dbError);
      googleAccountInfo = { error: "Database query failed" };
    }

    // Debug session data
    const debugInfo = {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      },
      sessionKeys: Object.keys(session),
      hasAccessToken: !!(session as any)?.accessToken,
      accessTokenValue: (session as any)?.accessToken ? "EXISTS" : "MISSING",
      provider: (session.user as any)?.provider,
      googleAccountInfo,
      fullSessionStructure: {
        ...session,
        accessToken: (session as any)?.accessToken ? "***HIDDEN***" : "MISSING"
      }
    };

    console.log("DEBUG SESSION INFO:", debugInfo);

    return NextResponse.json({
      success: true,
      debug: debugInfo
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Session debug error:", err.message);

    return NextResponse.json(
      { 
        error: "Failed to debug session",
        details: err.message 
      },
      { status: 500 }
    );
  }
}