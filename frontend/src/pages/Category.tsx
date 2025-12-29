import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { PromptCard } from '../components/PromptCard';
import { useCategories, usePrompts } from '../hooks/usePrompts';
import { useStartChat } from '../hooks/useChat';

const categoryColors: Record<string, string> = {
  foundational: '#4ecdc4',
  strategic: '#ff6b6b',
  specialized: '#ffd93d',
  cognitive: '#a855f7',
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
  const color = categoryColors[categoryId || ''] || '#4ecdc4';

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
    <div className="min-h-screen p-8">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-8 animate-fade-in">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-midnight-400 hover:text-midnight-200 transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          <span>Back to Categories</span>
        </Link>

        {category && (
          <div className="flex items-start gap-6">
            <div 
              className="p-4 rounded-2xl"
              style={{ 
                backgroundColor: `${color}20`,
                boxShadow: `0 0 30px ${color}30`,
              }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-display font-bold"
                style={{ color }}
              >
                {category.name.charAt(0)}
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-display font-bold text-midnight-50 mb-2">
                {category.name}
              </h1>
              <p className="text-midnight-300 text-lg max-w-2xl">
                {category.description}
              </p>
              <p 
                className="mt-3 text-sm font-mono"
                style={{ color }}
              >
                {category.promptCount} prompts available
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Search */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="relative">
          <Search 
            size={20} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-500" 
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..."
            className="
              w-full glass rounded-xl px-12 py-3
              text-midnight-100 placeholder-midnight-500
              focus:ring-2 focus:ring-opacity-50 transition-all
            "
            style={{ 
              // @ts-ignore
              '--tw-ring-color': color,
            }}
          />
        </div>
      </div>

      {/* Prompts Grid */}
      <section className="max-w-5xl mx-auto">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="glass-light rounded-xl p-5 h-40 animate-pulse"
              >
                <div className="h-5 w-3/4 bg-midnight-700 rounded mb-3" />
                <div className="h-4 w-full bg-midnight-700 rounded mb-2" />
                <div className="h-4 w-2/3 bg-midnight-700 rounded mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-midnight-700 rounded" />
                  <div className="h-6 w-16 bg-midnight-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPrompts && filteredPrompts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-midnight-300 mb-2">No prompts found</p>
            <p className="text-midnight-500 text-sm">
              Try adjusting your search terms
            </p>
          </div>
        )}

        {startChat.isPending && (
          <div className="fixed inset-0 bg-midnight-950/80 flex items-center justify-center z-50">
            <div className="glass rounded-2xl p-8 text-center">
              <Loader2 size={40} className="text-accent-teal animate-spin mx-auto mb-4" />
              <p className="text-midnight-200">Starting conversation...</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

