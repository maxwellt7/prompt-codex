import { Link } from 'react-router-dom';
import { 
  Brain, 
  Target, 
  Lightbulb, 
  Sparkles, 
  Users, 
  Layers,
  Compass,
  Shield,
  TrendingUp,
  type LucideIcon
} from 'lucide-react';
import type { Category } from '../api/client';

const iconMap: Record<string, LucideIcon> = {
  foundational: Lightbulb,
  strategic: Target,
  specialized: Users,
  cognitive: Brain,
  transformational: Sparkles,
  agentic: Compass,
  metacognitive: Layers,
  // Additional mappings
  growth: TrendingUp,
  risk: Shield,
};

type GradientType = 'primary' | 'secondary' | 'accent';

const categoryGradients: Record<string, GradientType> = {
  foundational: 'primary',
  strategic: 'secondary',
  specialized: 'accent',
  cognitive: 'primary',
  transformational: 'secondary',
  agentic: 'accent',
  metacognitive: 'primary',
};

const colors = {
  primary: { main: '#0ea5e9', light: 'rgba(14, 165, 233, 0.2)', lighter: 'rgba(14, 165, 233, 0.05)' },
  secondary: { main: '#a855f7', light: 'rgba(168, 85, 247, 0.2)', lighter: 'rgba(168, 85, 247, 0.05)' },
  accent: { main: '#2dd4bf', light: 'rgba(45, 212, 191, 0.2)', lighter: 'rgba(45, 212, 191, 0.05)' },
};

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.id] || Lightbulb;
  const gradient = categoryGradients[category.id] || 'primary';
  const color = colors[gradient];
  
  return (
    <Link
      to={`/category/${category.id}`}
      className="group relative block p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-left"
      style={{ 
        background: `linear-gradient(135deg, ${color.light} 0%, ${color.lighter} 100%)`,
        borderColor: color.light,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: 'rgba(10, 15, 30, 0.5)' }}
        >
          <Icon className="w-6 h-6" style={{ color: color.main }} />
        </div>
        <span 
          className="text-xs font-mono px-2 py-1 rounded-full"
          style={{ 
            backgroundColor: 'rgba(100, 116, 139, 0.3)',
            color: 'rgb(148, 163, 184)'
          }}
        >
          {category.promptCount} prompts
        </span>
      </div>

      <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(241, 245, 249)' }}>
        {category.name}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: 'rgb(148, 163, 184)' }}>
        {category.description}
      </p>

      <div 
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: color.main }}
      />
    </Link>
  );
}
