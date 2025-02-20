import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { getStructuredData } from "../utils/structuredData";
import { labelAssets, translations } from "../utils/translations";
import { Helmet } from "react-helmet-async";
import {SkillCategories, SkillItems} from "../interfaces.ts";
import {cvPDF} from "../assets/statics.ts";

type CertificateType = {
    title: string;
    image: string;
};

type SectionType = 'experience' | 'education' | 'skills' | 'certifications' | null;

const CV = () => {
    const { language } = useLanguage();
    const { isDark } = useDarkMode();
    const [openSection, setOpenSection] = useState<SectionType>(null);
    const [selectedCertificate, setSelectedCertificate] = useState<CertificateType | null>(null);
    const cvData = translations.cv[language];

    const handleShowCertificate = (certificateImage: string, title: string) => {
        setSelectedCertificate({ title, image: certificateImage });
    };

    const SectionButton: React.FC<{ section: SectionType; title: string }> = ({ section, title }) => (
        <button
            onClick={() => setOpenSection(openSection === section ? null : section)}
            className="w-full py-6 text-left border-t border-gray-200 dark:border-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
        >
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-light tracking-wide dark:text-white">{title}</h2>
                <span className="text-2xl text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {openSection === section ? '−' : '+'}
                </span>
            </div>
        </button>
    );

    const renderExperience = () => (
        <div className="space-y-12">
            {cvData.sections.experience.items.map((exp) => (
                <article key={exp.company} className="group">
                    <div className="flex flex-wrap items-baseline justify-between mb-2">
                        <h3 className="text-lg font-normal dark:text-white">{exp.role}</h3>
                        <time className="text-sm text-gray-500 dark:text-gray-400">{exp.period}</time>
                    </div>
                    <h4 className="text-base text-gray-600 dark:text-gray-300 mb-4">{exp.company}</h4>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        {exp.responsibilities.map((resp, index) => (
                            <li key={index} className="ml-4">• {resp}</li>
                        ))}
                    </ul>
                    {exp.techStack && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {exp.techStack.flatMap(stack =>
                                stack.items.map(tech => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-full dark:text-gray-300"
                                    >
                                        {tech}
                                    </span>
                                ))
                            )}
                        </div>
                    )}
                </article>
            ))}
        </div>
    );

    const renderEducation = () => (
        <div className="space-y-8">
            {cvData.sections.education.items.map((edu) => (
                <article key={edu.institution}>
                    <div className="flex flex-wrap items-baseline justify-between mb-2">
                        <h3 className="text-lg font-normal dark:text-white">{edu.degree}</h3>
                        <time className="text-sm text-gray-500 dark:text-gray-400">{edu.period}</time>
                    </div>
                    <h4 className="text-base text-gray-600 dark:text-gray-300 mb-4">{edu.institution}</h4>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        {edu.details.map((detail, index) => (
                            <li key={index} className="ml-4">• {detail}</li>
                        ))}
                    </ul>
                </article>
            ))}
        </div>
    );

    const renderSkills = () => {
        const skillCategories = cvData.sections.skills.categories as SkillCategories;
        const skillItems = cvData.sections.skills.items as SkillItems;

        return (
            <div className="space-y-12">
                {Object.keys(skillItems)
                    .filter(category => category !== 'softSkills')
                    .map(category => (
                        <div key={category} className="space-y-4">
                            <h3 className="text-xl font-light dark:text-white">
                                {skillCategories[category as keyof SkillCategories]}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skillItems[category as keyof SkillItems].map((skill: string, index: number) => (
                                    <span
                                        key={`${skill}-${index}`}
                                        className="px-4 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-full dark:text-gray-300"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        );
    };

    const renderCertifications = () => (
        <div className="space-y-12">
            {cvData.sections.labels.items.map((cert, index) => (
                <article key={cert.title} className="group">
                    <div className="flex items-start gap-6">
                        <img
                            src={index === 0 ? labelAssets.companieros.logo : labelAssets.meta.logo}
                            alt={`${cert.title} logo`}
                            className="w-12 h-12 object-contain"
                        />
                        <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <h3 className="text-lg font-normal dark:text-white">{cert.title}</h3>
                                <time className="text-sm text-gray-500 dark:text-gray-400">{cert.date}</time>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{cert.skills}</p>
                            <div className="flex gap-4 mt-2">
                                <button
                                    onClick={() => handleShowCertificate(
                                        index === 0 ? labelAssets.companieros.certificate : labelAssets.meta.certificate,
                                        cert.title
                                    )}
                                    className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                >
                                    View Certificate →
                                </button>
                                {cert.link && (
                                    <a
                                        href={cert.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                    >
                                        Learn More →
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );

    return (
        <>
            <Helmet>
                <title>{cvData.personalInfo.name} - {cvData.summary}</title>
                <meta name="description" content={cvData.summary} />
                <script type="application/ld+json">{JSON.stringify(getStructuredData(language))}</script>
            </Helmet>

            <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
                <div className="mb-16">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-3xl font-light text-gray-800 dark:text-gray-200">
                            {language === 'en' ? 'Portfolio & Career Path' : 'Portfolio & Parcours Professionnel'}
                        </h1>
                        <a
                            href={cvPDF}
                            download="CV_Ziad_Lahrouni.pdf"
                            className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                        >
                            {language === 'en' ? 'Download PDF' : 'Télécharger PDF'}
                        </a>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        {cvData.summary}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <a
                            href={`mailto:${cvData.personalInfo.email}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            {cvData.personalInfo.email}
                        </a>
                        <div className="flex gap-4">
                            {cvData.personalInfo.links.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-75 transition-opacity"
                                >
                                    <img
                                        src={isDark ? link.darkLogo : link.logo}
                                        alt={link.name}
                                        className="w-5 h-5"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <SectionButton section="experience" title={cvData.experience} />
                    {openSection === 'experience' && renderExperience()}

                    <SectionButton section="education" title={cvData.sections.education.title} />
                    {openSection === 'education' && renderEducation()}

                    <SectionButton section="skills" title={cvData.skills} />
                    {openSection === 'skills' && renderSkills()}

                    <SectionButton section="certifications" title={cvData.sections.labels.title} />
                    {openSection === 'certifications' && renderCertifications()}
                </div>
            </div>

            {selectedCertificate && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedCertificate(null)}
                >
                    <div
                        className="bg-white rounded-lg w-full max-w-4xl h-[85vh] flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-medium text-gray-900">{selectedCertificate.title}</h3>
                            <button
                                onClick={() => setSelectedCertificate(null)}
                                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <div className="h-full p-4">
                                <img
                                    src={selectedCertificate.image}
                                    alt="Certificate"
                                    className="min-h-full w-full object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CV;