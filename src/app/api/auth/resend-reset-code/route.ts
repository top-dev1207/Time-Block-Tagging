import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const resendResetCodeSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validation = resendResetCodeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: "If an account with that email exists, we've sent a new 6-digit verification code." },
        { status: 200 }
      );
    }

    // Generate new 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Save new verification code to database
    await prisma.users.update({
      where: { id: user.id },
      data: {
        verificationCode,
        verificationCodeExpiry,
      }
    });

    // Send new verification code via email using Resend
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'noreply@timeROI.com',
        to: [email],
        subject: 'New Password Reset Verification Code - TimeROI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, hsl(202, 63%, 17%), hsl(284, 100%, 54%)); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">TimeROI</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">New Verification Code</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h2 style="color: #333; margin-bottom: 20px;">Your New Verification Code</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #e9ecef; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; color: hsl(202, 63%, 17%); letter-spacing: 8px;">${verificationCode}</span>
              </div>
              <p style="color: #666; margin: 15px 0; font-size: 14px;">This new code will expire in 5 minutes</p>
              <p style="color: #999; margin: 10px 0; font-size: 12px;">Any previous codes are now invalid</p>
            </div>
            
            <div style="padding: 20px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 14px;">If you didn't request this password reset, please ignore this email.</p>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 12px;">This is an automated message, please do not reply.</p>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't reveal email sending failure to user for security
    }

    return NextResponse.json(
      { message: "If an account with that email exists, we've sent a new 6-digit verification code." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Resend reset code error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}