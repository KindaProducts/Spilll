import React from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
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
                Privacy Policy
              </Dialog.Title>

              <div className="mt-4 text-gray-300 space-y-6 max-h-[60vh] overflow-y-auto pr-4 relative z-10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-purple-500 [&::-webkit-scrollbar-thumb:hover]:bg-purple-400">
                <section>
                  <h3 className="text-lg font-semibold mb-4">1. Information We Collect</h3>
                  <p className="mb-4">When you use Spilll, we collect information that you provide directly to us, including:</p>
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Account information (email address, name)</li>
                    <li>Payment information (processed securely through Stripe)</li>
                    <li>Images you upload for preset generation</li>
                    <li>Generated presets and preferences</li>
                    <li>Usage data and analytics</li>
                    <li>Communications with our support team</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">2. How We Use Your Information</h3>
                  <p className="mb-4">We use the information we collect to:</p>
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process your transactions</li>
                    <li>Send you technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Develop new features and services</li>
                    <li>Prevent fraud and abuse</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">3. Data Storage and Security</h3>
                  <p className="mb-4">We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, please note that no system is completely secure.</p>
                  <p className="mb-4">Your data is stored on secure servers located in the United States. By using our service, you consent to your data being transferred to and processed in the United States.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">4. Data Retention</h3>
                  <p className="mb-4">We retain your personal information for as long as necessary to provide you with our services and as described in this privacy policy. If you delete your account, we will delete or anonymize your information unless we need to keep it for legitimate business or legal purposes.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">5. Your Rights</h3>
                  <p className="mb-4">You have the right to:</p>
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Access your personal data</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to our use of your data</li>
                    <li>Request a copy of your data</li>
                    <li>Withdraw consent at any time</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">6. Third-Party Services</h3>
                  <p className="mb-4">We use third-party services for:</p>
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Payment processing (Stripe)</li>
                    <li>Analytics (Google Analytics)</li>
                    <li>Cloud storage (AWS)</li>
                    <li>Email communications</li>
                  </ul>
                  <p>These services have their own privacy policies and may collect information as specified in their respective privacy policies.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">7. Updates to This Policy</h3>
                  <p className="mb-4">We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">8. Contact Us</h3>
                  <p className="mb-4">If you have any questions about this privacy policy or our treatment of your personal data, please contact us at privacy@spilll.ai.</p>
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

export default PrivacyPolicyModal; 