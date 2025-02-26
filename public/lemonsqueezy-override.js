/**
 * This script completely overrides the LemonSqueezy library at the global level
 * It runs before any other scripts and ensures that our custom checkout URLs are used
 */
(function() {
  console.log('LemonSqueezy override script loaded');
  
  // Create a mock LemonSqueezy object
  const mockLemonSqueezy = {
    // Mock the configure method
    configure: function() {
      console.log('LemonSqueezy.configure called - using mock implementation');
      return mockLemonSqueezy;
    },
    
    // Mock the checkout method
    checkout: {
      // Mock the create method
      create: function(options) {
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
  
  // Override the global LemonSqueezy object
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
      configurable: true,
      enumerable: true
    });
    
    console.log('Successfully overrode global LemonSqueezy object');
  } catch (err) {
    console.error('Failed to override global LemonSqueezy object:', err);
  }
  
  // Block any attempts to load the LemonSqueezy script
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    
    if (tagName.toLowerCase() === 'script') {
      const originalSetAttribute = element.setAttribute;
      element.setAttribute = function(name, value) {
        if (name === 'src' && value && typeof value === 'string' && value.includes('lemonsqueezy')) {
          console.log('Blocking LemonSqueezy script load:', value);
          return originalSetAttribute.call(this, 'src', 'data:text/javascript,console.log("LemonSqueezy script blocked");');
        }
        return originalSetAttribute.call(this, name, value);
      };
    }
    
    return element;
  };
  
  // Override any global fetch calls to LemonSqueezy API
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    if (typeof input === 'string' && input.includes('lemonsqueezy.com')) {
      console.log('Intercepted fetch call to LemonSqueezy API:', input);
      // Return a mock response
      return Promise.resolve(new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    return originalFetch.apply(this, arguments);
  };
  
  // Override any XMLHttpRequest calls to LemonSqueezy API
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    if (typeof url === 'string' && url.includes('lemonsqueezy.com')) {
      console.log('Intercepted XMLHttpRequest to LemonSqueezy API:', url);
      // Redirect to a non-existent endpoint
      url = 'about:blank';
    }
    return originalXHROpen.call(this, method, url, ...args);
  };
})(); 