import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "What file formats do you support?",
    answer: "We support all major image formats including JPEG, PNG, and RAW files (DNG, CR2, NEF, ARW). Our AI can analyze and generate presets for any supported format while maintaining the highest quality."
  },
  {
    question: "How do I import the presets into Lightroom?",
    answer: "Our presets are exported in Lightroom's native format (.xmp). Simply download the preset file and import it through Lightroom's preset panel. We provide detailed step-by-step instructions for both Lightroom Classic and Lightroom CC."
  },
  {
    question: "Can I use the presets on multiple devices?",
    answer: "Yes! Once you've downloaded your presets, you can use them on any device running Lightroom. They're also synced across devices if you're using Lightroom CC with Creative Cloud."
  },
  {
    question: "What makes your AI presets different from regular presets?",
    answer: "Our AI analyzes each photo's unique characteristics - lighting, colors, composition, and subject matter - to create custom presets that enhance your specific image. Unlike generic presets, our AI-generated presets are tailored to any photo you choose, ensuring the perfect look every time."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access to the service until the end of your current billing period. Any presets you've already downloaded are yours to keep forever."
  },
  {
    question: "Do you offer refunds?",
    answer: "Due to the instant access nature of our digital service and the immediate value provided through our AI-powered preset generation, we do not offer refunds on subscriptions. When you subscribe, you get immediate access to our advanced AI technology and can generate unlimited presets. Since these digital assets cannot be 'returned' and the service is provided instantly, we maintain a no-refund policy. However, you can cancel your subscription at any time to prevent future charges."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="py-16 sm:py-24" id="faq">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-base font-semibold leading-7 text-blue-400">FAQ</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Frequently Asked Questions
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Find answers to common questions about our AI-powered preset generator.
          </p>
        </motion.div>

        <motion.div 
          className="mx-auto mt-16 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <dl className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="rounded-2xl bg-gray-800/50 p-6 ring-1 ring-gray-700"
                initial={false}
                animate={{ backgroundColor: openIndex === index ? 'rgba(31, 41, 55, 0.5)' : 'rgba(31, 41, 55, 0.2)' }}
                transition={{ duration: 0.2 }}
              >
                <dt>
                  <motion.button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="flex w-full items-start justify-between text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-lg font-semibold leading-7 text-white">
                      {faq.question}
                    </span>
                    <span className="ml-6 flex h-7 items-center">
                      <motion.svg
                        className="h-6 w-6 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </motion.svg>
                    </span>
                  </motion.button>
                </dt>
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.dd
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 overflow-hidden"
                    >
                      <p className="text-base leading-7 text-gray-300">
                        {faq.answer}
                      </p>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ; 