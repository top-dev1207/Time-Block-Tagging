import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Create Google OAuth re-authorization URL with Calendar permissions
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!);
    googleAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXTAUTH_URL}/api/auth/callback/google`);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events');
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'consent'); // Force consent screen
    googleAuthUrl.searchParams.set('state', 'reauth'); // Mark as re-authorization

    return NextResponse.json({
      success: true,
      authUrl: googleAuthUrl.toString()
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Google re-auth URL generation error:", err.message);

    return NextResponse.json(
      { 
        error: "Failed to generate re-authorization URL",
        details: err.message 
      },
      { status: 500 }
    );
  }
}