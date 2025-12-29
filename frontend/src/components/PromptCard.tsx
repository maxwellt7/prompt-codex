import { Tag } from 'lucide-react';
import type { PromptSummary } from '../api/client';

interface PromptCardProps {
  prompt: PromptSummary;
  onClick: () => void;
  index: number;
  color?: string;
}

export function PromptCard({ prompt, onClick, index, color = '#4ecdc4' }: PromptCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left glass-light card-hover rounded-xl p-5
        animate-slide-up
        focus:outline-none focus:ring-2 focus:ring-accent-teal focus:ring-opacity-50
      `}
      style={{ 
        animationDelay: `${index * 0.05}s`,
        animationFillMode: 'backwards',
      }}
    >
      <h4 className="text-lg font-semibold text-midnight-50 mb-2 group-hover:text-white">
        {prompt.name}
      </h4>
      
      <p className="text-midnight-300 text-sm leading-relaxed mb-4 line-clamp-2">
        {prompt.description}
      </p>
      
      <div className="flex flex-wrap gap-2">
        {prompt.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md"
            style={{ 
              backgroundColor: `${color}15`,
              color: color,
            }}
          >
            <Tag size={10} />
            {tag}
          </span>
        ))}
        {prompt.tags.length > 3 && (
          <span className="text-xs text-midnight-400">
            +{prompt.tags.length - 3} more
          </span>
        )}
      </div>
    </button>
  );
}

