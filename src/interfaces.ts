// types.ts
export type SupportedLanguage = 'en' | 'fr';

export interface TechStack {
    category: string;
    items: string[];
}

export interface Experience {
    company: string;
    role: string;
    period: string;
    responsibilities: string[];
    techStack?: TechStack[];
    location?: string;
    tasks?: string[];
}

export interface Education {
    institution: string;
    degree: string;
    period: string;
    details: string[];
}

export interface Label {
    title: string;
    date: string;
    skills: string;
    id: string | null;
    link: string;
}

export interface Link {
    name: string;
    link: string;
    logo: string;
    darkLogo: string;
}

export interface PersonalInfo {
    name: string;
    email: string;
    links: Link[];
}

export interface SkillCategories {
    speakingLanguages: string;
    programmingLanguages: string;
    qualityCompliance: string;
    webTechnologies: string;
    frameworksLibraries: string;
    databases: string;
    devOpsTools: string;
    methodologiesPractices: string;
    softSkills: string;
}

export interface SkillItems {
    speakingLanguages: string[];
    programmingLanguages: string[];
    qualityCompliance: string[];
    webTechnologies: string[];
    frameworksLibraries: string[];
    databases: string[];
    devOpsTools: string[];
    methodologiesPractices: string[];
    softSkills: string[];
}

export interface Skills {
    title: string;
    categories: SkillCategories;
    items: SkillItems;
}

export interface Sections {
    labels: {
        title: string;
        items: Label[];
    };
    skills: Skills;
    education: {
        title: string;
        items: Education[];
    };
    experience: {
        title: string;
        items: Experience[];
    };
}

export interface CVData {
    title: string;
    summary: string;
    skills: string;
    experience: string;
    personalInfo: PersonalInfo;
    sections: Sections;
}

export interface CVProps {
    language: SupportedLanguage;
}