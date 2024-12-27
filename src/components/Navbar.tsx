import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { translate } from '../utils/translations';
import { franceFlag, ukFlag } from '../assets/images';

const Navbar: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const { isDark, toggleDark } = useDarkMode();
    const location = useLocation();

    return (
        <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow z-50">
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Tabs */}
                <div className="flex">
                    <Link
                        to="/"
                        className={`px-6 py-4 border-b-2 ${
                            location.pathname === '/'
                                ? 'border-blue-500 text-blue-500'
                                : 'border-transparent text-gray-600 dark:text-gray-300'
                        } hover:text-blue-500`}
                    >
                        {translate('navbar', 'home', language)}
                    </Link>
                    <Link
                        to="/cv"
                        className={`px-6 py-4 border-b-2 ${
                            location.pathname === '/cv'
                                ? 'border-blue-500 text-blue-500'
                                : 'border-transparent text-gray-600 dark:text-gray-300'
                        } hover:text-blue-500`}
                    >
                        {translate('navbar', 'cv', language)}
                    </Link>
                </div>

                {/* Settings */}
                <div className="flex items-center gap-4">
                    {/* Language Toggle */}
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                        className="flex items-center gap-2 hover:opacity-80"
                    >
                        <img
                            src={language === 'en' ? ukFlag : franceFlag}
                            alt={language === 'en' ? 'English' : 'Français'}
                            className="w-6 h-4"
                        />
                    </button>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDark}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:opacity-80"
                    >
                        {isDark ? '🌞' : '🌙'}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;