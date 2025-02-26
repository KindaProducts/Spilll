import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import prisma from '../../lib/prisma';

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY!;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

const mailgun = new Mailgun(FormData).client({
  username: 'api',
  key: MAILGUN_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is already verified. Please sign in.' 
      });
    }

    // Generate new verification token
    const verificationToken = uuidv4();

    // Update user with new verification token
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    // Send verification email
    const verificationUrl = `${APP_URL}/verify?token=${verificationToken}`;
    
    await mailgun.messages.create(MAILGUN_DOMAIN, {
      from: `Spilll <noreply@${MAILGUN_DOMAIN}>`,
      to: email,
      subject: 'Verify your Spilll account',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #3b82f6; margin-bottom: 5px;">Spilll</h1>
            <p style="color: #6b7280; font-size: 16px;">AI-powered photo presets</p>
          </div>
          
          <div style="background-color: #1f2937; border-radius: 8px; padding: 30px; color: #e5e7eb;">
            <h2 style="color: white; margin-top: 0;">Verify Your Email</h2>
            <p>Click the button below to verify your email address and activate your Spilll account:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="
                display: inline-block;
                background-color: #3b82f6;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 500;
                font-size: 16px;
              ">
                Verify Email Address
              </a>
            </div>
            
            <p style="margin-bottom: 5px;">Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #93c5fd; margin-top: 0;">${verificationUrl}</p>
            
            <p style="margin-top: 30px; font-size: 14px; color: #9ca3af;">This link will expire in 24 hours.</p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
            <p>© ${new Date().getFullYear()} Spilll. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Resend verification error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to resend verification email' 
    });
  }
} 