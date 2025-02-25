import React from 'react';
import { motion } from 'framer-motion';

const fadeInUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const fadeInLeftVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const fadeInRightVariant = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
};

const features = [
  {
    name: 'Smart Color Matching',
    description:
      'Our AI understands color theory and automatically adjusts tones to create harmonious and balanced results that enhance your unique style.',
    icon: (
      <motion.svg 
        className="h-16 w-16 text-blue-400"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
      </motion.svg>
    ),
  },
  {
    name: 'Batch Processing',
    description:
      'Save hours of editing time by applying your AI-generated presets to multiple photos at once. Perfect for wedding, event, or landscape photography collections.',
    icon: (
      <motion.svg 
        className="h-16 w-16 text-blue-400"
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </motion.svg>
    ),
  },
  {
    name: 'Regular Updates',
    description:
      `Stay ahead of the curve with continuous improvements to our AI models, new preset styles, and advanced features. We're constantly evolving to deliver the best results.`,
    icon: (
      <motion.svg 
        className="h-16 w-16 text-blue-400"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </motion.svg>
    ),
  },
];

const Features: React.FC = () => {
  return (
    <div className="relative" id="features">
      {/* Wave separator */}
      <motion.div 
        className="absolute top-0 left-0 right-0 w-full z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUpVariant}
        transition={{ duration: 0.8 }}
      >
        <svg 
          viewBox="0 0 1440 118" 
          className="w-full h-[118px] block transform translate-y-[-99%]"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,58L60,53C120,48,240,38,360,36.3C480,35,600,41,720,48C840,55,960,61,1080,59.7C1200,58,1320,48,1380,43L1440,38L1440,118L1380,118C1320,118,1200,118,1080,118C960,118,840,118,720,118C600,118,480,118,360,118C240,118,120,118,60,118L0,118Z"
            fill="#0a192f"
          />
        </svg>
      </motion.div>

      <div className="relative pt-20 pb-32 sm:pt-24 sm:pb-40">
        <div className="absolute inset-0 bg-[#0a192f]" />
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-base font-semibold leading-7 text-blue-400"
              variants={fadeInUpVariant}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Powerful Features
            </motion.h2>
            <motion.p 
              className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
              variants={fadeInUpVariant}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Everything you need to create stunning photos
            </motion.p>
            <motion.p 
              className="mt-6 text-lg leading-8 text-gray-300"
              variants={fadeInUpVariant}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Our AI-powered platform provides all the tools you need to transform your photos into professional masterpieces.
            </motion.p>
          </motion.div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="space-y-24">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.name}
                  className={`relative flex items-center gap-12 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div 
                    className="flex-1 lg:text-left"
                    variants={index % 2 === 0 ? fadeInLeftVariant : fadeInRightVariant}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <motion.h3 
                      className="text-2xl font-bold tracking-tight text-white sm:text-3xl mb-4"
                      variants={fadeInUpVariant}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      {feature.name}
                    </motion.h3>
                    <motion.p 
                      className="text-lg leading-8 text-gray-300"
                      variants={fadeInUpVariant}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      {feature.description}
                    </motion.p>
                  </motion.div>

                  <motion.div 
                    className="flex-1 flex justify-center items-center"
                    variants={index % 2 === 0 ? fadeInRightVariant : fadeInLeftVariant}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    {feature.icon}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features; 