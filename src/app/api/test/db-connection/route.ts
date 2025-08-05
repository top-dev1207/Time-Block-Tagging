import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection by trying to count users
    const userCount = await prisma.users.count();
    
    console.log("Database connection successful, user count:", userCount);
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful",
      userCount: userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Test user creation
    const testUser = await prisma.users.create({
      data: {
        email: email,
        name: name || "Test User",
        emailVerified: new Date(),
        company: "Test Company"
      }
    });

    console.log("Test user created:", testUser);

    return NextResponse.json({
      success: true,
      message: "Test user created successfully",
      user: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name
      }
    });
  } catch (error) {
    console.error("User creation failed:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "User creation failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
