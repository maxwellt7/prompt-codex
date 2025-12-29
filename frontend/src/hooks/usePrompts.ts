import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

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
    queryFn: () => (category ? api.getPromptsByCategory(category) : api.getPrompts()),
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

