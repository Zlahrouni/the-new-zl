import React, {useEffect, useRef, useState} from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {labelAssets, translations} from "../utils/translations.ts";

const CV: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const [selectedCertificate, setSelectedCertificate] = useState<{title: string, image: string}>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);


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

    const handleShowCertificate = (certificate: string, title: string) => {
        setSelectedCertificate({title: title, image: certificate});
    };

    const handleCloseModal = () => {
        setSelectedCertificate(null);
    };

    const renderSkillCategory = (category: string) => {
        const skills = translations.cv[language].sections.skills.items[category];
        return (
            <div key={category} className="mb-4" role="region" aria-label={translations.cv[language].sections.skills.categories[category]}>
                <h3 className="font-semibold text-lg mb-2">
                    {translations.cv[language].sections.skills.categories[category]}
                </h3>
                <div className="flex flex-wrap gap-2" role="list">
                    {skills.map((skill, index) => (
                        <span
                            key={index}
                            role="listitem"
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
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
            <div className="mb-6 border-b pb-4" role="region" aria-labelledby="labels-title">
                <h3 id="labels-title" className="font-semibold text-lg mb-3">
                    {cvData.sections.labels.title}
                </h3>
                <div className="space-y-4">
                    {labels.map((label, index) => (
                        <div key={label.title} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-3">
                                <img
                                    src={index === 0 ? labelAssets.companieros.logo : labelAssets.meta.logo}
                                    alt={`${label.title} logo`}
                                    className="w-8 h-8 object-contain"
                                />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium">{label.title}</h4>
                                    <p className="text-xs text-gray-600">
                                        <time dateTime={label.date}>{label.date}</time>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{label.skills}</p>
                                    <button
                                        className="text-blue-700 text-xs underline mt-2"
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
                                            className="text-blue-700 text-xs underline mt-2 block"
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

    const renderExperienceItem = (experience: any) => (
        <article key={experience.company} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">{experience.role}</h3>
                <time dateTime={experience.period} className="text-gray-600 text-sm">
                    {experience.period}
                </time>
            </div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">{experience.company}</h4>
            <ul className="list-disc list-inside text-gray-600 mb-3" role="list">
                {experience.responsibilities.map((resp: string, index: number) => (
                    <li key={index} role="listitem">{resp}</li>
                ))}
            </ul>
            {experience.techStack && (
                <div className="mt-2">
                    <strong id={`techstack-${experience.company}`}>Tech Stack:</strong>
                    <div className="space-y-2 mt-1" role="region" aria-labelledby={`techstack-${experience.company}`}>
                        {experience.techStack.map((stack, idx) => (
                            <div key={idx} className="flex flex-wrap gap-2">
                                <span className="font-medium text-gray-700">{stack.category}:</span>
                                {stack.items.map((tech, techIdx) => (
                                    <span
                                        key={techIdx}
                                        className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs"
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

    const renderEducationItem = (education: any) => (
        <article key={education.institution} className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">{education.degree}</h3>
                <time dateTime={education.period} className="text-gray-600 text-sm">
                    {education.period}
                </time>
            </div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">{education.institution}</h4>
            <ul className="list-disc list-inside text-gray-600" role="list">
                {education.details.map((detail: string, index: number) => (
                    <li key={index} role="listitem">{detail}</li>
                ))}
            </ul>
        </article>
    );

    const cvData = translations.cv[language];

    return (
        <main className="min-h-screen pt-20 pb-20 bg-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-[300px_1fr] gap-8">
                    {/* Skills Sidebar */}
                    <aside className="hidden md:block bg-white p-6 rounded-xl shadow-lg h-fit sticky top-20">
                        <h2 className="text-2xl font-semibold mb-4" id="skills-section">
                            {cvData.skills}
                        </h2>
                        {renderLabelsSection()}
                        <div className="space-y-4" role="region" aria-labelledby="skills-section">
                            {Object.keys(cvData.sections.skills.items)
                                .filter(category => category !== 'softSkills')
                                .map(renderSkillCategory)}
                        </div>
                    </aside>

                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        {/* Language Switcher and Title */}
                        <div id="name" className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold">
                                {cvData.personalInfo.name}
                            </h1>
                            <button
                                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                                className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-600 transition"
                                aria-label={`Switch to ${language === 'en' ? 'French' : 'English'}`}
                            >
                                {language === 'en' ? 'FR' : 'EN'}
                            </button>
                        </div>

                        {/* Personal Info Section */}
                        <header className="mb-6">
                            <p className="text-gray-700 mb-2">
                                <span>{cvData.personalInfo.title}</span>
                                <span aria-hidden="true"> | </span>
                                <span>{cvData.personalInfo.location}</span>
                            </p>
                            <p className="text-gray-600">{cvData.summary}</p>
                        </header>

                        {/* Experience Section */}
                        <section className="mb-6" aria-labelledby="experience-title">
                            <h2 id="experience-title"  className="text-2xl font-semibold mb-4 border-b pb-2">
                                {cvData.experience}
                            </h2>
                            {cvData.sections.experience.items.map(renderExperienceItem)}
                        </section>

                        {/* Education Section */}
                        <section aria-labelledby="education-title">
                            <h2 id="education-title" className="text-2xl font-semibold mb-4 border-b pb-2">
                                {cvData.sections.education.title}
                            </h2>
                            {cvData.sections.education.items.map(renderEducationItem)}
                        </section>

                        <div className="md:hidden">
                            <section aria-labelledby="mobile-skills-title">
                                <h2 id="mobile-skills-title" className="text-2xl font-semibold mb-4 border-b pb-2">
                                    {cvData.skills}
                                </h2>
                                {renderLabelsSection()}
                                <div className="grid md:grid-cols-2 gap-4">
                                    {Object.keys(cvData.sections.skills.items)
                                        .filter(category => category !== 'softSkills')
                                        .map(renderSkillCategory)}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {/* Certificate Modal */}
            {selectedCertificate && (
                <div
                    ref={modalRef}
                    tabIndex={-1}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div
                        className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col"
                        role="document"
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 id="modal-title" className="text-xl font-semibold">{selectedCertificate.title}</h3>
                            <button
                                id="close-modal"
                                className="text-gray-500 hover:text-gray-700 p-2"
                                onClick={handleCloseModal}
                                aria-label="Close certificate modal"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-4 overflow-auto flex-1">
                            <img
                                src={selectedCertificate.image}
                                alt="Certificate"
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default CV;