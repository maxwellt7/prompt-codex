import { Tag, ArrowRight } from 'lucide-react';
import type { PromptSummary } from '../api/client';

interface PromptCardProps {
  prompt: PromptSummary;
  onClick: () => void;
  index: number;
  color?: string;
}

export function PromptCard({ prompt, onClick, index, color = '#10b981' }: PromptCardProps) {
  return (
    <button
      onClick={onClick}
      className="
        group w-full text-left rounded-xl p-5
        bg-slate-900/50 hover:bg-slate-900/80
        border border-slate-800 hover:border-slate-700
        transition-all duration-300 ease-out
        hover:shadow-xl hover:shadow-black/20
        hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-emerald-500/50
        animate-slide-up
      "
      style={{ 
        animationDelay: `${index * 0.05}s`,
        animationFillMode: 'backwards',
      }}
    >
      <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-white transition-colors">
        {prompt.name}
      </h4>
      
      <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
        {prompt.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {prompt.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
              style={{ 
                backgroundColor: `${color}15`,
                color: color,
              }}
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
          {prompt.tags.length > 2 && (
            <span className="text-xs text-slate-500">
              +{prompt.tags.length - 2}
            </span>
          )}
        </div>
        
        <span 
          className="
            flex items-center gap-1 text-sm font-medium
            opacity-0 -translate-x-2
            group-hover:opacity-100 group-hover:translate-x-0
            transition-all duration-300
          "
          style={{ color }}
        >
          Start <ArrowRight size={14} />
        </span>
      </div>
    </button>
  );
}
