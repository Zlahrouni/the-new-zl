import React, { useState, ReactNode } from 'react';
import { useLanguage } from "../contexts/LanguageContext";
import { useDarkMode } from "../contexts/DarkModeContext";
import { Link, useLocation } from 'react-router-dom';
import CVDownloadModal from './CVDownloadModal';

interface NavbarProps {
    children: ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const location = useLocation();
    const { language } = useLanguage();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
            <nav className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="block group">
                            <div className="border-2 border-neutral-900 dark:border-neutral-100 px-3 py-1 w-[60px] lg:group-hover:w-[160px] transition-all duration-300">
                                <div className="flex text-xl text-neutral-900 dark:text-neutral-100 overflow-hidden">
                                    <div className="flex">
                                        <span className="inline-block min-w-[12px]">Z</span>
                                        <span className="w-0 lg:group-hover:w-auto transition-all duration-300 overflow-hidden hidden lg:block">iad</span>
                                    </div>
                                    <span className="pl-1"></span>
                                    <div className="flex">
                                        <span className="inline-block min-w-[12px]">L</span>
                                        <span className="w-0 lg:group-hover:w-auto transition-all duration-300 overflow-hidden hidden lg:block">ahrouni</span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6">
                            <div className="flex space-x-4">
                                <NavLink to="/" active={location.pathname === '/'}>
                                    {language === 'en' ? 'Resume' : 'CV'}
                                </NavLink>
                                <NavLink to="/tools" active={location.pathname === '/tools'}>
                                    {language === 'en' ? 'Tools' : 'Outils'}
                                </NavLink>
                            </div>
                            <LanguageThemeToggle
                                onDownloadClick={() => setIsDownloadModalOpen(true)}
                            />
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center gap-4 md:hidden">
                            <LanguageThemeToggle
                                onDownloadClick={() => setIsDownloadModalOpen(true)}
                            />
                            <button
                                onClick={toggleMenu}
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? '✕' : '☰'}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {isMenuOpen && (
                        <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 md:hidden">
                            <div className="container mx-auto px-6 py-4 space-y-3">
                                <MobileNavLink to="/" onClick={toggleMenu}>{language === 'en' ? 'Resume' : 'CV'}</MobileNavLink>
                                <MobileNavLink to="/tools" onClick={toggleMenu}>{language === 'en' ? 'Tools' : 'Outils'}</MobileNavLink>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* CV Download Modal */}
            <CVDownloadModal
                isOpen={isDownloadModalOpen}
                onClose={() => setIsDownloadModalOpen(false)}
            />

            <main className="pt-20">
                {children}
            </main>
        </div>
    );
};

// Helper component for navigation links
interface NavLinkProps {
    to: string;
    children: ReactNode;
    active: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, active }) => (
    <Link
        to={to}
        className={`
            text-sm font-medium transition-colors duration-200
            ${active
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
        }
        `}
    >
        {children}
    </Link>
);

// Helper component for mobile navigation links
interface MobileNavLinkProps {
    to: string;
    children: ReactNode;
    onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, children, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2"
    >
        {children}
    </Link>
);

interface LanguageThemeToggleProps {
    onDownloadClick: () => void;
}

const LanguageThemeToggle: React.FC<LanguageThemeToggleProps> = ({ onDownloadClick }) => {
    const { language, setLanguage } = useLanguage();
    const { isDark, toggleDark } = useDarkMode();

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={onDownloadClick}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
                {language === 'en' ? 'Download CV' : 'Télécharger CV'}
            </button>
            <button
                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
                {language === 'en' ? 'FR' : 'EN'}
            </button>
            <button
                onClick={toggleDark}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
                {isDark ? '🌞' : '🌙'}
            </button>
        </div>
    );
};

export default Navbar;