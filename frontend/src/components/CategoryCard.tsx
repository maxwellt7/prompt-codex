import { Link } from 'react-router-dom';
import { 
  Lightbulb, 
  Target, 
  Star, 
  Brain, 
  Sparkles, 
  Users, 
  Layers 
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

interface CategoryCardProps {
  category: Category;
  index: number;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Lightbulb;
  
  return (
    <Link
      to={`/category/${category.id}`}
      className={`
        group glass card-hover rounded-2xl p-6 block
        animate-slide-up stagger-${index + 1}
        hover:border-opacity-30
      `}
      style={{ 
        borderColor: category.color,
        animationFillMode: 'backwards',
      }}
    >
      <div className="flex items-start gap-4">
        <div 
          className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
          style={{ 
            backgroundColor: `${category.color}20`,
            boxShadow: `0 0 20px ${category.color}30`,
          }}
        >
          <Icon 
            size={28} 
            style={{ color: category.color }}
            className="transition-transform duration-300 group-hover:rotate-12"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-midnight-50 mb-2 group-hover:text-white transition-colors">
            {category.name}
          </h3>
          <p className="text-midnight-300 text-sm leading-relaxed mb-4">
            {category.description}
          </p>
          <div className="flex items-center justify-between">
            <span 
              className="text-sm font-mono px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: `${category.color}15`,
                color: category.color,
              }}
            >
              {category.promptCount} prompts
            </span>
            <span 
              className="text-sm font-medium transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
              style={{ color: category.color }}
            >
              Explore →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

