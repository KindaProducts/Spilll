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
    const { 
      email, 
      password, 
      subscriptionId, 
      customerId, 
      variantId, 
      subscriptionStatus,
      currentPeriodEnd,
      planType
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // If user exists but came from checkout, update their subscription info
      if (subscriptionId) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            subscriptionId,
            customerId,
            variantId,
            subscriptionStatus,
            currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : null,
            planType,
            isSubscribed: subscriptionStatus === 'active',
          },
        });
        
        // If user is already verified, send subscription confirmation
        if (existingUser.isVerified) {
          await sendSubscriptionConfirmationEmail(email);
        }
      }
      
      return res.status(200).json({ 
        success: true, 
        message: 'User already exists, subscription info updated',
        isNewUser: false
      });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Generate verification token
    const verificationToken = uuidv4();

    // Create user with verification token and subscription info if available
    const userData = {
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    };

    // Add subscription data if available
    if (subscriptionId) {
      Object.assign(userData, {
        subscriptionId,
        customerId,
        variantId,
        subscriptionStatus,
        currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : null,
        planType,
        isSubscribed: subscriptionStatus === 'active',
      });
    }

    // Create user
    const user = await prisma.user.create({
      data: userData,
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

    return res.status(200).json({ 
      success: true,
      message: 'Account created successfully',
      isNewUser: true
    });
  } catch (error: any) {
    console.error('Account creation error:', error);
    return res.status(500).json({ error: 'Failed to create account' });
  }
}

// Send subscription confirmation email
async function sendSubscriptionConfirmationEmail(email: string) {
  try {
    await mailgun.messages.create(MAILGUN_DOMAIN, {
      from: `Spilll <noreply@${MAILGUN_DOMAIN}>`,
      to: email,
      subject: 'Welcome to Spilll Premium!',
      html: `
        <h1>Thank You for Subscribing to Spilll!</h1>
        <p>We're excited to have you on board! You now have unlimited access to our AI-powered preset generator.</p>
        <p><a href="${APP_URL}/app" style="
          display: inline-block;
          background-color: #3b82f6;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 24px 0;
        ">
          Start Creating Presets
        </a></p>
        <p>Here's what you can do now:</p>
        <ul>
          <li>Generate unlimited custom presets</li>
          <li>Access advanced AI features</li>
          <li>Get priority support</li>
        </ul>
        <p>Need help getting started? Contact our support team at support@spillling.com.</p>
      `,
    });
    
    console.log(`Subscription confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending subscription confirmation email:', error);
  }
} 