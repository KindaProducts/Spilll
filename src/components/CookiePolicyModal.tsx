import React from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

interface CookiePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CookiePolicyModal: React.FC<CookiePolicyModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative z-50"
          open={isOpen}
          onClose={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ 
              duration: 0.3,
              ease: "easeInOut"
            }}
            className="fixed inset-0 bg-black/60 transition-[backdrop-filter,opacity] duration-300"
            style={{
              backdropFilter: "var(--blur)",
              WebkitBackdropFilter: "var(--blur)"
            }}
            aria-hidden="true"
          />

          {/* Full-screen container to center the panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative mx-auto max-w-2xl w-full overflow-hidden rounded-2xl bg-gray-900/95 p-8 shadow-xl border border-gray-800/50 backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
              
              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors duration-200 z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>

              <Dialog.Title
                as="h2"
                className="text-2xl font-bold leading-6 text-white mb-8 relative z-10"
              >
                Cookie Policy
              </Dialog.Title>

              <div className="mt-4 text-gray-300 space-y-6 max-h-[60vh] overflow-y-auto pr-4 relative z-10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-purple-500 [&::-webkit-scrollbar-thumb:hover]:bg-purple-400">
                <section>
                  <h3 className="text-lg font-semibold mb-4">1. What Are Cookies</h3>
                  <p className="mb-4">Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by:</p>
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Remembering your preferences and settings</li>
                    <li>Understanding how you use our service</li>
                    <li>Improving our website functionality</li>
                    <li>Providing personalized content and features</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">2. Types of Cookies We Use</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Essential Cookies</h4>
                      <p>Required for the website to function properly. They enable basic features like page navigation and access to secure areas.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Functionality Cookies</h4>
                      <p>Help us remember your preferences and customize your experience.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Analytics Cookies</h4>
                      <p>Collect information about how you use our website, helping us improve our services.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Marketing Cookies</h4>
                      <p>Used to track visitors across websites to display relevant advertisements.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">3. How We Use Cookies</h3>
                  <p className="mb-4">We use cookies for the following purposes:</p>
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Authentication and security</li>
                    <li>Preferences and settings storage</li>
                    <li>Analytics and performance monitoring</li>
                    <li>Marketing and advertising optimization</li>
                    <li>User experience improvement</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">4. Third-Party Cookies</h3>
                  <p className="mb-4">We use services from these third parties that may place cookies on your device:</p>
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Google Analytics (analytics)</li>
                    <li>Stripe (payment processing)</li>
                    <li>Social media platforms (sharing features)</li>
                    <li>Marketing and advertising partners</li>
                  </ul>
                  <p>These third parties have their own privacy and cookie policies.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">5. Cookie Management</h3>
                  <p className="mb-4">You can control cookies through your browser settings. Options typically include:</p>
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Accepting all cookies</li>
                    <li>Notifying you when cookies are set</li>
                    <li>Rejecting all cookies</li>
                    <li>Deleting cookies periodically</li>
                  </ul>
                  <p className="mb-4">Note: Blocking some types of cookies may impact your experience on our website.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">6. Updates to Cookie Policy</h3>
                  <p className="mb-4">We may update this Cookie Policy to reflect changes in our practices or for operational, legal, or regulatory reasons. We will notify you of any material changes through our website.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">7. Contact Us</h3>
                  <p className="mb-4">If you have questions about our use of cookies, please contact us at cookies@spilll.ai.</p>
                </section>
              </div>

              <div className="mt-8 flex justify-end relative z-10">
                <motion.button
                  onClick={onClose}
                  className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default CookiePolicyModal; 