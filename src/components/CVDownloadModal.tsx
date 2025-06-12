import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CVDownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CVDownloadModal: React.FC<CVDownloadModalProps> = ({ isOpen, onClose }) => {
    const { language } = useLanguage();

    if (!isOpen) return null;

    const handleDownload = (lang: 'fr' | 'en') => {
        const fileName = lang === 'fr' ? 'cv-fr.pdf' : 'cv-en.pdf';
        const link = document.createElement('a');
        link.href = `/${fileName}`;
        link.download = `CV_Ziad_Lahrouni_${lang.toUpperCase()}.pdf`;
        link.click();
        onClose();
    };

    const texts = {
        en: {
            title: 'Choose CV Language',
            description: 'Select the language for your CV download',
            french: 'French Version',
            english: 'English Version',
            cancel: 'Cancel'
        },
        fr: {
            title: 'Choisir la Langue du CV',
            description: 'Sélectionnez la langue pour télécharger le CV',
            french: 'Version Française',
            english: 'Version Anglaise',
            cancel: 'Annuler'
        }
    };

    const t = texts[language];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t.title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label={t.cancel}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {t.description}
                    </p>

                    <div className="space-y-3">
                        {/* French Version */}
                        <button
                            onClick={() => handleDownload('fr')}
                            className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800">
                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">FR</span>
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {t.french}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        CV_Ziad_Lahrouni_FR.pdf
                                    </div>
                                </div>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </button>

                        {/* English Version */}
                        <button
                            onClick={() => handleDownload('en')}
                            className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800">
                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">EN</span>
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {t.english}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        CV_Ziad_Lahrouni_EN.pdf
                                    </div>
                                </div>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 font-medium"
                    >
                        {t.cancel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CVDownloadModal;