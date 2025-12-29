import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CategoryCard } from '../components/CategoryCard';
import { useCategories } from '../hooks/usePrompts';

export function Home() {
  const { data: categories, isLoading, error } = useCategories();

  const totalPrompts = categories?.reduce((acc, c) => acc + c.promptCount, 0) || 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "4s" }} />
      </div>

      {/* Hero Section */}
      <header className="relative z-10 pt-8 pb-20">
        <div className="container mx-auto px-6">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(199,89%,48%)] to-[hsl(262,83%,58%)] flex items-center justify-center glow-primary">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                Prompt Codex
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/"
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                History
              </Link>
              <button className="px-4 py-2 text-sm rounded-lg bg-muted/50 backdrop-blur-md border border-border/50 hover:bg-muted/70 hover:border-primary/30 text-foreground transition-all flex items-center gap-2">
                <Zap className="w-4 h-4" />
                New Chat
              </button>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm text-muted-foreground mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Powered by Anthropic Claude
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Your Strategic
              <br />
              <span className="text-gradient">AI Partner</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {totalPrompts} expert-crafted prompts organized into strategic frameworks. 
              Select a category, choose your prompt, and engage in powerful AI-driven conversations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#categories"
                className="px-10 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-[hsl(199,89%,48%)] via-[hsl(262,83%,58%)] to-[hsl(171,77%,50%)] text-[hsl(222,47%,6%)] hover:opacity-90 shadow-[0_0_30px_hsl(199_89%_48%/0.4)] transition-all flex items-center gap-2"
              >
                Start Exploring
                <ArrowRight className="w-5 h-5" />
              </a>
              <button className="px-8 py-3 text-base rounded-lg border border-border bg-transparent hover:bg-muted hover:text-foreground text-muted-foreground transition-all">
                View All Prompts
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 text-center">
            <div>
              <p className="text-3xl font-bold text-foreground">{totalPrompts}</p>
              <p className="text-sm text-muted-foreground">Expert Prompts</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="text-3xl font-bold text-foreground">{categories?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="text-3xl font-bold text-foreground">∞</p>
              <p className="text-sm text-muted-foreground">Conversations</p>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Section */}
      <section id="categories" className="relative z-10 py-20 border-t border-border/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Focus
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Select a category to explore curated prompts designed for specific strategic outcomes.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="p-6 rounded-2xl border border-border/50 bg-gradient-to-br from-muted/20 to-muted/5 h-44 animate-pulse"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-muted/50" />
                    <div className="w-16 h-6 rounded-full bg-muted/50" />
                  </div>
                  <div className="h-5 w-32 bg-muted/50 rounded mb-2" />
                  <div className="h-4 w-full bg-muted/50 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="border-gradient rounded-2xl p-10 text-center max-w-md mx-auto">
              <Zap className="w-10 h-10 text-destructive mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">Failed to load categories</p>
              <p className="text-muted-foreground text-sm">
                Make sure the backend server is running and connected
              </p>
            </div>
          )}

          {/* Categories Grid */}
          {categories && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="border-gradient rounded-3xl p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Transform Your Strategy?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start a conversation with Claude and unlock strategic insights.
            </p>
            <a 
              href="#categories"
              className="inline-flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-[hsl(199,89%,48%)] via-[hsl(262,83%,58%)] to-[hsl(171,77%,50%)] text-[hsl(222,47%,6%)] hover:opacity-90 shadow-[0_0_30px_hsl(199_89%_48%/0.4)] transition-all"
            >
              Launch Your First Chat
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-border/30">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>Built for strategic minds. Powered by Anthropic.</p>
        </div>
      </footer>
    </div>
  );
}
