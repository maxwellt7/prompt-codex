import { Sparkles, BookOpen, Zap, ArrowRight } from 'lucide-react';
import { CategoryCard } from '../components/CategoryCard';
import { useCategories } from '../hooks/usePrompts';

export function Home() {
  const { data: categories, isLoading, error } = useCategories();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        
        {/* Content */}
        <div className="relative px-6 py-16 md:px-12 md:py-24 lg:py-32">
          <div className="max-w-5xl mx-auto text-center animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 border border-slate-700/50 mb-8 backdrop-blur-sm">
              <Sparkles size={16} className="text-amber-400" />
              <span className="text-sm text-slate-300 font-medium">Prompt Codex Dashboard</span>
            </div>
            
            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Unlock the Power
              </span>
              <br />
              <span className="text-white">of AI Conversations</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Explore curated prompts designed to transform your AI interactions. 
              From strategic thinking to creative exploration, find the perfect 
              conversation catalyst.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 md:gap-12">
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <BookOpen size={20} className="text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-white">
                    {categories?.reduce((acc, c) => acc + c.promptCount, 0) || 0}
                  </p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Prompts</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Zap size={20} className="text-amber-400" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-white">
                    {categories?.length || 0}
                  </p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Categories</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
      </header>

      {/* Categories Section */}
      <section className="relative bg-slate-950 px-6 py-16 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                Choose a Category
              </h2>
              <p className="text-slate-400">Select a category to explore specialized prompts</p>
            </div>
            {categories && categories.length > 0 && (
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
                <span>Scroll to explore</span>
                <ArrowRight size={16} />
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6 h-44 animate-pulse"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800" />
                    <div className="flex-1">
                      <div className="h-5 w-36 bg-slate-800 rounded mb-3" />
                      <div className="h-4 w-full bg-slate-800 rounded mb-2" />
                      <div className="h-4 w-2/3 bg-slate-800 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-2xl bg-slate-900/50 border border-red-500/30 p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <Zap size={28} className="text-red-400" />
              </div>
              <p className="text-red-400 font-medium mb-2">Failed to load categories</p>
              <p className="text-slate-500 text-sm">
                Make sure the backend server is running and connected
              </p>
            </div>
          )}

          {/* Categories Grid */}
          {categories && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/50 px-6 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-600 text-sm">
            Built with Claude • Powered by your Prompt Codex collection
          </p>
        </div>
      </footer>
    </div>
  );
}
