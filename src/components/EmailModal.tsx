import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendEmail } from '../services/email';

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Clear states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setError('');
      setValidationError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setValidationError('Email is required');
      return false;
    }
    if (!EMAIL_REGEX.test(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail) {
      validateEmail(newEmail);
    } else {
      setValidationError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await sendEmail(email, 'welcome');
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to send welcome email');
      }
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError('Too many attempts. Please try again later.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to subscribe. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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
              className="relative mx-auto max-w-md w-full overflow-hidden rounded-2xl bg-gray-900/95 p-8 shadow-xl border border-gray-800/50 backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
              
              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
              
              <div className="relative">
                <Dialog.Title className="text-3xl font-semibold leading-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Get 10 Free Presets
                </Dialog.Title>
                <Dialog.Description className="mt-4 text-lg leading-7 text-gray-300">
                  Enter your email to receive 10 free AI-generated Lightroom presets.
                </Dialog.Description>

                <form onSubmit={handleSubmit} className="mt-8">
                  <div className="space-y-2">
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={() => email && validateEmail(email)}
                      placeholder="your@email.com"
                      className={`w-full px-5 py-3.5 bg-gray-800/50 border rounded-xl text-base text-white placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all duration-200
                        ${validationError || error ? 'border-red-500' : 'border-gray-700'}`}
                      disabled={loading || success}
                      aria-invalid={!!validationError}
                      aria-describedby={validationError ? 'email-error' : undefined}
                    />
                    {validationError && (
                      <p id="email-error" className="text-sm text-red-400 pl-1">
                        {validationError}
                      </p>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                      >
                        <p className="text-sm text-red-400">
                          {error}
                        </p>
                      </motion.div>
                    )}
                    
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl"
                      >
                        <p className="text-sm text-green-400">
                          Success! Check your email for your free presets.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-6 flex justify-end gap-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white
                        rounded-xl transition-colors duration-200"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      disabled={loading || success || !!validationError}
                      className={`px-4 py-2.5 text-sm font-medium text-white
                        rounded-xl transition-all duration-200
                        ${loading || success || !!validationError 
                          ? 'bg-blue-500/50 cursor-not-allowed' 
                          : 'bg-blue-500 hover:bg-blue-400'}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? 'Sending...' : success ? 'Sent!' : 'Get Presets'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default EmailModal; 