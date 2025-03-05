import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
          setVerificationStatus('error');
          setErrorMessage('Verification token is missing.');
          return;
        }

        const response = await fetch('/api/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.success) {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
          setErrorMessage(data.error || 'Failed to verify email.');
        }
      } catch (err) {
        console.error('Email verification error:', err);
        setVerificationStatus('error');
        setErrorMessage('An error occurred during verification. Please try again.');
      }
    };

    verifyEmail();
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center"
      >
        {verificationStatus === 'loading' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 mb-6">
              <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Verifying Your Email
            </h2>
            <p className="text-gray-300">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg
                className="h-10 w-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Email Verified Successfully!
            </h2>
            <p className="text-gray-300 mb-6">
              Your email has been verified and your account is now active. You can now sign in to access your premium features.
            </p>
            <div className="flex flex-col space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Return to Homepage
              </motion.button>
            </div>
          </>
        )}

        {verificationStatus === 'error' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg
                className="h-10 w-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Verification Failed
            </h2>
            <p className="text-gray-300 mb-6">
              {errorMessage || 'We could not verify your email. The verification link may have expired or is invalid.'}
            </p>
            <div className="flex flex-col space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/resend-verification')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Resend Verification Email
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Return to Homepage
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail; 