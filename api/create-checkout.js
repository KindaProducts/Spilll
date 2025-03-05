import axios from 'axios';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { variantId, customData } = req.body;

    if (!variantId) {
      return res.status(400).json({ success: false, error: 'Variant ID is required' });
    }

    console.log('Creating checkout for variant:', variantId, 'with custom data:', customData);

    // Ensure we have the API key
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    if (!apiKey) {
      console.error('Missing LemonSqueezy API key');
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    // Get the app URL with fallback
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.spillling.com';
    
    console.log('Using app URL:', appUrl);
    
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
                redirect_url: `${appUrl}/create`,
                receipt_button_text: 'Create Your Account',
                receipt_link_url: `${appUrl}/create`,
                receipt_thank_you_note: 'Thank you for your purchase! Please create your account to access your subscription.'
              },
              custom_data: {
                ...customData || {},
                source: 'website',
                created_at: new Date().toISOString()
              },
              preview: process.env.NODE_ENV === 'development',
              embed: true, // Enable overlay checkout
              disable_style_reset: false,
              dark: true // Use dark mode for better integration with our site
            }
          }
        }
      },
      {
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    const checkoutUrl = response.data.data.attributes.url;
    console.log('Checkout URL created:', checkoutUrl);

    // Return the checkout URL
    return res.status(200).json({
      success: true,
      checkoutUrl: checkoutUrl
    });
  } catch (error) {
    // Detailed error logging
    console.error('Error creating checkout:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    
    return res.status(500).json({
      success: false,
      error: 'Failed to create checkout session',
      details: process.env.NODE_ENV === 'development' ? 
        (error.response?.data || error.message) : undefined
    });
  }
} 