import nodemailer from 'nodemailer';

// Create transporter - will be configured per environment in sendEmail function

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    // In development, create a test account and use Ethereal Email
    if (process.env.NODE_ENV === 'development') {
      const testAccount = await nodemailer.createTestAccount();
      const devTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      const info = await devTransporter.sendMail({
        from: '"TimeROI Team" <noreply@timeroi.com>',
        to,
        subject,
        text: text || html.replace(/<[^>]*>/g, ''),
        html,
      });
      
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      return { success: true, messageId: info.messageId };
    }
    
    // Production email sending using Gmail
    const productionTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM || 'noreply@gmail.com',
        pass: process.env.EMAIL_PASSWORD || ''
      }
    });
    
    const info = await productionTransporter.sendMail({
      from: '"TimeROI Team" <noreply@timeroi.com>',
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''),
      html,
    });
    
    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
}

export function generateVerificationEmailHtml(name: string, verificationUrl: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - TimeROI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #102C46 0%, #1e3a8a 100%); padding: 40px 30px; text-align: center;">
      <div style="width: 60px; height: 60px; background: rgba(255, 255, 255, 0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        <div style="color: white; font-size: 24px;">⏰</div>
      </div>
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">TimeROI</h1>
      <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Executive Time Analytics Platform</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Welcome to TimeROI Beta!</h2>
      
      <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
        Hi ${name},
      </p>
      
      <p style="color: #4b5563; margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">
        Thank you for joining our exclusive beta program! You're now part of an elite community of executives transforming their time management strategy.
      </p>
      
      <p style="color: #4b5563; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
        To complete your account setup and access your executive dashboard, please verify your email address by clicking the button below:
      </p>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #102C46 0%, #1e3a8a 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(16, 44, 70, 0.2);">
          Verify Email & Access Dashboard
        </a>
      </div>
      
      <p style="color: #6b7280; margin: 25px 0 0 0; font-size: 14px; line-height: 1.5;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${verificationUrl}" style="color: #102C46; word-break: break-all;">${verificationUrl}</a>
      </p>
      
      <!-- Features Preview -->
      <div style="background: #f8fafc; border-radius: 8px; padding: 25px; margin: 30px 0;">
        <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">What's waiting for you:</h3>
        <ul style="color: #4b5563; margin: 0; padding: 0; list-style: none;">
          <li style="margin: 8px 0; padding-left: 25px; position: relative;">
            <span style="position: absolute; left: 0; color: #10b981;">✓</span>
            £10K strategic time vs £10 admin task analysis
          </li>
          <li style="margin: 8px 0; padding-left: 25px; position: relative;">
            <span style="position: absolute; left: 0; color: #10b981;">✓</span>
            Revenue, Recovery, Relationships framework
          </li>
          <li style="margin: 8px 0; padding-left: 25px; position: relative;">
            <span style="position: absolute; left: 0; color: #10b981;">✓</span>
            Executive time optimization insights
          </li>
          <li style="margin: 8px 0; padding-left: 25px; position: relative;">
            <span style="position: absolute; left: 0; color: #10b981;">✓</span>
            Calendar ROI tracking and analytics
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background: #f8fafc; padding: 25px 30px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; margin: 0; font-size: 14px; text-align: center;">
        This verification link will expire in 24 hours for security reasons.
      </p>
      <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 12px; text-align: center;">
        © 2025 TimeROI. Executive Time Analytics Platform.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateVerificationEmailText(name: string, verificationUrl: string) {
  return `
Welcome to TimeROI Beta!

Hi ${name},

Thank you for joining our exclusive beta program! You're now part of an elite community of executives transforming their time management strategy.

To complete your account setup and access your executive dashboard, please verify your email address by visiting this link:

${verificationUrl}

What's waiting for you:
✓ £10K strategic time vs £10 admin task analysis
✓ Revenue, Recovery, Relationships framework  
✓ Executive time optimization insights
✓ Calendar ROI tracking and analytics

This verification link will expire in 24 hours for security reasons.

© 2025 TimeROI. Executive Time Analytics Platform.
  `;
}

export function generateVerificationCodeEmailHtml(name: string, verificationCode: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code - TimeROI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #102C46 0%, #1e3a8a 100%); padding: 40px 30px; text-align: center;">
      <div style="width: 60px; height: 60px; background: rgba(255, 255, 255, 0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        <div style="color: white; font-size: 24px;">⏰</div>
      </div>
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">TimeROI</h1>
      <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Executive Time Analytics Platform</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Your Verification Code</h2>
      
      <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
        Hi ${name},
      </p>
      
      <p style="color: #4b5563; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
        Welcome to TimeROI Beta! To complete your account verification, please enter the following 6-digit code:
      </p>
      
      <!-- Verification Code -->
      <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; background: #f8fafc; border: 2px solid #102C46; border-radius: 12px; padding: 20px 40px; font-size: 32px; font-weight: 700; color: #102C46; letter-spacing: 8px; font-family: 'Courier New', monospace;">
          ${verificationCode}
        </div>
      </div>
      
      <p style="color: #ef4444; margin: 25px 0; font-size: 14px; text-align: center; font-weight: 600;">
        ⏰ This code expires in 5 minutes
      </p>
      
      <p style="color: #6b7280; margin: 25px 0 0 0; font-size: 14px; line-height: 1.5;">
        If you didn't request this code, please ignore this email. Someone may have typed your email address by mistake.
      </p>
      
      <!-- Features Preview -->
      <div style="background: #f8fafc; border-radius: 8px; padding: 25px; margin: 30px 0;">
        <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">What's waiting for you:</h3>
        <ul style="color: #4b5563; margin: 0; padding: 0; list-style: none;">
          <li style="margin: 8px 0; padding-left: 25px; position: relative;">
            <span style="position: absolute; left: 0; color: #10b981;">✓</span>
            £10K strategic time vs £10 admin task analysis
          </li>
          <li style="margin: 8px 0; padding-left: 25px; position: relative;">
            <span style="position: absolute; left: 0; color: #10b981;">✓</span>
            Revenue, Recovery, Relationships framework
          </li>
          <li style="margin: 8px 0; padding-left: 25px; position: relative;">
            <span style="position: absolute; left: 0; color: #10b981;">✓</span>
            Executive time optimization insights
          </li>
          <li style="margin: 8px 0; padding-left: 25px; position: relative;">
            <span style="position: absolute; left: 0; color: #10b981;">✓</span>
            Calendar ROI tracking and analytics
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background: #f8fafc; padding: 25px 30px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; margin: 0; font-size: 14px; text-align: center;">
        This verification code will expire in 5 minutes for security reasons.
      </p>
      <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 12px; text-align: center;">
        © 2025 TimeROI. Executive Time Analytics Platform.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateVerificationCodeEmailText(name: string, verificationCode: string) {
  return `
Your TimeROI Verification Code

Hi ${name},

Welcome to TimeROI Beta! To complete your account verification, please enter the following 6-digit code:

${verificationCode}

⏰ This code expires in 5 minutes

What's waiting for you:
✓ £10K strategic time vs £10 admin task analysis
✓ Revenue, Recovery, Relationships framework  
✓ Executive time optimization insights
✓ Calendar ROI tracking and analytics

If you didn't request this code, please ignore this email.

© 2025 TimeROI. Executive Time Analytics Platform.
  `;
}