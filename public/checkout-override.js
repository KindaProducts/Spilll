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
          
          // Extract the variant ID from the URL - handle both formats
          // Format 1: /buy/705574
          // Format 2: /buy/705574?success_url=https://www.spillling.com/success
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
  
  // Add a more aggressive approach - intercept all navigation events
  document.addEventListener('DOMContentLoaded', function() {
    // Intercept all link clicks
    document.addEventListener('click', function(event) {
      const target = event.target;
      if (target && target.tagName === 'A') {
        const href = target.getAttribute('href');
        if (href && href.includes('checkout.lemonsqueezy.com')) {
          event.preventDefault();
          
          // Extract the variant ID
          const variantMatch = href.match(/\/buy\/(\d+)/);
          const variantId = variantMatch ? variantMatch[1] : null;
          
          if (variantId) {
            let customUrl;
            
            if (variantId === '705574' || window.__env__.NEXT_PUBLIC_LEMONSQUEEZY_YEARLY_VARIANT_ID === variantId) {
              customUrl = window.__env__.NEXT_PUBLIC_YEARLY_CHECKOUT_URL;
            } else if (variantId === '705572' || window.__env__.NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_VARIANT_ID === variantId) {
              customUrl = window.__env__.NEXT_PUBLIC_MONTHLY_CHECKOUT_URL;
            }
            
            if (customUrl) {
              console.log('Intercepted link click, redirecting to:', customUrl);
              window.location.replace(customUrl);
            }
          }
        }
      }
    }, true);
  });
  
  // Create a MutationObserver to watch for dynamically added elements
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
              const links = node.querySelectorAll('a[href*="checkout.lemonsqueezy.com"]');
              links.forEach(function(link) {
                link.addEventListener('click', function(event) {
                  event.preventDefault();
                  
                  const href = link.getAttribute('href');
                  const variantMatch = href.match(/\/buy\/(\d+)/);
                  const variantId = variantMatch ? variantMatch[1] : null;
                  
                  if (variantId) {
                    let customUrl;
                    
                    if (variantId === '705574' || window.__env__.NEXT_PUBLIC_LEMONSQUEEZY_YEARLY_VARIANT_ID === variantId) {
                      customUrl = window.__env__.NEXT_PUBLIC_YEARLY_CHECKOUT_URL;
                    } else if (variantId === '705572' || window.__env__.NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_VARIANT_ID === variantId) {
                      customUrl = window.__env__.NEXT_PUBLIC_MONTHLY_CHECKOUT_URL;
                    }
                    
                    if (customUrl) {
                      console.log('Intercepted dynamic link click, redirecting to:', customUrl);
                      window.location.replace(customUrl);
                    }
                  }
                });
              });
            }
          });
        }
      });
    });
    
    // Start observing the document
    observer.observe(document, { childList: true, subtree: true });
  }
  
  // Override fetch and XMLHttpRequest to intercept any API calls to LemonSqueezy
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