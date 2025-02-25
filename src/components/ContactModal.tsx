import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendEmail } from '../services/email';

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Clear states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setError('');
      setValidationErrors({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setSuccess(false);
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const errors = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!EMAIL_REGEX.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
      isValid = false;
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for the field being typed in
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await sendEmail(formData.email, 'contact', {
        name: formData.name,
        subject: formData.subject,
        message: formData.message
      });
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError('Too many attempts. Please try again later.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to send message. Please try again.');
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
              className="relative mx-auto max-w-lg w-full overflow-hidden rounded-2xl bg-gray-900/95 p-8 shadow-xl border border-gray-800/50 backdrop-blur-xl"
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
                  Contact Support
                </Dialog.Title>
                <Dialog.Description className="mt-4 text-lg leading-7 text-gray-300">
                  Send us a message and we'll get back to you as soon as possible.
                </Dialog.Description>

                <form onSubmit={handleSubmit} className="mt-8">
                  <div className="space-y-4">
                    {/* Name field */}
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        className={`w-full px-5 py-3.5 bg-gray-800/50 border rounded-xl text-base text-white placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all duration-200
                          ${validationErrors.name ? 'border-red-500' : 'border-gray-700'}`}
                        disabled={loading || success}
                        aria-invalid={!!validationErrors.name}
                        aria-describedby={validationErrors.name ? 'name-error' : undefined}
                      />
                      {validationErrors.name && (
                        <p id="name-error" className="mt-1 text-sm text-red-400 pl-1">
                          {validationErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Email field */}
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className={`w-full px-5 py-3.5 bg-gray-800/50 border rounded-xl text-base text-white placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all duration-200
                          ${validationErrors.email ? 'border-red-500' : 'border-gray-700'}`}
                        disabled={loading || success}
                        aria-invalid={!!validationErrors.email}
                        aria-describedby={validationErrors.email ? 'email-error' : undefined}
                      />
                      {validationErrors.email && (
                        <p id="email-error" className="mt-1 text-sm text-red-400 pl-1">
                          {validationErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Subject field */}
                    <div>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Subject"
                        className={`w-full px-5 py-3.5 bg-gray-800/50 border rounded-xl text-base text-white placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all duration-200
                          ${validationErrors.subject ? 'border-red-500' : 'border-gray-700'}`}
                        disabled={loading || success}
                        aria-invalid={!!validationErrors.subject}
                        aria-describedby={validationErrors.subject ? 'subject-error' : undefined}
                      />
                      {validationErrors.subject && (
                        <p id="subject-error" className="mt-1 text-sm text-red-400 pl-1">
                          {validationErrors.subject}
                        </p>
                      )}
                    </div>

                    {/* Message field */}
                    <div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Your message"
                        rows={4}
                        className={`w-full px-5 py-3.5 bg-gray-800/50 border rounded-xl text-base text-white placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all duration-200 resize-none
                          ${validationErrors.message ? 'border-red-500' : 'border-gray-700'}`}
                        disabled={loading || success}
                        aria-invalid={!!validationErrors.message}
                        aria-describedby={validationErrors.message ? 'message-error' : undefined}
                      />
                      {validationErrors.message && (
                        <p id="message-error" className="mt-1 text-sm text-red-400 pl-1">
                          {validationErrors.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
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
                        className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl"
                      >
                        <p className="text-sm text-green-400">
                          Message sent successfully! We'll get back to you soon.
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
                      disabled={loading || success}
                      className={`px-4 py-2.5 text-sm font-medium text-white
                        rounded-xl transition-all duration-200
                        ${loading || success
                          ? 'bg-blue-500/50 cursor-not-allowed' 
                          : 'bg-blue-500 hover:bg-blue-400'}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? 'Sending...' : success ? 'Sent!' : 'Send Message'}
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

export default ContactModal; 