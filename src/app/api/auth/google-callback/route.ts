import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login?error=authentication_required', request.url));
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error("OAuth error:", error);
      return NextResponse.redirect(new URL('/dashboard/calendar?error=oauth_denied', request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/dashboard/calendar?error=no_code', request.url));
    }

    let stateData;
    try {
      stateData = state ? JSON.parse(state) : {};
    } catch {
      stateData = {};
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google-callback`,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokens);
      return NextResponse.redirect(new URL('/dashboard/calendar?error=token_exchange_failed', request.url));
    }

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();

    if (!userInfoResponse.ok) {
      console.error("Failed to get user info:", userInfo);
      return NextResponse.redirect(new URL('/dashboard/calendar?error=userinfo_failed', request.url));
    }

    // Store Google account in database
    try {
      const dbUser = await prisma.users.findUnique({
        where: { id: session.user.id }
      });

      if (!dbUser) {
        return NextResponse.redirect(new URL('/dashboard/calendar?error=user_not_found', request.url));
      }

      // Check if Google account already exists
      const existingAccount = await prisma.accounts.findFirst({
        where: {
          userId: dbUser.id,
          provider: 'google'
        }
      });

      const accountData = {
        userId: dbUser.id,
        type: 'oauth',
        provider: 'google',
        providerAccountId: userInfo.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : null,
        token_type: tokens.token_type,
        scope: tokens.scope,
        id_token: tokens.id_token,
      };

      if (existingAccount) {
        // Update existing account
        await prisma.accounts.update({
          where: { id: existingAccount.id },
          data: accountData
        });
      } else {
        // Create new account
        await prisma.accounts.create({
          data: accountData
        });
      }

      console.log("Google Calendar connected successfully for user:", session.user.email);
      
      const returnUrl = stateData.returnUrl || '/dashboard/calendar';
      return NextResponse.redirect(new URL(`${returnUrl}?success=calendar_connected`, request.url));

    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.redirect(new URL('/dashboard/calendar?error=database_error', request.url));
    }

  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL('/dashboard/calendar?error=callback_error', request.url));
  }
}