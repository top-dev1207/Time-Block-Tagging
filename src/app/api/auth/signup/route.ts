import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs";
import { z } from "zod";
import crypto from "crypto";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  company: z.string().min(1, "Company is required"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
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
    const existingUser = await prisma.users.findUnique({
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
    
    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.users.create({
      data: {
        name,
        email,
        company,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiry,
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
    await prisma.user_settings.create({
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
        prisma.goals.create({
          data: {
            userId: user.id,
            type: goal.type,
            targetHours: goal.targetHours
          }
        })
      )
    );

    // Send verification email
    try {
      const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
      
      const { sendEmail, generateVerificationEmailHtml, generateVerificationEmailText } = await import("@/lib/email");
      
      await sendEmail({
        to: email,
        subject: "Verify your email - TimeROI Beta Access",
        html: generateVerificationEmailHtml(name, verificationUrl),
        text: generateVerificationEmailText(name, verificationUrl)
      });
      
      console.log(`Email verification sent to: ${email}`);
      console.log(`Verification link: ${verificationUrl}`);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue with user creation even if email fails
    }

    return NextResponse.json(
      { 
        message: "User created successfully. Please check your email to verify your account.",
        user: user,
        requiresVerification: true
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