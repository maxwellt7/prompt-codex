import { useQuery } from '@tanstack/react-query';
import { api, PromptSearchParams } from '../api/client';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePrompts(category?: string) {
  return useQuery({
    queryKey: ['prompts', category],
    queryFn: () => (category ? api.getPromptsByCategory(category) : api.getAllPrompts().then(r => r.prompts)),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePrompt(id: string | null) {
  return useQuery({
    queryKey: ['prompt', id],
    queryFn: () => (id ? api.getPrompt(id) : null),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllPrompts(params: PromptSearchParams) {
  return useQuery({
    queryKey: ['allPrompts', params],
    queryFn: () => api.getAllPrompts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });
}

export function useFilterOptions() {
  return useQuery({
    queryKey: ['filterOptions'],
    queryFn: api.getFilterOptions,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
