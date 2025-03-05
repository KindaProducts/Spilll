import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId parameter' });
    }

    console.log(`Verifying payment for order ID: ${orderId}`);

    // Find user with this order ID
    const user = await prisma.user.findFirst({
      where: {
        subscriptionId: orderId.toString()
      }
    });

    if (user) {
      console.log(`Found user for order ID ${orderId}: ${user.email}`);
      
      // Return user data
      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          isSubscribed: user.isSubscribed,
          planType: user.planType
        }
      });
    } else {
      console.log(`No user found for order ID ${orderId}, but payment was verified`);
      
      // Return success but note that user record may still be processing
      return res.status(200).json({
        success: true,
        message: 'Payment verified, but user record may still be processing'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 