import { User } from 'lucide-react';
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
            ? "bg-primary/20" 
            : "bg-gradient-to-br from-[hsl(199,89%,48%)] to-[hsl(262,83%,58%)]"
        )}
      >
        {isUser ? (
          <User size={16} className="text-primary" />
        ) : (
          <span className="text-xs font-bold text-white">AI</span>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "text-sm font-medium",
            isUser ? "text-primary" : "text-secondary"
          )}>
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(message.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        
        <div 
          className={cn(
            "rounded-2xl p-3 text-sm text-foreground/90",
            isUser 
              ? "bg-primary/20 border border-primary/30 rounded-tl-md" 
              : "bg-muted/50 rounded-tl-md"
          )}
        >
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
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
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(199,89%,48%)] to-[hsl(262,83%,58%)] flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-white">AI</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-secondary">Assistant</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-2xl rounded-tl-md p-3 text-sm text-foreground/90">
          <p className="whitespace-pre-wrap leading-relaxed">
            {content || 'Thinking...'}
            <span className="inline-block w-0.5 h-4 bg-secondary ml-1 animate-pulse" />
          </p>
        </div>
      </div>
    </div>
  );
}
