import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Verify the webhook signature
const verifyWebhookSignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(signature)
  );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['x-signature'] as string;
    
    if (!signature) {
      return res.status(400).json({ error: 'Missing signature header' });
    }

    // Get the raw request body as a string
    const rawBody = JSON.stringify(req.body);
    
    // Verify the webhook signature
    const isValid = verifyWebhookSignature(
      rawBody,
      signature,
      process.env.LEMONSQUEEZY_WEBHOOK_SECRET || ''
    );

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Process the webhook event
    const { meta, data } = req.body;
    const eventName = meta.event_name;
    
    console.log(`Processing LemonSqueezy webhook event: ${eventName}`);

    // Handle different event types
    switch (eventName) {
      case 'order_created':
        await handleOrderCreated(data);
        break;
      case 'subscription_created':
        await handleSubscriptionCreated(data);
        break;
      case 'subscription_updated':
        await handleSubscriptionUpdated(data);
        break;
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(data);
        break;
      default:
        console.log(`Unhandled event type: ${eventName}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Handler functions for different event types
async function handleOrderCreated(data: any) {
  const { attributes } = data;
  const { user_email, first_name, last_name, order_number } = attributes;
  
  console.log(`New order created: ${order_number} for ${user_email}`);
  
  // Check if user exists
  let user = await prisma.user.findUnique({
    where: { email: user_email }
  });
  
  // If user doesn't exist, create a new one
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: user_email,
        password: crypto.randomBytes(16).toString('hex')
      }
    });
    
    console.log(`Created new user for ${user_email}`);
  }
}

async function handleSubscriptionCreated(data: any) {
  const { attributes } = data;
  const { 
    user_email, 
    status, 
    product_id, 
    variant_id, 
    renews_at, 
    ends_at,
    order_id,
    customer_id
  } = attributes;
  
  console.log(`New subscription created for ${user_email}`);
  
  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: user_email }
  });
  
  if (!user) {
    console.error(`User not found for email: ${user_email}`);
    return;
  }
  
  // Update user with subscription details
  await prisma.user.update({
    where: { id: user.id },
    data: { 
      subscriptionId: order_id.toString(),
      customerId: customer_id.toString(),
      variantId: variant_id.toString(),
      isSubscribed: status === 'active',
      subscriptionStatus: status,
      currentPeriodEnd: renews_at ? new Date(renews_at) : null,
      planType: variant_id === process.env.NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_VARIANT_ID ? 'monthly' : 'yearly'
    }
  });
}

async function handleSubscriptionUpdated(data: any) {
  const { attributes } = data;
  const { 
    user_email, 
    status, 
    renews_at, 
    variant_id
  } = attributes;
  
  console.log(`Subscription updated for ${user_email}`);
  
  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: user_email }
  });
  
  if (!user) {
    console.error(`User not found for email: ${user_email}`);
    return;
  }
  
  // Update user with subscription details
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isSubscribed: status === 'active',
      subscriptionStatus: status,
      currentPeriodEnd: renews_at ? new Date(renews_at) : null,
      variantId: variant_id.toString(),
      planType: variant_id === process.env.NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_VARIANT_ID ? 'monthly' : 'yearly'
    }
  });
}

async function handleSubscriptionCancelled(data: any) {
  const { attributes } = data;
  const { user_email, ends_at } = attributes;
  
  console.log(`Subscription cancelled for ${user_email}`);
  
  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: user_email }
  });
  
  if (!user) {
    console.error(`User not found for email: ${user_email}`);
    return;
  }
  
  // Update user with subscription details
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: 'cancelled',
      currentPeriodEnd: ends_at ? new Date(ends_at) : null
    }
  });
  
  // If ends_at is in the past or null, update user's subscription status immediately
  const now = new Date();
  const endDate = ends_at ? new Date(ends_at) : now;
  
  if (endDate <= now) {
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        isSubscribed: false,
        subscriptionStatus: 'inactive'
      }
    });
  }
} 