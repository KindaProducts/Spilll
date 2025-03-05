import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(401).json({ 
        success: false, 
        error: 'Please verify your email before signing in',
        needsVerification: true,
        email: user.email
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success with token
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred during login. Please try again.'
    });
  }
} 