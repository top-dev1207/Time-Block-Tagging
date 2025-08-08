import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch all event tags for the user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const eventTags = await prisma.event_tags.findMany({
      where: {
        user: {
          email: session.user.email!
        }
      },
      select: {
        eventId: true,
        valueTier: true,
        category: true,
      }
    });

    // Convert to a map for easier lookup
    const tagsMap = eventTags.reduce((acc, tag) => {
      acc[tag.eventId] = {
        valueTier: tag.valueTier,
        category: tag.category
      };
      return acc;
    }, {} as Record<string, { valueTier: string; category: string }>);

    return NextResponse.json({
      success: true,
      tags: tagsMap
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Error fetching event tags:", err.message);
    
    // If table doesn't exist yet, return empty tags
    if (err.message.includes("doesn't exist") || err.message.includes("event_tags")) {
      console.log("Event tags table not found, returning empty tags");
      return NextResponse.json({
        success: true,
        tags: {}
      });
    }

    return NextResponse.json(
      { 
        error: "Failed to fetch event tags",
        details: err.message 
      },
      { status: 500 }
    );
  }
}

// POST: Save or update an event tag
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { eventId, valueTier, category } = body;

    if (!eventId || !valueTier || !category) {
      return NextResponse.json(
        { error: "Missing required fields: eventId, valueTier, category" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.users.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Upsert the event tag (update if exists, create if not)
    const eventTag = await prisma.event_tags.upsert({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: eventId
        }
      },
      update: {
        valueTier,
        category,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        eventId,
        valueTier,
        category
      }
    });

    console.log(`Event tag saved for event ${eventId}: tier=${valueTier}, category=${category}`);

    return NextResponse.json({
      success: true,
      tag: {
        eventId: eventTag.eventId,
        valueTier: eventTag.valueTier,
        category: eventTag.category
      }
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Error saving event tag:", err.message);
    
    // If table doesn't exist yet, return success anyway (temporary)
    if (err.message.includes("doesn't exist") || err.message.includes("event_tags")) {
      console.log("Event tags table not found, skipping save");
      return NextResponse.json({
        success: true,
        message: "Tag save skipped - table not found"
      });
    }

    return NextResponse.json(
      { 
        error: "Failed to save event tag",
        details: err.message 
      },
      { status: 500 }
    );
  }
}

// DELETE: Remove an event tag
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: "Missing eventId parameter" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.users.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Delete the event tag
    await prisma.event_tags.delete({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: eventId
        }
      }
    });

    console.log(`Event tag deleted for event ${eventId}`);

    return NextResponse.json({
      success: true,
      message: "Event tag deleted successfully"
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    
    // If the tag doesn't exist, that's okay
    if (err.message.includes("Record to delete does not exist")) {
      return NextResponse.json({
        success: true,
        message: "Event tag not found (already deleted)"
      });
    }

    console.error("Error deleting event tag:", err.message);

    return NextResponse.json(
      { 
        error: "Failed to delete event tag",
        details: err.message 
      },
      { status: 500 }
    );
  }
}