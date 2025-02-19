import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';
import { useParams, useNavigate } from "react-router-dom";

interface BlogMetadata {
    title?: string;
    date?: string;
    author?: string;
    description?: string;
    tags?: string;
}

const BlogPost: React.FC = () => {
    const { filename } = useParams<{ filename: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<string>('');
    const [metadata, setMetadata] = useState<BlogMetadata>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/src/assets/db/posts/${filename}`);

                if (!response.ok) {
                    navigate('/notfound');
                    return;
                }

                const text = await response.text();

                // Check if the content is HTML (indicating a Vite dev server error page)
                if (text.trim().toLowerCase().startsWith('<!doctype html>')) {
                    navigate('/notfound');
                    return;
                }

                setPost(text);

                // Find the position of the second '---' marker
                const firstMarker = text.indexOf('---');
                const secondMarker = text.indexOf('---', firstMarker + 3);

                if (firstMarker !== -1 && secondMarker !== -1) {
                    // Extract front matter
                    const frontMatter = text.slice(firstMarker + 3, secondMarker).trim();
                    const meta = frontMatter.split('\n').reduce<BlogMetadata>((acc, line) => {
                        const [key, ...value] = line.split(': ');
                        if (key && value) {
                            acc[key.trim() as keyof BlogMetadata] = value.join(': ').replace(/"/g, '').trim();
                        }
                        return acc;
                    }, {});

                    setMetadata(meta);
                } else {
                    // If no valid markdown format is found, redirect to notfound
                    navigate('/notfound');
                }
            } catch (error) {
                console.error('Error loading blog post:', error);
                navigate('/notfound');
            } finally {
                setLoading(false);
            }
        };

        if (filename) {
            fetchPost();
        } else {
            navigate('/notfound');
        }
    }, [filename, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    // Find the content after the second '---' marker
    const startOfContent = post.indexOf('---', post.indexOf('---') + 3) + 3;
    const content = post.slice(startOfContent);

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {metadata && (
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                        {metadata.title}
                    </h1>
                    <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{metadata.date}</span>
                        <span>By {metadata.author}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {metadata.tags?.split(',').map(tag => (
                            <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded text-sm">
                                {tag.replace(/[[\]"]/g, '').trim()}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            <article className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                >
                    {content}
                </ReactMarkdown>
            </article>
        </div>
    );
};

export default BlogPost;