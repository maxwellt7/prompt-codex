import { Link } from 'react-router-dom';
import { 
  Lightbulb, 
  Target, 
  Star, 
  Brain, 
  Sparkles, 
  Users, 
  Layers,
  ArrowRight
} from 'lucide-react';
import type { Category } from '../api/client';

const iconMap: Record<string, React.ElementType> = {
  foundation: Lightbulb,
  strategy: Target,
  expert: Star,
  brain: Brain,
  transform: Sparkles,
  persona: Users,
  meta: Layers,
};

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  '#4ecdc4': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'group-hover:shadow-emerald-500/20' },
  '#ff6b6b': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', glow: 'group-hover:shadow-red-500/20' },
  '#ffd93d': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'group-hover:shadow-amber-500/20' },
  '#a855f7': { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30', glow: 'group-hover:shadow-violet-500/20' },
  '#06b6d4': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', glow: 'group-hover:shadow-cyan-500/20' },
  '#f97316': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', glow: 'group-hover:shadow-orange-500/20' },
  '#ec4899': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30', glow: 'group-hover:shadow-pink-500/20' },
};

interface CategoryCardProps {
  category: Category;
  index: number;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Lightbulb;
  const colors = colorMap[category.color] || colorMap['#4ecdc4'];
  
  return (
    <Link
      to={`/category/${category.id}`}
      className={`
        group block rounded-2xl p-6
        bg-slate-900/50 hover:bg-slate-900/80
        border border-slate-800 hover:${colors.border}
        transition-all duration-300 ease-out
        hover:shadow-xl ${colors.glow}
        hover:-translate-y-1
      `}
      style={{ 
        animationDelay: `${index * 0.1}s`,
        animationFillMode: 'backwards',
      }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div 
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${colors.bg} ${colors.text}
            transition-transform duration-300 group-hover:scale-110
          `}
        >
          <Icon size={24} />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-1.5 group-hover:text-white transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4">
            {category.description}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between">
            <span 
              className={`
                text-xs font-medium px-3 py-1.5 rounded-full
                ${colors.bg} ${colors.text}
              `}
            >
              {category.promptCount} prompts
            </span>
            <span 
              className={`
                flex items-center gap-1 text-sm font-medium
                ${colors.text} opacity-0 -translate-x-2
                group-hover:opacity-100 group-hover:translate-x-0
                transition-all duration-300
              `}
            >
              Explore <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
