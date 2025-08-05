import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const verifyResetCodeSchema = z.object({
  email: z.string().email("Invalid email format"),
  code: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validation = verifyResetCodeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, code } = validation.data;

    // Find user with valid verification code for password reset
    const user = await prisma.users.findFirst({
      where: {
        email: email,
        verificationCode: code,
        verificationCodeExpiry: {
          gt: new Date() // Code hasn't expired
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Generate a temporary reset token for password change
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes for password reset

    // Update user with reset token and clear verification code
    await prisma.users.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
        verificationCode: null,
        verificationCodeExpiry: null,
      }
    });

    return NextResponse.json(
      { 
        message: "Verification code confirmed successfully",
        resetToken,
        userId: user.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Reset code verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}