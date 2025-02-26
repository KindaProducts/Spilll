import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PricingProps {
  onFreePresetsClick: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onFreePresetsClick }) => {
  const [isYearly, setIsYearly] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const monthlyPrice = 29;
  const yearlyPrice = Math.floor(monthlyPrice * 12 * 0.8); // 20% discount
  const monthlySavings = Math.floor(monthlyPrice * 12 - yearlyPrice);

  const handleSubscribe = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Debug: Log environment variables
      console.log('Environment:', window.__env__);
      
      // Get variant IDs from environment variables
      const monthlyVariantId = window.__env__?.NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_VARIANT_ID;
      const yearlyVariantId = window.__env__?.NEXT_PUBLIC_LEMONSQUEEZY_YEARLY_VARIANT_ID;
      const storeId = window.__env__?.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID;

      console.log('Config:', { 
        monthlyVariantId, 
        yearlyVariantId, 
        storeId,
        isYearly 
      });

      if (!monthlyVariantId || !yearlyVariantId) {
        throw new Error('Variant IDs not found. Please check your configuration.');
      }

      // Use the correct variant ID based on selection
      const variantId = isYearly ? yearlyVariantId : monthlyVariantId;
      
      // Construct the checkout URL using the standard LemonSqueezy format
      const checkoutUrl = `https://lemonsqueezy.com/checkout/${variantId}`;
      
      console.log('Redirecting to checkout:', checkoutUrl);
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error('Checkout error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to start checkout process';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const subscriptionFeatures = [
    'Unlimited AI-generated presets',
    'Custom color grading profiles',
    'Priority support',
    'Early access to new AI models',
  ];

  const freeFeatures = [
    '10 AI-generated presets',
    'Basic preset customization',
    'Export to Lightroom format',
    'Community support',
  ];

  return (
    <div className="py-16 sm:py-24" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Choose your plan
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Start with our free plan or upgrade to Pro for unlimited access to all features.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="mt-16 grid gap-8 max-w-2xl mx-auto">
          {/* Pro Plan */}
          <motion.div 
            className="rounded-2xl bg-gray-800/50 p-8 ring-1 ring-gray-700 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Billing toggle */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <span className="text-gray-300">Monthly</span>
              <motion.button
                type="button"
                role="switch"
                aria-checked={isYearly}
                onClick={() => setIsYearly(!isYearly)}
                className="relative inline-flex h-6 w-11 items-center rounded-full"
                animate={{ backgroundColor: isYearly ? 'rgb(37, 99, 235)' : 'rgb(55, 65, 81)' }}
                transition={{ duration: 0.2 }}
              >
                <span className="sr-only">Enable yearly billing</span>
                <motion.span
                  className="inline-block h-4 w-4 transform rounded-full bg-white"
                  animate={{ x: isYearly ? 24 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
              <span className="text-gray-300">
                Yearly
                <span className="ml-2 inline-flex items-center rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-300 ring-1 ring-inset ring-blue-500/20">
                  Save ${monthlySavings}/year
                </span>
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white">
              Pro Plan
            </h3>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-white">
                ${isYearly ? Math.floor(yearlyPrice / 12) : monthlyPrice}
              </span>
              <span className="text-lg text-gray-300">/month</span>
            </p>
            {isYearly && (
              <p className="mt-1 text-sm text-gray-400">
                ${yearlyPrice} billed yearly
              </p>
            )}
            <ul className="mt-8 space-y-3">
              {subscriptionFeatures.map((feature) => (
                <motion.li 
                  key={feature} 
                  className="flex gap-x-3 text-gray-300"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <svg className="h-6 w-5 flex-none text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </motion.li>
              ))}
            </ul>
            <motion.button
              onClick={handleSubscribe}
              disabled={isLoading}
              className={`mt-8 block w-full rounded-lg bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              whileHover={isLoading ? {} : { scale: 1.02 }}
              whileTap={isLoading ? {} : { scale: 0.98 }}
            >
              {isLoading ? 'Processing...' : `Get Started with ${isYearly ? 'Yearly' : 'Monthly'} Plan`}
            </motion.button>
          </motion.div>

          {/* Free tier card */}
          <motion.div 
            className="rounded-2xl bg-gray-800/30 p-8 ring-1 ring-gray-700 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-2xl font-bold text-white">
              Free Preset Pack
            </h3>
            <p className="mt-6 text-base text-gray-300">
              Get started with 10 high-quality AI-generated Lightroom presets delivered straight to your inbox. Perfect for trying out our technology and enhancing your photos.
            </p>
            <motion.button
              onClick={onFreePresetsClick}
              className="mt-8 block w-full rounded-lg bg-gray-700 hover:bg-gray-600 px-6 py-4 text-sm font-semibold text-white shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Free Presets
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Add error display */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default Pricing; 