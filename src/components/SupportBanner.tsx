import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import PayPalDonateButton from './PayPalDonateButton';

const SupportBanner: React.FC = () => {
    const { language } = useLanguage();
    const { isDark } = useDarkMode();
    const [isOpen, setIsOpen] = useState(true);

    const closeBanner = () => {
        setIsOpen(false);
        // Optionnellement, stockez la préférence dans localStorage pour ne pas réafficher
        // la bannière pendant un certain temps
        localStorage.setItem('supportBannerClosed', Date.now().toString());
    };

    const texts = {
        en: {
            message: "These tools are free to use. If you find them helpful, please consider supporting my work.",
            support: "Support",
            close: "Close"
        },
        fr: {
            message: "Ces outils sont gratuits. Si vous les trouvez utiles, merci d'envisager de soutenir mon travail.",
            support: "Soutenir",
            close: "Fermer"
        }
    };

    const currentTexts = language === 'en' ? texts.en : texts.fr;

    if (!isOpen) return null;

    return (
        <div className={`py-2 px-4 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} border-b ${isDark ? 'border-blue-800' : 'border-blue-100'}`}>
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
                <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'} text-center sm:text-left mb-2 sm:mb-0`}>
                    {currentTexts.message}
                </p>

                <div className="flex items-center gap-3">
                    <PayPalDonateButton />

                    <button
                        onClick={closeBanner}
                        className={`text-xs px-2 py-1 rounded ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}
                        aria-label={currentTexts.close}
                    >
                        {currentTexts.close}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupportBanner;