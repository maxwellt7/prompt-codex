const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Auth token getter - will be set by the app
let getAuthToken: (() => Promise<string | null>) | null = null;

export function setAuthTokenGetter(getter: () => Promise<string | null>) {
  getAuthToken = getter;
}

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers as Record<string, string>,
  };

  // Add auth token if available
  if (getAuthToken) {
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

async function fetchWithAuth(url: string, options?: RequestInit): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers as Record<string, string>,
  };

  // Add auth token if available
  if (getAuthToken) {
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });
}

// Types
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  promptCount: number;
}

export interface PromptSummary {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  source: string;
}

export interface Prompt extends PromptSummary {
  systemPromptTemplate: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  promptId: string;
  promptName: string;
  category: string;
  status: 'active' | 'completed';
  createdAt: string;
  completedAt?: string;
  messages?: Message[];
  messageCount?: number;
}

export interface ChatStartResponse extends Chat {
  initialMessage: string;
}

// Pagination response
export interface PaginatedResponse<T> {
  prompts: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Filter options response
export interface FilterOptionsResponse {
  sources: string[];
  tags: string[];
  categories: { id: string; name: string }[];
}

// Search/filter params
export interface PromptSearchParams {
  search?: string;
  category?: string;
  source?: string;
  tags?: string;
  page?: number;
  limit?: number;
  sort?: 'name' | 'category' | 'source';
}

// API Functions
export const api = {
  // Categories (public)
  getCategories: () => fetchJSON<Category[]>('/categories'),

  // Prompts (public)
  getPromptsByCategory: (category: string) => 
    fetchJSON<PromptSummary[]>(`/prompts/${category}`),
  getPrompt: (id: string) => fetchJSON<Prompt>(`/prompt/${id}`),
  
  // All prompts with search/filter/pagination (public)
  getAllPrompts: (params?: PromptSearchParams) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.source) searchParams.set('source', params.source);
    if (params?.tags) searchParams.set('tags', params.tags);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.sort) searchParams.set('sort', params.sort);
    
    const queryString = searchParams.toString();
    return fetchJSON<PaginatedResponse<PromptSummary>>(
      `/prompts${queryString ? `?${queryString}` : ''}`
    );
  },
  
  // Get filter options (public)
  getFilterOptions: () => fetchJSON<FilterOptionsResponse>('/filters'),

  // Chats (require auth)
  getChats: () => fetchJSON<Chat[]>('/chats'),
  getChat: (id: string) => fetchJSON<Chat>(`/chat/${id}`),
  
  startChat: (promptId: string) =>
    fetchJSON<ChatStartResponse>('/chat/start', {
      method: 'POST',
      body: JSON.stringify({ promptId }),
    }),

  sendMessage: (chatId: string, content: string) =>
    fetchJSON<{ message: Message }>(`/chat/${chatId}/message`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  completeChat: (chatId: string) =>
    fetchJSON<{ id: string; status: string; summary: string; keyTopics: string[] }>(
      `/chat/${chatId}/complete`,
      { method: 'POST' }
    ),

  deleteChat: (chatId: string) =>
    fetchJSON<{ success: boolean }>(`/chat/${chatId}`, {
      method: 'DELETE',
    }),

  // Streaming message (requires auth)
  sendMessageStream: async (
    chatId: string,
    content: string,
    onChunk: (chunk: string) => void,
    onComplete: (message: Message) => void
  ) => {
    const response = await fetchWithAuth(`/chat/${chatId}/message/stream`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Failed to stream message');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'chunk') {
              onChunk(data.content);
            } else if (data.type === 'done') {
              onComplete(data.message);
            }
          } catch (e) {
            console.error('Failed to parse SSE data:', e);
          }
        }
      }
    }
  },
};
