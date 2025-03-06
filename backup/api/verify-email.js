import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    // Validate token exists
    if (!token) {
      return res.status(400).json({ success: false, error: 'Verification token is required' });
    }

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: {
          gt: new Date() // Token must not be expired
        }
      }
    });

    // If no user found with this token or token expired
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token. Please request a new verification email.'
      });
    }

    // Update user to mark as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpires: null
      }
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred during email verification. Please try again.'
    });
  }
} 