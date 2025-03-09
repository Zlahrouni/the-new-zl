import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = 'https://ziadlahrouni.com';

// Définir toutes les routes de votre site
const routes = [
    {
        path: '/',
        changefreq: 'monthly',
        priority: 1.0
    },
    {
        path: '/tools',
        changefreq: 'monthly',
        priority: 0.8
    }
];

const generateSitemap = () => {
    const today = new Date().toISOString();

    // Créer le contenu XML du sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    `;

    // Ajouter chaque route au sitemap
    routes.forEach(route => {
        sitemap += `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
    });

    sitemap += `</urlset>`;

    const buildDir = resolve(__dirname, 'dist');

    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir);
    }

    fs.writeFileSync(resolve(buildDir, 'sitemap.xml'), sitemap);
    console.log('Sitemap generated with ' + routes.length + ' URLs!');
};

generateSitemap();