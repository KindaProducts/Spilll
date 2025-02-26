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
    create: () => {
      console.log('LemonSqueezy.checkout.create called - using mock implementation');
      return Promise.resolve({ url: null });
    }
  }
};

// Export the mock object
export default mockLemonSqueezy;

// Attempt to override the global LemonSqueezy object if it exists
if (typeof window !== 'undefined') {
  try {
    // @ts-ignore
    window.LemonSqueezy = mockLemonSqueezy;
    console.log('Successfully overrode global LemonSqueezy object');
  } catch (err) {
    console.error('Failed to override global LemonSqueezy object:', err);
  }
} 