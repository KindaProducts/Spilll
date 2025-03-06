import { VercelRequest, VercelResponse } from '@vercel/node';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import crypto from 'crypto';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
  url: 'https://api.mailgun.net',
});

const DOMAIN = process.env.MAILGUN_DOMAIN || 'spillling.com';
const FROM_EMAIL = `noreply@${DOMAIN}`;

// In a real application, you would use a proper database
const verificationTokens = new Map<string, { email: string; password: string }>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    verificationTokens.set(token, { email, password });

    // Send verification email
    const verificationLink = `${process.env.VERCEL_URL}/verify?token=${token}`;
    
    const emailData = {
      from: FROM_EMAIL,
      to: [email],
      subject: 'Verify Your Spilll Account',
      html: `
        <h1>Welcome to Spilll!</h1>
        <p>Click the button below to verify your email address and activate your account:</p>
        <a href="${verificationLink}" style="display: inline-block; background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
          Verify Email
        </a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${verificationLink}</p>
      `,
    };

    await mg.messages.create(DOMAIN, emailData);

    return res.status(200).json({
      success: true,
      message: 'Verification email sent',
    });
  } catch (error) {
    console.error('Error creating account:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create account',
    });
  }
} 