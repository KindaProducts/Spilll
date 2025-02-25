import React from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
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
                Terms of Service
              </Dialog.Title>

              <div className="mt-4 text-gray-300 space-y-6 max-h-[60vh] overflow-y-auto pr-4 relative z-10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-purple-500 [&::-webkit-scrollbar-thumb:hover]:bg-purple-400">
                <section>
                  <h3 className="text-lg font-semibold mb-4">1. Acceptance of Terms</h3>
                  <p className="mb-4">By accessing and using Spilll, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the service.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">2. Description of Service</h3>
                  <p className="mb-4">Spilll provides an AI-powered Lightroom preset generation service. We offer both free and paid subscription plans with different features and limitations.</p>
                  <p className="mb-4">We reserve the right to modify, suspend, or discontinue any aspect of the service at any time without notice.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">3. User Accounts</h3>
                  <p className="mb-4">To access certain features, you must create an account. You agree to:</p>
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Promptly update any changes to your information</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">4. Subscription and Payments</h3>
                  <p className="mb-4">Paid subscriptions are billed in advance on a monthly or annual basis. By subscribing, you agree to:</p>
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Pay all applicable fees</li>
                    <li>Provide valid payment information</li>
                    <li>Accept automatic renewal unless cancelled</li>
                    <li>No refunds for partial subscription periods</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">5. Intellectual Property</h3>
                  <p className="mb-4">You retain ownership of your uploaded content. By using our service, you grant us a license to:</p>
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Process and analyze your images</li>
                    <li>Generate and store presets based on your content</li>
                    <li>Use anonymized data for service improvement</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">6. Acceptable Use</h3>
                  <p className="mb-4">You agree not to:</p>
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Upload illegal or unauthorized content</li>
                    <li>Violate any laws or regulations</li>
                    <li>Interfere with service operation</li>
                    <li>Attempt to gain unauthorized access</li>
                    <li>Use the service for harmful purposes</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">7. Limitation of Liability</h3>
                  <p className="mb-4">Spilll is provided "as is" without warranties of any kind. We are not liable for:</p>
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Service interruptions or errors</li>
                    <li>Data loss or corruption</li>
                    <li>Indirect or consequential damages</li>
                    <li>Third-party actions or content</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">8. Termination</h3>
                  <p className="mb-4">We may terminate or suspend your account and access to the service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">9. Changes to Terms</h3>
                  <p className="mb-4">We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service. Continued use of the service after changes constitutes acceptance of the new terms.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4">10. Contact</h3>
                  <p className="mb-4">For questions about these Terms of Service, please contact us at terms@spilll.ai.</p>
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

export default TermsModal; 