import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    // Find user with verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        isVerified: false,
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    // Redirect to login page with success message
    res.redirect(307, '/login?verified=true');
  } catch (error: any) {
    console.error('Verification error:', error);
    return res.status(500).json({ error: 'Failed to verify email' });
  }
} 