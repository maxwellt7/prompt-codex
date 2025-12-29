import { User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../api/client';
import { cn } from '../lib/utils';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className="flex gap-3">
      <div 
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
          isUser 
            ? "bg-[rgba(14,165,233,0.2)]" 
            : "bg-gradient-to-br from-[#0ea5e9] to-[#a855f7]"
        )}
      >
        {isUser ? (
          <User size={16} style={{ color: "#0ea5e9" }} />
        ) : (
          <span className="text-xs font-bold" style={{ color: "#0a0f1a" }}>AI</span>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "text-sm font-medium",
            isUser ? "text-[#0ea5e9]" : "text-[#a855f7]"
          )}>
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs" style={{ color: "#94a3b8" }}>
            {new Date(message.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        
        <div 
          className={cn(
            "rounded-2xl p-4 text-sm",
            isUser 
              ? "rounded-tl-md" 
              : "rounded-tl-md"
          )}
          style={{
            backgroundColor: isUser ? "rgba(14, 165, 233, 0.15)" : "rgba(30, 41, 59, 0.5)",
            borderWidth: isUser ? "1px" : "0",
            borderColor: isUser ? "rgba(14, 165, 233, 0.3)" : "transparent",
            color: "rgba(232, 237, 245, 0.9)",
          }}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Headings
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold mt-4 mb-2 first:mt-0" style={{ color: "#e8edf5" }}>{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-bold mt-4 mb-2 first:mt-0" style={{ color: "#e8edf5" }}>{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-semibold mt-3 mb-1 first:mt-0" style={{ color: "#e8edf5" }}>{children}</h3>
                  ),
                  // Paragraphs
                  p: ({ children }) => (
                    <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
                  ),
                  // Lists
                  ul: ({ children }) => (
                    <ul className="list-disc list-outside ml-5 mb-3 space-y-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-outside ml-5 mb-3 space-y-1">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  // Code
                  code: ({ className, children, ...props }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code 
                          className="px-1.5 py-0.5 rounded text-sm font-mono"
                          style={{ backgroundColor: "rgba(30, 58, 95, 0.5)", color: "#2dd4bf" }}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className={cn("font-mono text-sm", className)} {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre 
                      className="rounded-lg p-4 mb-3 overflow-x-auto font-mono text-sm"
                      style={{ backgroundColor: "rgba(10, 15, 26, 0.8)", borderWidth: "1px", borderColor: "rgba(30, 58, 95, 0.5)" }}
                    >
                      {children}
                    </pre>
                  ),
                  // Blockquote
                  blockquote: ({ children }) => (
                    <blockquote 
                      className="pl-4 my-3 italic"
                      style={{ borderLeftWidth: "3px", borderColor: "#a855f7", color: "#94a3b8" }}
                    >
                      {children}
                    </blockquote>
                  ),
                  // Links
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:opacity-80 transition-opacity"
                      style={{ color: "#0ea5e9" }}
                    >
                      {children}
                    </a>
                  ),
                  // Strong/Bold
                  strong: ({ children }) => (
                    <strong className="font-semibold" style={{ color: "#e8edf5" }}>{children}</strong>
                  ),
                  // Emphasis/Italic
                  em: ({ children }) => (
                    <em className="italic">{children}</em>
                  ),
                  // Horizontal rule
                  hr: () => (
                    <hr className="my-4" style={{ borderColor: "rgba(30, 58, 95, 0.5)" }} />
                  ),
                  // Tables
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-3">
                      <table className="min-w-full" style={{ borderWidth: "1px", borderColor: "rgba(30, 58, 95, 0.5)" }}>
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead style={{ backgroundColor: "rgba(30, 41, 59, 0.5)" }}>{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th className="px-3 py-2 text-left font-semibold" style={{ borderWidth: "1px", borderColor: "rgba(30, 58, 95, 0.5)", color: "#e8edf5" }}>
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-3 py-2" style={{ borderWidth: "1px", borderColor: "rgba(30, 58, 95, 0.5)" }}>
                      {children}
                    </td>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StreamingMessageProps {
  content: string;
}

export function StreamingMessage({ content }: StreamingMessageProps) {
  return (
    <div className="flex gap-3">
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg, #0ea5e9, #a855f7)" }}
      >
        <span className="text-xs font-bold" style={{ color: "#0a0f1a" }}>AI</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium" style={{ color: "#a855f7" }}>Assistant</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "rgba(232, 237, 245, 0.4)", animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "rgba(232, 237, 245, 0.4)", animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "rgba(232, 237, 245, 0.4)", animationDelay: "300ms" }} />
          </div>
        </div>
        
        <div 
          className="rounded-2xl rounded-tl-md p-4 text-sm"
          style={{ backgroundColor: "rgba(30, 41, 59, 0.5)", color: "rgba(232, 237, 245, 0.9)" }}
        >
          <div className="markdown-content">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
                ),
                code: ({ className, children, ...props }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code 
                        className="px-1.5 py-0.5 rounded text-sm font-mono"
                        style={{ backgroundColor: "rgba(30, 58, 95, 0.5)", color: "#2dd4bf" }}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className={cn("font-mono text-sm", className)} {...props}>
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre 
                    className="rounded-lg p-4 mb-3 overflow-x-auto font-mono text-sm"
                    style={{ backgroundColor: "rgba(10, 15, 26, 0.8)", borderWidth: "1px", borderColor: "rgba(30, 58, 95, 0.5)" }}
                  >
                    {children}
                  </pre>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold" style={{ color: "#e8edf5" }}>{children}</strong>
                ),
              }}
            >
              {content || 'Thinking...'}
            </ReactMarkdown>
          </div>
          <span className="inline-block w-0.5 h-4 ml-1 animate-pulse" style={{ backgroundColor: "#a855f7" }} />
        </div>
      </div>
    </div>
  );
}
