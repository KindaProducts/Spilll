import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onSignIn: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSignIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = window.pageYOffset + elementPosition - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });

      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  const handleGetStartedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const pricingSection = document.querySelector('#pricing');
    if (!pricingSection) return;

    const headerOffset = 80;
    const elementPosition = pricingSection.getBoundingClientRect().top;
    const offsetPosition = window.pageYOffset + elementPosition - headerOffset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth'
    });
  };

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <nav 
        className="rounded-2xl bg-white/[0.05] backdrop-blur-2xl border border-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] transition-all duration-300"
        aria-label="Global"
      >
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex lg:flex-1">
            <a 
              href="#hero" 
              onClick={(e) => handleNavClick(e, '#hero')}
              className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
            >
              <img
                src="/images/logo-dark.png"
                alt="Spilll Logo"
                className="h-8 w-auto"
              />
              <span className="text-xl font-semibold text-white">Spilll</span>
            </a>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 text-white transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm font-semibold text-white transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
            <button
              onClick={onSignIn}
              className="text-sm font-semibold text-white transition-all duration-300"
            >
              Sign in
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStartedClick}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              See Plans
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog as="div" className="lg:hidden" open={isMobileMenuOpen} onClose={setIsMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white/[0.05] backdrop-blur-2xl border-l border-white/[0.05] px-6 py-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <a 
              href="#hero"
              onClick={(e) => {
                handleNavClick(e, '#hero');
                setIsMobileMenuOpen(false);
              }}
              className="transition-all duration-300"
            >
              <span className="sr-only">Spilll</span>
              <img
                src="/images/logo-dark.png"
                alt="Spilll Logo"
                className="h-8 w-auto"
              />
              <span className="text-xl font-semibold text-white">Spilll</span>
            </a>
            <button
              type="button"
              className="rounded-md p-2.5 text-white transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-700">
              <div className="space-y-2 py-6">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-base text-white hover:bg-gray-800 transition-all duration-300"
                    onClick={(e) => {
                      handleNavClick(e, item.href);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6 space-y-3">
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      const pricingSection = document.querySelector('#pricing');
                      if (pricingSection) {
                        pricingSection.scrollIntoView({ 
                          behavior: 'smooth', 
                          block: 'start',
                          inline: 'nearest'
                        });
                      }
                    }}
                    className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-base text-white shadow-sm transition-all duration-300 hover:scale-105"
                  >
                    See Plans
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Header; 