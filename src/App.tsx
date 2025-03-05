import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PresetGenerator from './components/desktop/PresetGenerator';
import EmailModal from './components/EmailModal';
import SignInModal from './components/SignInModal';
import ContactModal from './components/ContactModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsModal from './components/TermsModal';
import CookiePolicyModal from './components/CookiePolicyModal';
import DesktopLayout from './components/desktop/DesktopLayout';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import CreateAccount from './pages/CreateAccount';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';

// Check if running in Electron
const isElectron = typeof window !== 'undefined' && 
  window.process?.versions?.hasOwnProperty('electron');

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('authToken');
  return token ? <>{children}</> : <Navigate to="/" />;
};

// HomePage component
const HomePage: React.FC = () => {
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
    <>
      <Header onSignIn={handleSignInClick} />
      <main>
        <Hero 
          onFreePresetsClick={handleFreePresetsClick}
          onSubscribeClick={() => {
            const pricingSection = document.querySelector('#pricing');
            if (pricingSection) {
              pricingSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
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

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
      <CookiePolicyModal
        isOpen={isCookieModalOpen}
        onClose={() => setIsCookieModalOpen(false)}
      />
    </>
  );
};

const App: React.FC = () => {
  // Enable dark mode by default
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-dark-900 text-white">
        <Routes>
          <Route path="/" element={isElectron ? (
            <DesktopLayout>
              <PresetGenerator isSubscribed={false} />
            </DesktopLayout>
          ) : (
            <HomePage />
          )} />
          <Route path="/create" element={<CreateAccount />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/app" element={
            <ProtectedRoute>
              <DesktopLayout>
                <PresetGenerator isSubscribed={true} />
              </DesktopLayout>
            </ProtectedRoute>
          } />
          <Route path="/create-account" element={<Navigate to="/create" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
