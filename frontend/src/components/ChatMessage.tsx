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
        flex gap-4 p-4 rounded-xl animate-fade-in
        ${isUser ? 'message-user' : 'message-assistant'}
      `}
    >
      <div 
        className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          ${isUser ? 'bg-accent-teal/20' : 'bg-accent-violet/20'}
        `}
      >
        {isUser ? (
          <User size={20} className="text-accent-teal" />
        ) : (
          <Bot size={20} className="text-accent-violet" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm font-medium ${isUser ? 'text-accent-teal' : 'text-accent-violet'}`}>
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-midnight-500">
            {new Date(message.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        
        <div className="prose text-midnight-100 whitespace-pre-wrap">
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
    <div className="flex gap-4 p-4 rounded-xl message-assistant animate-fade-in">
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-accent-violet/20">
        <Bot size={20} className="text-accent-violet" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-accent-violet">Assistant</span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-violet loading-dot" />
            <span className="w-1.5 h-1.5 rounded-full bg-accent-violet loading-dot" />
            <span className="w-1.5 h-1.5 rounded-full bg-accent-violet loading-dot" />
          </div>
        </div>
        
        <div className="prose text-midnight-100 whitespace-pre-wrap">
          {content || 'Thinking...'}
          <span className="inline-block w-2 h-5 bg-accent-violet/50 ml-1 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

