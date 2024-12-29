import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = 'https://ziadlahrouni.com';

const generateSitemap = () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${SITE_URL}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
      </url>
    </urlset>`;

    const buildDir = resolve(__dirname, 'dist');

    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir);
    }

    fs.writeFileSync(resolve(buildDir, 'sitemap.xml'), sitemap);
    console.log('Sitemap generated!');
};

generateSitemap();