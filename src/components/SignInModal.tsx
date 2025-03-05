import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  // Clear states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setError('');
      setValidationError('');
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

    if (!password) {
      setValidationError('Password is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting to sign in with:', { email, password });
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        onClose();
        navigate('/app');
      } else {
        if (data.needsVerification) {
          // If email needs verification, redirect to resend verification page
          onClose();
          navigate('/resend-verification', { state: { email: data.email } });
        } else {
          setError(data.error || 'Invalid credentials');
        }
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Failed to sign in. Please try again.');
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
          open={isOpen}
          onClose={onClose}
          className="relative z-50"
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

          {/* Modal */}
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
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="relative">
                <Dialog.Title className="text-3xl font-semibold leading-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Sign In
                </Dialog.Title>
                <Dialog.Description className="mt-4 text-lg leading-7 text-gray-300">
                  Access your Spilll account to create AI-powered presets.
                </Dialog.Description>

                <form onSubmit={handleSubmit} className="mt-8">
                  <div className="space-y-4">
                    <div>
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
                        disabled={loading}
                        aria-invalid={!!validationError}
                        aria-describedby={validationError ? 'email-error' : undefined}
                      />
                      {validationError && (
                        <p id="email-error" className="text-sm text-red-400 pl-1 mt-1">
                          {validationError}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className={`w-full px-5 py-3.5 bg-gray-800/50 border rounded-xl text-base text-white placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all duration-200
                          ${error ? 'border-red-500' : 'border-gray-700'}`}
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                        <span className="sr-only">
                          {showPassword ? 'Hide password' : 'Show password'}
                        </span>
                      </button>
                    </div>
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
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </motion.button>
                </form>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default SignInModal; 