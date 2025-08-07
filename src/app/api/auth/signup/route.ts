import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs";
import { z } from "zod";

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
      // If user exists but email is not verified, allow re-signup with new verification code
      if (!existingUser.emailVerified) {
        // Generate new verification code and update existing user
        const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const newVerificationCodeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await prisma.users.update({
          where: { email },
          data: {
            name,
            company,
            password: await bcrypt.hash(password, 12),
            verificationCode: newVerificationCode,
            verificationCodeExpiry: newVerificationCodeExpiry,
          }
        });

        // Send new verification code
        try {
          const { sendEmail, generateVerificationCodeEmailHtml, generateVerificationCodeEmailText } = await import("@/lib/email");
          
          const emailResult = await sendEmail({
            to: email,
            subject: "Your TimeROI verification code",
            html: generateVerificationCodeEmailHtml(name, newVerificationCode),
            text: generateVerificationCodeEmailText(name, newVerificationCode)
          });
          
          if (emailResult.success) {
            console.log(`New verification code sent successfully to existing unverified user: ${email}`);
            console.log(`Message ID: ${emailResult.messageId}`);
          } else {
            console.error(`Failed to send verification email to existing user: ${email}`, emailResult.error);
          }
          
          console.log(`New verification code: ${newVerificationCode} (expires in 5 minutes)`);
        } catch (emailError: unknown) {
          const error = emailError instanceof Error ? emailError : new Error(String(emailError));
          console.error("Failed to send verification email for existing user:", {
            email: email,
            error: error.message,
            stack: error.stack
          });
        }

        return NextResponse.json(
          { 
            message: "Account exists but was not verified. A new verification code has been sent to your email.",
            user: { 
              id: existingUser.id, 
              name, 
              email, 
              company, 
              createdAt: existingUser.createdAt 
            },
            requiresVerification: true,
            isExistingUser: true
          },
          { status: 200 }
        );
      }

      // If user exists and is verified
      return NextResponse.json(
        { error: "User with this email already exists and is verified. Please use the login page." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const verificationCodeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Create user
    const user = await prisma.users.create({
      data: {
        name,
        email,
        company,
        password: hashedPassword,
        verificationCode: verificationCode,
        verificationCodeExpiry: verificationCodeExpiry,
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

    // Send verification code email
    try {
      const { sendEmail, generateVerificationCodeEmailHtml, generateVerificationCodeEmailText } = await import("@/lib/email");
      
      const emailResult = await sendEmail({
        to: email,
        subject: "Your TimeROI verification code",
        html: generateVerificationCodeEmailHtml(name, verificationCode),
        text: generateVerificationCodeEmailText(name, verificationCode)
      });
      
      if (emailResult.success) {
        console.log(`Verification code sent successfully to: ${email}`);
        console.log(`Message ID: ${emailResult.messageId}`);
      } else {
        console.error(`Failed to send verification email to: ${email}`, emailResult.error);
      }
      
      console.log(`Verification code: ${verificationCode} (expires in 5 minutes)`);
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