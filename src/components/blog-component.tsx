import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';

interface BlogMetadata {
    title?: string;
    date?: string;
    author?: string;
    description?: string;
    tags?: string;
}

const BlogPost: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    // Import all markdown files
    const posts = import.meta.glob('/src/assets/db/posts/*.md', {
        eager: true,
        query: '?raw',
        import: 'default'
    });

    // Find the matching post
    const postEntry = Object.entries(posts).find(([path]) => path.includes(slug || ''));

    if (!postEntry) {
        navigate('/notfound');
        return null;
    }

    const [, content] = postEntry;
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

    const postContent = contentParts.join('---').trim();

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    {metadata.title}
                </h1>
                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <time dateTime={metadata.date}>{metadata.date}</time>
                    <span>By {metadata.author}</span>
                </div>
                {metadata.tags && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {metadata.tags.split(',').map(tag => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded text-sm"
                            >
                                {tag.replace(/[[\]"]/g, '').trim()}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <article className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                >
                    {postContent}
                </ReactMarkdown>
            </article>
        </div>
    );
};

export default BlogPost;