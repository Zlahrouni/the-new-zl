export const getStructuredData = (language: 'en' | 'fr') => ({
    "@context": "http://schema.org",
    "@type": "Person",
    "name": "Ziad Lahrouni",
    "jobTitle": language === 'en' ? "Full Stack Developer" : "Développeur Full Stack",
    "url": "https://ziadlahrouni.com",
    "sameAs": [
        "https://github.com/zlahrouni",
        "https://linkedin.com/in/ziad-lahrouni/"
    ],
    "knowsAbout": [
        "Angular",
        "Spring Boot",
        "React",
        "TypeScript",
        "Java",
        "Full Stack Development"
    ],
    "worksFor": {
        "@type": "Organization",
        "name": "CDC Informatique"
    },
    "alumniOf": [
        {
            "@type": "CollegeOrUniversity",
            "name": language === "en" ? "University of Western Brittany" : "Université de Bretagne Occidentale",
            "alternateName": "UBO"
        }
    ],
    "attends": {
        "@type": "CollegeOrUniversity",
        "name": "Efrei Paris",
        "programName": language === "en" ? "Full Stack Dev Manager - Apprenticeship" : "Développeur Manager Full Stack - Apprentissage"
    },
    "skills": [
        "Web Development",
        "Software Architecture",
        "DevOps",
        "Agile Methodologies"
    ]
});