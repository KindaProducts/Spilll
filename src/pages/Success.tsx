import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'loading' | 'create' | 'verify' | 'complete'>('loading');

  useEffect(() => {
    const verifyPurchase = async () => {
      try {
        // Get the order data from LemonSqueezy's redirect
        const orderData = searchParams.get('order_data');
        if (!orderData) {
          throw new Error('No order data found');
        }

        // Parse the base64 encoded order data
        const decodedData = JSON.parse(atob(orderData));
        console.log('Order data:', decodedData);
        
        // Set the email from the order
        setEmail(decodedData.customer.email);
        setStep('create');
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        console.error('Error verifying purchase:', err);
      }
    };

    verifyPurchase();
  }, [searchParams]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      const response = await fetch('/api/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to create account');
      }

      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    }
  };

  // Progress indicator component
  const ProgressIndicator = ({ currentStep }: { currentStep: 'create' | 'verify' }) => {
    return (
      <div className="flex items-center justify-center my-6">
        <div className="flex items-center w-full max-w-md">
          {/* Step 1: Payment */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-blue-400 mt-1">Payment</span>
          </div>
          
          {/* Connector */}
          <div className="flex-1 h-1 bg-blue-500"></div>
          
          {/* Step 2: Account */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 ${currentStep === 'create' ? 'bg-blue-500 text-white' : 'bg-blue-500'} rounded-full flex items-center justify-center`}>
              {currentStep === 'create' ? (
                <span className="text-sm">2</span>
              ) : (
                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="text-xs text-blue-400 mt-1">Account</span>
          </div>
          
          {/* Connector */}
          <div className={`flex-1 h-1 ${currentStep === 'verify' ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
          
          {/* Step 3: Verify */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 ${currentStep === 'verify' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'} rounded-full flex items-center justify-center`}>
              <span className="text-sm">3</span>
            </div>
            <span className={`text-xs ${currentStep === 'verify' ? 'text-blue-400' : 'text-gray-500'} mt-1`}>Verify</span>
          </div>
          
          {/* Connector */}
          <div className="flex-1 h-1 bg-gray-700"></div>
          
          {/* Step 4: Access */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-gray-700 text-gray-400 rounded-full flex items-center justify-center">
              <span className="text-sm">4</span>
            </div>
            <span className="text-xs text-gray-500 mt-1">Access</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-violet-500/20 via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl text-center"
        >
          {step === 'loading' && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
              />
              <p className="text-lg text-gray-300">Verifying your purchase...</p>
            </div>
          )}

          {step === 'create' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Welcome to Spilll!</h1>
                
                {/* Add progress indicator */}
                <ProgressIndicator currentStep="create" />
                
                <p className="mt-4 text-lg text-gray-300">
                  Your payment was successful. Let's set up your account to get started.
                </p>
              </div>

              <form onSubmit={handleCreateAccount} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-left text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    disabled
                    className="mt-2 block w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-left text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 block w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                    minLength={8}
                  />
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-left text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-2 block w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                    minLength={8}
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <motion.button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-blue-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create Account
                </motion.button>
              </form>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-6">
              {/* Add progress indicator */}
              <ProgressIndicator currentStep="verify" />
              
              <div className="rounded-2xl bg-blue-500/10 p-8 ring-1 ring-blue-500/20">
                <svg className="mx-auto h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="mt-4 text-2xl font-semibold">Check Your Email</h2>
                <p className="mt-2 text-gray-300">
                  We've sent a verification link to <span className="font-medium text-blue-400">{email}</span>.
                  Please click the link to verify your email address and activate your account.
                </p>
              </div>

              <p className="text-sm text-gray-400">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setStep('create')}
                  className="text-blue-400 hover:text-blue-300"
                >
                  try again
                </button>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Success; 