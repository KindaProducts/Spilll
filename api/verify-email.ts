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
const FROM_EMAIL = `noreply@${DOMAIN}`;

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
    const emailData = {
      from: FROM_EMAIL,
      to: [userData.email],
      subject: 'Welcome to Spilll!',
      html: `
        <h1>Welcome to Spilll!</h1>
        <p>Your account has been successfully created. You can now log in and start using our AI-powered preset generator.</p>
        <a href="${process.env.VERCEL_URL}/login" style="display: inline-block; background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
          Log In Now
        </a>
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