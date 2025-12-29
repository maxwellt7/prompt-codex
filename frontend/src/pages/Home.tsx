import { Sparkles, BookOpen, Zap } from 'lucide-react';
import { CategoryCard } from '../components/CategoryCard';
import { useCategories } from '../hooks/usePrompts';

export function Home() {
  const { data: categories, isLoading, error } = useCategories();

  return (
    <div className="min-h-screen p-8">
      {/* Hero Section */}
      <header className="max-w-5xl mx-auto text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-6">
          <Sparkles size={16} className="text-accent-gold" />
          <span className="text-sm text-midnight-200">Prompt Codex Dashboard</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
          <span className="gradient-text">Unlock the Power</span>
          <br />
          <span className="text-midnight-100">of AI Conversations</span>
        </h1>
        
        <p className="text-xl text-midnight-300 max-w-2xl mx-auto mb-8">
          Explore curated prompts designed to transform your AI interactions. 
          From strategic thinking to creative exploration, find the perfect 
          conversation catalyst.
        </p>

        <div className="flex items-center justify-center gap-8 text-sm text-midnight-400">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-accent-teal" />
            <span>{categories?.reduce((acc, c) => acc + c.promptCount, 0) || 0} Prompts</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-accent-gold" />
            <span>{categories?.length || 0} Categories</span>
          </div>
        </div>
      </header>

      {/* Categories Grid */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-display font-semibold text-midnight-100 mb-6">
          Choose a Category
        </h2>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="glass rounded-2xl p-6 h-40 animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-midnight-700" />
                  <div className="flex-1">
                    <div className="h-6 w-48 bg-midnight-700 rounded mb-2" />
                    <div className="h-4 w-full bg-midnight-700 rounded mb-2" />
                    <div className="h-4 w-2/3 bg-midnight-700 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-accent-coral mb-4">Failed to load categories</p>
            <p className="text-midnight-400 text-sm">
              Make sure the backend server is running at http://localhost:3001
            </p>
          </div>
        )}

        {categories && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-16 pt-8 border-t border-midnight-700/50 text-center">
        <p className="text-midnight-500 text-sm">
          Built with Claude • Powered by your Prompt Codex collection
        </p>
      </footer>
    </div>
  );
}

