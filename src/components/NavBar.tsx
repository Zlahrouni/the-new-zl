import React, { useState } from 'react';
import { useLanguage } from "../contexts/LanguageContext";
import { useDarkMode } from "../contexts/DarkModeContext";
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
            <nav className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
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

                            {/* Navigation Links */}
                            <div className="hidden md:flex space-x-4">
                                <NavLink to="/" active={location.pathname === '/'}>
                                    CV
                                </NavLink>
                                <NavLink to="/blogs" active={location.pathname === '/blogs'}>
                                    Blog
                                </NavLink>
                            </div>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden">
                            <button
                                onClick={toggleMenu}
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? '✕' : '☰'}
                            </button>
                        </div>

                        <LanguageThemeToggle />
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden mt-4 space-y-2">
                            <MobileNavLink to="/" onClick={toggleMenu}>CV</MobileNavLink>
                            <MobileNavLink to="/blogs" onClick={toggleMenu}>Blog</MobileNavLink>
                        </div>
                    )}
                </div>
            </nav>
            <main className="pt-20">
                {children}
            </main>
        </div>
    );
};

// Helper component for navigation links
const NavLink = ({ to, children, active }) => (
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
const MobileNavLink = ({ to, children, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2"
    >
        {children}
    </Link>
);

const LanguageThemeToggle = () => {
    const { language, setLanguage } = useLanguage();
    const { isDark, toggleDark } = useDarkMode();

    return (
        <div className="flex items-center gap-4">
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