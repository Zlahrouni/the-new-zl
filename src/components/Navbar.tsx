import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import {translate} from '../utils/translations';
import React, { useState } from "react";
import { franceFlag, ukFlag } from '../assets/images';

const Navbar: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang);
        setDropdownOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-black/20 text-white z-50">
            <div className="container mx-auto flex justify-between items-center p-4">
                <div className="flex space-x-4">
                    <Link to="/" className="hover:text-blue-300">
                        {translate('navbar', 'home', language)}
                    </Link>
                    <Link to="/cv" className="hover:text-blue-300">
                        {translate('navbar', 'cv', language)}
                    </Link>
                </div>

                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="bg-white/20 px-4 py-2 rounded-full hover:bg-white/40 transition flex items-center"
                    >
                        <img
                            src={language === 'en' ? ukFlag : franceFlag}
                            alt={language === 'en' ? 'UK Flag' : 'France Flag'}
                            className="w-6 h-4 mr-2"
                        />
                        {language.toUpperCase()}
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-blue-500 rounded-md shadow-lg z-50">
                            <button
                                onClick={() => handleLanguageChange('en')}
                                className="flex items-center w-full px-4 py-2 text-left hover:bg-blue-200"
                            >
                                <img src={ukFlag} alt="UK Flag" className="w-6 h-4 mr-2" />
                                EN
                            </button>
                            <button
                                onClick={() => handleLanguageChange('fr')}
                                className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-200"
                            >
                                <img src={franceFlag} alt="France Flag" className="w-6 h-4 mr-2" />
                                FR
                            </button>
                            {/* Add more languages here */}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;