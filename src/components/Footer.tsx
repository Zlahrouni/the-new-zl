import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useDarkMode } from '../contexts/DarkModeContext';

const Footer: React.FC = () => {
    const { language } = useLanguage();
    const { isDark } = useDarkMode();
    const location = useLocation();
    const currentYear = new Date().getFullYear();

    // Construire les URLs de redirection PayPal avec l'origine actuelle
    const paypalUrls = useMemo(() => {
        // Obtenir l'origine du site (par ex. https://ziadlahrouni.com)
        const origin = window.location.origin;

        // URLs complètes pour le retour et l'annulation
        // Revenir à la page actuelle après le don
        const returnUrl = `${origin}${location.pathname}?donation=success`;
        const cancelUrl = `${origin}${location.pathname}?donation=cancelled`;

        // URL de don PayPal complète avec paramètres de redirection
        const donateUrl = `https://www.paypal.com/donate/?hosted_button_id=2JWN6FDDMYSBU&return=${encodeURIComponent(returnUrl)}&cancel_return=${encodeURIComponent(cancelUrl)}`;

        return {
            donate: donateUrl,
            returnUrl,
            cancelUrl
        };
    }, [location.pathname]);

    // Vérifier si l'utilisateur vient de faire un don (pour afficher un message de remerciement)
    const donationStatus = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get('donation');
    }, [location.search]);

    const texts = {
        en: {
            support: "Support My Work",
            supportMessage: "If you find my tools and projects helpful, consider supporting my work.",
            donationHelps: "Your donation helps me maintain and create more free tools.",
            donateButton: "Donate with PayPal",
            thankYou: "Thank you for your donation! Your support is greatly appreciated.",
            donationCancelled: "Your donation was cancelled. No problem! Thank you for considering supporting my work.",
            usefulLinks: "Useful Links",
            sitemap: "Sitemap",
            accessibility: "Accessibility",
            legal: "Legal Notice",
            contact: "Contact",
            followMe: "Follow Me",
            madeWith: "Made with",
            and: "and",
            rights: "All Rights Reserved",
            accessibilityStatus: "Site partially accessible",
            tools: "Tools",
            home: "Home"
        },
        fr: {
            support: "Soutenir Mon Travail",
            supportMessage: "Si vous trouvez mes outils et projets utiles, envisagez de soutenir mon travail.",
            donationHelps: "Votre don m'aide à maintenir et créer davantage d'outils gratuits.",
            donateButton: "Faire un don avec PayPal",
            thankYou: "Merci pour votre don ! Votre soutien est grandement apprécié.",
            donationCancelled: "Votre don a été annulé. Pas de problème ! Merci d'avoir envisagé de soutenir mon travail.",
            usefulLinks: "Liens Utiles",
            sitemap: "Plan du site",
            accessibility: "Accessibilité",
            legal: "Mentions légales",
            contact: "Contact",
            followMe: "Me suivre",
            madeWith: "Fait avec",
            and: "et",
            rights: "Tous droits réservés",
            accessibilityStatus: "Site partiellement accessible",
            tools: "Outils",
            home: "Accueil"
        }
    };

    const t = language === 'en' ? texts.en : texts.fr;

    // Fonction pour nettoyer l'URL après l'affichage des messages de don
    const clearDonationStatus = () => {
        if (donationStatus) {
            // Supprimer le paramètre donation de l'URL sans recharger la page
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    };

    // Effacer les paramètres de l'URL après 5 secondes
    React.useEffect(() => {
        if (donationStatus) {
            const timer = setTimeout(clearDonationStatus, 5000);
            return () => clearTimeout(timer);
        }
    }, [clearDonationStatus, donationStatus]);

    return (
        <footer className={`mt-auto py-12 ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
            {/* Message de remerciement après don */}
            {donationStatus === 'success' && (
                <div className="fixed top-4 right-4 left-4 md:left-auto md:w-96 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-lg shadow-lg z-50 flex items-start">
                    <div className="flex-1">{t.thankYou}</div>
                    <button
                        onClick={clearDonationStatus}
                        className="ml-4 text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100"
                        aria-label="Close message"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Message d'annulation de don */}
            {donationStatus === 'cancelled' && (
                <div className="fixed top-4 right-4 left-4 md:left-auto md:w-96 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 p-4 rounded-lg shadow-lg z-50 flex items-start">
                    <div className="flex-1">{t.donationCancelled}</div>
                    <button
                        onClick={clearDonationStatus}
                        className="ml-4 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                        aria-label="Close message"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Section 1: Support */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t.support}</h3>
                        <p className="text-sm mb-3">
                            {t.supportMessage}
                        </p>
                        <div className={`mb-4 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
                            {/* Bouton PayPal avec URLs de redirection */}
                            <div className="flex flex-col items-center">
                                <a
                                    href={paypalUrls.donate}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block"
                                >
                                    <img
                                        src="https://www.paypalobjects.com/en_US/FR/i/btn/btn_donateCC_LG.gif"
                                        alt={language === 'en' ? 'Donate with PayPal button' : 'Faire un don avec PayPal'}
                                        title={language === 'en' ? 'PayPal - The safer, easier way to pay online!' : 'PayPal - Un moyen plus sûr et plus simple de payer en ligne !'}
                                        className="hover:opacity-90 transition-opacity"
                                    />
                                </a>
                                <p className="text-xs mt-3 italic text-gray-500 dark:text-gray-400 text-center">
                                    {t.donationHelps}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Useful Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t.usefulLinks}</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-sm hover:underline">
                                    {t.home}
                                </Link>
                            </li>
                            <li>
                                <Link to="/tools" className="text-sm hover:underline">
                                    {t.tools}
                                </Link>
                            </li>
                            <li>
                                <Link to="/sitemap.xml" target="_blank" className="text-sm hover:underline">
                                    {t.sitemap}
                                </Link>
                            </li>
                            <li>
                                <Link to="/accessibility" className="text-sm hover:underline">
                                    {t.accessibility}
                                </Link>
                            </li>
                            <li>
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  {t.accessibilityStatus}
                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Section 3: Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t.contact}</h3>
                        <p className="text-sm mb-2">
                            <a
                                href="mailto:ziad.lahrouni@gmail.com"
                                className="hover:underline"
                                aria-label="Email Ziad Lahrouni"
                            >
                                ziad.lahrouni@gmail.com
                            </a>
                        </p>

                        <h3 className="text-lg font-semibold mt-6 mb-3">{t.followMe}</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com/zlahrouni"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-75 transition-opacity"
                                aria-label="GitHub Profile"
                            >
                                <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                </svg>
                            </a>
                            <a
                                href="https://linkedin.com/in/ziad-lahrouni/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-75 transition-opacity"
                                aria-label="LinkedIn Profile"
                            >
                                <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={`pt-6 mt-6 border-t ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-sm mb-4 sm:mb-0">
                            © {currentYear} Ziad Lahrouni. {t.rights}.
                        </div>
                        <div className="text-sm">
                            <span>{t.madeWith} </span>
                            <span className="text-red-500">❤</span>
                            <span>, React {t.and} TypeScript</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;