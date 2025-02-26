import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import prisma from '../../src/lib/prisma';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LEMONSQUEEZY_WEBHOOK_SECRET: string;
      MAILGUN_API_KEY: string;
      MAILGUN_DOMAIN: string;
      NEXT_PUBLIC_APP_URL: string;
    }
  }
}

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY!;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

const mailgun = new Mailgun(FormData).client({
  username: 'api',
  key: MAILGUN_API_KEY,
});

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
      case 'order_created':
        // Handle new order
        await handleOrderCreated(data);
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

// Handle new subscription
async function handleSubscriptionCreated(data: any) {
  try {
    const subscriptionId = data.id;
    const customerId = data.attributes.customer_id;
    const variantId = data.attributes.variant_id;
    const email = data.attributes.user_email;
    const status = data.attributes.status;
    const renewsAt = data.attributes.renews_at ? new Date(data.attributes.renews_at) : null;
    const planType = variantId === process.env.NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_VARIANT_ID ? 'monthly' : 'yearly';

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Update existing user with subscription info
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionId,
          customerId,
          variantId,
          isSubscribed: true,
          subscriptionStatus: status,
          currentPeriodEnd: renewsAt,
          planType,
        },
      });

      // Send subscription confirmation email if user is already verified
      if (user.isVerified) {
        await sendSubscriptionConfirmationEmail(email);
      }
    } else {
      // If user doesn't exist yet, they will create an account on the success page
      // We'll link the subscription to their account when they create it
      console.log(`User with email ${email} not found. Subscription will be linked when they create an account.`);
    }

    console.log('Subscription created successfully:', subscriptionId);
  } catch (error) {
    console.error('Error handling subscription creation:', error);
  }
}

// Handle subscription update
async function handleSubscriptionUpdated(data: any) {
  try {
    const subscriptionId = data.id;
    const status = data.attributes.status;
    const renewsAt = data.attributes.renews_at ? new Date(data.attributes.renews_at) : null;

    // Find user by subscription ID
    const user = await prisma.user.findFirst({
      where: { subscriptionId },
    });

    if (!user) {
      console.log(`No user found with subscription ID ${subscriptionId}`);
      return;
    }

    // Update user's subscription status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: status,
        currentPeriodEnd: renewsAt,
        isSubscribed: status === 'active',
      },
    });

    console.log('Subscription updated successfully:', subscriptionId);
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

// Handle subscription cancellation
async function handleSubscriptionCancelled(data: any) {
  try {
    const subscriptionId = data.id;
    const status = data.attributes.status;
    const endsAt = data.attributes.ends_at ? new Date(data.attributes.ends_at) : null;

    // Find user by subscription ID
    const user = await prisma.user.findFirst({
      where: { subscriptionId },
    });

    if (!user) {
      console.log(`No user found with subscription ID ${subscriptionId}`);
      return;
    }

    // Update user's subscription status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: status,
        currentPeriodEnd: endsAt,
        // Don't set isSubscribed to false yet, as they still have access until the end of their billing period
      },
    });

    // Send cancellation email
    await sendSubscriptionCancellationEmail(user.email);

    console.log('Subscription cancelled successfully:', subscriptionId);
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

// Handle subscription resumption
async function handleSubscriptionResumed(data: any) {
  try {
    const subscriptionId = data.id;
    const status = data.attributes.status;
    const renewsAt = data.attributes.renews_at ? new Date(data.attributes.renews_at) : null;

    // Find user by subscription ID
    const user = await prisma.user.findFirst({
      where: { subscriptionId },
    });

    if (!user) {
      console.log(`No user found with subscription ID ${subscriptionId}`);
      return;
    }

    // Update user's subscription status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: status,
        currentPeriodEnd: renewsAt,
        isSubscribed: true,
      },
    });

    // Send resumption email
    await sendSubscriptionResumedEmail(user.email);

    console.log('Subscription resumed successfully:', subscriptionId);
  } catch (error) {
    console.error('Error handling subscription resumption:', error);
  }
}

// Handle new order
async function handleOrderCreated(data: any) {
  try {
    const orderId = data.id;
    const customerId = data.attributes.customer_id;
    const email = data.attributes.user_email;
    
    console.log(`New order created: ${orderId} for customer ${customerId} (${email})`);
    
    // We'll handle account creation on the success page
    // This is just for logging purposes
  } catch (error) {
    console.error('Error handling order creation:', error);
  }
}

// Email sending functions
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

async function sendSubscriptionCancellationEmail(email: string) {
  try {
    await mailgun.messages.create(MAILGUN_DOMAIN, {
      from: `Spilll <noreply@${MAILGUN_DOMAIN}>`,
      to: email,
      subject: 'Your Spilll Subscription Has Been Cancelled',
      html: `
        <h1>Your Spilll Subscription Has Been Cancelled</h1>
        <p>We're sorry to see you go! Your subscription has been cancelled, but you'll still have access until the end of your current billing period.</p>
        <p>If you change your mind, you can reactivate your subscription at any time.</p>
        <p><a href="${APP_URL}/subscribe" style="
          display: inline-block;
          background-color: #3b82f6;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 24px 0;
        ">
          Reactivate Subscription
        </a></p>
        <p>We'd love to hear your feedback on why you decided to cancel. Please reply to this email to let us know how we can improve.</p>
      `,
    });
    
    console.log(`Subscription cancellation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending subscription cancellation email:', error);
  }
}

async function sendSubscriptionResumedEmail(email: string) {
  try {
    await mailgun.messages.create(MAILGUN_DOMAIN, {
      from: `Spilll <noreply@${MAILGUN_DOMAIN}>`,
      to: email,
      subject: 'Welcome Back to Spilll Premium!',
      html: `
        <h1>Your Spilll Subscription Has Been Reactivated</h1>
        <p>Welcome back! Your subscription has been successfully reactivated, and you now have full access to all premium features.</p>
        <p><a href="${APP_URL}/app" style="
          display: inline-block;
          background-color: #3b82f6;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 24px 0;
        ">
          Go to Dashboard
        </a></p>
        <p>Thank you for choosing Spilll. We're excited to have you back!</p>
      `,
    });
    
    console.log(`Subscription resumed email sent to ${email}`);
  } catch (error) {
    console.error('Error sending subscription resumed email:', error);
  }
} 