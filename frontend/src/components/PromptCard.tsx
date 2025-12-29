import { Tag, ArrowRight } from 'lucide-react';
import type { PromptSummary } from '../api/client';
import { cn } from '../lib/utils';

interface PromptCardProps {
  prompt: PromptSummary;
  onClick: () => void;
  index: number;
}

export function PromptCard({ prompt, onClick, index }: PromptCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full p-6 rounded-2xl border bg-gradient-to-br transition-all duration-300",
        "from-muted/20 to-muted/5 border-border/50",
        "hover:from-primary/20 hover:to-primary/5 hover:border-primary/30",
        "hover:scale-[1.02] hover:shadow-lg",
        "text-left"
      )}
      style={{ 
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-gradient transition-colors">
        {prompt.name}
      </h4>
      
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {prompt.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {prompt.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
          {prompt.tags.length > 2 && (
            <span className="text-xs text-muted-foreground/70">
              +{prompt.tags.length - 2}
            </span>
          )}
        </div>
        
        <span 
          className="
            flex items-center gap-1 text-sm font-medium text-primary
            opacity-0 -translate-x-2
            group-hover:opacity-100 group-hover:translate-x-0
            transition-all duration-300
          "
        >
          Start <ArrowRight size={14} />
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
