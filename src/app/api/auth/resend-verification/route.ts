import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const resendVerificationSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validation = resendVerificationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Find user
    const user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: "If an account with that email exists and is unverified, we've sent a verification email." },
        { status: 200 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 200 }
      );
    }

    // Generate new 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const verificationCodeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Update user with new verification code
    await prisma.users.update({
      where: { id: user.id },
      data: {
        verificationToken: verificationCode,
        verificationTokenExpiry: verificationCodeExpiry,
      }
    });

    // Send verification code email
    try {
      const { sendEmail, generateVerificationCodeEmailHtml, generateVerificationCodeEmailText } = await import("@/lib/email");
      
      // Extract name from email for personalization
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      await sendEmail({
        to: email,
        subject: "Your TimeROI verification code",
        html: generateVerificationCodeEmailHtml(name, verificationCode),
        text: generateVerificationCodeEmailText(name, verificationCode)
      });
      
      console.log(`Verification code resent to: ${email}`);
      console.log(`Verification code: ${verificationCode} (expires in 5 minutes)`);
    } catch (emailError) {
      console.error("Failed to resend verification email:", emailError);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "If an account with that email exists and is unverified, we've sent a verification email." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}