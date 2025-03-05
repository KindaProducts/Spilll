import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { variantId, customData } = req.body;

    if (!variantId) {
      return res.status(400).json({ success: false, error: 'Variant ID is required' });
    }

    // Create checkout session with LemonSqueezy API
    const response = await axios.post(
      'https://api.lemonsqueezy.com/v1/checkouts',
      {
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              variant_id: variantId,
              custom_price: null,
              product_options: {
                redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/create`,
                receipt_button_text: 'Create Your Account',
                receipt_link_url: `${process.env.NEXT_PUBLIC_APP_URL}/create`,
                receipt_thank_you_note: 'Thank you for your purchase! Please create your account to access your subscription.'
              },
              custom_data: customData || {},
              preview: process.env.NODE_ENV === 'development',
              embed: true // Enable overlay checkout
            }
          }
        }
      },
      {
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`
        }
      }
    );

    // Return the checkout URL
    return res.status(200).json({
      success: true,
      checkoutUrl: response.data.data.attributes.url
    });
  } catch (error) {
    console.error('Error creating checkout:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to create checkout session'
    });
  }
} 