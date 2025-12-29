import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = 'Type your message...' }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-2 bg-muted/30 rounded-xl p-2 border border-border/50 focus-within:border-primary/30 transition-colors">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="
            flex-1 bg-transparent text-foreground placeholder:text-muted-foreground
            px-3 py-2 resize-none
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        />
        
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={cn(
            "p-3 rounded-lg transition-all duration-200 flex items-center justify-center shrink-0",
            "bg-muted/50 backdrop-blur-md border border-border/50",
            "hover:bg-primary/20 hover:border-primary/30 hover:text-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-muted/50 disabled:hover:border-border/50 disabled:hover:text-muted-foreground",
            message.trim() && !disabled ? "text-primary" : "text-muted-foreground"
          )}
        >
          {disabled ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
      
      <p className="text-xs text-muted-foreground/70 mt-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
}
