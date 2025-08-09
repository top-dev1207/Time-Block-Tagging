import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user has Google Calendar access
    const googleAccount = await prisma.accounts.findFirst({
      where: {
        userId: session.user.id,
        provider: 'google'
      }
    });

    const hasCalendarAccess = !!googleAccount?.access_token;
    const needsReauth = googleAccount?.expires_at ? 
      (googleAccount.expires_at * 1000) < Date.now() && !googleAccount.refresh_token : 
      false;

    return NextResponse.json({
      success: true,
      hasCalendarAccess,
      needsReauth,
      accountEmail: googleAccount ? session.user.email : null,
      lastConnected: googleAccount ? new Date().toISOString() : null
    });

  } catch (error) {
    console.error("Error checking calendar connection status:", error);
    return NextResponse.json(
      { error: "Failed to check calendar connection status" },
      { status: 500 }
    );
  }
}