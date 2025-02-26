// This file completely disables any LemonSqueezy functionality
// It's loaded before any other scripts to ensure it takes precedence

// Override any global LemonSqueezy object
window.LemonSqueezy = {
  // Mock all methods to do nothing
  setup: () => {},
  Url: {
    checkout: () => {}
  },
  // Override the checkout URL creation to use our custom URLs
  createCheckout: (options) => {
    console.log('LemonSqueezy.createCheckout intercepted:', options);
    
    // Get the variant ID from the options
    const variantId = options?.variantId || '';
    
    // Determine which URL to use based on the variant ID
    let checkoutUrl;
    if (variantId === '705574') {
      // Yearly plan
      checkoutUrl = 'https://spillling.com/buy/c10e8f45-cb50-4472-aaf1-9ec55074c62f';
    } else if (variantId === '705572') {
      // Monthly plan
      checkoutUrl = 'https://spillling.com/buy/9588e2f5-6ffd-4408-9964-b46d84d4d9ac';
    } else {
      // Default to yearly if variant ID is unknown
      checkoutUrl = 'https://spillling.com/buy/c10e8f45-cb50-4472-aaf1-9ec55074c62f';
    }
    
    console.log('Redirecting to custom checkout URL:', checkoutUrl);
    window.location.href = checkoutUrl;
    
    // Return a mock promise
    return Promise.resolve();
  }
};

// Override any checkout.lemonsqueezy.com redirects
const originalOpen = window.open;
window.open = function(url, ...args) {
  if (url && typeof url === 'string' && url.includes('checkout.lemonsqueezy.com')) {
    console.log('Intercepted window.open to LemonSqueezy checkout:', url);
    
    // Extract the variant ID from the URL
    const variantIdMatch = url.match(/\/buy\/(\d+)/);
    const variantId = variantIdMatch ? variantIdMatch[1] : '';
    
    // Determine which URL to use based on the variant ID
    let customUrl;
    if (variantId === '705574') {
      // Yearly plan
      customUrl = 'https://spillling.com/buy/c10e8f45-cb50-4472-aaf1-9ec55074c62f';
    } else if (variantId === '705572') {
      // Monthly plan
      customUrl = 'https://spillling.com/buy/9588e2f5-6ffd-4408-9964-b46d84d4d9ac';
    } else {
      // Default to yearly if variant ID is unknown
      customUrl = 'https://spillling.com/buy/c10e8f45-cb50-4472-aaf1-9ec55074c62f';
    }
    
    console.log('Redirecting to custom URL:', customUrl);
    window.location.href = customUrl;
    return null;
  }
  
  // Call the original window.open for non-LemonSqueezy URLs
  return originalOpen.call(this, url, ...args);
};

// Override window.location.href assignments
const originalLocationDescriptor = Object.getOwnPropertyDescriptor(window, 'location');
if (originalLocationDescriptor && originalLocationDescriptor.configurable) {
  Object.defineProperty(window, 'location', {
    configurable: true,
    get: function() {
      return originalLocationDescriptor.get.call(this);
    },
    set: function(url) {
      if (typeof url === 'string' && url.includes('checkout.lemonsqueezy.com')) {
        console.log('Intercepted window.location assignment to LemonSqueezy checkout:', url);
        
        // Extract the variant ID from the URL
        const variantIdMatch = url.match(/\/buy\/(\d+)/);
        const variantId = variantIdMatch ? variantIdMatch[1] : '';
        
        // Determine which URL to use based on the variant ID
        let customUrl;
        if (variantId === '705574') {
          // Yearly plan
          customUrl = 'https://spillling.com/buy/c10e8f45-cb50-4472-aaf1-9ec55074c62f';
        } else if (variantId === '705572') {
          // Monthly plan
          customUrl = 'https://spillling.com/buy/9588e2f5-6ffd-4408-9964-b46d84d4d9ac';
        } else {
          // Default to yearly if variant ID is unknown
          customUrl = 'https://spillling.com/buy/c10e8f45-cb50-4472-aaf1-9ec55074c62f';
        }
        
        console.log('Redirecting to custom URL:', customUrl);
        return originalLocationDescriptor.set.call(this, customUrl);
      }
      
      // Use the original setter for non-LemonSqueezy URLs
      return originalLocationDescriptor.set.call(this, url);
    }
  });
}

console.log('LemonSqueezy override loaded and active'); 