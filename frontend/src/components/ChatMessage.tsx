import { User, Bot } from 'lucide-react';
import type { Message } from '../api/client';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div
      className={`
        flex gap-4 p-5 rounded-2xl animate-fade-in
        ${isUser 
          ? 'bg-emerald-500/10 border border-emerald-500/20' 
          : 'bg-violet-500/10 border border-violet-500/20'
        }
      `}
    >
      <div 
        className={`
          flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
          ${isUser 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'bg-violet-500/20 text-violet-400'
          }
        `}
      >
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-sm font-semibold ${isUser ? 'text-emerald-400' : 'text-violet-400'}`}>
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-slate-500">
            {new Date(message.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        
        <div className="prose text-slate-200 whitespace-pre-wrap leading-relaxed">
          {message.content}
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
    <div className="flex gap-4 p-5 rounded-2xl bg-violet-500/10 border border-violet-500/20 animate-fade-in">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-violet-500/20 text-violet-400">
        <Bot size={20} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-violet-400">Assistant</span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 loading-dot" />
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 loading-dot" />
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 loading-dot" />
          </div>
        </div>
        
        <div className="prose text-slate-200 whitespace-pre-wrap leading-relaxed">
          {content || 'Thinking...'}
          <span className="inline-block w-0.5 h-5 bg-violet-400 ml-1 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
