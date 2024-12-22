export type Language = 'en' | 'fr';

class DbService {
    private static instance: DbService;
    private cache: {
        data: { [key in Language]?: CvData } | null;
        timestamp: number;
    } = {
        data: null,
        timestamp: 0
    };

    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    private readonly GITHUB_URL = 'https://raw.githubusercontent.com/Zlahrouni/the-new-zl-db/main/the-new-zl.json';
    private readonly GITHUB_TOKEN = 'GHSAT0AAAAAACSUNFHIYUUYQ7E4Z7HBU4NQZ3DMAWA';

    private constructor() {}

    public static getInstance(): DbService {
        if (!DbService.instance) {
            DbService.instance = new DbService();
        }
        return DbService.instance;
    }

    private async fetchData(): Promise<{ en: CvData; fr: CvData }> {
        try {
            console.log('this.githuburl: ', this.GITHUB_TOKEN)
            const response = await fetch(this.GITHUB_URL, {
                headers: {
                    'Authorization': `${this.GITHUB_TOKEN}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch CV data: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching CV data:', error);
            throw error;
        }
    }

    private isCacheValid(): boolean {
        return (
            this.cache.data !== null &&
            Date.now() - this.cache.timestamp < this.CACHE_DURATION
        );
    }

    public async getCvData(lang: Language): Promise<CvData> {
        try {
            if (!this.isCacheValid()) {
                const data = await this.fetchData();
                this.cache = {
                    data,
                    timestamp: Date.now()
                };
            }

            return this.cache.data![lang];
        } catch (error) {
            console.error(`Error getting CV data for language ${lang}:`, error);
            throw error;
        }
    }

    public async getSection<K extends keyof CvData>(
        lang: Language,
        section: K
    ): Promise<CvData[K]> {
        const data = await this.getCvData(lang);
        return data[section];
    }

    public clearCache(): void {
        this.cache = {
            data: null,
            timestamp: 0
        };
    }
}

export const dbService = DbService.getInstance();