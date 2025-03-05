import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import EmailModal from './components/EmailModal';
import SignInModal from './components/SignInModal';
import ContactModal from './components/ContactModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsModal from './components/TermsModal';
import CookiePolicyModal from './components/CookiePolicyModal';
import DesktopLayout from './components/desktop/DesktopLayout';
import PresetGenerator from './components/desktop/PresetGenerator';

// Check if running in Electron
const isElectron = typeof window !== 'undefined' && window.navigator.userAgent.indexOf('Electron') >= 0;

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In a real app, you would check if the user is authenticated
  return <>{children}</>;
};

// Home page component
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

  const handleFreePresetsClick = () => {
    setIsEmailModalOpen(true);
  };

  const handleSignInClick = () => {
    setIsSignInModalOpen(true);
  };

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handlePrivacyClick = () => {
    setIsPrivacyModalOpen(true);
  };

  const handleTermsClick = () => {
    setIsTermsModalOpen(true);
  };

  const handleCookieClick = () => {
    setIsCookieModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSignIn={handleSignInClick} />
      <main className="flex-grow">
        <Hero
          onFreePresetsClick={handleFreePresetsClick}
          onSubscribeClick={() => navigate('/success')}
        />
        <Features />
        <HowItWorks />
        <Pricing onFreePresetsClick={handleFreePresetsClick} />
        <FAQ />
      </main>
      <Footer
        onContactClick={handleContactClick}
        onPrivacyClick={handlePrivacyClick}
        onTermsClick={handleTermsClick}
        onCookieClick={handleCookieClick}
      />

      {/* Modals */}
      <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />
      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
      <CookiePolicyModal isOpen={isCookieModalOpen} onClose={() => setIsCookieModalOpen(false)} />
    </div>
  );
};

// Success page component
const SuccessPage: React.FC = () => {
  // This will be imported from the success.tsx file we created
  const SuccessComponent = require('./pages/success').default;
  return <SuccessComponent />;
};

// Main App component
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            {isElectron ? (
              <DesktopLayout>
                <PresetGenerator isSubscribed={true} />
              </DesktopLayout>
            ) : (
              <DesktopLayout>
                <PresetGenerator isSubscribed={true} />
              </DesktopLayout>
            )}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
