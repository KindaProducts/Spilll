import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if user has just verified their email
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      setShowVerificationSuccess(true);
      // Hide the success message after 5 seconds
      const timer = setTimeout(() => {
        setShowVerificationSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/test-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store the token
        localStorage.setItem('authToken', data.token);
        // Redirect to the app
        navigate('/app');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Progress indicator component
  const ProgressIndicator = () => {
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
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-blue-400 mt-1">Account</span>
          </div>
          
          {/* Connector */}
          <div className="flex-1 h-1 bg-blue-500"></div>
          
          {/* Step 3: Verify */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-blue-400 mt-1">Verify</span>
          </div>
          
          {/* Connector */}
          <div className="flex-1 h-1 bg-blue-500"></div>
          
          {/* Step 4: Access */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
              <span className="text-sm">4</span>
            </div>
            <span className="text-xs text-blue-400 mt-1">Access</span>
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
          className="mx-auto max-w-md"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">Welcome Back</h1>
            
            {/* Show progress indicator */}
            <ProgressIndicator />
            
            <p className="mt-4 text-lg text-gray-300">
              Sign in to access your Spilll account
            </p>
          </div>

          {/* Verification success message */}
          <AnimatePresence>
            {showVerificationSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 rounded-lg bg-green-500/10 p-4 text-sm text-green-400 flex items-center"
              >
                <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Your email has been verified successfully! You can now log in.
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 