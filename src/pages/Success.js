import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get the order_id from the URL query parameters
        const params = new URLSearchParams(location.search);
        const orderId = params.get('order_id');
        
        if (!orderId) {
          console.log('No order ID found in URL parameters');
          // If no order ID, we'll assume it's a valid redirect from LemonSqueezy
          // This happens when using the redirect_url parameter
          setVerified(true);
          setVerifying(false);
          return;
        }
        
        // Verify the payment with our API
        const response = await fetch('/api/verify-lemonsqueezy-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          setVerified(true);
          
          // Store user data if available
          if (data.user) {
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('isSubscribed', 'true');
          }
        } else {
          setError(data.error || 'Failed to verify payment');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('An error occurred while verifying your payment');
      } finally {
        setVerifying(false);
      }
    };
    
    verifyPayment();
  }, [location.search]);

  useEffect(() => {
    // Only start countdown if payment is verified
    if (verified && !error) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [navigate, verified, error]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 mb-6">
            <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Verifying Your Payment
          </h2>
          <p className="text-gray-300">
            Please wait while we verify your payment details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Verification Failed
          </h2>
          <p className="text-gray-300 mb-6">
            {error}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            Return to Homepage
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center"
      >
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
          Payment Successful!
        </h2>
        <p className="text-gray-300 mb-6">
          Thank you for your purchase. Your subscription has been activated and you now have access to all premium features.
        </p>
        <p className="text-gray-400 mb-8">
          You will receive a confirmation email shortly with your receipt and account details.
        </p>
        <div className="text-sm text-gray-400">
          Redirecting to dashboard in {countdown} seconds...
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-md transition-colors"
        >
          Go to Dashboard Now
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Success; 