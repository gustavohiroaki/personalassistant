import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import 'highlight.js/styles/github-dark.css';
interface MarkdownRendererProps {
    content: string;
    className?: string;
}
export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
    return (
        <div className={`prose prose-invert prose-lg max-w-full max-h-full ${className}`}>
            <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    h1: ({ children }) => (
                        <h1 className="text-3xl font-bold text-white mb-6 pb-2 border-b border-gray-600">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-2xl font-semibold text-blue-300 mb-4 mt-8">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-xl font-medium text-green-300 mb-3 mt-6">
                            {children}
                        </h3>
                    ),
                    p: ({ children }) => (
                        <p className="text-gray-200 mb-4 leading-relaxed">
                            {children}
                        </p>
                    ),
                    ul: ({ children }) => (
                        <ul className="list-none space-y-2 mb-6">
                            {children}
                        </ul>
                    ),
                    li: ({ children }) => (
                        <li className="flex items-start text-gray-200">
                            <span className="text-blue-400 mr-3 mt-1 flex-shrink-0">•</span>
                            <span className="leading-relaxed">{children}</span>
                        </li>
                    ),
                    strong: ({ children }) => (
                        <strong className="font-semibold text-white">
                            {children}
                        </strong>
                    ),
                    em: ({ children }) => (
                        <em className="italic text-yellow-300">
                            {children}
                        </em>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-800/50 rounded-r-lg mb-4">
                            {children}
                        </blockquote>
                    ),
                    code: ({ children }) => (
                        <code className="bg-gray-800 text-green-300 px-2 py-1 rounded text-sm font-mono">
                            {children}
                        </code>
                    ),
                    pre: ({ children }) => (
                        <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto mb-4">
                            {children}
                        </pre>
                    )
                }}
            >
                {content}
            </Markdown>
        </div>
    )
}