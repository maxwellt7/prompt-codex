import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface CategoryCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  promptCount: number;
  gradient: "primary" | "secondary" | "accent";
}

const gradientStyles = {
  primary: {
    bg: "linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(14, 165, 233, 0.05) 100%)",
    border: "rgba(14, 165, 233, 0.3)",
    icon: "#0ea5e9",
    hoverBorder: "rgba(14, 165, 233, 0.5)",
    bar: "#0ea5e9",
  },
  secondary: {
    bg: "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0.05) 100%)",
    border: "rgba(168, 85, 247, 0.3)",
    icon: "#a855f7",
    hoverBorder: "rgba(168, 85, 247, 0.5)",
    bar: "#a855f7",
  },
  accent: {
    bg: "linear-gradient(135deg, rgba(45, 212, 191, 0.2) 0%, rgba(45, 212, 191, 0.05) 100%)",
    border: "rgba(45, 212, 191, 0.3)",
    icon: "#2dd4bf",
    hoverBorder: "rgba(45, 212, 191, 0.5)",
    bar: "#2dd4bf",
  },
};

export const CategoryCard = ({
  id,
  title,
  description,
  icon: Icon,
  promptCount,
  gradient,
}: CategoryCardProps) => {
  const styles = gradientStyles[gradient];

  return (
    <Link
      to={`/category/${id}`}
      className={cn(
        "group relative w-full p-6 rounded-2xl border transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-lg",
        "text-left block"
      )}
      style={{
        background: styles.bg,
        borderColor: styles.border,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = styles.hoverBorder;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = styles.border;
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "p-3 rounded-xl backdrop-blur-sm",
            "group-hover:scale-110 transition-transform duration-300"
          )}
          style={{ backgroundColor: "rgba(10, 15, 26, 0.5)" }}
        >
          <Icon className="w-6 h-6" style={{ color: styles.icon }} />
        </div>
        <span 
          className="text-xs font-mono px-2 py-1 rounded-full"
          style={{ 
            backgroundColor: "rgba(30, 41, 59, 0.5)", 
            color: "#94a3b8" 
          }}
        >
          {promptCount} prompts
        </span>
      </div>

      <h3 
        className="text-lg font-semibold mb-2 group-hover:text-gradient transition-colors"
        style={{ color: "#e8edf5" }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
        {description}
      </p>

      <div 
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: styles.bar }}
      />
    </Link>
  );
};
