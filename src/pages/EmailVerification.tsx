import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');
  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!token) {
          setError('Verification token is missing');
          setStatus('error');
          return;
        }
        
        // Simulate verification delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const response = await fetch('/api/verify', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          setStatus('success');
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login?verified=true');
          }, 3000);
        } else {
          const data = await response.json();
          setError(data.error || 'Verification failed');
          setStatus('error');
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        setStatus('error');
      }
    };
    
    verifyEmail();
  }, [searchParams, navigate]);
  
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
              {status === 'loading' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : status === 'success' ? (
                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="text-xs text-blue-400 mt-1">Verify</span>
          </div>
          
          {/* Connector */}
          <div className={`flex-1 h-1 ${status === 'success' ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
          
          {/* Step 4: Access */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 ${status === 'success' ? 'bg-blue-500' : 'bg-gray-700'} text-white rounded-full flex items-center justify-center`}>
              <span className="text-sm">4</span>
            </div>
            <span className={`text-xs ${status === 'success' ? 'text-blue-400' : 'text-gray-500'} mt-1`}>Access</span>
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
          <div className="space-y-8">
            <h1 className="text-4xl font-bold tracking-tight">Email Verification</h1>
            
            <ProgressIndicator />
            
            {status === 'loading' && (
              <div className="rounded-2xl bg-blue-500/10 p-8 ring-1 ring-blue-500/20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="mx-auto w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full"
                />
                <h2 className="mt-4 text-2xl font-semibold">Verifying Your Email</h2>
                <p className="mt-2 text-gray-300">
                  Please wait while we verify your email address...
                </p>
              </div>
            )}
            
            {status === 'success' && (
              <div className="rounded-2xl bg-blue-500/10 p-8 ring-1 ring-blue-500/20">
                <svg className="mx-auto h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="mt-4 text-2xl font-semibold">Email Verified!</h2>
                <p className="mt-2 text-gray-300">
                  Your email has been successfully verified. You'll be redirected to the login page in a moment.
                </p>
                <motion.button
                  onClick={() => navigate('/login?verified=true')}
                  className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Go to Login
                </motion.button>
              </div>
            )}
            
            {status === 'error' && (
              <div className="rounded-2xl bg-red-500/10 p-8 ring-1 ring-red-500/20">
                <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <h2 className="mt-4 text-2xl font-semibold">Verification Failed</h2>
                <p className="mt-2 text-gray-300">
                  {error || "We couldn't verify your email. The link may have expired or been used already."}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                  <motion.button
                    onClick={() => navigate('/login')}
                    className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Go to Login
                  </motion.button>
                  <motion.button
                    onClick={() => window.location.reload()}
                    className="rounded-lg bg-gray-700 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Try Again
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailVerification; 