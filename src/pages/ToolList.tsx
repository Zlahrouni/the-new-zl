import React, {useEffect, useState} from "react";
import {Helmet} from "react-helmet-async";
import {useLanguage} from "../contexts/LanguageContext.tsx";
import {Link} from "react-router-dom";

interface Tool {
    name: string;
    description: string;
    link: string;
    tags: string[];
    comingSoon?: boolean;
}

const ToolList: React.FC = () => {
    const {language} = useLanguage();
    const [title, setTitle] = useState("Free Online Tools");
    const [description, setDescription] = useState("You wonder why you see this section? Sometimes you need a specific tool for a quick task, but when you search online, you find that it costs extra money - not ideal! That's why I came up with this idea: to provide small, free, and useful tools that anyone can use without hassle. Enjoy these resources, and I hope they make your life a little easier!");
    const [tools, setTools] = useState<Tool[]>([]);
    const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
    const [search, setSearch] = useState("");
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [allTags, setAllTags] = useState<string[]>([]);

    useEffect(() => {
        setTitle(language === 'en' ?
            'Free Online Tools'
            :
            'Outils Gratuits en Ligne'
        );
        setDescription(language === 'en' ?
            'You wonder why you see this section? Sometimes you need a specific tool for a quick task, but when you search online, you find that it costs extra money - not ideal! That\'s why I came up with this idea: to provide small, free, and useful tools that anyone can use without hassle. Enjoy these resources, and I hope they make your life a little easier!'
            :
            'Vous vous demandez pourquoi vous voyez cette section ? Parfois, vous avez besoin d\'un outil spécifique pour une tâche rapide, mais lorsque vous cherchez en ligne, vous découvrez que cela vous coûtera de l\'argent supplémentaire - pas idéal ! C\'est pourquoi j\'ai eu cette idée : proposer des petits outils gratuits et utiles que tout le monde peut utiliser sans difficulté. Profitez de ces ressources, et j\'espère qu\'elles rendront votre vie un peu plus facile !'
        );
    }, [language]);

    useEffect(() => {
        const toolList: Tool[] = [
            {
                name: language === 'en' ? "PDF Metadata Editor" : "Éditeur de Métadonnées PDF",
                description: language === 'en'
                    ? "Edit the metadata of your PDF files easily and quickly."
                    : "Modifiez facilement et rapidement les métadonnées de vos fichiers PDF.",
                link: "/tools/pdf-metadata-editor",
                tags: ["PDF", "Metadata", "Editor"],
            },
            {
                name: language === 'en' ? "Image Compressor" : "Compresseur d'Images",
                description: language === 'en' ? "Compress your images while maintaining quality to reduce file size."
                : "Compressez vos images tout en maintenant la qualité pour réduire la taille des fichiers.",
                link: "/tools/image-optimizer",
                tags: ["Image", "Compression", "Optimizer"],
            },
            {
                name: language === 'en' ? "Accessibility Checker" : "Vérificateur d'Accessibilité",
                description: language === 'en'
                    ? "Validate your HTML against RGAA 4.1 accessibility standards and improve web accessibility."
                    : "Validez votre HTML selon les normes d'accessibilité RGAA 4.1 et améliorez l'accessibilité web.",
                link: "/tools/accessibility-checker",
                tags: ["Accessibility", "RGAA", "HTML", "Validator"],
            },
        ];

        setTools(toolList);

        // Extract all unique tags
        const tags = new Set<string>();
        toolList.forEach(tool => {
            tool.tags.forEach(tag => tags.add(tag));
        });
        setAllTags(Array.from(tags));

    }, [language]);

    // Filter tools based on search and active tag
    useEffect(() => {
        let filtered = tools;

        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(tool =>
                tool.name.toLowerCase().includes(searchLower) ||
                tool.description.toLowerCase().includes(searchLower) ||
                tool.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }

        if (activeTag) {
            filtered = filtered.filter(tool =>
                tool.tags.includes(activeTag)
            );
        }

        setFilteredTools(filtered);
    }, [tools, search, activeTag]);

    const handleTagClick = (tag: string) => {
        setActiveTag(activeTag === tag ? null : tag);
    };

    return(
        <>
            <Helmet>
                <title>ZL - {title}</title>
                <meta name="description" content={description} />
            </Helmet>
            <div className="min-h-screen pt-16 sm:pt-20 pb-16 sm:pb-20 bg-gray-100 dark:bg-gray-900 transition-colors">
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-xl shadow-lg">
                        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h1>
                        <p className="text-gray-700 dark:text-gray-300 mb-8">{description}</p>

                        {/* Search and filter section */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder={language === 'en' ? "Search tools..." : "Rechercher des outils..."}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md
                                                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        aria-label={language === 'en' ? "Search tools" : "Rechercher des outils"}
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {allTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagClick(tag)}
                                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                            activeTag === tag
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                                {activeTag && (
                                    <button
                                        onClick={() => setActiveTag(null)}
                                        className="px-3 py-1 text-sm rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100"
                                    >
                                        {language === 'en' ? "Clear filter" : "Effacer le filtre"}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tools grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTools.length > 0 ? filteredTools.map((tool, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
                                        {tool.comingSoon && (
                                            <span className="inline-block px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 rounded-md">
                                                {language === 'en' ? "Coming Soon" : "Bientôt Disponible"}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">{tool.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {tool.tags.map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-md"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    {tool.comingSoon ? (
                                        <button
                                            disabled
                                            className="w-full py-2 text-center bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-md cursor-not-allowed"
                                        >
                                            {language === 'en' ? "Coming Soon" : "Bientôt Disponible"}
                                        </button>
                                    ) : (
                                        <Link
                                            to={tool.link}
                                            className="block w-full py-2 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                                        >
                                            {language === 'en' ? "Use Tool" : "Utiliser l'Outil"}
                                        </Link>
                                    )}
                                </div>
                            )) : (
                                <div className="col-span-full flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
                                    <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <p className="text-xl">
                                        {language === 'en'
                                            ? "No tools match your search"
                                            : "Aucun outil ne correspond à votre recherche"}
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearch("");
                                            setActiveTag(null);
                                        }}
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        {language === 'en' ? "Clear Search" : "Effacer la Recherche"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ToolList;