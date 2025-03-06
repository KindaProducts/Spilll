import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mailgun from 'mailgun-js';

const prisma = new PrismaClient();

// Initialize Mailgun with API credentials
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email, password, orderId } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  try {
    console.log(`Creating account for email: ${email}, with orderId: ${orderId || 'none'}`);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`User with email ${email} already exists`);
      return res.status(400).json({ success: false, error: 'An account with this email already exists' });
    }

    // Validate the order ID if provided
    let order = null;
    if (orderId) {
      // Check if the order exists and is valid
      order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        console.log(`Invalid order ID: ${orderId}`);
        return res.status(400).json({ success: false, error: 'Invalid order ID' });
      }

      // Check if the order is already associated with a user
      if (order.userId) {
        console.log(`Order ${orderId} is already associated with a user`);
        return res.status(400).json({ success: false, error: 'This order has already been used to create an account' });
      }
      
      // If the order has an email and it doesn't match the provided email, log a warning
      if (order.email && order.email !== email) {
        console.log(`Warning: Email mismatch. Order email: ${order.email}, Provided email: ${email}`);
        // We'll still allow the account creation, but log the discrepancy
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires,
        emailVerified: false,
        // Set subscription status based on order if available
        subscriptionStatus: order ? 'active' : 'none',
        subscriptionPlan: order ? order.plan : null,
      },
    });

    // If order ID is provided, associate the order with the user
    if (orderId && order) {
      await prisma.order.update({
        where: { id: orderId },
        data: { userId: user.id },
      });
      console.log(`Associated order ${orderId} with user ${user.id}`);
    }

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
    
    const emailData = {
      from: `Spilll <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: email,
      subject: 'Verify Your Spilll Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; color: #ffffff; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://spillling.com/images/logo-dark.png" alt="Spilll Logo" style="width: 120px; filter: invert(1);">
          </div>
          <h2 style="color: #4F46E5; text-align: center; font-size: 24px; margin-bottom: 20px;">Verify Your Email Address</h2>
          <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.5; color: #e0e0e0;">
            Thank you for creating an account with Spilll! To complete your registration and access our AI-powered Lightroom presets, please verify your email address by clicking the button below:
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
      `,
    };

    try {
      await mg.messages().send(emailData);
      console.log(`Verification email sent to ${email}`);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // We'll still return success but log the email sending error
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Account created successfully. Please check your email to verify your account.' 
    });
  } catch (error) {
    console.error('Account creation error:', error);
    return res.status(500).json({ success: false, error: 'An error occurred while creating your account' });
  }
} 