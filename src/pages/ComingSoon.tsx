import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { translate} from '../utils/translations';

const ComingSoon: React.FC = () => {
  const { language} = useLanguage();

  // Replace these with your actual social links
  const socialLinks = {
    github: 'https://github.com/zlahrouni',
    linkedin: 'https://linkedin.com/in/ziad-lahrouni'
  };

  const SocialIcon = ({ Icon, href, color }) => (
      <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className={`text-3xl mx-3 hover:text-opacity-80 transition-colors`}
          style={{ color }}
      >
        <Icon />
      </motion.a>
  );

  return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
        {/* Animated Background */}
        <motion.div
            className="absolute top-0 left-0 w-full h-full"
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
        >
          <div className="absolute w-32 h-32 bg-white/20 rounded-full blur-2xl top-20 left-20 animate-pulse"></div>
          <div className="absolute w-48 h-48 bg-white/10 rounded-full blur-3xl bottom-20 right-20 animate-pulse"></div>
        </motion.div>

        {/* Main Content */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center text-white p-8 bg-black/20 rounded-xl shadow-2xl"
        >
          <h1 className="text-4xl font-bold mb-4">
            {translate('comingSoon', 'title', language)}
          </h1>
          <p className="text-xl mb-6">
            {translate('comingSoon', 'description', language)}
          </p>

          {/* CV Button */}
          <Link
              to="/cv"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition mb-6 inline-block"
          >
            {translate('comingSoon', 'cvButton', language)}
          </Link>

          {/* Social Links */}
          <div className="mt-6">
            <h3 className="text-lg mb-4">
              {translate('comingSoon', 'socialConnect', language)}
            </h3>
            <div className="flex justify-center items-center">
              <SocialIcon
                  Icon={FaGithub}
                  href={socialLinks.github}
                  color="#333"
              />
              <SocialIcon
                  Icon={FaLinkedin}
                  href={socialLinks.linkedin}
                  color="#0077B5"
              />
            </div>
          </div>
        </motion.div>
      </div>
  );
};

export default ComingSoon;