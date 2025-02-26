/**
 * Custom checkout service to handle redirections to our custom URLs
 * This completely bypasses any LemonSqueezy library's behavior
 */

/**
 * Redirects to the appropriate checkout URL based on the plan type
 * @param isYearly Whether the user selected the yearly plan
 */
export const redirectToCheckout = (isYearly: boolean): void => {
  try {
    // Get the checkout URLs directly from window.__env__
    const monthlyCheckoutUrl = window.__env__.NEXT_PUBLIC_MONTHLY_CHECKOUT_URL;
    const yearlyCheckoutUrl = window.__env__.NEXT_PUBLIC_YEARLY_CHECKOUT_URL;
    
    console.log('Environment variables:', {
      monthlyCheckoutUrl,
      yearlyCheckoutUrl,
      allEnv: window.__env__
    });
    
    // Use the appropriate URL based on the selected plan
    const checkoutUrl = isYearly ? yearlyCheckoutUrl : monthlyCheckoutUrl;
    
    console.log('Redirecting to checkout:', checkoutUrl);
    
    // Force a direct navigation to the URL by setting the location directly
    // This bypasses any potential interference from other libraries
    
    // First, try with replace to avoid browser history issues
    try {
      window.location.replace(checkoutUrl);
    } catch (e) {
      console.error('Error with window.location.replace:', e);
      
      // If replace fails, try with href
      try {
        window.location.href = checkoutUrl;
      } catch (e2) {
        console.error('Error with window.location.href:', e2);
        
        // If href fails, try with window.open
        try {
          window.open(checkoutUrl, '_self');
        } catch (e3) {
          console.error('Error with window.open:', e3);
          
          // Last resort - create and click a link
          const link = document.createElement('a');
          link.href = checkoutUrl;
          link.target = '_self';
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    }
  } catch (err) {
    console.error('Checkout redirection error:', err);
    throw err;
  }
}; 