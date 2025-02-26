/**
 * This file completely disables the LemonSqueezy library by providing mock implementations
 * of its functions that do nothing or use our custom checkout URLs.
 */

// Create a mock LemonSqueezy object
const mockLemonSqueezy = {
  // Mock the configure method
  configure: () => {
    console.log('LemonSqueezy.configure called - using mock implementation');
    return mockLemonSqueezy;
  },
  
  // Mock the checkout method
  checkout: {
    // Mock the create method
    create: (options: any) => {
      console.log('LemonSqueezy.checkout.create called - using mock implementation', options);
      
      // Extract the variant ID from the options
      const variantId = options?.variantId || options?.variant || options?.id;
      
      // Determine which custom URL to use based on the variant ID
      let checkoutUrl;
      if (variantId) {
        if (variantId === '705574' || window.__env__.NEXT_PUBLIC_LEMONSQUEEZY_YEARLY_VARIANT_ID === variantId) {
          // Yearly plan
          checkoutUrl = window.__env__.NEXT_PUBLIC_YEARLY_CHECKOUT_URL;
        } else if (variantId === '705572' || window.__env__.NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_VARIANT_ID === variantId) {
          // Monthly plan
          checkoutUrl = window.__env__.NEXT_PUBLIC_MONTHLY_CHECKOUT_URL;
        }
      }
      
      // If we have a custom URL, redirect to it
      if (checkoutUrl) {
        console.log('Redirecting to custom URL:', checkoutUrl);
        window.location.replace(checkoutUrl);
      }
      
      // Return a mock response
      return Promise.resolve({ url: checkoutUrl || null });
    }
  }
};

// Export the mock object
export default mockLemonSqueezy;

// Attempt to override the global LemonSqueezy object if it exists
if (typeof window !== 'undefined') {
  try {
    // Define a property on window that intercepts any access to LemonSqueezy
    Object.defineProperty(window, 'LemonSqueezy', {
      get: function() {
        console.log('Accessing global LemonSqueezy object - returning mock');
        return mockLemonSqueezy;
      },
      set: function(value) {
        console.log('Attempting to set global LemonSqueezy object - ignoring');
        // Ignore the set operation, keeping our mock
      },
      configurable: false,
      enumerable: true
    });
    
    console.log('Successfully overrode global LemonSqueezy object');
    
    // Also intercept any script loading attempts for LemonSqueezy
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName: string) {
      const element = originalCreateElement.call(document, tagName);
      
      if (tagName.toLowerCase() === 'script') {
        // Override the src setter
        const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
        if (originalSrcDescriptor && originalSrcDescriptor.set) {
          Object.defineProperty(element, 'src', {
            set: function(value) {
              if (value && typeof value === 'string' && value.includes('lemonsqueezy')) {
                console.log('Blocking LemonSqueezy script load:', value);
                // Set to an empty script instead
                return originalSrcDescriptor.set.call(this, 'data:text/javascript,console.log("LemonSqueezy script blocked");');
              }
              return originalSrcDescriptor.set.call(this, value);
            },
            get: originalSrcDescriptor.get,
            configurable: true
          });
        }
      }
      
      return element;
    };
  } catch (err) {
    console.error('Failed to override global LemonSqueezy object:', err);
  }
}