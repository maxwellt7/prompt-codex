import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Sparkles,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { PromptCard } from '../components/PromptCard';
import { AuthButton } from '../components/AuthButton';
import { useAllPrompts, useFilterOptions, useCategories } from '../hooks/usePrompts';
import { useStartChat } from '../hooks/useChat';
import type { PromptSearchParams } from '../api/client';

export function AllPrompts() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const startChat = useStartChat();
  
  // Local state for immediate UI updates
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  
  // Parse URL params
  const params: PromptSearchParams = useMemo(() => ({
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    source: searchParams.get('source') || undefined,
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: 30,
    sort: (searchParams.get('sort') as 'name' | 'category' | 'source') || 'name',
  }), [searchParams]);
  
  // Queries
  const { data, isLoading, isFetching } = useAllPrompts(params);
  const { data: filterOptions } = useFilterOptions();
  const { data: categories } = useCategories();
  
  // Update URL params
  const updateParams = (updates: Partial<PromptSearchParams>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === 'all') {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    
    // Reset to page 1 when filters change
    if (!('page' in updates)) {
      newParams.delete('page');
    }
    
    setSearchParams(newParams);
  };
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (params.search || '')) {
        updateParams({ search: searchInput || undefined });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);
  
  const handleSelectPrompt = async (promptId: string) => {
    try {
      const result = await startChat.mutateAsync(promptId);
      navigate(`/chat/${result.id}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };
  
  const clearFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };
  
  const hasActiveFilters = params.search || params.category || params.source;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 sticky top-0 bg-background/95 backdrop-blur-sm z-20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
            <AuthButton />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                <Sparkles size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  All Prompts
                </h1>
                <p className="text-muted-foreground">
                  {data?.pagination.totalCount || 0} expert prompts available
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 flex-1 lg:max-w-xl">
              <div className="relative flex-1">
                <Search 
                  size={18} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" 
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search prompts by name, description, or tags..."
                  className="
                    w-full rounded-xl px-12 py-3
                    bg-muted/30 border border-border/50
                    text-foreground placeholder:text-muted-foreground
                    focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none
                    transition-all
                  "
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-xl border transition-all
                  ${showFilters 
                    ? 'bg-primary/10 border-primary/50 text-primary' 
                    : 'bg-muted/30 border-border/50 text-muted-foreground hover:text-foreground hover:border-border'
                  }
                `}
              >
                <SlidersHorizontal size={18} />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-4 rounded-xl bg-muted/20 border border-border/30">
              <div className="flex flex-wrap items-center gap-4">
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">Category:</label>
                  <select
                    value={params.category || 'all'}
                    onChange={(e) => updateParams({ category: e.target.value })}
                    className="
                      rounded-lg px-3 py-2 text-sm
                      bg-background border border-border/50
                      text-foreground focus:border-primary/50 focus:outline-none
                    "
                  >
                    <option value="all">All Categories</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Source Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">Source:</label>
                  <select
                    value={params.source || 'all'}
                    onChange={(e) => updateParams({ source: e.target.value })}
                    className="
                      rounded-lg px-3 py-2 text-sm
                      bg-background border border-border/50
                      text-foreground focus:border-primary/50 focus:outline-none
                    "
                  >
                    <option value="all">All Sources</option>
                    {filterOptions?.sources.map((source) => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">Sort by:</label>
                  <select
                    value={params.sort || 'name'}
                    onChange={(e) => updateParams({ sort: e.target.value as 'name' | 'category' | 'source' })}
                    className="
                      rounded-lg px-3 py-2 text-sm
                      bg-background border border-border/50
                      text-foreground focus:border-primary/50 focus:outline-none
                    "
                  >
                    <option value="name">Name</option>
                    <option value="category">Category</option>
                    <option value="source">Source</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <X size={14} />
                    Clear all
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Active Filters Tags */}
          {hasActiveFilters && !showFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {params.search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                  Search: "{params.search}"
                  <button onClick={() => { setSearchInput(''); updateParams({ search: undefined }); }}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {params.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                  {categories?.find(c => c.id === params.category)?.name || params.category}
                  <button onClick={() => updateParams({ category: undefined })}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {params.source && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                  {params.source}
                  <button onClick={() => updateParams({ source: undefined })}>
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Results */}
      <main className="container mx-auto px-6 py-8">
        {/* Loading indicator */}
        {isFetching && (
          <div className="flex items-center justify-center gap-2 py-2 mb-4 text-sm text-muted-foreground">
            <Loader2 size={14} className="animate-spin" />
            <span>Loading...</span>
          </div>
        )}

        {/* Initial loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
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

        {/* Results Grid */}
        {data && data.prompts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.prompts.map((prompt, index) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onClick={() => handleSelectPrompt(prompt.id)}
                  index={index}
                />
              ))}
            </div>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={() => updateParams({ page: Math.max(1, (params.page || 1) - 1) })}
                  disabled={params.page === 1}
                  className="
                    flex items-center gap-1 px-4 py-2 rounded-lg
                    bg-muted/30 border border-border/50
                    text-foreground hover:bg-muted/50
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all
                  "
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Page</span>
                  <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium">
                    {params.page || 1}
                  </span>
                  <span className="text-muted-foreground">of {data.pagination.totalPages}</span>
                </div>
                
                <button
                  onClick={() => updateParams({ page: (params.page || 1) + 1 })}
                  disabled={!data.pagination.hasMore}
                  className="
                    flex items-center gap-1 px-4 py-2 rounded-lg
                    bg-muted/30 border border-border/50
                    text-foreground hover:bg-muted/50
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all
                  "
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {data && data.prompts.length === 0 && (
          <div className="border-gradient rounded-2xl p-10 text-center max-w-md mx-auto">
            <Search size={40} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium mb-2">No prompts found</p>
            <p className="text-muted-foreground text-sm mb-4">
              Try adjusting your search terms or filters
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-primary hover:text-primary/80 text-sm transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Chat loading overlay */}
        {startChat.isPending && (
          <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="border-gradient rounded-2xl p-8 text-center">
              <Loader2 size={40} className="text-primary animate-spin mx-auto mb-4" />
              <p className="text-foreground font-medium">Starting conversation...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

