export const getStructuredData = (language: 'en' | 'fr') => ({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
    "@type": "Person",
        "name": "Ziad Lahrouni",
        "jobTitle": language === 'en' ? "Full Stack Developer" : "Développeur Full Stack",
        "url": "https://ziadlahrouni.com",
        "sameAs": [
        "https://github.com/zlahrouni",
        "https://linkedin.com/in/ziad-lahrouni/"
    ],
        "worksFor": {
        "@type": "Organization",
            "name": "CDC Informatique"
    },
    "attends": {
        "@type": "CollegeOrUniversity",
            "name": "Efrei Paris"
    },
    "alumniOf": {
        "@type": "CollegeOrUniversity",
            "name": "University of Western Brittany",
            "alternateName": "UBO"
    }
}
});