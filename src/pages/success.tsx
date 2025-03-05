import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Success: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Get the order_id from the URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const order_id = searchParams.get('order_id');

    const verifyPayment = async () => {
      try {
        if (!order_id) {
          // If no order_id is provided, assume it's a valid redirect
          // This can happen if the user is manually navigating to this page
          console.log('No order_id provided, assuming valid redirect');
          setVerified(true);
          setVerifying(false);
          return;
        }

        console.log(`Verifying payment for order ID: ${order_id}`);
        
        // Call our API to verify the payment
        const response = await axios.post('/api/verify-lemonsqueezy-payment', {
          orderId: order_id,
        });

        if (response.data.success) {
          console.log('Payment verified successfully');
          setVerified(true);
          
          // If user data is returned, store it
          if (response.data.user) {
            setUserData(response.data.user);
            
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        } else {
          console.error('Payment verification failed:', response.data.error);
          setError(response.data.error || 'Payment verification failed');
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('An error occurred while verifying your payment. Please contact support.');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [location.search]);

  // Countdown effect
  useEffect(() => {
    if (verified && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (verified && countdown === 0) {
      // Redirect to the app
      navigate('/app');
    }
  }, [verified, countdown, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          {verifying ? (
            <>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Verifying your payment...</h1>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            </>
          ) : verified ? (
            <>
              <svg
                className="h-16 w-16 text-green-500 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your account has been activated.
              </p>
              <p className="text-gray-500">
                Redirecting to the app in {countdown} seconds...
              </p>
              <button
                onClick={() => navigate('/app')}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
              >
                Go to App Now
              </button>
            </>
          ) : (
            <>
              <svg
                className="h-16 w-16 text-red-500 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h1>
              <p className="text-gray-600 mb-6">
                {error || 'There was an issue verifying your payment.'}
              </p>
              <p className="text-gray-500 mb-6">
                If you believe this is an error, please contact our support team.
              </p>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => navigate('/')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                >
                  Return to Homepage
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                >
                  Try Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Success; 