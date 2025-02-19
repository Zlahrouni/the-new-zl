import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface BlogMetadata {
    title?: string;
    date?: string;
    author?: string;
    description?: string;
    tags?: string;
}

const BlogList: React.FC = () => {
    const [blogs, setBlogs] = useState<{ filename: string; metadata: BlogMetadata | null }[]>([]);

    useEffect(() => {
        const importBlogPosts = async () => {
            try {
                const markdownFiles = import.meta.glob('/src/assets/db/posts/*.md');

                const blogPromises = Object.entries(markdownFiles).map(async ([fullpathFilename]) => {
                    const response = await fetch(fullpathFilename);

                    const text = await response.text();

                    const firstMarker = text.indexOf('---');
                    const secondMarker = text.indexOf('---', firstMarker + 3);
                    let metadata: BlogMetadata | null = null;

                    if (firstMarker !== -1 && secondMarker !== -1) {
                        const frontMatter = text.slice(firstMarker + 3, secondMarker).trim();
                        metadata = frontMatter.split('\n').reduce((acc, line) => {
                            const [key, ...value] = line.split(': ');
                            if (key && value) {
                                acc[key.trim() as keyof BlogMetadata] = value.join(': ').replace(/"/g, '').trim();
                            }
                            return acc;
                        }, {} as BlogMetadata);
                    }

                    const filename = fullpathFilename.replace(/^.*[\\/]/, '');
                    return { filename, metadata };
                });

                const blogData = await Promise.all(blogPromises);
                setBlogs(blogData);
            } catch (error) {
                console.error('Error loading blog list:', error);
            }
        };

        importBlogPosts();
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Blog Posts</h1>
            <ul className="space-y-4">
                {blogs.map(({ filename, metadata }) => (
                    <li key={filename}>
                        <Link to={`/blog/${filename}`} className="block">
                            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                {metadata?.title || 'Untitled'}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">{metadata?.description || 'No description available.'}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BlogList;