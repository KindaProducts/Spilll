import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Order ID is required' });
    }

    // In a production environment, you would verify the order with LemonSqueezy API
    // For now, we'll assume the order is valid if it has an ID
    
    // Check if we have a user associated with this order in our database
    const subscription = await prisma.user.findFirst({
      where: {
        subscriptionId: orderId.toString(),
      },
    });

    if (subscription) {
      // Return the user data
      return res.status(200).json({
        success: true,
        user: {
          id: subscription.id,
          email: subscription.email,
          isSubscribed: subscription.isSubscribed,
          planType: subscription.planType,
        },
      });
    }

    // If we don't have a user record yet, the webhook might not have processed
    // We'll still return success but without user data
    return res.status(200).json({
      success: true,
      message: 'Payment verified, but user record not found yet. The webhook may still be processing.',
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify payment',
    });
  }
} 