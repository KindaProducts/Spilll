import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Verify the webhook signature
  const signature = req.headers['x-signature'];
  const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error('Missing signature or webhook secret');
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    // Get the raw request body
    const rawBody = JSON.stringify(req.body);
    
    // Compute the HMAC signature
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(rawBody);
    const computedSignature = hmac.digest('hex');
    
    // Compare signatures
    if (computedSignature !== signature) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ success: false, error: 'Invalid signature' });
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

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ success: false, error: 'Failed to process webhook' });
  }
}

// Handle order_created event
async function handleOrderCreated(data) {
  const { id, attributes } = data;
  const { order_number, user_email, first_order_item, total_formatted } = attributes;
  
  console.log(`New order created: #${order_number} for ${user_email}, total: ${total_formatted}`);
  
  try {
    // Create or update the order in our database
    await prisma.order.upsert({
      where: { id: id.toString() },
      update: {
        orderNumber: order_number,
        email: user_email,
        total: total_formatted,
        productName: first_order_item.product_name,
        variantName: first_order_item.variant_name,
        status: 'created'
      },
      create: {
        id: id.toString(),
        orderNumber: order_number,
        email: user_email,
        total: total_formatted,
        productName: first_order_item.product_name,
        variantName: first_order_item.variant_name,
        status: 'created'
      }
    });
  } catch (error) {
    console.error('Error saving order:', error);
  }
}

// Handle subscription_created event
async function handleSubscriptionCreated(data) {
  const { id, attributes } = data;
  const { user_email, status, product_name, variant_name, order_id } = attributes;
  
  console.log(`New subscription created: ${id} for ${user_email}, status: ${status}`);
  
  try {
    // Create or update the subscription in our database
    await prisma.subscription.upsert({
      where: { id: id.toString() },
      update: {
        email: user_email,
        status,
        productName: product_name,
        variantName: variant_name,
        orderId: order_id.toString()
      },
      create: {
        id: id.toString(),
        email: user_email,
        status,
        productName: product_name,
        variantName: variant_name,
        orderId: order_id.toString()
      }
    });
    
    // Update the order with the subscription ID
    await prisma.order.update({
      where: { id: order_id.toString() },
      data: { subscriptionId: id.toString() }
    });
  } catch (error) {
    console.error('Error saving subscription:', error);
  }
}

// Handle subscription_updated event
async function handleSubscriptionUpdated(data) {
  const { id, attributes } = data;
  const { status } = attributes;
  
  console.log(`Subscription updated: ${id}, new status: ${status}`);
  
  try {
    // Update the subscription in our database
    await prisma.subscription.update({
      where: { id: id.toString() },
      data: { status }
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
  }
}

// Handle subscription_cancelled event
async function handleSubscriptionCancelled(data) {
  const { id } = data;
  
  console.log(`Subscription cancelled: ${id}`);
  
  try {
    // Update the subscription in our database
    await prisma.subscription.update({
      where: { id: id.toString() },
      data: { status: 'cancelled' }
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
  }
} 