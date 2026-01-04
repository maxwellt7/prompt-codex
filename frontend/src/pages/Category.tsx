import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, Loader2, Sparkles, LogIn } from 'lucide-react';
import { useAuth, SignInButton } from '@clerk/clerk-react';
import { PromptCard } from '../components/PromptCard';
import { useCategories, usePrompts } from '../hooks/usePrompts';
import { useStartChat } from '../hooks/useChat';

export function Category() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { isSignedIn } = useAuth();
  
  const { data: categories } = useCategories();
  const { data: prompts, isLoading } = usePrompts(categoryId);
  const startChat = useStartChat();

  const category = categories?.find(c => c.id === categoryId);

  const filteredPrompts = prompts?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelectPrompt = async (promptId: string) => {
    if (!isSignedIn) {
      // This shouldn't happen with the UI protection, but just in case
      return;
    }
    try {
      const result = await startChat.mutateAsync(promptId);
      navigate(`/chat/${result.id}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30">
        <div className="container mx-auto px-6 py-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Categories</span>
          </Link>

          {category && (
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <Sparkles size={28} className="text-primary" />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  {category.name}
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                  {category.description}
                </p>
                <span className="inline-block mt-4 text-xs font-mono text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                  {category.promptCount} prompts available
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Sign-in prompt if not authenticated */}
      {!isSignedIn && (
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3">
              <LogIn size={20} className="text-primary" />
              <span className="text-foreground">Sign in to start conversations with these prompts</span>
            </div>
            <SignInButton mode="modal">
              <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="container mx-auto px-6 py-8">
        <div className="relative max-w-md">
          <Search 
            size={18} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..."
            className="
              w-full rounded-xl px-12 py-3
              bg-muted/30 border border-border/50
              text-foreground placeholder:text-muted-foreground
              focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none
              transition-all
            "
          />
        </div>
      </div>

      {/* Prompts Grid */}
      <section className="container mx-auto px-6 pb-16">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="rounded-2xl bg-gradient-to-br from-muted/20 to-muted/5 border border-border/50 p-5 h-44 animate-pulse"
              >
                <div className="h-5 w-3/4 bg-muted/50 rounded mb-3" />
                <div className="h-4 w-full bg-muted/50 rounded mb-2" />
                <div className="h-4 w-2/3 bg-muted/50 rounded mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-muted/50 rounded-full" />
                  <div className="h-6 w-16 bg-muted/50 rounded-full" />
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
                onClick={isSignedIn ? () => handleSelectPrompt(prompt.id) : undefined}
                index={index}
                disabled={!isSignedIn}
              />
            ))}
          </div>
        )}

        {filteredPrompts && filteredPrompts.length === 0 && (
          <div className="border-gradient rounded-2xl p-10 text-center max-w-md mx-auto">
            <p className="text-foreground mb-2">No prompts found</p>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search terms
            </p>
          </div>
        )}

        {startChat.isPending && (
          <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="border-gradient rounded-2xl p-8 text-center">
              <Loader2 size={40} className="text-primary animate-spin mx-auto mb-4" />
              <p className="text-foreground font-medium">Starting conversation...</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
