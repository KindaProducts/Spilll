import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Remove the global type declaration as we'll use the exact code from LemonSqueezy
interface PricingProps {
  onFreePresetsClick: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onFreePresetsClick }) => {
  const [isYearly, setIsYearly] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Load LemonSqueezy script - using the exact script tag from LemonSqueezy dashboard
  useEffect(() => {
    // Create and append the script element
    const script = document.createElement('script');
    script.src = 'https://assets.lemonsqueezy.com/lemon.js';
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

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

  const handleSubscribe = () => {
    // The LemonSqueezy overlay will be triggered by the link's href
    // No need for additional JavaScript here
    console.log(`Opening ${isYearly ? 'yearly' : 'monthly'} checkout overlay`);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate email
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Here you would typically send the email to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Interest registered for:', { 
        email,
        plan: isYearly ? 'yearly' : 'monthly'
      });
      
      setFormSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to register interest';
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
            
            {!showEmailForm && !formSubmitted && (
              <>
                {isYearly ? (
                  <a href="https://spilll.lemonsqueezy.com/buy/257635ee-f50c-4a3a-b487-effbccb1c8b3?embed=1&logo=0" className="lemonsqueezy-button mt-8 block w-full rounded-lg bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 text-center">Buy Spilll Yearly Subscription</a>
                ) : (
                  <a href="https://spilll.lemonsqueezy.com/buy/8a0e0990-c94e-49d0-9ecd-483f7b45de51?embed=1&logo=0" className="lemonsqueezy-button mt-8 block w-full rounded-lg bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 text-center">Buy Spilll Monthly Subscription</a>
                )}
                <script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>
              </>
            )}
            
            {showEmailForm && !formSubmitted && (
              <motion.form 
                onSubmit={handleEmailSubmit}
                className="mt-6 space-y-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className={`block w-full rounded-lg bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  whileHover={isLoading ? {} : { scale: 1.02 }}
                  whileTap={isLoading ? {} : { scale: 0.98 }}
                >
                  {isLoading ? 'Processing...' : 'Register Interest'}
                </motion.button>
              </motion.form>
            )}
            
            {formSubmitted && (
              <motion.div
                className="mt-6 rounded-lg bg-green-500/10 p-4 text-green-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-medium">Thank you for your interest!</p>
                <p className="mt-1 text-sm">We'll contact you soon with more information about our Pro plan.</p>
              </motion.div>
            )}
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