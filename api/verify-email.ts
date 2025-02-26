import { VercelRequest, VercelResponse } from '@vercel/node';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
  url: 'https://api.mailgun.net',
});

const DOMAIN = process.env.MAILGUN_DOMAIN || 'spillling.com';
const FROM_EMAIL = `Spilll <noreply@${DOMAIN}>`;
const APP_URL = process.env.VERCEL_URL || 'https://spilll.vercel.app';

// This should be imported from create-account.ts in a real application
declare const verificationTokens: Map<string, { email: string; password: string }>;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: 'Token is required' });
    }

    const userData = verificationTokens.get(token);
    if (!userData) {
      return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    }

    // In a real application, you would:
    // 1. Create the user in your database
    // 2. Hash the password
    // 3. Set up any necessary user roles/permissions
    // 4. Create a session or JWT token

    // Remove the verification token
    verificationTokens.delete(token);

    // Send welcome email
    const loginUrl = `${APP_URL}/login`;
    
    const emailData = {
      from: FROM_EMAIL,
      to: [userData.email],
      subject: 'Welcome to Spilll!',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #3b82f6; margin-bottom: 5px;">Spilll</h1>
            <p style="color: #6b7280; font-size: 16px;">AI-powered photo presets</p>
          </div>
          
          <div style="background-color: #1f2937; border-radius: 8px; padding: 30px; color: #e5e7eb;">
            <h2 style="color: white; margin-top: 0;">Welcome to Spilll!</h2>
            <p>Your account has been successfully verified. You can now log in and start using our AI-powered preset generator.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" style="
                display: inline-block;
                background-color: #3b82f6;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 500;
                font-size: 16px;
              ">
                Log In Now
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #9ca3af;">Thank you for joining Spilll!</p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
            <p>© ${new Date().getFullYear()} Spilll. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await mg.messages.create(DOMAIN, emailData);

    return res.status(200).json({
      success: true,
      message: 'Email verified and account created',
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify email',
    });
  }
} 