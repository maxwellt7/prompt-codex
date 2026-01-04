import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Lightbulb, 
  Shield,
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react";
import { Button } from "../components/ui/button";
import { CategoryCard } from "../components/CategoryCard";
import { ChatPreview } from "../components/ChatPreview";
import { SidebarPreview } from "../components/SidebarPreview";
import { SafeAuthButton } from "../components/AuthButton";
import { useCategories } from "../hooks/usePrompts";

// Icon mapping for categories from API
const iconMap: Record<string, typeof Target> = {
  foundational: Lightbulb,
  strategic: Target,
  specialized: Users,
  cognitive: Brain,
  transformational: TrendingUp,
  agentic: Shield,
  metacognitive: Brain,
};

// Gradient mapping
const gradientMap: Record<string, "primary" | "secondary" | "accent"> = {
  foundational: "primary",
  strategic: "secondary",
  specialized: "accent",
  cognitive: "primary",
  transformational: "secondary",
  agentic: "accent",
  metacognitive: "primary",
};

export function Home() {
  const { data: categories, isLoading, error } = useCategories();
  
  const totalPrompts = categories?.reduce((acc, c) => acc + c.promptCount, 0) || 0;
  const categoryCount = categories?.length || 0;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#0a0f1a" }}>
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[128px] animate-pulse-slow"
          style={{ backgroundColor: "rgba(14, 165, 233, 0.1)" }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[128px] animate-pulse-slow"
          style={{ backgroundColor: "rgba(168, 85, 247, 0.1)", animationDelay: "2s" }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-[100px] animate-pulse-slow"
          style={{ backgroundColor: "rgba(45, 212, 191, 0.05)", animationDelay: "4s" }}
        />
      </div>

      {/* Hero Section */}
      <header className="relative z-10 pt-8 pb-20">
        <div className="container mx-auto px-6">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center glow-primary"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #a855f7)" }}
              >
                <Sparkles className="w-5 h-5" style={{ color: "#0a0f1a" }} />
              </div>
              <span className="text-xl font-semibold" style={{ color: "#e8edf5", fontFamily: "var(--font-display)" }}>
                Prompt Codex
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">History</Button>
              <Button variant="glass" size="sm">
                <Zap className="w-4 h-4 mr-1" />
                New Chat
              </Button>
              <SafeAuthButton />
            </div>
          </nav>

          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
              style={{ 
                backgroundColor: "rgba(30, 41, 59, 0.5)", 
                borderWidth: "1px",
                borderColor: "rgba(30, 58, 95, 0.5)",
                color: "#94a3b8"
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#2dd4bf" }} />
              Powered by Anthropic Claude
            </div>
            
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{ color: "#e8edf5", fontFamily: "var(--font-display)" }}
            >
              Your Strategic
              <br />
              <span className="text-gradient">AI Partner</span>
            </h1>
            
            <p 
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: "#94a3b8" }}
            >
              {totalPrompts} expert-crafted prompts organized into strategic frameworks. 
              Select a category, choose your prompt, and engage in powerful AI-driven conversations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <a href="#categories">
                  Start Exploring
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/prompts">
                  View All Prompts
                </a>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 text-center">
            <div>
              <p className="text-3xl font-bold" style={{ color: "#e8edf5", fontFamily: "var(--font-display)" }}>{totalPrompts}</p>
              <p className="text-sm" style={{ color: "#94a3b8" }}>Expert Prompts</p>
            </div>
            <div className="w-px h-10" style={{ backgroundColor: "#1e3a5f" }} />
            <div>
              <p className="text-3xl font-bold" style={{ color: "#e8edf5", fontFamily: "var(--font-display)" }}>{categoryCount}</p>
              <p className="text-sm" style={{ color: "#94a3b8" }}>Categories</p>
            </div>
            <div className="w-px h-10" style={{ backgroundColor: "#1e3a5f" }} />
            <div>
              <p className="text-3xl font-bold" style={{ color: "#e8edf5", fontFamily: "var(--font-display)" }}>∞</p>
              <p className="text-sm" style={{ color: "#94a3b8" }}>Conversations</p>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Section */}
      <section 
        id="categories" 
        className="relative z-10 py-20"
        style={{ borderTopWidth: "1px", borderColor: "rgba(30, 58, 95, 0.3)" }}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#e8edf5", fontFamily: "var(--font-display)" }}
            >
              Choose Your Focus
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: "#94a3b8" }}>
              Select a category to explore curated prompts designed for specific strategic outcomes.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="p-6 rounded-2xl h-44 animate-pulse"
                  style={{ 
                    borderWidth: "1px",
                    borderColor: "rgba(30, 58, 95, 0.5)",
                    background: "linear-gradient(135deg, rgba(30, 41, 59, 0.2), rgba(30, 41, 59, 0.05))"
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: "rgba(30, 41, 59, 0.5)" }} />
                    <div className="w-20 h-6 rounded-full" style={{ backgroundColor: "rgba(30, 41, 59, 0.5)" }} />
                  </div>
                  <div className="h-5 w-32 rounded mb-2" style={{ backgroundColor: "rgba(30, 41, 59, 0.5)" }} />
                  <div className="h-4 w-full rounded" style={{ backgroundColor: "rgba(30, 41, 59, 0.5)" }} />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="border-gradient rounded-2xl p-10 text-center max-w-md mx-auto">
              <Zap className="w-10 h-10 mx-auto mb-4" style={{ color: "#ef4444" }} />
              <p className="font-medium mb-2" style={{ color: "#e8edf5" }}>Failed to load categories</p>
              <p className="text-sm" style={{ color: "#94a3b8" }}>
                Make sure the backend server is running and connected
              </p>
            </div>
          )}

          {/* Categories Grid */}
          {categories && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {categories.map((category, index) => (
                <CategoryCard 
                  key={category.id} 
                  id={category.id}
                  title={category.name}
                  description={category.description}
                  icon={iconMap[category.id] || Lightbulb}
                  promptCount={category.promptCount}
                  gradient={gradientMap[category.id] || (index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "accent")}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Preview Section */}
      <section 
        className="relative z-10 py-20"
        style={{ borderTopWidth: "1px", borderColor: "rgba(30, 58, 95, 0.3)" }}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#e8edf5", fontFamily: "var(--font-display)" }}
            >
              Seamless Conversations
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: "#94a3b8" }}>
              Your chats are tracked in the sidebar and archived to Pinecone for future reference.
            </p>
          </div>

          <div className="flex items-center justify-center gap-8 max-w-5xl mx-auto">
            <div className="hidden lg:block">
              <SidebarPreview />
            </div>
            <ChatPreview />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="border-gradient rounded-3xl p-12 text-center max-w-3xl mx-auto">
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ color: "#e8edf5", fontFamily: "var(--font-display)" }}
            >
              Ready to Transform Your Strategy?
            </h2>
            <p className="mb-8" style={{ color: "#94a3b8" }}>
              Start a conversation with Claude and unlock strategic insights.
            </p>
            <Button variant="hero" size="xl" asChild>
              <a href="#categories">
                Launch Your First Chat
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="relative z-10 py-8"
        style={{ borderTopWidth: "1px", borderColor: "rgba(30, 58, 95, 0.3)" }}
      >
        <div className="container mx-auto px-6 text-center text-sm" style={{ color: "#94a3b8" }}>
          <p>Built for strategic minds. Powered by Anthropic.</p>
        </div>
      </footer>
    </div>
  );
}
