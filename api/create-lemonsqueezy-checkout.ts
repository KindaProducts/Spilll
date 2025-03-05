import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { variantId, isYearly } = req.body;

    if (!variantId) {
      return res.status(400).json({ success: false, error: 'Variant ID is required' });
    }
    
    // Get the appropriate checkout URL based on plan type
    const checkoutUrl = isYearly 
      ? process.env.NEXT_PUBLIC_LEMONSQUEEZY_YEARLY_URL 
      : process.env.NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_URL;

    if (!checkoutUrl) {
      return res.status(400).json({ success: false, error: 'Checkout URL not configured' });
    }

    // Return the direct checkout URL
    return res.status(200).json({ 
      success: true, 
      checkoutUrl: checkoutUrl
    });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create checkout',
    });
  }
} 