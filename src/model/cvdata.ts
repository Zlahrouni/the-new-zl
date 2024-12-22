interface CvData {
    title: string;
    summary: string;
    skills: string;
    experience: string;
    personalInfo: {
        name: string;
        title: string;
        location: string;
        links?: {
            name: string;
            link: string;
        }[];
    };
    sections: {
        labels: {
            title: string;
            items: Array<{
                title: string;
                date: string;
                skills: string;
                id: string | null;
                link: string | null;
            }>;
        };
        skills: {
            title: string;
            categories: Record<string, string>;
            items: Record<string, string[]>;
        };
        education: {
            title: string;
            items: Array<{
                institution: string;
                degree: string;
                period: string;
                details: string[];
            }>;
        };
        experience: {
            title: string;
            items: Array<{
                company: string;
                role: string;
                period: string;
                responsibilities: string[];
                techStack: Array<{
                    category: string;
                    items: string[];
                }>;
                tasks?: string[];
                location?: string;
            }>;
        };
    };
}