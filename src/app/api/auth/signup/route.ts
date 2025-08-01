import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  company: z.string().min(1, "Company is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, email, company, password } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        company,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        createdAt: true,
      }
    });

    // Create default user settings
    await prisma.userSettings.create({
      data: {
        userId: user.id,
        timezone: "UTC",
        workingHours: {
          start: "09:00",
          end: "18:00"
        },
        notifications: {
          email: true,
          insights: true,
          reminders: true
        }
      }
    });

    // Create default goals
    const defaultGoals = [
      { type: "strategic", targetHours: 15 },
      { type: "revenue", targetHours: 20 },
      { type: "recovery", targetHours: 8 },
      { type: "admin", targetHours: 5 }
    ];

    await Promise.all(
      defaultGoals.map(goal =>
        prisma.goal.create({
          data: {
            userId: user.id,
            type: goal.type,
            targetHours: goal.targetHours
          }
        })
      )
    );

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: user
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}