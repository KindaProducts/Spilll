import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sendEmail } from '../services/email';

interface FooterProps {
  onContactClick: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onCookieClick: () => void;
}

const Footer: React.FC<FooterProps> = ({
  onContactClick,
  onPrivacyClick,
  onTermsClick,
  onCookieClick
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await sendEmail(email, 'welcome');
      if (result.success) {
        setIsSuccess(true);
        setEmail('');
        // Reset success state after 3 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to subscribe');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigation = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'How it Works', href: '#how-it-works' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'FAQ', href: '#faq' },
    ],
    support: [
      { name: 'Contact Support', onClick: onContactClick },
    ],
    legal: [
      { name: 'Privacy', onClick: onPrivacyClick },
      { name: 'Terms', onClick: onTermsClick },
      { name: 'Cookie Policy', onClick: onCookieClick },
    ],
    social: [
      {
        name: 'Twitter',
        href: '#',
        icon: (props: any) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        ),
      },
    ],
  };

  return (
    <footer className="relative isolate mt-24 w-full" aria-labelledby="footer-heading">
      {/* Wave separator */}
      <div className="absolute top-0 left-0 right-0 w-full">
        <svg 
          viewBox="0 0 1440 118" 
          className="w-full h-[118px] block transform translate-y-[-99%]"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,58L60,53C120,48,240,38,360,36.3C480,35,600,41,720,48C840,55,960,61,1080,59.7C1200,58,1320,48,1380,43L1440,38L1440,118L1380,118C1320,118,1200,118,1080,118C960,118,840,118,720,118C600,118,480,118,360,118C240,118,120,118,60,118L0,118Z"
            className="fill-[#2D1B69]"
          />
        </svg>
      </div>

      <div className="w-full bg-[#2D1B69]">
        <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="xl:grid xl:grid-cols-12 xl:gap-8">
            <div className="xl:col-span-4 space-y-8">
              <span className="text-xl font-semibold text-white">Spilll</span>
              <p className="text-sm leading-6 text-gray-300">
                Transform your photos with AI-powered Lightroom presets. Perfect for photographers of all skill levels.
              </p>

              {/* Email subscription form */}
              <div className="space-y-4">
                <label htmlFor="footer-email" className="block text-sm font-medium text-gray-300">
                  Join our list (no spam, we swear!)
                </label>
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="email"
                      id="footer-email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-lg border-0 bg-white/5 px-4 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                      placeholder="Enter your email"
                      disabled={isSubmitting || isSuccess}
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className={`rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm whitespace-nowrap transition-all duration-200 ${
                      isSuccess
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? 'Subscribing...' : isSuccess ? 'Subscribed!' : 'Subscribe'}
                  </motion.button>
                </form>
                {error && (
                  <p className="text-sm text-red-400">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex space-x-6">
                {navigation.social.map((item) => (
                  <a 
                    key={item.name} 
                    href={item.href} 
                    className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-16 xl:col-span-7 xl:col-start-6 xl:mt-0">
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">Product</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.product.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.support.map((item) => (
                      <li key={item.name}>
                        <button
                          onClick={item.onClick}
                          className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200"
                        >
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.legal.map((item) => (
                      <li key={item.name}>
                        <motion.button
                          onClick={item.onClick}
                          className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {item.name}
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-gray-800/50 pt-8 sm:mt-20 lg:mt-24">
            <p className="text-xs leading-5 text-gray-400">
              &copy; {new Date().getFullYear()} Spilll. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 