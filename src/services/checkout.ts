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
      yearlyCheckoutUrl
    });
    
    // Use the appropriate URL based on the selected plan
    const checkoutUrl = isYearly ? yearlyCheckoutUrl : monthlyCheckoutUrl;
    
    console.log('Redirecting to checkout:', checkoutUrl);
    
    // Force a direct navigation to the URL by setting the location directly
    // This bypasses any potential interference from other libraries
    window.location.replace(checkoutUrl);
  } catch (err) {
    console.error('Checkout redirection error:', err);
    throw err;
  }
}; 