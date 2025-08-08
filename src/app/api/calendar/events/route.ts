import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleCalendarAPI } from "@/lib/google-calendar";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("Session data:", {
      hasUser: !!session?.user,
      hasAccessToken: !!(session as any)?.accessToken,
      userEmail: session?.user?.email,
      sessionKeys: session ? Object.keys(session) : []
    });
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const accessToken = (session as any)?.accessToken;
    if (!accessToken) {
      console.error("No access token found in session");
      return NextResponse.json(
        { error: "No Google Calendar access token found. Please sign in with Google." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const calendarId = searchParams.get('calendarId') || 'primary';
    const timeMin = searchParams.get('timeMin');
    const timeMax = searchParams.get('timeMax');
    const maxResults = parseInt(searchParams.get('maxResults') || '50');

    const calendar = new GoogleCalendarAPI(accessToken);
    
    console.log(`Fetching calendar events for user: ${session.user.email}`);
    console.log(`Parameters: calendarId=${calendarId}, timeMin=${timeMin}, timeMax=${timeMax}`);

    const events = await calendar.getEvents(calendarId, timeMin || undefined, timeMax || undefined, maxResults);

    console.log(`Successfully fetched ${events.items?.length || 0} events`);

    return NextResponse.json({
      success: true,
      events: events.items || [],
      nextPageToken: events.nextPageToken
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Calendar events fetch error:", {
      message: err.message,
      stack: err.stack
    });

    return NextResponse.json(
      { 
        error: "Failed to fetch calendar events",
        details: err.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const accessToken = (session as any)?.accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: "No Google Calendar access token found. Please sign in with Google." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { calendarId = 'primary', ...eventData } = body;

    // Validate required fields
    if (!eventData.summary || !eventData.startTime || !eventData.endTime) {
      return NextResponse.json(
        { error: "Missing required fields: summary, startTime, endTime" },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects
    const createEventData = {
      ...eventData,
      startTime: new Date(eventData.startTime),
      endTime: new Date(eventData.endTime)
    };

    const calendar = new GoogleCalendarAPI(accessToken);
    
    console.log(`Creating calendar event for user: ${session.user.email}`);
    console.log(`Event data:`, createEventData);

    const createdEvent = await calendar.createEvent(calendarId, createEventData);

    console.log(`Successfully created event with ID: ${createdEvent.id}`);

    return NextResponse.json({
      success: true,
      event: createdEvent
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Calendar event creation error:", {
      message: err.message,
      stack: err.stack
    });

    return NextResponse.json(
      { 
        error: "Failed to create calendar event",
        details: err.message 
      },
      { status: 500 }
    );
  }
}