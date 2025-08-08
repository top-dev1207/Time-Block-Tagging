import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleCalendarAPI } from "@/lib/google-calendar";

export async function PUT(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
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
    const eventId = params.eventId;

    // Convert date strings to Date objects if provided
    if (eventData.startTime) {
      eventData.startTime = new Date(eventData.startTime);
    }
    if (eventData.endTime) {
      eventData.endTime = new Date(eventData.endTime);
    }

    const calendar = new GoogleCalendarAPI(accessToken);
    
    console.log(`Updating calendar event ${eventId} for user: ${session.user.email}`);
    console.log(`Update data:`, eventData);

    try {
      const updatedEvent = await calendar.updateEvent(calendarId, eventId, eventData);
      console.log(`Successfully updated event with ID: ${updatedEvent.id}`);
      
      return NextResponse.json({
        success: true,
        event: updatedEvent
      });
    } catch (updateError) {
      // If the update fails, try to get more details
      console.error("Detailed update error:", updateError);
      throw updateError;
    }

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Calendar event update error:", {
      message: err.message,
      stack: err.stack
    });

    return NextResponse.json(
      { 
        error: "Failed to update calendar event",
        details: err.message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
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

    const { searchParams } = new URL(request.url);
    const calendarId = searchParams.get('calendarId') || 'primary';
    const eventId = params.eventId;

    const calendar = new GoogleCalendarAPI(accessToken);
    
    console.log(`Deleting calendar event ${eventId} for user: ${session.user.email}`);

    try {
      await calendar.deleteEvent(calendarId, eventId);
      console.log(`Successfully deleted event with ID: ${eventId}`);
    } catch (deleteError) {
      console.error("Detailed delete error:", deleteError);
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully"
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Calendar event deletion error:", {
      message: err.message,
      stack: err.stack
    });

    return NextResponse.json(
      { 
        error: "Failed to delete calendar event",
        details: err.message 
      },
      { status: 500 }
    );
  }
}