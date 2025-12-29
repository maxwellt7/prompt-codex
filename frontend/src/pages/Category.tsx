import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, Loader2, Sparkles } from 'lucide-react';
import { PromptCard } from '../components/PromptCard';
import { useCategories, usePrompts } from '../hooks/usePrompts';
import { useStartChat } from '../hooks/useChat';

const categoryColors: Record<string, string> = {
  foundational: '#10b981',
  strategic: '#ef4444',
  specialized: '#f59e0b',
  cognitive: '#8b5cf6',
  transformational: '#06b6d4',
  agentic: '#f97316',
  metacognitive: '#ec4899',
};

export function Category() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  
  const { data: categories } = useCategories();
  const { data: prompts, isLoading } = usePrompts(categoryId);
  const startChat = useStartChat();

  const category = categories?.find(c => c.id === categoryId);
  const color = categoryColors[categoryId || ''] || '#10b981';

  const filteredPrompts = prompts?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelectPrompt = async (promptId: string) => {
    try {
      const result = await startChat.mutateAsync(promptId);
      navigate(`/chat/${result.id}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-8 md:px-12 md:py-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Categories</span>
          </Link>

          {category && (
            <div className="flex items-start gap-6">
              <div 
                className="p-4 rounded-2xl"
                style={{ 
                  backgroundColor: `${color}15`,
                  boxShadow: `0 0 40px ${color}20`,
                }}
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                  }}
                >
                  <Sparkles size={28} style={{ color }} />
                </div>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
                  {category.name}
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                  {category.description}
                </p>
                <p 
                  className="mt-4 text-sm font-medium px-3 py-1 rounded-full inline-block"
                  style={{ 
                    backgroundColor: `${color}15`,
                    color: color,
                  }}
                >
                  {category.promptCount} prompts available
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Search */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
        <div className="relative max-w-md">
          <Search 
            size={18} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" 
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..."
            className="
              w-full rounded-xl px-12 py-3
              bg-slate-900/50 border border-slate-800
              text-slate-100 placeholder-slate-500
              focus:border-slate-600 focus:ring-1 focus:ring-slate-600
              transition-all
            "
          />
        </div>
      </div>

      {/* Prompts Grid */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pb-16">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="rounded-xl bg-slate-900/50 border border-slate-800 p-5 h-44 animate-pulse"
              >
                <div className="h-5 w-3/4 bg-slate-800 rounded mb-3" />
                <div className="h-4 w-full bg-slate-800 rounded mb-2" />
                <div className="h-4 w-2/3 bg-slate-800 rounded mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-slate-800 rounded-full" />
                  <div className="h-6 w-16 bg-slate-800 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPrompts && filteredPrompts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPrompts.map((prompt, index) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onClick={() => handleSelectPrompt(prompt.id)}
                index={index}
                color={color}
              />
            ))}
          </div>
        )}

        {filteredPrompts && filteredPrompts.length === 0 && (
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-10 text-center">
            <p className="text-slate-300 mb-2">No prompts found</p>
            <p className="text-slate-500 text-sm">
              Try adjusting your search terms
            </p>
          </div>
        )}

        {startChat.isPending && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
              <Loader2 size={40} className="text-emerald-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-200 font-medium">Starting conversation...</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
