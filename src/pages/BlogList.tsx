import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

interface BlogMetadata {
    title?: string;
    date?: string;
    author?: string;
    description?: string;
    tags?: string;
    slug?: string;
    [key: string]: string | undefined;  // Index signature for dynamic keys
}

interface BlogPost {
    content: string;
    metadata: BlogMetadata;
}

const BlogList: React.FC = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                // Import all markdown files from the posts directory
                const markdownFiles = import.meta.glob('/src/assets/db/posts/*.md', {
                    eager: true,
                    query: '?raw',
                    import: 'default'
                });

                const processedBlogs = Object.entries(markdownFiles).map(([path, content]) => {
                    // Extract metadata and content
                    const [, frontMatter, ...contentParts] = (content as string).split('---');

                    // Parse front matter
                    const metadata = frontMatter.trim().split('\n').reduce<BlogMetadata>((acc, line) => {
                        const [key, ...value] = line.split(': ');
                        if (key && value) {
                            const trimmedKey = key.trim() as keyof BlogMetadata;
                            acc[trimmedKey] = value.join(': ').replace(/"/g, '').trim();
                        }
                        return acc;
                    }, {} as BlogMetadata);

                    // Add slug from filename
                    metadata.slug = path.split('/').pop()?.replace('.md', '');

                    return {
                        content: contentParts.join('---').trim(),
                        metadata
                    };
                });

                // Sort by date (newest first)
                const sortedBlogs = processedBlogs.sort((a, b) => {
                    const dateA = new Date(a.metadata.date || '');
                    const dateB = new Date(b.metadata.date || '');
                    return dateB.getTime() - dateA.getTime();
                });

                setBlogs(sortedBlogs);
            } catch (error) {
                console.error('Error loading blog posts:', error);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Blog Posts</h1>
            <div className="space-y-6">
                {blogs.map((blog) => (
                    <article
                        key={blog.metadata.slug}
                        className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                        <Link to={`/blog/${blog.metadata.slug}`}>
                            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-2">
                                {blog.metadata.title}
                            </h2>
                            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <time dateTime={blog.metadata.date}>{blog.metadata.date}</time>
                                <span>By {blog.metadata.author}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                                {blog.metadata.description}
                            </p>
                            {blog.metadata.tags && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {blog.metadata.tags.split(',').map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded text-sm"
                                        >
                                            {tag.replace(/[[\]"]/g, '').trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default BlogList;