import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createTimeBlockSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.string().datetime("Invalid start time format"),
  endTime: z.string().datetime("Invalid end time format"),
  valueTier: z.number().int().positive("Value tier must be positive"),
  category: z.string().min(1, "Category is required"),
});

const updateTimeBlockSchema = createTimeBlockSchema.partial();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');

    const whereClause: any = {
      userId: session.user.id
    };

    // Add date range filter if provided
    if (startTime && endTime) {
      whereClause.startTime = {
        gte: new Date(startTime),
        lte: new Date(endTime)
      };
    }

    const timeBlocks = await prisma.timeblocks.findMany({
      where: whereClause,
      orderBy: {
        startTime: 'asc'
      }
    });

    console.log(`Fetched ${timeBlocks.length} time blocks for user: ${session.user.email}`);

    return NextResponse.json({
      success: true,
      timeBlocks
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Time blocks fetch error:", {
      message: err.message,
      stack: err.stack
    });

    return NextResponse.json(
      { 
        error: "Failed to fetch time blocks",
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

    const body = await request.json();
    
    // Validate input data
    const validation = createTimeBlockSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { title, description, startTime, endTime, valueTier, category } = validation.data;

    const timeBlock = await prisma.timeblocks.create({
      data: {
        userId: session.user.id,
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        valueTier,
        category
      }
    });

    console.log(`Created time block for user: ${session.user.email}`);

    return NextResponse.json({
      success: true,
      timeBlock
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Time block creation error:", {
      message: err.message,
      stack: err.stack
    });

    return NextResponse.json(
      { 
        error: "Failed to create time block",
        details: err.message 
      },
      { status: 500 }
    );
  }
}