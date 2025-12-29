import { Link } from 'react-router-dom';
import { 
  Brain, 
  Target, 
  Lightbulb, 
  Sparkles, 
  Users, 
  Layers,
  Compass,
  type LucideIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { Category } from '../api/client';

const iconMap: Record<string, LucideIcon> = {
  foundational: Lightbulb,
  strategic: Target,
  specialized: Users,
  cognitive: Brain,
  transformational: Sparkles,
  agentic: Compass,
  metacognitive: Layers,
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

const gradientStyles = {
  primary: "from-[hsl(199,89%,48%)]/20 to-[hsl(199,89%,48%)]/5 hover:from-[hsl(199,89%,48%)]/30 hover:to-[hsl(199,89%,48%)]/10 border-[hsl(199,89%,48%)]/20 hover:border-[hsl(199,89%,48%)]/40",
  secondary: "from-[hsl(262,83%,58%)]/20 to-[hsl(262,83%,58%)]/5 hover:from-[hsl(262,83%,58%)]/30 hover:to-[hsl(262,83%,58%)]/10 border-[hsl(262,83%,58%)]/20 hover:border-[hsl(262,83%,58%)]/40",
  accent: "from-[hsl(171,77%,50%)]/20 to-[hsl(171,77%,50%)]/5 hover:from-[hsl(171,77%,50%)]/30 hover:to-[hsl(171,77%,50%)]/10 border-[hsl(171,77%,50%)]/20 hover:border-[hsl(171,77%,50%)]/40",
};

const iconStyles = {
  primary: "text-[hsl(199,89%,48%)]",
  secondary: "text-[hsl(262,83%,58%)]",
  accent: "text-[hsl(171,77%,50%)]",
};

interface CategoryCardProps {
  category: Category;
  index: number;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  const Icon = iconMap[category.id] || Lightbulb;
  const gradient = categoryGradients[category.id] || 'primary';
  
  return (
    <Link
      to={`/category/${category.id}`}
      className={cn(
        "group relative w-full p-6 rounded-2xl border bg-gradient-to-br transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-lg",
        "text-left block",
        gradientStyles[gradient]
      )}
      style={{ 
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "p-3 rounded-xl bg-background/50 backdrop-blur-sm",
            "group-hover:scale-110 transition-transform duration-300"
          )}
        >
          <Icon className={cn("w-6 h-6", iconStyles[gradient])} />
        </div>
        <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
          {category.promptCount} prompts
        </span>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-gradient transition-colors">
        {category.name}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
        {category.description}
      </p>

      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity",
        gradient === 'primary' && "bg-[hsl(199,89%,48%)]",
        gradient === 'secondary' && "bg-[hsl(262,83%,58%)]",
        gradient === 'accent' && "bg-[hsl(171,77%,50%)]",
      )} />
    </Link>
  );
}
