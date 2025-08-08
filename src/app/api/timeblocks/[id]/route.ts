import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateTimeBlockSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  startTime: z.string().datetime("Invalid start time format").optional(),
  endTime: z.string().datetime("Invalid end time format").optional(),
  valueTier: z.number().int().positive("Value tier must be positive").optional(),
  category: z.string().min(1, "Category is required").optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const timeBlock = await prisma.timeblocks.findFirst({
      where: {
        id: params.id,
        userId: session.user.id // Ensure user can only access their own time blocks
      }
    });

    if (!timeBlock) {
      return NextResponse.json(
        { error: "Time block not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      timeBlock
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Time block fetch error:", {
      message: err.message,
      stack: err.stack
    });

    return NextResponse.json(
      { 
        error: "Failed to fetch time block",
        details: err.message 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input data
    const validation = updateTimeBlockSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validation.error.errors },
        { status: 400 }
      );
    }

    // Check if time block exists and belongs to user
    const existingTimeBlock = await prisma.timeblocks.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!existingTimeBlock) {
      return NextResponse.json(
        { error: "Time block not found" },
        { status: 404 }
      );
    }

    const updateData: { title?: string; description?: string; startTime?: Date; endTime?: Date; valueTier?: number; category?: string } = {};
    const { title, description, startTime, endTime, valueTier, category } = validation.data;

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startTime !== undefined) updateData.startTime = new Date(startTime);
    if (endTime !== undefined) updateData.endTime = new Date(endTime);
    if (valueTier !== undefined) updateData.valueTier = valueTier;
    if (category !== undefined) updateData.category = category;

    const updatedTimeBlock = await prisma.timeblocks.update({
      where: { id: params.id },
      data: updateData
    });

    console.log(`Updated time block ${params.id} for user: ${session.user.email}`);

    return NextResponse.json({
      success: true,
      timeBlock: updatedTimeBlock
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Time block update error:", {
      message: err.message,
      stack: err.stack
    });

    return NextResponse.json(
      { 
        error: "Failed to update time block",
        details: err.message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if time block exists and belongs to user
    const existingTimeBlock = await prisma.timeblocks.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!existingTimeBlock) {
      return NextResponse.json(
        { error: "Time block not found" },
        { status: 404 }
      );
    }

    await prisma.timeblocks.delete({
      where: { id: params.id }
    });

    console.log(`Deleted time block ${params.id} for user: ${session.user.email}`);

    return NextResponse.json({
      success: true,
      message: "Time block deleted successfully"
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Time block deletion error:", {
      message: err.message,
      stack: err.stack
    });

    return NextResponse.json(
      { 
        error: "Failed to delete time block",
        details: err.message 
      },
      { status: 500 }
    );
  }
}