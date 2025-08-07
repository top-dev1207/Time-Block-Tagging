import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleCalendarAPI } from "@/lib/google-calendar";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !session.accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const calendar = new GoogleCalendarAPI(session.accessToken);
    
    console.log(`Fetching calendar list for user: ${session.user.email}`);

    const calendars = await calendar.getCalendars();

    console.log(`Successfully fetched ${calendars.items?.length || 0} calendars`);

    return NextResponse.json({
      success: true,
      calendars: calendars.items || []
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Calendar list fetch error:", {
      message: err.message,
      stack: err.stack
    });

    return NextResponse.json(
      { 
        error: "Failed to fetch calendar list",
        details: err.message 
      },
      { status: 500 }
    );
  }
}