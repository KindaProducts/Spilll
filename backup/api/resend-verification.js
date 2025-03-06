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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verify Your Email Address</h2>
          <p>Thank you for creating an account with Spilll. Please click the button below to verify your email address:</p>
          <a href="${verificationUrl}" style="display: inline-block; background-color: #4F46E5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 20px 0;">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not create an account, please ignore this email.</p>
          <p>If the button above doesn't work, copy and paste the following URL into your browser:</p>
          <p style="word-break: break-all;">${verificationUrl}</p>
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