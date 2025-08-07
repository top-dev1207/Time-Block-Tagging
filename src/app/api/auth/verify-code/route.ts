import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const verifyCodeSchema = z.object({
  email: z.string().email("Invalid email format"),
  code: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validation = verifyCodeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, code } = validation.data;

    // Find user with valid verification code
    const user = await prisma.users.findFirst({
      where: {
        email: email,
        verificationCode: code,
        verificationCodeExpiry: {
          gt: new Date() // Code hasn't expired
        },
        emailVerified: null // Not yet verified
      }
    });

    console.log(`Verification attempt for: ${email} with code: ${code}`);
    console.log(`User found:`, user ? 'Yes' : 'No');
    
    if (!user) {
      // Debug: Check if user exists at all
      const existingUser = await prisma.users.findUnique({
        where: { email },
        select: {
          email: true,
          verificationCode: true,
          verificationCodeExpiry: true,
          emailVerified: true,
          createdAt: true
        }
      });
      
      console.log(`Debug - User in DB:`, existingUser);
      console.log(`Debug - Current time:`, new Date().toISOString());
      console.log(`Debug - Code expiry:`, existingUser?.verificationCodeExpiry?.toISOString());
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Update user as verified and clear verification code
    await prisma.users.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationCode: null,
        verificationCodeExpiry: null,
      }
    });

    console.log(`Email verification successful for: ${email}`);

    return NextResponse.json(
      { 
        message: "Email verified successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Code verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}