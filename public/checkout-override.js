/**
 * This script runs before the application loads and ensures that our custom checkout URLs are used.
 * It overrides any potential LemonSqueezy checkout functionality.
 */
(function() {
  // Store the original open method
  const originalOpen = window.open;
  
  // Override the window.open method to intercept any calls to LemonSqueezy checkout
  window.open = function(url, target, features) {
    console.log('Intercepted window.open call:', { url, target, features });
    
    // Check if the URL is a LemonSqueezy checkout URL
    if (url && typeof url === 'string' && url.includes('checkout.lemonsqueezy.com')) {
      console.log('Detected LemonSqueezy checkout URL:', url);
      
      // Extract the variant ID from the URL
      const variantMatch = url.match(/\/buy\/(\d+)/);
      const variantId = variantMatch ? variantMatch[1] : null;
      
      // Determine which custom URL to use based on the variant ID
      if (variantId) {
        let customUrl;
        
        if (variantId === '705574' || window.__env__.NEXT_PUBLIC_LEMONSQUEEZY_YEARLY_VARIANT_ID === variantId) {
          // Yearly plan
          customUrl = window.__env__.NEXT_PUBLIC_YEARLY_CHECKOUT_URL;
        } else if (variantId === '705572' || window.__env__.NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_VARIANT_ID === variantId) {
          // Monthly plan
          customUrl = window.__env__.NEXT_PUBLIC_MONTHLY_CHECKOUT_URL;
        }
        
        if (customUrl) {
          console.log('Redirecting to custom URL:', customUrl);
          window.location.replace(customUrl);
          return null; // Prevent the original window.open call
        }
      }
    }
    
    // For all other URLs, use the original window.open method
    return originalOpen.apply(window, arguments);
  };
  
  // Also override window.location.href setter
  const originalLocationDescriptor = Object.getOwnPropertyDescriptor(window.Location.prototype, 'href');
  if (originalLocationDescriptor && originalLocationDescriptor.set) {
    Object.defineProperty(window.Location.prototype, 'href', {
      set: function(url) {
        if (url && typeof url === 'string' && url.includes('checkout.lemonsqueezy.com')) {
          console.log('Intercepted window.location.href assignment:', url);
          
          // Extract the variant ID from the URL
          const variantMatch = url.match(/\/buy\/(\d+)/);
          const variantId = variantMatch ? variantMatch[1] : null;
          
          // Determine which custom URL to use based on the variant ID
          if (variantId) {
            let customUrl;
            
            if (variantId === '705574' || window.__env__.NEXT_PUBLIC_LEMONSQUEEZY_YEARLY_VARIANT_ID === variantId) {
              // Yearly plan
              customUrl = window.__env__.NEXT_PUBLIC_YEARLY_CHECKOUT_URL;
            } else if (variantId === '705572' || window.__env__.NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_VARIANT_ID === variantId) {
              // Monthly plan
              customUrl = window.__env__.NEXT_PUBLIC_MONTHLY_CHECKOUT_URL;
            }
            
            if (customUrl) {
              console.log('Redirecting to custom URL:', customUrl);
              return originalLocationDescriptor.set.call(this, customUrl);
            }
          }
        }
        
        return originalLocationDescriptor.set.call(this, url);
      },
      get: originalLocationDescriptor.get,
      configurable: true
    });
  }
})(); 