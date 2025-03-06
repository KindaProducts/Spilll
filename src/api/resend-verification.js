import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import mailgun from 'mailgun-js';

const prisma = new PrismaClient();

// Initialize Mailgun with API credentials
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validate email exists
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // Find user with this email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // If no user found with this email
    if (!user) {
      // For security reasons, don't reveal that the email doesn't exist
      // Instead, return a generic success message
      return res.status(200).json({
        success: true,
        message: 'If your email exists in our system, a verification email has been sent.'
      });
    }

    // If user is already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        error: 'Your email is already verified. Please login to your account.'
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 24); // Token expires in 24 hours

    // Update user with new verification token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpires: tokenExpiration
      }
    });

    // Create verification URL
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;

    // Send verification email
    const emailData = {
      from: `Spilll <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; color: #ffffff; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://spillling.com/images/logo-dark.png" alt="Spilll Logo" style="width: 120px; filter: invert(1);">
          </div>
          <h2 style="color: #4F46E5; text-align: center; font-size: 24px; margin-bottom: 20px;">Verify Your Email Address</h2>
          <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.5; color: #e0e0e0;">
            You recently requested a new verification email for your Spilll account. To complete your registration and access our AI-powered Lightroom presets, please verify your email address by clicking the button below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">Verify My Email</a>
          </div>
          <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.5; color: #e0e0e0;">
            This verification link will expire in 24 hours. If you don't verify your email within this time, you'll need to request a new verification link.
          </p>
          <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.5; color: #e0e0e0;">
            If the button above doesn't work, you can copy and paste the following URL into your browser:
          </p>
          <p style="background-color: #2a2a2a; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 14px; margin-bottom: 30px; color: #e0e0e0;">
            ${verificationUrl}
          </p>
          <p style="margin-bottom: 10px; font-size: 16px; line-height: 1.5; color: #e0e0e0;">
            If you did not create an account with Spilll, please ignore this email.
          </p>
          <div style="border-top: 1px solid #333; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 14px; color: #999;">
            <p>&copy; ${new Date().getFullYear()} Spilll. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await mg.messages().send(emailData);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Verification email has been sent. Please check your inbox.'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while sending the verification email. Please try again.'
    });
  }
} 