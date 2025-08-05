import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";

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

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new verification token
    await prisma.users.update({
      where: { id: user.id },
      data: {
        verificationToken: verificationToken,
        verificationTokenExpiry: verificationTokenExpiry,
      }
    });

    // Send verification email
    try {
      const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
      
      const { sendEmail, generateVerificationEmailHtml, generateVerificationEmailText } = await import("@/lib/email");
      
      // Extract name from email for personalization
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      await sendEmail({
        to: email,
        subject: "Verify your email - TimeROI Beta Access",
        html: generateVerificationEmailHtml(name, verificationUrl),
        text: generateVerificationEmailText(name, verificationUrl)
      });
      
      console.log(`Verification email resent to: ${email}`);
      console.log(`Verification link: ${verificationUrl}`);
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