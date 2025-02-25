import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LEMONSQUEEZY_WEBHOOK_SECRET: string;
    }
  }
}

// Verify webhook signature
const verifySignature = (payload: string, signature: string, secret: string): boolean => {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle preflight requests for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const signature = req.headers['x-ls-signature'];
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      console.error('Missing signature or webhook secret');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Verify webhook signature
    const rawBody = JSON.stringify(req.body);
    if (!verifySignature(rawBody, signature as string, webhookSecret)) {
      console.error('Invalid signature');
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    const event = req.body;
    const eventName = event.meta.event_name;
    const data = event.data;

    console.log('Received LemonSqueezy webhook:', eventName);

    switch (eventName) {
      case 'subscription_created':
        // Handle new subscription
        await handleSubscriptionCreated(data);
        break;
      case 'subscription_updated':
        // Handle subscription update
        await handleSubscriptionUpdated(data);
        break;
      case 'subscription_cancelled':
        // Handle subscription cancellation
        await handleSubscriptionCancelled(data);
        break;
      case 'subscription_resumed':
        // Handle subscription resumption
        await handleSubscriptionResumed(data);
        break;
      default:
        console.log('Unhandled event type:', eventName);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

// Implement these functions based on your application's needs
async function handleSubscriptionCreated(data: any) {
  // TODO: Implement subscription creation logic
  console.log('New subscription created:', data);
}

async function handleSubscriptionUpdated(data: any) {
  // TODO: Implement subscription update logic
  console.log('Subscription updated:', data);
}

async function handleSubscriptionCancelled(data: any) {
  // TODO: Implement subscription cancellation logic
  console.log('Subscription cancelled:', data);
}

async function handleSubscriptionResumed(data: any) {
  // TODO: Implement subscription resumption logic
  console.log('Subscription resumed:', data);
} 