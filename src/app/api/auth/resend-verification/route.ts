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
      return NextResponse.json(
        { error: "No account found with this email address. Please sign up first." },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "This email is already verified. You can sign in directly." },
        { status: 409 }
      );
    }

    // Generate new 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const verificationCodeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Update user with new verification code
    await prisma.users.update({
      where: { id: user.id },
      data: {
        verificationCode: verificationCode,
        verificationCodeExpiry: verificationCodeExpiry,
      }
    });

    // Send verification code email
    try {
      const { sendEmail, generateVerificationCodeEmailHtml, generateVerificationCodeEmailText } = await import("@/lib/email");
      
      const emailResult = await sendEmail({
        to: email,
        subject: "Your TimeROI verification code - Resent",
        html: generateVerificationCodeEmailHtml(user.name || "User", verificationCode),
        text: generateVerificationCodeEmailText(user.name || "User", verificationCode)
      });
      
      if (emailResult.success) {
        console.log(`Verification code resent successfully to: ${email}`);
        console.log(`Message ID: ${emailResult.messageId}`);
      } else {
        console.error(`Failed to resend verification email to: ${email}`, emailResult.error);
        return NextResponse.json(
          { error: "Failed to send verification email. Please try again." },
          { status: 500 }
        );
      }
      
      console.log(`Resent verification code: ${verificationCode} (expires in 5 minutes)`);
    } catch (emailError: unknown) {
      const error = emailError instanceof Error ? emailError : new Error(String(emailError));
      console.error("Failed to resend verification email:", {
        email: email,
        error: error.message,
        stack: error.stack
      });
      
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "New verification code has been sent to your email.",
        email: email
      },
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