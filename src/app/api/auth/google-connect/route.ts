import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Generate Google OAuth URL for calendar access
    const googleOAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    const params = {
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google-callback`,
      response_type: 'code',
      scope: 'openid email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
      access_type: 'offline',
      prompt: 'consent',
      state: JSON.stringify({ 
        userId: session.user.id,
        returnUrl: '/dashboard/calendar' 
      })
    };

    Object.entries(params).forEach(([key, value]) => {
      googleOAuthUrl.searchParams.append(key, value);
    });

    return NextResponse.json({
      success: true,
      authUrl: googleOAuthUrl.toString()
    });

  } catch (error) {
    console.error("Error generating Google OAuth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate Google OAuth URL" },
      { status: 500 }
    );
  }
}