import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Generate verification token
    const verificationToken = uuidv4();

    // Create user with verification token
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken,
        isVerified: false,
      },
    });

    // Send verification email
    const verificationUrl = `${APP_URL}/verify?token=${verificationToken}`;
    
    await mailgun.messages.create(MAILGUN_DOMAIN, {
      from: `Spilll <noreply@${MAILGUN_DOMAIN}>`,
      to: email,
      subject: 'Verify your Spilll account',
      html: `
        <h1>Welcome to Spilll!</h1>
        <p>Click the button below to verify your email address and activate your account:</p>
        <a href="${verificationUrl}" style="
          display: inline-block;
          background-color: #3b82f6;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 24px 0;
        ">
          Verify Email Address
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Account creation error:', error);
    return res.status(500).json({ error: 'Failed to create account' });
  }
} 