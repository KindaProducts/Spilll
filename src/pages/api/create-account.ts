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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Spilll Account</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f9fafb;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .logo {
              max-width: 150px;
              margin-bottom: 20px;
            }
            .content {
              padding: 30px 20px;
              background-color: #ffffff;
            }
            h1 {
              color: #1e40af;
              margin-top: 0;
              font-size: 24px;
            }
            p {
              margin-bottom: 20px;
              color: #4b5563;
            }
            .button {
              display: inline-block;
              background-color: #3b82f6;
              color: white;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #2563eb;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
            }
            .steps {
              margin: 30px 0;
              padding: 0;
            }
            .step {
              display: flex;
              align-items: flex-start;
              margin-bottom: 15px;
            }
            .step-number {
              background-color: #3b82f6;
              color: white;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              margin-right: 10px;
              flex-shrink: 0;
            }
            .step-content {
              flex: 1;
            }
            .step-inactive {
              background-color: #9ca3af;
            }
            .link {
              word-break: break-all;
              color: #3b82f6;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${APP_URL}/logo.png" alt="Spilll Logo" class="logo">
              <h1>Verify Your Spilll Account</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Thank you for creating an account with Spilll! To complete your registration and access your subscription, please verify your email address.</p>
              
              <div class="steps">
                <div class="step">
                  <div class="step-number">✓</div>
                  <div class="step-content">
                    <strong>Payment Completed</strong>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">✓</div>
                  <div class="step-content">
                    <strong>Account Created</strong>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <strong>Verify Email</strong> - You are here
                  </div>
                </div>
                <div class="step">
                  <div class="step-number step-inactive">4</div>
                  <div class="step-content">
                    <strong>Access Your Account</strong>
                  </div>
                </div>
              </div>
              
              <p>Click the button below to verify your email address:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p class="link">${verificationUrl}</p>
              
              <p><strong>Note:</strong> This verification link will expire in 24 hours.</p>
              
              <p>If you did not create an account with Spilll, please ignore this email.</p>
              
              <p>Best regards,<br>The Spilll Team</p>
            </div>
            <div class="footer">
              <p>© 2023 Spilll. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Account creation error:', error);
    return res.status(500).json({ error: 'Failed to create account' });
  }
} 