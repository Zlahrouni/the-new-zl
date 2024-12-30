import React, {useEffect, useRef, useState} from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {labelAssets, translations} from "../utils/translations.ts";
import {useDarkMode} from "../contexts/DarkModeContext.tsx";
import {CVData, Education, Experience} from "../interfaces.ts";
import {getStructuredData} from "../utils/structuredData.ts";
import {Helmet} from "react-helmet-async";

const CV: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const { isDark, toggleDark } = useDarkMode();
    const structuredData = getStructuredData(language);
    const [selectedCertificate, setSelectedCertificate] = useState<{ title: string; image: string } | null>(null);
    const [lastActiveElement, setLastActiveElement] = useState<HTMLElement | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleShowCertificate = (certificate: string, title: string) => {
        // Store the currently active element before opening modal
        setLastActiveElement(document.activeElement as HTMLElement);
        setSelectedCertificate({title: title, image: certificate});
    };

    const handleCloseModal = () => {
        // Restore focus to the last active element
        lastActiveElement?.focus();
        setSelectedCertificate(null);
        setLastActiveElement(null);
    };

    // Handle Escape key for modal
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && selectedCertificate) {
                handleCloseModal();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [selectedCertificate]);

    // Manage scroll lock
    useEffect(() => {
        if (selectedCertificate) {
            document.body.style.overflow = 'hidden';
            modalRef.current?.focus();
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedCertificate]);

    const HeaderControls = () => (
        <div className="flex gap-2 items-center">
            <button
                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                className="px-2 py-1 sm:px-3 sm:py-1 text-sm sm:text-base bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition"
                aria-label={`Switch to ${language === 'en' ? 'French' : 'English'}`}
            >
                {language === 'en' ? 'FR' : 'EN'}
            </button>
            <button
                onClick={toggleDark}
                className="p-1.5 sm:p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm sm:text-base"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {isDark ? '🌞' : '🌙'}
            </button>
        </div>
    );

    type CategoryKey = keyof typeof cvData.sections.skills.items;


    const renderSkillCategory = (category: CategoryKey) => {
        const skills = cvData.sections.skills.items[category];
        return (
            <div key={category} className="mb-4" role="region" aria-label={cvData.sections.skills.categories[category]}>
                <h3 className="font-semibold text-lg mb-2 dark:text-white">
                    {cvData.sections.skills.categories[category]}
                </h3>
                <div className="flex flex-wrap gap-2" role="list">
                    {skills.map((skill, i) => ( // Changed index to i for clarity
                        <span
                            key={i}
                            role="listitem"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-md text-sm"
                        >
                        {skill}
                    </span>
                    ))}
                </div>
            </div>
        );
    };

    const renderLabelsSection = () => {
        const labels = cvData.sections.labels.items;
        return (
            <div className="mb-6 border-b dark:border-gray-700 pb-4" role="region" aria-labelledby="labels-title">
                <h3 id="labels-title" className="font-semibold text-lg mb-3 dark:text-white">
                    {cvData.sections.labels.title}
                </h3>
                <div className="space-y-4">
                    {labels.map((label, index) => (
                        <div key={label.title} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="flex items-center gap-3">
                                <img
                                    src={index === 0 ? labelAssets.companieros.logo : labelAssets.meta.logo}
                                    alt={`${label.title} logo`}
                                    className="w-8 h-8 object-contain"
                                />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium dark:text-white">{label.title}</h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        <time dateTime={label.date}>{label.date}</time>
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label.skills}</p>
                                    <button
                                        className="text-blue-700 dark:text-blue-400 text-xs underline mt-2"
                                        onClick={() => handleShowCertificate(
                                            index === 0 ? labelAssets.companieros.certificate : labelAssets.meta.certificate,
                                            label.title
                                        )}
                                        aria-label={`Show Certificate for ${label.title}`}
                                    >
                                        Show Certificate
                                    </button>
                                    {label.link && (
                                        <a
                                            href={label.link}
                                            className="text-blue-700 dark:text-blue-400 text-xs underline mt-2 block"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View More
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderExperienceItem = (experience: Experience) => (
        <article key={experience.company} className="mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
                <h3 className="text-lg sm:text-xl font-bold dark:text-white">{experience.role}</h3>
                <time dateTime={experience.period} className="text-gray-600 dark:text-gray-300 text-sm">
                    {experience.period}
                </time>
            </div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{experience.company}</h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-3" role="list">
                {experience.responsibilities.map((resp, index) => (
                    <li key={index} role="listitem">{resp}</li>
                ))}
            </ul>
            {experience.techStack && (
                <div className="mt-2">
                    <strong id={`techstack-${experience.company}`} className="dark:text-white">Tech Stack:</strong>
                    <div className="space-y-2 mt-1" role="region" aria-labelledby={`techstack-${experience.company}`}>
                        {experience.techStack.map((stack, idx) => (
                            <div key={idx} className="flex flex-wrap gap-2">
                                <span className="font-medium text-gray-700 dark:text-gray-200">{stack.category}:</span>
                                {stack.items.map((tech, techIdx) => (
                                    <span
                                        key={techIdx}
                                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded-md text-xs"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </article>
    );

    const renderEducationItem = (education: Education) => (
        <article key={education.institution} className="mb-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1">
                <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold dark:text-white">{education.degree}</h3>
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{education.institution}</h4>
                </div>
                <time dateTime={education.period} className="text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap">
                    {education.period}
                </time>
            </div>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-2" role="list">
                {education.details.map((detail, index) => (
                    <li key={index} role="listitem">{detail}</li>
                ))}
            </ul>
            {education.link && (
                <a href={education.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 dark:text-blue-400 text-xs underline"
                    aria-label={`More information about ${education.institution}`}
                >
                    More Info
                </a>
                )}
        </article>
    );

    const cvData: CVData = translations.cv[language];

    return (
        <>
            <Helmet>
                <title>{language === 'en' ? 'Ziad Lahrouni - Full Stack Developer' : 'Ziad Lahrouni - Développeur Full Stack'}</title>
                <meta name="description" content={cvData.summary}/>
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>

            <main className="min-h-screen pt-16 sm:pt-20 pb-16 sm:pb-20 bg-gray-100 dark:bg-gray-900 transition-colors">
                <div className="container mx-auto px-3 sm:px-4">
                    <div className="grid md:grid-cols-[300px_1fr] gap-4 sm:gap-8">
                        {/* Sidebar */}
                        <aside id="desktop-skills"
                               className="hidden md:block bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg h-fit sticky top-20">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold dark:text-white" id="desktop-skills-title">
                                    {cvData.skills}
                                </h2>
                            </div>
                            {renderLabelsSection()}
                            <div className="space-y-4" role="region" aria-labelledby="skills-section">
                                {(Object.keys(cvData.sections.skills.items) as CategoryKey[])
                                    .filter(category => category !== 'softSkills')
                                    .map(renderSkillCategory)}
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-xl shadow-lg">
                            {/* Header Section */}
                            <div className="flex flex-col space-y-3 sm:space-y-4 mb-6">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                    <h1 id="name" className="text-2xl sm:text-3xl font-bold dark:text-white">
                                        {cvData.personalInfo.name}
                                    </h1>
                                    <HeaderControls/>
                                </div>

                                {/* Contact Info */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <a
                                        href={`mailto:${cvData.personalInfo.email}`}
                                        className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm break-all"
                                    >
                                        {cvData.personalInfo.email}
                                    </a>
                                    <div className="flex gap-3">
                                        {cvData.personalInfo.links.map((link, index) => (
                                            <a
                                                key={`link-${index}`}
                                                href={link.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:opacity-75 transition-opacity"
                                            >
                                                <img
                                                    src={isDark ? link.darkLogo : link.logo}
                                                    alt={`${link.name} logo`}
                                                    className="w-5 h-5 hover:scale-110 transition-transform"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {/* Summary */}
                            <header className="mb-6">
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{cvData.summary}</p>
                            </header>

                            <section id="experience-section" className="mb-6" aria-labelledby="experience-section">
                                <h2 id="experience-title"
                                    className="text-xl sm:text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2 dark:text-white">
                                    {cvData.experience}
                                </h2>
                                {cvData.sections.experience.items.map(renderExperienceItem)}
                            </section>

                            <section id="education-section" aria-labelledby="education-section">
                                <h2 id="education-title"
                                    className="text-xl sm:text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2 dark:text-white">
                                    {cvData.sections.education.title}
                                </h2>
                                {cvData.sections.education.items.map(renderEducationItem)}
                            </section>

                            <div className="md:hidden">
                                <section id="mobile-skills" aria-labelledby="skills-section">
                                    <h2 id="mobile-skills-title"
                                        className="text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2 dark:text-white">
                                        {cvData.skills}
                                    </h2>
                                    {renderLabelsSection()}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {(Object.keys(cvData.sections.skills.items) as CategoryKey[])
                                            .filter(category => category !== 'softSkills')
                                            .map(renderSkillCategory)}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>

                {selectedCertificate && (
                    <div
                        ref={modalRef}
                        tabIndex={-1}
                        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                        onKeyDown={(e) => {
                            if (e.key === 'Tab') {
                                // Trap focus within the modal
                                const focusableElements = modalRef.current?.querySelectorAll(
                                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                                );

                                if (focusableElements && focusableElements.length > 0) {
                                    const firstElement = focusableElements[0] as HTMLElement;
                                    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                                    if (e.shiftKey && document.activeElement === firstElement) {
                                        lastElement.focus();
                                        e.preventDefault();
                                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                                        firstElement.focus();
                                        e.preventDefault();
                                    }
                                }
                            }
                        }}
                    >
                        <div
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col"
                            role="document"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                        >
                            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                                <h3 id="modal-title" className="text-xl font-semibold dark:text-white">
                                    {selectedCertificate.title}
                                </h3>
                                <button
                                    id="close-modal"
                                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2"
                                    onClick={handleCloseModal}
                                    aria-label="Close certificate modal"
                                    ref={(el) => {
                                        // Automatically focus close button when modal opens
                                        if (el) el.focus();
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                            <div
                                className="p-4 overflow-auto flex-1"
                                tabIndex={0} // Make image container focusable
                            >
                                <img
                                    src={selectedCertificate.image}
                                    alt="Certificate"
                                    className="w-full h-auto object-contain"
                                    tabIndex={-1}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
};

export default CV;